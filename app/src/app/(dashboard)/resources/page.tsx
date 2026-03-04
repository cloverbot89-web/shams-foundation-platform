"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/files/file-upload";
import { FileList } from "@/components/files/file-list";
import { KnowledgeForm } from "@/components/knowledge/knowledge-form";
import { KnowledgeList } from "@/components/knowledge/knowledge-list";
import { FolderOpen, BookOpen } from "lucide-react";

export default function ResourcesPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [knowledgeRefreshKey, setKnowledgeRefreshKey] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Shared Resources</h1>
        <p className="text-slate-500 mt-1">
          Templates, guides, and documents the whole team can access. Every resource is a piece of the puzzle.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload a Resource</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload onFileUploaded={() => setRefreshKey((k) => k + 1)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-slate-400" />
            Resource Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FileList refreshKey={refreshKey} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-slate-400" />
            Knowledge Base
          </CardTitle>
          <p className="text-xs text-slate-500 mt-1">
            Add articles, guidelines, and reference material for the AI assistant to use when answering questions.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <KnowledgeForm onArticleCreated={() => setKnowledgeRefreshKey((k) => k + 1)} />
          <KnowledgeList refreshKey={knowledgeRefreshKey} />
        </CardContent>
      </Card>
    </div>
  );
}
