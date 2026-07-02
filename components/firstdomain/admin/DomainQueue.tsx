"use client";

import { useTransition } from "react";
import Link from "next/link";
import type { DomainRegistration, Application } from "@/lib/firstdomain/db/schema";
import { registerDomainForApplication } from "@/lib/firstdomain/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DomainQueueProps {
  registrations: Array<
    DomainRegistration & {
      application: Pick<Application, "fullName" | "projectName" | "email">;
    }
  >;
}

export function DomainQueue({ registrations }: DomainQueueProps) {
  const [pending, startTransition] = useTransition();

  function handleRegister(applicationId: string) {
    startTransition(async () => {
      await registerDomainForApplication(applicationId);
    });
  }

  return (
    <div className="space-y-4">
      {registrations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-500">
            No domain registrations in queue
          </CardContent>
        </Card>
      ) : (
        registrations.map((reg) => (
          <Card key={reg.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-mono">{reg.domain}</CardTitle>
                <p className="text-sm text-slate-500">
                  {reg.application.fullName} — {reg.application.projectName}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                  reg.status === "registered"
                    ? "bg-emerald-100 text-emerald-700"
                    : reg.status === "failed"
                      ? "bg-red-100 text-red-700"
                      : reg.status === "manual_required"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-700"
                }`}
              >
                {reg.status.replace("_", " ")}
              </span>
            </CardHeader>
            <CardContent>
              {reg.errorMessage && (
                <p className="mb-4 text-sm text-red-600">{reg.errorMessage}</p>
              )}
              {reg.namecheapOrderId && (
                <p className="mb-4 text-sm text-slate-500">
                  Order ID: {reg.namecheapOrderId}
                </p>
              )}
              <div className="flex gap-3">
                {reg.status === "pending" && (
                  <Button
                    size="sm"
                    onClick={() => handleRegister(reg.applicationId)}
                    disabled={pending}
                  >
                    {pending ? "Registering..." : "Register via Namecheap"}
                  </Button>
                )}
                <Button asChild size="sm" variant="outline">
                  <Link
                    href={`/firstdomain/admin/applications/${reg.applicationId}`}
                  >
                    View Application
                  </Link>
                </Button>
              </div>
              {reg.status === "registered" && !reg.assignedToFounderAccount && (
                <p className="mt-4 text-sm text-amber-600">
                  Manual step may be required to assign domain to founder&apos;s
                  Namecheap account.
                </p>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
