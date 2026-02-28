import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { teamId } = await params;

  const team = await db.team.findUnique({
    where: { id: teamId },
    include: {
      createdBy: { select: { id: true, name: true } },
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true, image: true, role: true } },
        },
      },
      tasks: {
        include: {
          assignee: { select: { id: true, name: true, avatarUrl: true, image: true } },
          _count: { select: { comments: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { tasks: true, members: true } },
    },
  });

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  return NextResponse.json(team);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { teamId } = await params;

  const team = await db.team.findUnique({ where: { id: teamId } });
  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  if (session.user.role !== "ADMIN" && team.createdById !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.team.delete({ where: { id: teamId } });

  return NextResponse.json({ success: true });
}
