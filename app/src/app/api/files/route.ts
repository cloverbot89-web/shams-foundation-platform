import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const taskId = searchParams.get("taskId");

  const where: Record<string, unknown> = {};
  if (taskId) where.taskId = taskId;

  const files = await db.file.findMany({
    where,
    include: {
      uploadedBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(files);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const taskId = formData.get("taskId") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name);
  const storageKey = `${randomUUID()}${ext}`;
  const uploadPath = path.join(process.cwd(), "public", "uploads", storageKey);

  await writeFile(uploadPath, buffer);

  const dbFile = await db.file.create({
    data: {
      filename: file.name,
      storageKey,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      taskId: taskId || null,
      uploadedById: session.user.id,
    },
    include: {
      uploadedBy: { select: { id: true, name: true } },
    },
  });

  await db.activity.create({
    data: {
      type: "FILE_UPLOADED",
      description: `Uploaded "${file.name}"${taskId ? " to a task" : " to the resource library"}`,
      userId: session.user.id,
      taskId: taskId || null,
    },
  });

  return NextResponse.json(dbFile, { status: 201 });
}
