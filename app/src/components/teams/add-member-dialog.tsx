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
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";

interface AddMemberDialogProps {
  teamId: string;
  onMemberAdded: () => void;
}

export function AddMemberDialog({ teamId, onMemberAdded }: AddMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/teams/${teamId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok) {
        setEmail("");
        setOpen(false);
        onMemberAdded();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to add member");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a Puzzle Piece</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-slate-500 mb-2">
          Every member brings a unique piece to the team. Add someone by their email.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="member-email">Email Address</Label>
            <Input
              id="member-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="teammate@example.com"
              required
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !email.trim()}>
              {loading ? "Adding..." : "Add to Team"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
