"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AddMemberDialog } from "@/components/teams/add-member-dialog";
import { PuzzleProgress } from "@/components/teams/puzzle-progress";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface TeamDetail {
  id: string;
  name: string;
  description: string | null;
  createdBy: { id: string; name: string };
  members: {
    id: string;
    role: string;
    user: { id: string; name: string; email: string; avatarUrl: string | null; image: string | null };
  }[];
  tasks: {
    id: string;
    title: string;
    status: string;
    priority: string;
    category: string;
    dueDate: string | null;
    assignee: { id: string; name: string; avatarUrl: string | null; image: string | null } | null;
    _count: { comments: number };
  }[];
  _count: { tasks: number; members: number };
}

const statusColors: Record<string, string> = {
  NOT_STARTED: "bg-slate-100 text-slate-600",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  DONE: "bg-green-100 text-green-700",
  BLOCKED: "bg-red-100 text-red-700",
};

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const [team, setTeam] = useState<TeamDetail | null>(null);

  const fetchTeam = useCallback(async () => {
    const res = await fetch(`/api/teams/${teamId}`);
    if (res.ok) {
      setTeam(await res.json());
    }
  }, [teamId]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  if (!team) {
    return <div className="text-center py-12 text-slate-400">Loading team...</div>;
  }

  const completedTasks = team.tasks.filter((t) => t.status === "DONE").length;

  return (
    <div className="space-y-6">
      <Link href="/teams" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" />
        Back to Teams
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{team.name}</h1>
          {team.description && (
            <p className="text-slate-500 mt-1">{team.description}</p>
          )}
          <p className="text-sm text-slate-400 mt-1">
            Created by {team.createdBy.name}
          </p>
        </div>
        <AddMemberDialog teamId={team.id} onMemberAdded={fetchTeam} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Team Puzzle Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <PuzzleProgress
            total={team._count.tasks}
            completed={completedTasks}
            label={`${completedTasks} of ${team._count.tasks} tasks completed`}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Team Tasks ({team.tasks.length})
          </h2>
          {team.tasks.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-slate-400">
                No tasks yet. Create tasks and assign them to this team.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {team.tasks.map((task) => (
                <Card key={task.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className={statusColors[task.status] ?? ""}>
                          {task.status.replace("_", " ").toLowerCase()}
                        </Badge>
                        {task.dueDate && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(task.dueDate), "MMM d")}
                          </span>
                        )}
                      </div>
                    </div>
                    {task.assignee && (
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={task.assignee.image ?? task.assignee.avatarUrl ?? undefined} />
                        <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
                          {task.assignee.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Members ({team.members.length})
          </h2>
          <Card>
            <CardContent className="p-4 space-y-3">
              {team.members.map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={m.user.image ?? m.user.avatarUrl ?? undefined} />
                    <AvatarFallback className="text-sm bg-indigo-100 text-indigo-700">
                      {m.user.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{m.user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{m.user.email}</p>
                  </div>
                  {m.role === "LEAD" && (
                    <Badge variant="secondary" className="text-xs">Lead</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
