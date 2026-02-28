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
import { Plus } from "lucide-react";

interface CreateTeamDialogProps {
  onTeamCreated: () => void;
}

export function CreateTeamDialog({ onTeamCreated }: CreateTeamDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || null }),
      });

      if (res.ok) {
        setName("");
        setDescription("");
        setOpen(false);
        onTeamCreated();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Team</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-slate-500 mb-2">
          Each team is a piece of the puzzle. Together, they complete the picture.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="team-name">Team Name</Label>
            <Input
              id="team-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Fundraising Team"
              required
            />
          </div>
          <div>
            <Label htmlFor="team-desc">Description</Label>
            <Textarea
              id="team-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this team focus on?"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? "Creating..." : "Create Team"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
