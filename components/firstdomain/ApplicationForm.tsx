"use client";

import { useState } from "react";
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
import { DomainChecker } from "@/components/firstdomain/DomainChecker";
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
import { cn } from "@/lib/utils";

const STEPS = [
  "Personal",
  "Founder",
  "Startup",
  "Domain",
  "Builder Wall",
  "Review",
];

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

  if (!applicationsOpen) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            Applications are closed
          </h2>
          <p className="mt-2 text-slate-600">
            Check back when the next cycle opens. You can still explore previous
            winners and check domain availability.
          </p>
        </CardContent>
      </Card>
    );
  }

  async function handleSubmit() {
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
            </>
          )}

          {step === 3 && (
            <>
              <DomainChecker
                initialProjectName={values.projectName}
                selectedDomain={values.desiredDomain}
                compact
                onSelectDomain={(domain, price) => {
                  form.setValue("desiredDomain", domain);
                  if (price) form.setValue("estimatedPrice", price);
                  const alternatives = form
                    .getValues("domainAlternatives")
                    .filter((d) => d !== domain);
                  if (!alternatives.includes(domain)) {
                    form.setValue("domainAlternatives", alternatives);
                  }
                }}
              />
              {form.formState.errors.desiredDomain && (
                <p className="text-sm text-red-600">
                  Please select a desired domain
                </p>
              )}
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

          {step === 4 && (
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

          {step === 5 && (
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
                  <strong>Domain:</strong> {values.desiredDomain || "—"}
                </p>
                <p>
                  <strong>Category:</strong> {values.category}
                </p>
                <p>
                  <strong>Launch Stage:</strong> {values.launchStage}
                </p>
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
                disabled={submitting}
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
