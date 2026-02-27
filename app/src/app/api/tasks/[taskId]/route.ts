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

  const task = await db.task.findUnique({
    where: { id: taskId },
    include: {
      assignee: { select: { id: true, name: true, avatarUrl: true, image: true } },
      createdBy: { select: { id: true, name: true } },
      comments: {
        include: {
          author: { select: { id: true, name: true, avatarUrl: true, image: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(task);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await params;
  const body = await req.json();
  const { title, description, status, priority, category, dueDate, assigneeId } = body;

  const existingTask = await db.task.findUnique({ where: { id: taskId } });
  if (!existingTask) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (status !== undefined) data.status = status;
  if (priority !== undefined) data.priority = priority;
  if (category !== undefined) data.category = category;
  if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
  if (assigneeId !== undefined) data.assigneeId = assigneeId || null;

  const task = await db.task.update({
    where: { id: taskId },
    data,
    include: {
      assignee: { select: { id: true, name: true, avatarUrl: true, image: true } },
      createdBy: { select: { id: true, name: true } },
    },
  });

  // Log status changes
  if (status && status !== existingTask.status) {
    const activityType = status === "DONE" ? "TASK_COMPLETED" : "STATUS_CHANGED";
    await db.activity.create({
      data: {
        type: activityType,
        description: `Changed status of "${task.title}" from ${existingTask.status} to ${status}`,
        userId: session.user.id,
        taskId: task.id,
        metadata: { oldStatus: existingTask.status, newStatus: status },
      },
    });
  }

  return NextResponse.json(task);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await params;

  const task = await db.task.findUnique({ where: { id: taskId } });
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  // Only admin or task creator can delete
  if (session.user.role !== "ADMIN" && task.createdById !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.task.delete({ where: { id: taskId } });

  return NextResponse.json({ success: true });
}
