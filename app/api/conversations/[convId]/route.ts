import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDatabase from "../../../../lib/db/connect";
import Conversation from "../../../../lib/db/models/Conversation";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { convId: string } }
) {
  try {
    const sessionCookie = cookies().get("session");
    if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = JSON.parse(sessionCookie.value);
    await connectToDatabase();

    const conversation = await Conversation.findOneAndDelete({
      _id: params.convId,
      projectId: session.projectId,
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete conversation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
