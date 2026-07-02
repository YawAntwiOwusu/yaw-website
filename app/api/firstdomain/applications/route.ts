import { NextResponse } from "next/server";
import { submitApplication } from "@/lib/firstdomain/actions/submit-application";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await submitApplication(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      applicationId: result.applicationId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Submission failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
