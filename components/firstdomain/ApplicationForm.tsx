"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  applicationFormSchema,
  type ApplicationFormData,
} from "@/lib/firstdomain/types/application";
import {
  FIRSTDOMAIN_CATEGORIES,
  FIRSTDOMAIN_LAUNCH_STAGES,
  FIRSTDOMAIN_LAUNCH_TIMELINES,
} from "@/lib/firstdomain/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { submitApplicationAction } from "@/lib/firstdomain/actions/server-actions";
import {
  getSelectedDomain,
  verifyDomainAvailable,
} from "@/lib/firstdomain/application-draft";
import { SelectedDomainBanner } from "@/components/firstdomain/SelectedDomainBanner";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const STEPS = ["Personal", "Founder", "Startup", "Builder Wall", "Review"];

interface ApplicationFormProps {
  applicationsOpen: boolean;
  cycleName?: string;
}

export function ApplicationForm({
  applicationsOpen,
  cycleName,
}: ApplicationFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [domainVerified, setDomainVerified] = useState(false);
  const [verifyingDomain, setVerifyingDomain] = useState(false);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      country: "",
      linkedin: "",
      twitter: "",
      website: "",
      bio: "",
      experience: "",
      industry: "",
      projectName: "",
      description: "",
      category: "SaaS",
      launchStage: "Prototype",
      demoUrl: "",
      prototypeNotes: "",
      desiredDomain: "",
      domainAlternatives: [],
      estimatedPrice: "",
      launchTimeline: "1–3 months",
      motivation: "",
      optIntoBuilderWall: false,
      builderWallPublic: false,
      consent: undefined as unknown as true,
    },
    mode: "onChange",
  });

  const values = form.watch();

  useEffect(() => {
    const draft = getSelectedDomain();
    if (!draft?.domain) {
      router.replace("/firstdomain#search");
      return;
    }

    form.setValue("desiredDomain", draft.domain);
    if (draft.estimatedPrice) {
      form.setValue("estimatedPrice", draft.estimatedPrice);
    }
    setDomainVerified(true);
    setReady(true);
  }, [form, router]);

  useEffect(() => {
    if (step === STEPS.length - 1 && values.desiredDomain) {
      setDomainVerified(true);
    }
  }, [step, values.desiredDomain]);

  if (!applicationsOpen) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            Applications are closed
          </h2>
          <p className="mt-2 text-slate-600">
            Check back when the next cycle opens. You can still explore previous
            winners and search for domains on the homepage.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading your application…
      </div>
    );
  }

  async function handleVerifyDomain() {
    const domain = form.getValues("desiredDomain").trim();
    if (!domain) {
      setDomainVerified(false);
      return;
    }

    setVerifyingDomain(true);
    setError(null);

    try {
      const available = await verifyDomainAvailable(domain);
      setDomainVerified(available);
      if (!available) {
        setError("That domain is not available. Try another name or pick from search results.");
      }
    } catch {
      setDomainVerified(false);
      setError("Could not verify domain availability. Please try again.");
    } finally {
      setVerifyingDomain(false);
    }
  }

  async function handleSubmit() {
    if (!domainVerified) {
      setError("Please verify your domain is available before submitting.");
      return;
    }

    const valid = await form.trigger();
    if (!valid) return;

    setSubmitting(true);
    setError(null);

    const result = await submitApplicationAction(form.getValues());

    if (!result.success) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    router.push(
      `/firstdomain/apply/success?id=${result.applicationId}`
    );
  }

  function nextStep() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <div>
      <SelectedDomainBanner />

      {cycleName && (
        <p className="mb-6 text-sm text-indigo-600">
          Applying for: <strong>{cycleName}</strong>
        </p>
      )}

      <div className="mb-8 flex gap-2 overflow-x-auto">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap",
              i === step
                ? "bg-indigo-600 text-white"
                : i < step
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-slate-100 text-slate-500"
            )}
          >
            {i + 1}. {label}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && (
            <>
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" {...form.register("fullName")} />
                {form.formState.errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" {...form.register("email")} />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input id="country" {...form.register("country")} />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input id="linkedin" {...form.register("linkedin")} />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter / X</Label>
                <Input id="twitter" {...form.register("twitter")} />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" {...form.register("website")} />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <Label htmlFor="bio">About you *</Label>
                <Textarea id="bio" rows={4} {...form.register("bio")} />
              </div>
              <div>
                <Label htmlFor="experience">Experience</Label>
                <Textarea
                  id="experience"
                  rows={3}
                  {...form.register("experience")}
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Input id="industry" {...form.register("industry")} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <Label htmlFor="projectName">Project Name *</Label>
                <Input id="projectName" {...form.register("projectName")} />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  rows={5}
                  {...form.register("description")}
                />
              </div>
              <div>
                <Label>Category *</Label>
                <Select
                  value={values.category}
                  onValueChange={(v) =>
                    form.setValue("category", v as ApplicationFormData["category"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIRSTDOMAIN_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Launch Stage *</Label>
                <Select
                  value={values.launchStage}
                  onValueChange={(v) =>
                    form.setValue(
                      "launchStage",
                      v as ApplicationFormData["launchStage"]
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIRSTDOMAIN_LAUNCH_STAGES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="demoUrl">Demo URL</Label>
                <Input id="demoUrl" {...form.register("demoUrl")} />
              </div>
              <div>
                <Label htmlFor="prototypeNotes">Prototype Notes</Label>
                <Textarea
                  id="prototypeNotes"
                  rows={3}
                  {...form.register("prototypeNotes")}
                />
              </div>
              <div>
                <Label>Launch Timeline *</Label>
                <Select
                  value={values.launchTimeline}
                  onValueChange={(v) =>
                    form.setValue(
                      "launchTimeline",
                      v as ApplicationFormData["launchTimeline"]
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIRSTDOMAIN_LAUNCH_TIMELINES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="motivation">Why First Domain? *</Label>
                <Textarea
                  id="motivation"
                  rows={4}
                  {...form.register("motivation")}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="font-medium">Join the Builder Wall</p>
                  <p className="text-sm text-slate-500">
                    Showcase what you&apos;re building publicly, even if not
                    selected.
                  </p>
                </div>
                <Switch
                  checked={values.optIntoBuilderWall}
                  onCheckedChange={(checked) =>
                    form.setValue("optIntoBuilderWall", checked)
                  }
                />
              </div>
              {values.optIntoBuilderWall && (
                <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div>
                    <p className="font-medium">Make profile public</p>
                    <p className="text-sm text-slate-500">
                      Your project will appear on the Builder Wall.
                    </p>
                  </div>
                  <Switch
                    checked={values.builderWallPublic}
                    onCheckedChange={(checked) =>
                      form.setValue("builderWallPublic", checked)
                    }
                  />
                </div>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Name:</strong> {values.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {values.email}
                </p>
                <p>
                  <strong>Project:</strong> {values.projectName}
                </p>
                <p>
                  <strong>Category:</strong> {values.category}
                </p>
                <p>
                  <strong>Launch Stage:</strong> {values.launchStage}
                </p>
                <p>
                  <strong>Launch Timeline:</strong> {values.launchTimeline}
                </p>
              </div>

              <div className="space-y-3 border-t border-slate-200 pt-4">
                <Label htmlFor="desiredDomain">Domain *</Label>
                <p className="text-sm text-slate-500">
                  You can edit your domain before submitting. Verify availability
                  after any change.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    id="desiredDomain"
                    className="font-mono"
                    value={values.desiredDomain}
                    onChange={(e) => {
                      form.setValue("desiredDomain", e.target.value);
                      setDomainVerified(false);
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVerifyDomain}
                    disabled={verifyingDomain || !values.desiredDomain.trim()}
                  >
                    {verifyingDomain ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Verify availability"
                    )}
                  </Button>
                </div>
                {domainVerified && values.desiredDomain && (
                  <p className="text-sm text-emerald-600">
                    Domain verified as available.
                  </p>
                )}
                {!domainVerified && values.desiredDomain && (
                  <p className="text-sm text-amber-600">
                    Verify your domain before submitting.
                  </p>
                )}
              </div>

              <div className="flex items-start gap-3 pt-4">
                <Checkbox
                  id="consent"
                  checked={values.consent === true}
                  onCheckedChange={(checked) =>
                    form.setValue("consent", checked === true ? true : (undefined as unknown as true))
                  }
                />
                <Label htmlFor="consent" className="text-sm leading-relaxed">
                  I agree to the processing of my application data and understand
                  that selection is at the discretion of the First Domain team.
                </Label>
              </div>
            </>
          )}

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={step === 0}
            >
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !domainVerified}
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
