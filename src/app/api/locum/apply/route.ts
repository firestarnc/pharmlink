import { ApplicationStatus, UserRole, VerificationStatus } from "@/generated/prisma/enums";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  shiftId: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== UserRole.PHARMACIST) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid shift application" }, { status: 400 });
  }

  const profile = await db.pharmacistProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile || profile.verificationStatus !== VerificationStatus.VERIFIED) {
    return NextResponse.json({ error: "Complete and verify your profile first" }, { status: 403 });
  }

  const application = await db.locumApplication.create({
    data: {
      shiftId: parsed.data.shiftId,
      pharmacistProfileId: profile.id,
      status: ApplicationStatus.APPLIED,
    },
  });

  return NextResponse.json(application);
}
