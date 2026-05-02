import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDatabase from "../../../lib/db/connect";
import Conversation from "../../../lib/db/models/Conversation";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = cookies().get("session");
    if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const session = JSON.parse(sessionCookie.value);
    await connectToDatabase();

    const conversations = await Conversation.find({ projectId: session.projectId })
      .sort({ updatedAt: -1 })
      .select("_id title updatedAt");

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Conversations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
