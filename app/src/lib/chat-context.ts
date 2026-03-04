import { db } from "@/lib/db";

export async function buildPlatformContext(userId: string, userRole: string): Promise<string> {
  const isRestricted = userRole === "CONTRIBUTOR" || userRole === "VIEWER";

  const [tasks, teams, campaigns, activities, comments, knowledgeArticles, filesWithText] = await Promise.all([
    db.task.findMany({
      where: isRestricted ? { assigneeId: userId } : {},
      include: {
        assignee: { select: { name: true } },
        createdBy: { select: { name: true } },
        team: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 200,
    }),
    db.team.findMany({
      include: {
        members: {
          include: { user: { select: { name: true } } },
        },
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    db.campaign.findMany({
      include: {
        createdBy: { select: { name: true } },
        _count: { select: { donations: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    db.activity.findMany({
      include: {
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    db.comment.findMany({
      include: {
        author: { select: { name: true } },
        task: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    db.knowledgeArticle.findMany({
      include: {
        createdBy: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    db.file.findMany({
      where: { textContent: { not: null } },
      select: {
        id: true,
        filename: true,
        textContent: true,
        uploadedBy: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const sections: string[] = [];

  // Tasks section
  if (tasks.length > 0) {
    const taskLines = tasks.map((t) => {
      const parts = [
        `[Task:${t.id}] "${t.title}"`,
        `Status: ${t.status}`,
        `Priority: ${t.priority}`,
        `Category: ${t.category}`,
        t.assignee ? `Assigned to: ${t.assignee.name}` : "Unassigned",
        `Created by: ${t.createdBy.name}`,
        t.team ? `Team: ${t.team.name}` : null,
        t.dueDate ? `Due: ${t.dueDate.toISOString().split("T")[0]}` : null,
        t.description ? `Description: ${t.description}` : null,
      ];
      return parts.filter(Boolean).join(" | ");
    });
    sections.push(`## Tasks (${tasks.length})\n${taskLines.join("\n")}`);
  }

  // Teams section
  if (teams.length > 0) {
    const teamLines = teams.map((t) => {
      const members = t.members.map((m) => `${m.user.name} (${m.role})`).join(", ");
      return `[Team:${t.id}] "${t.name}" | Members: ${members || "none"} | Tasks: ${t._count.tasks}${t.description ? ` | Description: ${t.description}` : ""}`;
    });
    sections.push(`## Teams (${teams.length})\n${teamLines.join("\n")}`);
  }

  // Campaigns section
  if (campaigns.length > 0) {
    const campaignLines = campaigns.map((c) => {
      return `[Campaign:${c.id}] "${c.name}" | Goal: $${c.goalAmount} | Raised: $${c.currentAmount} | Status: ${c.status} | Donations: ${c._count.donations} | Created by: ${c.createdBy.name}${c.description ? ` | Description: ${c.description}` : ""}`;
    });
    sections.push(`## Campaigns (${campaigns.length})\n${campaignLines.join("\n")}`);
  }

  // Recent Activity
  if (activities.length > 0) {
    const activityLines = activities.map((a) => {
      return `[Activity:${a.id}] ${a.user.name}: ${a.description} (${a.createdAt.toISOString().split("T")[0]})`;
    });
    sections.push(`## Recent Activity (${activities.length})\n${activityLines.join("\n")}`);
  }

  // Comments
  if (comments.length > 0) {
    const commentLines = comments.map((c) => {
      return `[Comment:${c.id}] On task "${c.task.title}" by ${c.author.name}: "${c.content}" (${c.createdAt.toISOString().split("T")[0]})`;
    });
    sections.push(`## Recent Comments (${comments.length})\n${commentLines.join("\n")}`);
  }

  // Knowledge Articles
  if (knowledgeArticles.length > 0) {
    const articleLines = knowledgeArticles.map((a) => {
      const tags = a.tags.length > 0 ? ` | Tags: ${a.tags.join(", ")}` : "";
      return `[Article:${a.id}] "${a.title}" by ${a.createdBy.name}${tags}\n${a.content}`;
    });
    sections.push(`## Knowledge Base (${knowledgeArticles.length})\n${articleLines.join("\n\n")}`);
  }

  // File Contents
  if (filesWithText.length > 0) {
    const fileLines = filesWithText.map((f) => {
      const truncated = f.textContent!.length > 5000
        ? f.textContent!.slice(0, 5000) + "... [truncated]"
        : f.textContent!;
      return `[File:${f.id}] "${f.filename}" uploaded by ${f.uploadedBy.name}\n${truncated}`;
    });
    sections.push(`## File Contents (${filesWithText.length})\n${fileLines.join("\n\n")}`);
  }

  if (sections.length === 0) {
    return "No platform data found. The platform appears to be empty.";
  }

  return sections.join("\n\n");
}
