import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const campaigns = await db.campaign.findMany({
    include: {
      createdBy: { select: { id: true, name: true } },
      _count: { select: { donations: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(campaigns);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, goalAmount, startDate, endDate } = body;

  if (!name || !goalAmount || !startDate) {
    return NextResponse.json({ error: "Name, goal amount, and start date are required" }, { status: 400 });
  }

  const campaign = await db.campaign.create({
    data: {
      name,
      description: description || null,
      goalAmount: Math.round(goalAmount * 100),
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      createdById: session.user.id,
    },
    include: {
      createdBy: { select: { id: true, name: true } },
      _count: { select: { donations: true } },
    },
  });

  await db.activity.create({
    data: {
      type: "TASK_CREATED",
      description: `Created fundraising campaign "${name}"`,
      userId: session.user.id,
    },
  });

  return NextResponse.json(campaign, { status: 201 });
}
