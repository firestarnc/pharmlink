import { MatchStatus, NotificationType, UserRole } from "@/generated/prisma/enums";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createNotification } from "@/lib/notifications";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  opportunityId: z.string().min(1),
  pharmacistProfileId: z.string().min(1),
  adminNotes: z.string().optional(),
});

const updateSchema = z.object({
  matchId: z.string().min(1),
  status: z.nativeEnum(MatchStatus),
  adminNotes: z.string().optional(),
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

  const matches = await db.match.findMany({
    orderBy: { offeredAt: "desc" },
    include: {
      opportunity: true,
      pharmacistProfile: {
        include: { user: true },
      },
      payments: true,
    },
  });

  return NextResponse.json(matches);
}

export async function POST(req: Request) {
  const adminId = await getAdminId();
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid match data" }, { status: 400 });
  }

  const match = await db.match.create({
    data: {
      opportunityId: parsed.data.opportunityId,
      pharmacistProfileId: parsed.data.pharmacistProfileId,
      adminNotes: parsed.data.adminNotes,
      createdByAdminId: adminId,
    },
    include: {
      pharmacistProfile: {
        include: {
          user: {
            select: {
              id: true,
            },
          },
        },
      },
      opportunity: {
        select: {
          title: true,
        },
      },
    },
  });

  await createNotification({
    recipientUserId: match.pharmacistProfile.user.id,
    title: "New match offer",
    message: `You have a new match offer for ${match.opportunity.title}.`,
    type: NotificationType.INFO,
    linkUrl: "/pharmacist/dashboard",
  });

  return NextResponse.json(match);
}

export async function PATCH(req: Request) {
  const adminId = await getAdminId();
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update data" }, { status: 400 });
  }

  const match = await db.match.update({
    where: { id: parsed.data.matchId },
    data: {
      status: parsed.data.status,
      adminNotes: parsed.data.adminNotes,
      decidedAt: new Date(),
    },
  });

  return NextResponse.json(match);
}
