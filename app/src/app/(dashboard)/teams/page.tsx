"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreateTeamDialog } from "@/components/teams/create-team-dialog";
import { PuzzleProgress } from "@/components/teams/puzzle-progress";
import { Users, Puzzle } from "lucide-react";

interface Team {
  id: string;
  name: string;
  description: string | null;
  members: {
    user: { id: string; name: string; avatarUrl: string | null; image: string | null };
  }[];
  tasks: never[];
  _count: { tasks: number; members: number };
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = useCallback(async () => {
    const res = await fetch("/api/teams");
    if (res.ok) {
      setTeams(await res.json());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Teams</h1>
          <p className="text-slate-500 mt-1">
            Each team is a piece of the puzzle. Together, you complete the picture.
          </p>
        </div>
        <CreateTeamDialog onTeamCreated={fetchTeams} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading teams...</div>
      ) : teams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Puzzle className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-700">No teams yet</h3>
            <p className="text-slate-400 mt-2 max-w-sm">
              Create your first team to start assembling the puzzle. Each team
              works on their piece, and together you see the whole picture.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Link key={team.id} href={`/teams/${team.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-slate-400">
                      <Users className="h-4 w-4" />
                      {team._count.members}
                    </div>
                  </div>
                  {team.description && (
                    <p className="text-sm text-slate-500 mt-1">{team.description}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <PuzzleProgress
                    total={team._count.tasks}
                    completed={0}
                    label="Task progress"
                  />
                  <div className="flex -space-x-2">
                    {team.members.slice(0, 5).map((m) => (
                      <Avatar key={m.user.id} className="h-8 w-8 border-2 border-white">
                        <AvatarImage src={m.user.image ?? m.user.avatarUrl ?? undefined} />
                        <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
                          {m.user.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {team._count.members > 5 && (
                      <div className="h-8 w-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs text-slate-500">
                        +{team._count.members - 5}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
