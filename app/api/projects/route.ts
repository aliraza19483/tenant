import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../../lib/db/connect";
import Project from "../../../lib/db/models/Project";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = cookies().get("session");
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    await connectToDatabase();

    const project = await Project.findById(session.projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json([project]);
  } catch (error) {
    console.error("Projects error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
