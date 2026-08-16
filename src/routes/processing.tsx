import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";

import { useEffect, useState } from "react";

import {
  Check,
  Loader2,
  UploadCloud,
  AudioLines,
  Sparkles,
  HelpCircle,
} from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/processing"
)({
  head: () => ({
    meta: [
      {
        title:
          "Processing Your Lecture — AI Lecture Summarizer",
      },
      {
        name: "description",
        content:
          "Transcribing your recording, generating a summary, and building revision questions.",
      },
    ],
  }),

  component: ProcessingPage,
});

const API_URL =
  "https://qnbvjqf5x0.execute-api.us-east-1.amazonaws.com";

const steps = [
  {
    icon: UploadCloud,
    label: "Uploading File",
  },
  {
    icon: AudioLines,
    label: "Converting Speech to Text",
  },
  {
    icon: Sparkles,
    label: "Generating Summary",
  },
  {
    icon: HelpCircle,
    label: "Creating Questions",
  },
];

function ProcessingPage() {
  const navigate = useNavigate();

  const [current, setCurrent] =
    useState(0);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<
      typeof setTimeout
    > | undefined;

    const checkResult = async () => {
      try {
        const lectureId =
          sessionStorage.getItem(
            "lectureId"
          );

        if (!lectureId) {
          throw new Error(
            "Lecture ID not found."
          );
        }

        console.log(
          "Checking lecture:",
          lectureId
        );

        const response =
          await fetch(
            `${API_URL}/lecture/${encodeURIComponent(
              lectureId
            )}`
          );

        console.log(
          "API response:",
          response.status
        );

        if (response.ok) {
          const result =
            await response.json();

          console.log(
            "Lecture result received:",
            result
          );

          if (!stopped) {
            sessionStorage.setItem(
              "lectureResult",
              JSON.stringify(result)
            );

            setCurrent(
              steps.length
            );

            timer = setTimeout(() => {
              navigate({
                to: "/results",
              });
            }, 700);
          }

          return;
        }

        if (response.status === 404) {
          console.log(
            "Lecture is still processing..."
          );

          if (!stopped) {
            setCurrent(
              (value) =>
                Math.min(
                  value + 1,
                  steps.length - 1
                )
            );

            timer = setTimeout(
              checkResult,
              3000
            );
          }

          return;
        }

        throw new Error(
          `API Error: ${response.status}`
        );

      } catch (err) {
        console.error(err);

        if (!stopped) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to check lecture status."
          );
        }
      }
    };

    checkResult();

    return () => {
      stopped = true;

      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [navigate]);

  const percent = Math.round(
    (current / steps.length) * 100
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">

      <PageHeader
        eyebrow="Step 2 of 3"
        title="Processing your lecture"
        description="Please wait while we transcribe your lecture and create your study material."
      />

      <div className="glass-panel animate-fade-up mt-10 rounded-3xl p-6 sm:p-8">

        <div className="flex items-center justify-between text-sm font-semibold">

          <span>
            Overall progress
          </span>

          <span className="text-primary">
            {percent}%
          </span>

        </div>

        <Progress
          value={percent}
          className="mt-3 h-2.5"
        />

        {error && (
          <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <ul className="mt-8 space-y-3">

          {steps.map(
            (step, i) => {
              const done =
                i < current;

              const active =
                i === current &&
                !error;

              return (
                <li
                  key={step.label}
                  className={cn(
                    "grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-border bg-card/70 px-4 py-3.5 transition-all duration-300",

                    active &&
                      "border-primary shadow-glow",

                    done &&
                      "opacity-90"
                  )}
                >

                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors",

                      done
                        ? "bg-success text-success-foreground"
                        : active
                        ? "bg-gradient-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >

                    {done ? (
                      <Check className="h-5 w-5" />
                    ) : active ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}

                  </span>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold">
                      {step.label}
                    </p>

                    <p className="text-xs text-muted-foreground">

                      {done
                        ? "Completed"
                        : active
                        ? "In progress…"
                        : "Waiting"}

                    </p>

                  </div>

                </li>
              );
            }
          )}

        </ul>

      </div>
    </div>
  );
}