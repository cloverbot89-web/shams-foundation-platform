import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Clock, CircleCheck, AlertTriangle } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  const stats = [
    { label: "Tasks Due This Week", value: 0, icon: Clock, color: "text-blue-600" },
    { label: "In Progress", value: 0, icon: CheckSquare, color: "text-amber-600" },
    { label: "Completed This Month", value: 0, icon: CircleCheck, color: "text-green-600" },
    { label: "Blocked", value: 0, icon: AlertTriangle, color: "text-red-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {session?.user?.name?.split(" ")[0] ?? "there"}
        </h1>
        <p className="text-slate-500 mt-1">
          Here&apos;s what&apos;s happening with your tasks today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400">
              <CheckSquare className="h-10 w-10 mb-3" />
              <p className="font-medium">No tasks yet</p>
              <p className="text-sm mt-1">
                Create your first task to get started.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400">
              <Clock className="h-10 w-10 mb-3" />
              <p className="font-medium">No activity yet</p>
              <p className="text-sm mt-1">
                Activity will appear here as your team gets to work.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
