import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { campaignId } = await params;
  const body = await req.json();
  const { amount, donorName, donorEmail, notes, donatedAt } = body;

  if (!amount || !donorName) {
    return NextResponse.json({ error: "Amount and donor name are required" }, { status: 400 });
  }

  const campaign = await db.campaign.findUnique({ where: { id: campaignId } });
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const amountInCents = Math.round(amount * 100);

  const donation = await db.donation.create({
    data: {
      amount: amountInCents,
      donorName,
      donorEmail: donorEmail || null,
      campaignId,
      source: "MANUAL",
      notes: notes || null,
      recordedById: session.user.id,
      donatedAt: donatedAt ? new Date(donatedAt) : new Date(),
    },
    include: {
      recordedBy: { select: { id: true, name: true } },
    },
  });

  // Update campaign total
  await db.campaign.update({
    where: { id: campaignId },
    data: {
      currentAmount: { increment: amountInCents },
    },
  });

  await db.activity.create({
    data: {
      type: "TASK_UPDATED",
      description: `Recorded $${amount.toFixed(2)} donation from ${donorName} for "${campaign.name}"`,
      userId: session.user.id,
    },
  });

  return NextResponse.json(donation, { status: 201 });
}
