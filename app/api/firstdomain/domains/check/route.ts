import { NextResponse } from "next/server";
import {
  checkDomainAvailability,
  generateDomainCandidates,
} from "@/lib/firstdomain/namecheap/client";

export async function POST(request: Request) {
  try {
    const { projectName } = await request.json();

    if (!projectName || typeof projectName !== "string") {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const domains = generateDomainCandidates(projectName);
    if (domains.length === 0) {
      return NextResponse.json(
        { error: "Invalid project name" },
        { status: 400 }
      );
    }

    const results = await checkDomainAvailability(domains);

    return NextResponse.json({ results });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Domain check failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
