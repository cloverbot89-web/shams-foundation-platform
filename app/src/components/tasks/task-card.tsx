"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Calendar } from "lucide-react";
import { format } from "date-fns";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    priority: string;
    category: string;
    dueDate: string | null;
    assignee: { id: string; name: string; avatarUrl: string | null; image: string | null } | null;
    _count?: { comments: number };
  };
  onClick: () => void;
}

const priorityColors: Record<string, string> = {
  URGENT: "bg-red-100 text-red-700",
  HIGH: "bg-orange-100 text-orange-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-slate-100 text-slate-600",
};

const categoryColors: Record<string, string> = {
  FUNDRAISING: "bg-emerald-100 text-emerald-700",
  OUTREACH: "bg-blue-100 text-blue-700",
  PROGRAM: "bg-purple-100 text-purple-700",
  RESEARCH: "bg-cyan-100 text-cyan-700",
  ADMIN: "bg-slate-100 text-slate-700",
  OTHER: "bg-gray-100 text-gray-600",
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const initials = task.assignee?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "";

  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      aria-label={`Task: ${task.title}, ${task.priority} priority, ${task.category} category`}
    >
      <p className="font-medium text-base text-slate-900 mb-2">{task.title}</p>

      <div className="flex flex-wrap gap-1 mb-2">
        <Badge variant="secondary" className={priorityColors[task.priority] ?? ""}>
          {task.priority.toLowerCase()}
        </Badge>
        <Badge variant="secondary" className={categoryColors[task.category] ?? ""}>
          {task.category.toLowerCase()}
        </Badge>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(task.dueDate), "MMM d")}
            </span>
          )}
          {(task._count?.comments ?? 0) > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {task._count?.comments}
            </span>
          )}
        </div>

        {task.assignee && (
          <Avatar className="h-5 w-5">
            <AvatarImage src={task.assignee.image ?? task.assignee.avatarUrl ?? undefined} />
            <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-700">
              {initials}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </Card>
  );
}
