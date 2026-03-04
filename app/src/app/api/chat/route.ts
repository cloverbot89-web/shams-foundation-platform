import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildPlatformContext } from "@/lib/chat-context";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are the Shams Foundation AI Assistant. You help team members find information about tasks, campaigns, teams, donations, and platform activity.

Rules:
1. ONLY answer questions using the platform data provided below. Do not make up information.
2. When referencing specific items, cite them using their bracketed IDs (e.g. [Task:abc-123], [Campaign:xyz-456]).
3. Handle misspellings and partial names gracefully — match the closest item from the data.
4. If you cannot find relevant data, say so clearly.
5. Be concise and helpful. Use bullet points for lists.
6. You can perform calculations (totals, counts, comparisons) on the provided data.
7. For questions outside the platform data scope, politely explain you can only help with platform-related queries.`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { message, sessionId } = body;

  if (!message || !sessionId) {
    return NextResponse.json({ error: "Message and sessionId are required" }, { status: 400 });
  }

  // Load conversation history for this session
  const history = await db.chatMessage.findMany({
    where: { userId: session.user.id, sessionId },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  // Build platform context
  const platformContext = await buildPlatformContext(
    session.user.id,
    session.user.role as string
  );

  // Build messages array for Haiku
  const messages: Anthropic.MessageParam[] = [
    ...history.map((msg) => ({
      role: msg.role === "USER" ? "user" as const : "assistant" as const,
      content: msg.content,
    })),
    { role: "user" as const, content: message },
  ];

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: `${SYSTEM_PROMPT}\n\n# Platform Data\n${platformContext}`,
    messages,
  });

  const assistantContent =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Extract citations from response
  const citationRegex = /\[(Task|Team|Campaign|Activity|Comment):([^\]]+)\]/g;
  const citations: { type: string; id: string }[] = [];
  let match;
  while ((match = citationRegex.exec(assistantContent)) !== null) {
    citations.push({ type: match[1], id: match[2] });
  }

  // Save both messages
  await db.chatMessage.createMany({
    data: [
      {
        userId: session.user.id,
        sessionId,
        role: "USER",
        content: message,
      },
      {
        userId: session.user.id,
        sessionId,
        role: "ASSISTANT",
        content: assistantContent,
        sourceCitations: citations.length > 0 ? citations : undefined,
      },
    ],
  });

  return NextResponse.json({
    content: assistantContent,
    citations,
  });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const sessionId = searchParams.get("sessionId");

  if (sessionId) {
    // Load messages for a specific session
    const messages = await db.chatMessage.findMany({
      where: { userId: session.user.id, sessionId },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(messages);
  }

  // List all sessions for this user (most recent message per session)
  const sessions = await db.$queryRaw<
    { session_id: string; last_message: Date; preview: string }[]
  >`
    SELECT DISTINCT ON (session_id)
      session_id,
      created_at AS last_message,
      content AS preview
    FROM chat_messages
    WHERE user_id = ${session.user.id}::uuid
    ORDER BY session_id, created_at DESC
  `;

  return NextResponse.json(sessions);
}
