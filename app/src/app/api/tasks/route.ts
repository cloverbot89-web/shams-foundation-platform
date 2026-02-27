import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const assigneeId = searchParams.get("assigneeId");

  const where: Record<string, unknown> = {};

  // Contributors only see their own tasks; coordinators/admins see all
  if (session.user.role === "CONTRIBUTOR" || session.user.role === "VIEWER") {
    where.assigneeId = session.user.id;
  }

  if (status) where.status = status;
  if (category) where.category = category;
  if (assigneeId) where.assigneeId = assigneeId;

  const tasks = await db.task.findMany({
    where,
    include: {
      assignee: { select: { id: true, name: true, avatarUrl: true, image: true } },
      createdBy: { select: { id: true, name: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, status, priority, category, dueDate, assigneeId, teamId, parentTaskId } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const task = await db.task.create({
    data: {
      title,
      description: description || null,
      status: status || "NOT_STARTED",
      priority: priority || "MEDIUM",
      category: category || "OTHER",
      dueDate: dueDate ? new Date(dueDate) : null,
      assigneeId: assigneeId || null,
      createdById: session.user.id,
      teamId: teamId || null,
      parentTaskId: parentTaskId || null,
    },
    include: {
      assignee: { select: { id: true, name: true, avatarUrl: true, image: true } },
      createdBy: { select: { id: true, name: true } },
    },
  });

  await db.activity.create({
    data: {
      type: "TASK_CREATED",
      description: `Created task "${title}"`,
      userId: session.user.id,
      taskId: task.id,
      teamId: teamId || null,
    },
  });

  return NextResponse.json(task, { status: 201 });
}
