"use client";

import { useState, useCallback } from "react";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";

export default function TasksPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTaskCreated = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Task Board</h1>
          <p className="text-slate-500 mt-1">
            Drag and drop tasks to update their status.
          </p>
        </div>
        <CreateTaskDialog onTaskCreated={handleTaskCreated} />
      </div>

      <KanbanBoard key={refreshKey} />
    </div>
  );
}
