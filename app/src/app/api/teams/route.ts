import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const teams = await db.team.findMany({
    include: {
      createdBy: { select: { id: true, name: true } },
      members: {
        include: {
          user: { select: { id: true, name: true, avatarUrl: true, image: true } },
        },
      },
      _count: { select: { tasks: true, members: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(teams);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const team = await db.team.create({
    data: {
      name,
      description: description || null,
      createdById: session.user.id,
      members: {
        create: {
          userId: session.user.id,
          role: "LEAD",
        },
      },
    },
    include: {
      createdBy: { select: { id: true, name: true } },
      members: {
        include: {
          user: { select: { id: true, name: true, avatarUrl: true, image: true } },
        },
      },
      _count: { select: { tasks: true, members: true } },
    },
  });

  await db.activity.create({
    data: {
      type: "MEMBER_JOINED",
      description: `Created team "${name}"`,
      userId: session.user.id,
      teamId: team.id,
    },
  });

  return NextResponse.json(team, { status: 201 });
}
