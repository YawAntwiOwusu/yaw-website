"use server";

import { submitApplication } from "@/lib/firstdomain/actions/submit-application";

export async function submitApplicationAction(data: unknown) {
  return submitApplication(data);
}
