import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ChatMessagePayloadSchema } from "../../../lib/zod/schemas";
import { sendMessage } from "../../../lib/services/chat.service";

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = cookies().get("session");
    if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = JSON.parse(sessionCookie.value);

    const body = await req.json();
    const result = ChatMessagePayloadSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    const searchParams = req.nextUrl.searchParams;
    const conversationId = searchParams.get("conversationId");

    const chatResponse = await sendMessage(
      session.projectId,
      session.userId,
      conversationId || null,
      result.data.content
    );

    if (chatResponse.status === 429) {
      return NextResponse.json({ error: chatResponse.error }, { status: 429 });
    }

    return NextResponse.json(chatResponse);
  } catch (error: any) {
    console.error("Chat route error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
