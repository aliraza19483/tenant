import { NextRequest, NextResponse } from "next/server";
import { LoginPayloadSchema } from "../../../../lib/zod/schemas";
import User from "../../../../lib/db/models/User";
import "../../../../lib/db/models/Project"; // Import to ensure schema is registered for populate
import connectToDatabase from "../../../../lib/db/connect";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = LoginPayloadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await connectToDatabase();
    
    const count = await User.countDocuments();
    console.log("Total users in DB:", count, "Looking for:", result.data.email);

    // In a real app we'd check passwords. Here we just lookup by email.
    const user = await User.findOne({ email: result.data.email }).populate("projectId");
    
    if (!user) {
      const allUsers = await User.find({}, {email: 1});
      console.log("Existing users:", allUsers);
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const sessionData = {
      userId: user._id.toString(),
      projectId: user.projectId._id.toString(),
      role: user.role,
      name: user.name,
      projectSlug: (user.projectId as any).slug
    };

    cookies().set("session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ success: true, projectSlug: (user.projectId as any).slug });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
