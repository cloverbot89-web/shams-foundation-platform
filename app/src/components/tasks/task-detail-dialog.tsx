"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Send } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string; avatarUrl: string | null; image: string | null };
}

interface TaskDetail {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  category: string;
  dueDate: string | null;
  createdAt: string;
  assignee: { id: string; name: string; avatarUrl: string | null; image: string | null } | null;
  createdBy: { id: string; name: string };
  comments: Comment[];
}

interface TaskDetailDialogProps {
  taskId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdated: () => void;
}

export function TaskDetailDialog({ taskId, open, onOpenChange, onTaskUpdated }: TaskDetailDialogProps) {
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [comment, setComment] = useState("");
  const [sendingComment, setSendingComment] = useState(false);

  useEffect(() => {
    if (taskId && open) {
      fetch(`/api/tasks/${taskId}`)
        .then((res) => res.json())
        .then(setTask);
    }
  }, [taskId, open]);

  async function handleStatusChange(newStatus: string) {
    if (!task) return;
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setTask({ ...task, status: newStatus });
    onTaskUpdated();
  }

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!task || !comment.trim()) return;

    setSendingComment(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment.trim() }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setTask({ ...task, comments: [...task.comments, newComment] });
        setComment("");
      }
    } finally {
      setSendingComment(false);
    }
  }

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{task.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{task.priority.toLowerCase()}</Badge>
            <Badge variant="secondary">{task.category.toLowerCase()}</Badge>
            {task.dueDate && (
              <Badge variant="outline">
                Due {format(new Date(task.dueDate), "MMM d, yyyy")}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm text-slate-500">Status</span>
              <Select value={task.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-40 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {task.assignee && (
              <div>
                <span className="text-sm text-slate-500">Assigned to</span>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={task.assignee.image ?? task.assignee.avatarUrl ?? undefined} />
                    <AvatarFallback className="text-xs">
                      {task.assignee.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.assignee.name}</span>
                </div>
              </div>
            )}
          </div>

          {task.description && (
            <div>
              <span className="text-sm text-slate-500">Description</span>
              <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          <div className="text-xs text-slate-400">
            Created by {task.createdBy.name} on {format(new Date(task.createdAt), "MMM d, yyyy")}
          </div>

          <Separator />

          <div>
            <h3 className="font-medium text-sm mb-3">
              Comments ({task.comments.length})
            </h3>

            <div className="space-y-3 mb-4">
              {task.comments.length === 0 && (
                <p className="text-sm text-slate-400">No comments yet.</p>
              )}
              {task.comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <Avatar className="h-7 w-7 mt-0.5">
                    <AvatarImage src={c.author.image ?? c.author.avatarUrl ?? undefined} />
                    <AvatarFallback className="text-xs">
                      {c.author.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{c.author.name}</span>
                      <span className="text-xs text-slate-400">
                        {format(new Date(c.createdAt), "MMM d, h:mm a")}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 mt-0.5">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows={2}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={sendingComment || !comment.trim()}
                className="self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
