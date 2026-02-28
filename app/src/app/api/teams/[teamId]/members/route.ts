import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { teamId } = await params;
  const body = await req.json();
  const { email, role } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const team = await db.team.findUnique({ where: { id: teamId } });
  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "User not found. They must sign in first." }, { status: 404 });
  }

  const existing = await db.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId: user.id } },
  });
  if (existing) {
    return NextResponse.json({ error: "Already a member" }, { status: 409 });
  }

  const member = await db.teamMember.create({
    data: {
      teamId,
      userId: user.id,
      role: role || "MEMBER",
    },
    include: {
      user: { select: { id: true, name: true, email: true, avatarUrl: true, image: true } },
    },
  });

  await db.activity.create({
    data: {
      type: "MEMBER_JOINED",
      description: `${user.name} joined team "${team.name}"`,
      userId: session.user.id,
      teamId,
    },
  });

  return NextResponse.json(member, { status: 201 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { teamId } = await params;
  const { searchParams } = req.nextUrl;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  await db.teamMember.deleteMany({
    where: { teamId, userId },
  });

  return NextResponse.json({ success: true });
}
