import { NotificationType, UserRole, VerificationStatus } from "@/generated/prisma/enums";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createNotification } from "@/lib/notifications";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  profileId: z.string().min(1),
  status: z.enum([VerificationStatus.VERIFIED, VerificationStatus.REJECTED]),
  reason: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid verification update" }, { status: 400 });
  }

  const profile = await db.pharmacistProfile.update({
    where: { id: parsed.data.profileId },
    data: {
      verificationStatus: parsed.data.status,
      verificationReason: parsed.data.reason,
      verificationReviewedAt: new Date(),
    },
    include: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  await createNotification({
    recipientUserId: profile.user.id,
    title: "Profile verification updated",
    message:
      parsed.data.status === VerificationStatus.VERIFIED
        ? "Your profile has been verified. You can now receive and apply for opportunities."
        : `Your profile was rejected.${parsed.data.reason ? ` Reason: ${parsed.data.reason}` : " Update your details and resubmit."}`,
    type: parsed.data.status === VerificationStatus.VERIFIED ? NotificationType.SUCCESS : NotificationType.WARNING,
    linkUrl: "/pharmacist/dashboard",
  });

  return NextResponse.json(profile);
}
