import { NotificationType } from "@/generated/prisma/enums";
import { db } from "@/lib/db";

type CreateNotificationInput = {
  recipientUserId: string;
  title: string;
  message: string;
  type?: NotificationType;
  linkUrl?: string;
};

export async function createNotification(input: CreateNotificationInput) {
  return db.notification.create({
    data: {
      recipientUserId: input.recipientUserId,
      title: input.title,
      message: input.message,
      type: input.type ?? NotificationType.INFO,
      linkUrl: input.linkUrl,
    },
  });
}

export async function createNotifications(inputs: CreateNotificationInput[]) {
  if (inputs.length === 0) {
    return;
  }

  await db.notification.createMany({
    data: inputs.map((input) => ({
      recipientUserId: input.recipientUserId,
      title: input.title,
      message: input.message,
      type: input.type ?? NotificationType.INFO,
      linkUrl: input.linkUrl,
    })),
  });
}
