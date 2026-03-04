"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, FileText, Loader2 } from "lucide-react";

interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  createdBy: { id: string; name: string };
}

interface KnowledgeListProps {
  refreshKey: number;
}

export function KnowledgeList({ refreshKey }: KnowledgeListProps) {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch("/api/knowledge");
      if (res.ok) {
        setArticles(await res.json());
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles, refreshKey]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/knowledge?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      // silently fail
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading articles...
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No knowledge articles yet. Add one above to give the AI assistant more context.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {articles.map((article) => (
        <div
          key={article.id}
          className="border border-slate-200 rounded-lg p-3 bg-white"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-slate-900 text-sm truncate">
                {article.title}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                By {article.createdBy.name} &middot;{" "}
                {new Date(article.createdAt).toLocaleDateString()}
              </p>
              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-sm text-slate-600 mt-2 line-clamp-3 whitespace-pre-wrap">
                {article.content}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-red-500 shrink-0"
              onClick={() => handleDelete(article.id)}
              disabled={deletingId === article.id}
              aria-label={`Delete "${article.title}"`}
            >
              {deletingId === article.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
