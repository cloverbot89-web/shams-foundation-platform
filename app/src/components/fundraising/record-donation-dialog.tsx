"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";

interface RecordDonationDialogProps {
  campaignId: string;
  onDonationRecorded: () => void;
}

export function RecordDonationDialog({ campaignId, onDonationRecorded }: RecordDonationDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [donatedAt, setDonatedAt] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !donorName.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/donations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          donorName: donorName.trim(),
          donorEmail: donorEmail.trim() || null,
          notes: notes.trim() || null,
          donatedAt: donatedAt || null,
        }),
      });

      if (res.ok) {
        setAmount("");
        setDonorName("");
        setDonorEmail("");
        setNotes("");
        setDonatedAt("");
        setOpen(false);
        onDonationRecorded();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Heart className="h-4 w-4 mr-2" />
          Record Donation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record a Donation</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-slate-500 mb-2">
          Another piece of the puzzle! Every contribution brings us closer.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="donor-name">Donor Name</Label>
            <Input
              id="donor-name"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Jane Smith"
              required
            />
          </div>
          <div>
            <Label htmlFor="donation-amount">Amount ($)</Label>
            <Input
              id="donation-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100.00"
              required
            />
          </div>
          <div>
            <Label htmlFor="donor-email">Donor Email (optional)</Label>
            <Input
              id="donor-email"
              type="email"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <Label htmlFor="donated-at">Donation Date (optional)</Label>
            <Input
              id="donated-at"
              type="date"
              value={donatedAt}
              onChange={(e) => setDonatedAt(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="donation-notes">Notes (optional)</Label>
            <Textarea
              id="donation-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any context about this donation..."
              rows={2}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !amount || !donorName.trim()}>
              {loading ? "Recording..." : "Record Donation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
