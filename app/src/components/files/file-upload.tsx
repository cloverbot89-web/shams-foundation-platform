"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileIcon, Loader2 } from "lucide-react";

interface FileUploadProps {
  taskId?: string;
  onFileUploaded: () => void;
}

export function FileUpload({ taskId, onFileUploaded }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    if (taskId) formData.append("taskId", taskId);

    try {
      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        onFileUploaded();
      } else {
        const data = await res.json();
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${dragging
            ? "border-indigo-400 bg-indigo-50"
            : "border-slate-200 hover:border-slate-300 bg-slate-50"
          }
        `}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter") inputRef.current?.click(); }}
        aria-label="Upload a file by dragging and dropping or clicking"
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.txt,.csv"
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
            <p className="text-sm text-slate-500">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-slate-400" />
            <p className="text-sm text-slate-600 font-medium">
              Drag and drop a file, or click to browse
            </p>
            <p className="text-xs text-slate-400">
              PDF, images, documents, spreadsheets (max 10MB)
            </p>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
          <X className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  );
}
