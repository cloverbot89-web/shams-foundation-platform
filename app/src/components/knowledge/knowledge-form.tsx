"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X, Plus } from "lucide-react";

interface KnowledgeFormProps {
  onArticleCreated: () => void;
}

export function KnowledgeForm({ onArticleCreated }: KnowledgeFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      if (res.ok) {
        setTitle("");
        setContent("");
        setTags("");
        onArticleCreated();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create article");
      }
    } catch {
      setError("Failed to create article");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        placeholder="Article title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Article content — paste guidelines, policies, notes, or any reference material for the AI assistant..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        required
      />
      <Input
        placeholder="Tags (comma-separated, optional)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={submitting || !title.trim() || !content.trim()}>
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Plus className="h-4 w-4 mr-1" />
          )}
          Add Article
        </Button>
        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <X className="h-3 w-3" /> {error}
          </p>
        )}
      </div>
    </form>
  );
}
