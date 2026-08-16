import {
  createFileRoute,
  Link,
} from "@tanstack/react-router";

import {
  Eye,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { useEffect, useState } from "react";

import { fetchAuthSession } from "aws-amplify/auth";

import "@/lib/amplify";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      {
        title:
          "Lecture History — AI Lecture Summarizer",
      },
      {
        name: "description",
        content:
          "Browse every lecture you have summarized, check its status, and reopen results.",
      },
      {
        property: "og:title",
        content:
          "Lecture History — AI Lecture Summarizer",
      },
      {
        property: "og:description",
        content:
          "Browse every lecture you have summarized and reopen its results.",
      },
    ],
  }),

  component: HistoryPage,
});

const API_URL =
  "https://qnbvjqf5x0.execute-api.us-east-1.amazonaws.com";

type LectureStatus =
  | "completed"
  | "processing"
  | "failed";

type Lecture = {
  id: string;
  name: string;
  date: string;
  status: LectureStatus;
};

const statusStyles: Record<
  LectureStatus,
  {
    label: string;
    className: string;
    icon: typeof Eye;
  }
> = {
  completed: {
    label: "Completed",
    className:
      "bg-success/12 text-success border-success/30",
    icon: CheckCircle2,
  },

  processing: {
    label: "Processing",
    className:
      "bg-warning/15 text-warning border-warning/30",
    icon: Loader2,
  },

  failed: {
    label: "Failed",
    className:
      "bg-destructive/12 text-destructive border-destructive/30",
    icon: AlertCircle,
  },
};

function StatusBadge({
  status,
}: {
  status: LectureStatus;
}) {
  const s = statusStyles[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        s.className
      )}
    >
      <s.icon
        className={cn(
          "h-3.5 w-3.5",
          status === "processing" &&
            "animate-spin"
        )}
      />

      {s.label}
    </span>
  );
}

function formatDate(value: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-CA");
}

function HistoryPage() {
  const [lectures, setLectures] =
    useState<Lecture[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadLectures = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(
          "Loading lecture history..."
        );

        // Get the current Cognito session
        const session =
          await fetchAuthSession();

        const token =
          session.tokens?.idToken?.toString();

        if (!token) {
          throw new Error(
            "You must be signed in to view your lecture history."
          );
        }

        console.log(
          "Cognito session found."
        );

        // Send Cognito JWT to API Gateway
        const response = await fetch(
          `${API_URL}/lectures`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        console.log(
          "History API status:",
          response.status
        );

        if (response.status === 401) {
          throw new Error(
            "Your session has expired. Please sign in again."
          );
        }

        if (!response.ok) {
          throw new Error(
            `API Error: ${response.status}`
          );
        }

        const data =
          await response.json();

        console.log(
          "Lecture history:",
          data
        );

        setLectures(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error(
          "Failed to load history:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load lecture history."
        );
      } finally {
        setLoading(false);
      }
    };

    loadLectures();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">

      <PageHeader
        eyebrow="Library"
        title="Lecture history"
        description="Everything you have processed so far, newest first."
      />

      {loading && (
        <div className="surface-card mt-10 flex items-center justify-center rounded-3xl p-12">
          <Loader2 className="mr-3 h-5 w-5 animate-spin text-primary" />

          <span className="text-sm text-muted-foreground">
            Loading your lectures...
          </span>
        </div>
      )}

      {error && (
        <div className="mt-10 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <strong>
            Unable to load lectures:
          </strong>{" "}
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        lectures.length === 0 && (
          <div className="surface-card mt-10 rounded-3xl p-12 text-center">
            <p className="text-lg font-semibold">
              No lectures yet
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Upload your first lecture to see it here.
            </p>

            <Button
              asChild
              variant="hero"
              className="mt-6"
            >
              <Link to="/upload">
                Upload Lecture
              </Link>
            </Button>
          </div>
        )}

      {!loading &&
        !error &&
        lectures.length > 0 && (
          <>
            {/* Desktop */}

            <div className="surface-card animate-fade-up mt-10 hidden overflow-hidden rounded-3xl md:block">

              <table className="w-full text-left text-sm">

                <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">

                  <tr>

                    <th className="px-6 py-4 font-semibold">
                      Lecture Name
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Date
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {lectures.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="border-t border-border transition-colors hover:bg-accent/40"
                      >

                        <td className="max-w-xs truncate px-6 py-4 font-medium">
                          {item.name}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                          {formatDate(
                            item.date
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge
                            status={
                              item.status
                            }
                          />
                        </td>

                        <td className="px-6 py-4 text-right">

                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="rounded-lg"
                            disabled={
                              item.status !==
                              "completed"
                            }
                          >

                            <Link
                              to="/results"
                              onClick={() => {
                                sessionStorage.setItem(
                                  "lectureId",
                                  item.id
                                );
                              }}
                            >
                              <Eye />
                              View Results
                            </Link>

                          </Button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

            {/* Mobile */}

            <div className="mt-10 grid gap-4 md:hidden">

              {lectures.map(
                (item) => (
                  <div
                    key={item.id}
                    className="surface-card animate-fade-up rounded-2xl p-5"
                  >

                    <p className="truncate text-sm font-semibold">
                      {item.name}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">

                      <span className="text-xs text-muted-foreground">
                        {formatDate(
                          item.date
                        )}
                      </span>

                      <StatusBadge
                        status={
                          item.status
                        }
                      />

                    </div>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="mt-4 w-full rounded-lg"
                      disabled={
                        item.status !==
                        "completed"
                      }
                    >

                      <Link
                        to="/results"
                        onClick={() => {
                          sessionStorage.setItem(
                            "lectureId",
                            item.id
                          );
                        }}
                      >
                        <Eye />
                        View Results
                      </Link>

                    </Button>

                  </div>
                )
              )}

            </div>
          </>
        )}

    </div>
  );
}