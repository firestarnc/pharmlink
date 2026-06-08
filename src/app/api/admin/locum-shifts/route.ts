import { UserRole } from "@/generated/prisma/enums";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(2),
  companyName: z.string().min(2),
  lagosArea: z.string().min(2),
  date: z.string().min(4),
  startTime: z.string().min(3),
  endTime: z.string().min(3),
  payNaira: z.coerce.number().min(1),
  requirements: z.string().min(5),
});

async function getAdminId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== UserRole.ADMIN) {
    return null;
  }
  return session.user.id;
}

export async function GET() {
  const adminId = await getAdminId();
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const shifts = await db.locumShift.findMany({
    orderBy: { createdAt: "desc" },
    include: { applications: true },
  });

  return NextResponse.json(shifts);
}

export async function POST(req: Request) {
  const adminId = await getAdminId();
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid shift data" }, { status: 400 });
  }

  const shift = await db.locumShift.create({
    data: {
      ...parsed.data,
      date: new Date(parsed.data.date),
      createdByAdminId: adminId,
    },
  });

  return NextResponse.json(shift);
}
