"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Bot, User } from "lucide-react";

interface Citation {
  type: string;
  id: string;
}

interface ChatMessageBubbleProps {
  role: "USER" | "ASSISTANT";
  content: string;
  citations?: Citation[];
  createdAt?: Date;
}

export function ChatMessageBubble({
  role,
  content,
  citations,
  createdAt,
}: ChatMessageBubbleProps) {
  const isUser = role === "USER";

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
          <Bot className="h-4 w-4 text-slate-600" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[75%] rounded-lg px-4 py-3",
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-white border border-slate-200 text-slate-900"
        )}
      >
        <div className="text-sm whitespace-pre-wrap">{content}</div>
        {citations && citations.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-200/30">
            <p className="text-xs font-medium opacity-70 mb-1">Sources:</p>
            <div className="flex flex-wrap gap-1">
              {citations.map((c, i) => (
                <span
                  key={i}
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded",
                    isUser
                      ? "bg-indigo-500 text-indigo-100"
                      : "bg-slate-100 text-slate-600"
                  )}
                >
                  {c.type}
                </span>
              ))}
            </div>
          </div>
        )}
        {createdAt && (
          <p
            className={cn(
              "text-xs mt-1",
              isUser ? "text-indigo-200" : "text-slate-400"
            )}
          >
            {format(new Date(createdAt), "h:mm a")}
          </p>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          <User className="h-4 w-4 text-indigo-600" />
        </div>
      )}
    </div>
  );
}
