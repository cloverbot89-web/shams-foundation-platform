import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await params;

  const comments = await db.comment.findMany({
    where: { taskId },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true, image: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(comments);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await params;
  const body = await req.json();
  const { content, parentCommentId } = body;

  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const task = await db.task.findUnique({ where: { id: taskId } });
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const comment = await db.comment.create({
    data: {
      content,
      taskId,
      authorId: session.user.id,
      parentCommentId: parentCommentId || null,
    },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true, image: true } },
    },
  });

  await db.activity.create({
    data: {
      type: "COMMENT_ADDED",
      description: `Commented on "${task.title}"`,
      userId: session.user.id,
      taskId,
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
