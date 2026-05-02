import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDashboardConfig, updateDashboardConfig, getDashboardData } from "../../../../lib/services/dashboard.service";
import { UpdateDashboardConfigPayloadSchema } from "../../../../lib/zod/schemas";
import { isAdmin } from "../../../../lib/access/admin";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = cookies().get("session");
    if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = JSON.parse(sessionCookie.value);

    if (!isAdmin(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const config = await getDashboardConfig(session.projectId);
    const data = await getDashboardData(session.projectId);

    return NextResponse.json({ config, data });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const sessionCookie = cookies().get("session");
    if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = JSON.parse(sessionCookie.value);

    if (!isAdmin(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const result = UpdateDashboardConfigPayloadSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    const updated = await updateDashboardConfig(session.projectId, result.data);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
