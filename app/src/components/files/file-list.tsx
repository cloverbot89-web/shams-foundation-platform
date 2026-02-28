"use client";

import { useState, useEffect, useCallback } from "react";
import { FileIcon, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface FileItem {
  id: string;
  filename: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
  uploadedBy: { id: true; name: string };
}

interface FileListProps {
  taskId?: string;
  refreshKey?: number;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const iconByType: Record<string, string> = {
  "application/pdf": "text-red-500",
  "image/png": "text-blue-500",
  "image/jpeg": "text-blue-500",
  "image/gif": "text-purple-500",
  "text/plain": "text-slate-500",
  "text/csv": "text-green-500",
};

export function FileList({ taskId, refreshKey }: FileListProps) {
  const [files, setFiles] = useState<FileItem[]>([]);

  const fetchFiles = useCallback(async () => {
    const params = taskId ? `?taskId=${taskId}` : "";
    const res = await fetch(`/api/files${params}`);
    if (res.ok) {
      setFiles(await res.json());
    }
  }, [taskId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles, refreshKey]);

  if (files.length === 0) {
    return (
      <p className="text-sm text-slate-400 text-center py-4">
        No files uploaded yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <FileIcon className={`h-5 w-5 ${iconByType[file.mimeType] ?? "text-slate-400"}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{file.filename}</p>
            <p className="text-xs text-slate-400">
              {formatFileSize(file.sizeBytes)} &middot; {file.uploadedBy.name} &middot; {format(new Date(file.createdAt), "MMM d, yyyy")}
            </p>
          </div>
          <a
            href={`/uploads/${file.storageKey}`}
            download={file.filename}
            className="shrink-0"
          >
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Download ${file.filename}`}>
              <Download className="h-4 w-4" />
            </Button>
          </a>
        </div>
      ))}
    </div>
  );
}
