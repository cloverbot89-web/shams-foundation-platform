import { db } from "@/lib/db";
import type { NotificationType } from "@prisma/client";

interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string;
}

export async function createNotification(input: CreateNotificationInput) {
  return db.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      linkUrl: input.linkUrl ?? null,
    },
  });
}

export async function notifyTaskAssigned(taskId: string, taskTitle: string, assigneeId: string, assignerName: string) {
  return createNotification({
    userId: assigneeId,
    type: "TASK_ASSIGNED",
    title: "New task assigned to you",
    message: `${assignerName} assigned you "${taskTitle}"`,
    linkUrl: `/tasks`,
  });
}

export async function notifyCommentAdded(taskId: string, taskTitle: string, taskCreatorId: string, assigneeId: string | null, commenterId: string, commenterName: string) {
  const recipients = new Set<string>();
  if (taskCreatorId !== commenterId) recipients.add(taskCreatorId);
  if (assigneeId && assigneeId !== commenterId) recipients.add(assigneeId);

  const promises = Array.from(recipients).map((userId) =>
    createNotification({
      userId,
      type: "COMMENT_REPLY",
      title: "New comment on task",
      message: `${commenterName} commented on "${taskTitle}"`,
      linkUrl: `/tasks`,
    })
  );

  return Promise.all(promises);
}

export async function notifyTeamInvite(userId: string, teamName: string, inviterName: string, teamId: string) {
  return createNotification({
    userId,
    type: "TEAM_INVITE",
    title: "Added to a team",
    message: `${inviterName} added you to "${teamName}"`,
    linkUrl: `/teams/${teamId}`,
  });
}
