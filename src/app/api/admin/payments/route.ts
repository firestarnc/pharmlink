import { PaymentStatus, PayerType, UserRole } from "@/generated/prisma/enums";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  matchId: z.string().min(1),
  payerType: z.nativeEnum(PayerType),
  expectedAmountNaira: z.coerce.number().min(1),
  notes: z.string().optional(),
});

const updateSchema = z.object({
  paymentId: z.string().min(1),
  status: z.nativeEnum(PaymentStatus),
  notes: z.string().optional(),
});

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  return !!session?.user?.id && session.user.role === UserRole.ADMIN;
}

export async function GET() {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payments = await db.paymentRecord.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      match: {
        include: {
          opportunity: true,
          pharmacistProfile: { include: { user: true } },
        },
      },
    },
  });

  return NextResponse.json(payments);
}

export async function POST(req: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
  }

  const payment = await db.paymentRecord.create({
    data: parsed.data,
  });

  return NextResponse.json(payment);
}

export async function PATCH(req: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payment status update" }, { status: 400 });
  }

  const payment = await db.paymentRecord.update({
    where: { id: parsed.data.paymentId },
    data: {
      status: parsed.data.status,
      notes: parsed.data.notes,
      paidAt: parsed.data.status === PaymentStatus.PAID ? new Date() : null,
    },
  });

  return NextResponse.json(payment);
}
