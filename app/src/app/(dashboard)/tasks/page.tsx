"use client";

import { useState, useCallback } from "react";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { TaskFilters } from "@/components/tasks/task-filters";

export default function TasksPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("ALL");
  const [category, setCategory] = useState("ALL");

  const handleTaskCreated = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Task Board</h1>
          <p className="text-slate-500 mt-1">
            Drag and drop tasks to update their status. Every piece matters.
          </p>
        </div>
        <CreateTaskDialog onTaskCreated={handleTaskCreated} />
      </div>

      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        priority={priority}
        onPriorityChange={setPriority}
        category={category}
        onCategoryChange={setCategory}
      />

      <KanbanBoard
        key={`${refreshKey}-${category}`}
        search={search}
        priority={priority}
        category={category}
      />
    </div>
  );
}
