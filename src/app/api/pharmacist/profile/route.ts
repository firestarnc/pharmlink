import { JobType, ProfessionalCategory, UserRole, VerificationStatus } from "@/generated/prisma/enums";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const profileSchema = z.object({
  category: z.nativeEnum(ProfessionalCategory),
  lagosArea: z.string().trim().min(2, "Lagos area must be at least 2 characters"),
  yearsOfExperience: z.coerce.number().min(0).max(60),
  qualification: z.string().trim().min(2, "Qualification must be at least 2 characters"),
  licenseNumber: z.string().trim().max(80).optional(),
  currentEmployment: z.string().trim().max(120).optional(),
  preferredJobType: z.nativeEnum(JobType),
  availability: z.string().trim().max(120).optional(),
  preferredSalaryMin: z.coerce.number().optional(),
  preferredSalaryMax: z.coerce.number().optional(),
  preferredWorkArea: z.string().trim().max(120).optional(),
  summary: z.string().trim().max(1500).optional(),
  cvUrl: z.url("CV file URL must be a valid URL").optional(),
  licenseDocumentUrls: z.array(z.url()).max(5).optional(),
}).refine((data) => {
  if (data.preferredSalaryMin == null || data.preferredSalaryMax == null) {
    return true;
  }

  return data.preferredSalaryMin <= data.preferredSalaryMax;
}, {
  message: "Preferred minimum salary cannot exceed preferred maximum salary",
  path: ["preferredSalaryMin"],
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== UserRole.PHARMACIST) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.pharmacistProfile.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(profile);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== UserRole.PHARMACIST) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = profileSchema.safeParse(body);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid profile data";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const { licenseDocumentUrls, ...profileData } = parsed.data;

  const profile = await db.pharmacistProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      ...profileData,
      verificationStatus: VerificationStatus.SUBMITTED,
    },
    update: {
      ...profileData,
      verificationStatus: VerificationStatus.SUBMITTED,
      verificationReason: null,
    },
  });

  if (licenseDocumentUrls && licenseDocumentUrls.length > 0) {
    const existing = await db.credentialDocument.findMany({
      where: {
        profileId: profile.id,
        label: "LICENSE",
      },
      select: { fileUrl: true },
    });

    const existingSet = new Set(existing.map((item) => item.fileUrl));
    const toCreate = licenseDocumentUrls.filter((url) => !existingSet.has(url));

    if (toCreate.length > 0) {
      await db.credentialDocument.createMany({
        data: toCreate.map((fileUrl) => ({
          profileId: profile.id,
          label: "LICENSE",
          fileUrl,
        })),
      });
    }
  }

  return NextResponse.json(profile);
}
