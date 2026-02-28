"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateCampaignDialog } from "@/components/fundraising/create-campaign-dialog";
import { RecordDonationDialog } from "@/components/fundraising/record-donation-dialog";
import { CampaignProgress } from "@/components/fundraising/campaign-progress";
import { DollarSign, Puzzle } from "lucide-react";
import { format } from "date-fns";

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  goalAmount: string; // Decimal comes as string from Prisma
  currentAmount: string;
  status: string;
  startDate: string;
  endDate: string | null;
  createdBy: { id: string; name: string };
  _count: { donations: number };
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  PAUSED: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-indigo-100 text-indigo-700",
};

export default function FundraisingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = useCallback(async () => {
    const res = await fetch("/api/campaigns");
    if (res.ok) {
      setCampaigns(await res.json());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Calculate totals across all campaigns
  const totalRaised = campaigns.reduce((sum, c) => sum + Number(c.currentAmount), 0);
  const totalGoal = campaigns.reduce((sum, c) => sum + Number(c.goalAmount), 0);
  const totalDonations = campaigns.reduce((sum, c) => sum + c._count.donations, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fundraising</h1>
          <p className="text-slate-500 mt-1">
            Every donation is a puzzle piece. Watch the picture come together.
          </p>
        </div>
        <CreateCampaignDialog onCampaignCreated={fetchCampaigns} />
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Total Raised</p>
            <p className="text-2xl font-bold text-indigo-600">
              {(totalRaised / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Total Goal</p>
            <p className="text-2xl font-bold text-slate-800">
              {(totalGoal / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Donations</p>
            <p className="text-2xl font-bold text-slate-800">{totalDonations}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Active Campaigns</p>
            <p className="text-2xl font-bold text-slate-800">{activeCampaigns}</p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading campaigns...</div>
      ) : campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <DollarSign className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-700">No campaigns yet</h3>
            <p className="text-slate-400 mt-2 max-w-sm">
              Start your first fundraising campaign. Each donation adds a piece to the puzzle.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    {campaign.description && (
                      <p className="text-sm text-slate-500 mt-1">{campaign.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className={statusColors[campaign.status] ?? ""}>
                        {campaign.status.toLowerCase()}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        {format(new Date(campaign.startDate), "MMM d, yyyy")}
                        {campaign.endDate && ` — ${format(new Date(campaign.endDate), "MMM d, yyyy")}`}
                      </span>
                    </div>
                  </div>
                  <RecordDonationDialog campaignId={campaign.id} onDonationRecorded={fetchCampaigns} />
                </div>
              </CardHeader>
              <CardContent>
                <CampaignProgress
                  currentAmount={Number(campaign.currentAmount)}
                  goalAmount={Number(campaign.goalAmount)}
                  donationCount={campaign._count.donations}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
