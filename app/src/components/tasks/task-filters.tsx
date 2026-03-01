"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  priority: string;
  onPriorityChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
}

export function TaskFilters({
  search,
  onSearchChange,
  priority,
  onPriorityChange,
  category,
  onCategoryChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="pl-9"
          aria-label="Search tasks"
        />
      </div>
      <Select value={priority} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-full sm:w-40" aria-label="Filter by priority">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Priorities</SelectItem>
          <SelectItem value="URGENT">Urgent</SelectItem>
          <SelectItem value="HIGH">High</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="LOW">Low</SelectItem>
        </SelectContent>
      </Select>
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-40" aria-label="Filter by category">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Categories</SelectItem>
          <SelectItem value="FUNDRAISING">Fundraising</SelectItem>
          <SelectItem value="OUTREACH">Outreach</SelectItem>
          <SelectItem value="PROGRAM">Program</SelectItem>
          <SelectItem value="RESEARCH">Research</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
          <SelectItem value="OTHER">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
