import { JobType, ProfessionalCategory, UserRole } from "@/generated/prisma/enums";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(2),
  companyName: z.string().min(2),
  companyContact: z.string().optional(),
  location: z.string().min(2),
  jobType: z.nativeEnum(JobType),
  category: z.nativeEnum(ProfessionalCategory),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  requirements: z.string().min(10),
  urgency: z.string().optional(),
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

  const opportunities = await db.opportunity.findMany({
    orderBy: { createdAt: "desc" },
    include: { matches: true },
  });

  return NextResponse.json(opportunities);
}

export async function POST(req: Request) {
  const adminId = await getAdminId();
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid opportunity data" }, { status: 400 });
  }

  const opportunity = await db.opportunity.create({
    data: {
      ...parsed.data,
      createdByAdminId: adminId,
    },
  });

  return NextResponse.json(opportunity);
}
