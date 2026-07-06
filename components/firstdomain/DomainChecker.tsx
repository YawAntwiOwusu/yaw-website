"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface DomainResult {
  domain: string;
  available: boolean;
  price?: string;
}

interface DomainCheckerProps {
  initialProjectName?: string;
  onSelectDomain?: (domain: string, price?: string) => void;
  selectedDomain?: string;
  compact?: boolean;
  variant?: "light" | "dark";
  selectLabel?: string;
  inputId?: string;
}

export function DomainChecker({
  initialProjectName = "",
  onSelectDomain,
  selectedDomain,
  compact = false,
  variant = "light",
  selectLabel = "Select",
  inputId = "projectName",
}: DomainCheckerProps) {
  const [projectName, setProjectName] = useState(initialProjectName);
  const [results, setResults] = useState<DomainResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheck() {
    if (!projectName.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch("/api/firstdomain/domains/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName: projectName.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to check domains");
      }
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const isDark = variant === "dark";

  return (
    <Card
      className={cn(
        compact && "border-0 bg-transparent shadow-none",
        isDark && compact && "text-white"
      )}
    >
      {!compact && (
        <CardHeader>
          <CardTitle>Domain Availability Checker</CardTitle>
          <p className="text-sm text-slate-500">
            Enter your project name to see available domains across supported
            TLDs.
          </p>
        </CardHeader>
      )}
      <CardContent className={cn(compact && "p-0")}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <Label htmlFor={inputId} className="sr-only">
              Project Name
            </Label>
            <Input
              id={inputId}
              placeholder="e.g. PrintBible"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              className={cn(
                isDark &&
                  "border-white/20 bg-white/10 text-white placeholder:text-neutral-400"
              )}
            />
          </div>
          <Button
            onClick={handleCheck}
            disabled={loading || !projectName.trim()}
            className={cn(
              isDark && "bg-white text-neutral-950 hover:bg-neutral-200"
            )}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Check availability"
            )}
          </Button>
        </div>

        {error && (
          <p className={cn("mt-4 text-sm", isDark ? "text-red-300" : "text-red-600")}>
            {error}
          </p>
        )}

        {results.length > 0 && (
          <div className="mt-6 space-y-2">
            <p
              className={cn(
                "text-sm font-medium",
                isDark ? "text-neutral-300" : "text-slate-700"
              )}
            >
              Suggested domains for &ldquo;{projectName}&rdquo;
            </p>
            <ul
              className={cn(
                "divide-y rounded-lg border",
                isDark
                  ? "divide-white/10 border-white/15 bg-white/5"
                  : "divide-slate-100 border-slate-200"
              )}
            >
              {results.map((result) => (
                <li
                  key={result.domain}
                  className={cn(
                    "flex items-center justify-between px-4 py-3",
                    onSelectDomain &&
                      result.available &&
                      (isDark
                        ? "cursor-pointer hover:bg-white/10"
                        : "cursor-pointer hover:bg-slate-50"),
                    selectedDomain === result.domain &&
                      (isDark ? "bg-white/10" : "bg-indigo-50")
                  )}
                  onClick={() =>
                    result.available &&
                    onSelectDomain?.(result.domain, result.price)
                  }
                >
                  <div className="flex items-center gap-3">
                    {result.available ? (
                      <Check className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-400" />
                    )}
                    <span className="font-mono text-sm">{result.domain}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {result.price && result.available && (
                      <span
                        className={cn(
                          "text-sm",
                          isDark ? "text-neutral-400" : "text-slate-500"
                        )}
                      >
                        ~${result.price}/yr
                      </span>
                    )}
                    {onSelectDomain && result.available && (
                      <Button
                        type="button"
                        size="sm"
                        variant={
                          selectedDomain === result.domain
                            ? "default"
                            : "outline"
                        }
                        className={cn(
                          isDark &&
                            selectedDomain !== result.domain &&
                            "border-white/20 bg-transparent text-white hover:bg-white/10"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDomain(result.domain, result.price);
                        }}
                      >
                        {selectedDomain === result.domain
                          ? "Selected"
                          : selectLabel}
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
