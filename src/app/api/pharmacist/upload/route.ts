import { UserRole } from "@/generated/prisma/enums";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const uploadTypeSchema = z.enum(["CV", "LICENSE"]);

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function extensionFromMimeType(mimeType: string) {
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "application/msword") return "doc";
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "docx";
  return "bin";
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== UserRole.PHARMACIST) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const uploadTypeRaw = String(formData.get("uploadType") ?? "");
  const uploadType = uploadTypeSchema.safeParse(uploadTypeRaw);

  if (!uploadType.success) {
    return NextResponse.json({ error: "Upload type must be CV or LICENSE" }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type. Use PDF, DOC, DOCX, JPG, or PNG." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: "File too large. Max size is 5MB." }, { status: 400 });
  }

  const ext = extensionFromMimeType(file.type);
  const fileName = `${Date.now()}-${sanitizeFileName(file.name || "document")}.${ext}`;
  const relativeDir = path.join("uploads", session.user.id);
  const absoluteDir = path.join(process.cwd(), "public", relativeDir);
  const absolutePath = path.join(absoluteDir, fileName);

  await mkdir(absoluteDir, { recursive: true });
  const arrayBuffer = await file.arrayBuffer();
  await writeFile(absolutePath, Buffer.from(arrayBuffer));

  const fileUrl = `/${relativeDir}/${fileName}`;

  const profile = await db.pharmacistProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (uploadType.data === "CV") {
    if (profile) {
      await db.pharmacistProfile.update({
        where: { id: profile.id },
        data: { cvUrl: fileUrl },
      });
    }
  }

  if (uploadType.data === "LICENSE") {
    if (profile) {
      await db.credentialDocument.create({
        data: {
          profileId: profile.id,
          label: "LICENSE",
          fileUrl,
        },
      });
    }
  }

  return NextResponse.json({ data: { fileUrl } });
}
