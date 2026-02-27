"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { TaskCard } from "./task-card";
import { TaskDetailDialog } from "./task-detail-dialog";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  category: string;
  dueDate: string | null;
  assignee: { id: string; name: string; avatarUrl: string | null; image: string | null } | null;
  _count?: { comments: number };
}

const columns = [
  { id: "NOT_STARTED", label: "Not Started", color: "bg-slate-200" },
  { id: "IN_PROGRESS", label: "In Progress", color: "bg-blue-200" },
  { id: "DONE", label: "Done", color: "bg-green-200" },
  { id: "BLOCKED", label: "Blocked", color: "bg-red-200" },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    const res = await fetch("/api/tasks");
    if (res.ok) {
      const data = await res.json();
      setTasks(data);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  }

  function handleTaskClick(taskId: string) {
    setSelectedTaskId(taskId);
    setDetailOpen(true);
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => {
            const columnTasks = tasks.filter((t) => t.status === column.id);

            return (
              <div key={column.id} className="flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />
                  <h3 className="font-medium text-sm text-slate-700">
                    {column.label}
                  </h3>
                  <span className="text-xs text-slate-400 ml-auto">
                    {columnTasks.length}
                  </span>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-2 p-2 rounded-lg min-h-[200px] transition-colors ${
                        snapshot.isDraggingOver
                          ? "bg-indigo-50 border-2 border-dashed border-indigo-300"
                          : "bg-slate-50 border border-slate-200"
                      }`}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard
                                task={task}
                                onClick={() => handleTaskClick(task.id)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <TaskDetailDialog
        taskId={selectedTaskId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onTaskUpdated={fetchTasks}
      />
    </>
  );
}
