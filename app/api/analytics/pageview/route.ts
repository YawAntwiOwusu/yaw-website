import { NextResponse } from "next/server";
import { recordPageview } from "@/lib/fwd/actions/analytics";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      path?: string;
      referrer?: string | null;
      sessionId?: string | null;
    };

    if (!body.path || typeof body.path !== "string") {
      return NextResponse.json({ error: "path required" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent");
    await recordPageview({
      path: body.path,
      referrer: body.referrer,
      sessionId: body.sessionId,
      userAgent,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
