import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Clock, CircleCheck, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default async function DashboardPage() {
  const session = await auth();

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [dueThisWeek, inProgress, completedThisMonth, blocked, myTasks, recentActivity] =
    await Promise.all([
      db.task.count({
        where: { dueDate: { gte: startOfWeek, lt: endOfWeek }, status: { not: "DONE" } },
      }),
      db.task.count({ where: { status: "IN_PROGRESS" } }),
      db.task.count({
        where: { status: "DONE", updatedAt: { gte: startOfMonth } },
      }),
      db.task.count({ where: { status: "BLOCKED" } }),
      db.task.findMany({
        where: { assigneeId: session?.user?.id },
        include: { assignee: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      db.activity.findMany({
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

  const stats = [
    { label: "Tasks Due This Week", value: dueThisWeek, icon: Clock, color: "text-blue-600" },
    { label: "In Progress", value: inProgress, icon: CheckSquare, color: "text-amber-600" },
    { label: "Completed This Month", value: completedThisMonth, icon: CircleCheck, color: "text-green-600" },
    { label: "Blocked", value: blocked, icon: AlertTriangle, color: "text-red-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
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
              <div className="text-4xl font-bold">{stat.value}</div>
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
            {myTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400">
                <CheckSquare className="h-10 w-10 mb-3" />
                <p className="font-medium">No tasks yet</p>
                <p className="text-sm mt-1">
                  Create your first task to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <div>
                      <p className="font-medium text-slate-900">{task.title}</p>
                      <p className="text-sm text-slate-500">
                        {task.status.replace("_", " ").toLowerCase()}
                        {task.dueDate && ` \u00b7 Due ${format(new Date(task.dueDate), "MMM d")}`}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      task.priority === "URGENT" ? "bg-red-100 text-red-700" :
                      task.priority === "HIGH" ? "bg-orange-100 text-orange-700" :
                      task.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-700" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {task.priority.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400">
                <Clock className="h-10 w-10 mb-3" />
                <p className="font-medium">No activity yet</p>
                <p className="text-sm mt-1">
                  Activity will appear here as your team gets to work.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">{activity.description}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {activity.user.name} &middot; {format(new Date(activity.createdAt), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
