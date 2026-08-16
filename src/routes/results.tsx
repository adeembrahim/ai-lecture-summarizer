import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Sparkles,
  ListChecks,
  HelpCircle,
  Layers,
  FileDown,
  FileText,
  RefreshCw,
  RotateCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { ResultCard } from "@/components/ResultCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      {
        title: "Lecture Results — AI Lecture Summarizer",
      },
      {
        name: "description",
        content:
          "Your AI-generated lecture summary, key points, quiz questions, and flashcards.",
      },
    ],
  }),

  component: ResultsPage,
});

type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

type LectureResult = {
  summary?: string;
  keyPoints?: string[];
  quiz?: QuizQuestion[];
  transcript?: string;
  fileName?: string;
};

function ResultsPage() {
  const [result, setResult] =
    useState<LectureResult | null>(null);

  const [flipped, setFlipped] =
    useState<number | null>(null);

  const [picked, setPicked] =
    useState<Record<number, number>>({});

 useEffect(() => {
  const lectureId =
    sessionStorage.getItem("lectureId");

  const saved =
    sessionStorage.getItem("lectureResult");

  const loadResult = async () => {
    try {
      // إذا جينا من History
      if (lectureId) {
        console.log(
          "Loading result for lecture:",
          lectureId
        );

        const response = await fetch(
          `https://qnbvjqf5x0.execute-api.us-east-1.amazonaws.com/lecture/${lectureId}`
        );

        console.log(
          "Get lecture result status:",
          response.status
        );

        if (!response.ok) {
          throw new Error(
            `API Error: ${response.status}`
          );
        }

        const data =
          await response.json();

        console.log(
          "Lecture result from DynamoDB:",
          data
        );

        setResult(data);

        // نحذف الـID بعد استخدامه
        sessionStorage.removeItem(
          "lectureId"
        );

        return;
      }

      // إذا جينا من Processing
      // نستخدم النتيجة الموجودة أصلًا
      if (saved) {
        const parsed =
          JSON.parse(saved);

        console.log(
          "Real lecture result:",
          parsed
        );

        setResult(parsed);
      }
    } catch (error) {
      console.error(
        "Failed to load lecture result:",
        error
      );
    }
  };

  loadResult();
}, []);

  if (!result) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <PageHeader
          eyebrow="Results"
          title="No results found"
          description="We couldn't find a processed lecture."
        />

        <div className="mt-8 text-center">
          <Button asChild variant="hero">
            <Link to="/upload">
              Upload a Lecture
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const summary =
    result.summary ||
    "No summary available.";

  const keyPoints =
    result.keyPoints || [];

  const quiz =
    result.quiz || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">

      <PageHeader
        eyebrow="Step 3 of 3"
        title="Your Lecture Results"
        description="Your AI-generated study material is ready."
      />

      {/* Download / Generate Again */}

      <div className="animate-fade-up mt-8 flex flex-wrap justify-center gap-3">

        <Button
          variant="hero"
          size="lg"
          onClick={() => {
            const text =
              `SUMMARY\n\n${summary}\n\nKEY POINTS\n\n${keyPoints
                .map(
                  (point, i) =>
                    `${i + 1}. ${point}`
                )
                .join("\n")}`;

            const blob =
              new Blob([text], {
                type: "text/plain",
              });

            const url =
              URL.createObjectURL(blob);

            const a =
              document.createElement("a");

            a.href = url;
            a.download =
              "lecture-summary.txt";

            a.click();

            URL.revokeObjectURL(url);
          }}
        >
          <FileDown />
          Download
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="rounded-xl"
          onClick={() => {
            const text =
              `SUMMARY\n\n${summary}\n\nKEY POINTS\n\n${keyPoints
                .map(
                  (point, i) =>
                    `${i + 1}. ${point}`
                )
                .join("\n")}\n\nQUIZ\n\n${quiz
                .map(
                  (q, i) =>
                    `${i + 1}. ${q.question}\n${q.options
                      .map(
                        (option, j) =>
                          `${String.fromCharCode(
                            65 + j
                          )}. ${option}`
                      )
                      .join("\n")}\nAnswer: ${q.answer}`
                )
                .join("\n\n")}`;

            const blob =
              new Blob([text], {
                type: "text/plain",
              });

            const url =
              URL.createObjectURL(blob);

            const a =
              document.createElement("a");

            a.href = url;
            a.download =
              "lecture-results.txt";

            a.click();

            URL.revokeObjectURL(url);
          }}
        >
          <FileText />
          Download TXT
        </Button>

        <Button
          asChild
          variant="secondary"
          size="lg"
          className="rounded-xl"
        >
          <Link to="/upload">
            <RefreshCw />
            Generate Again
          </Link>
        </Button>

      </div>

      {/* Results */}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">

        {/* Summary */}

        <ResultCard
          icon={Sparkles}
          title="Summary"
          subtitle="Full-lecture recap"
        >
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
            {summary}
          </p>
        </ResultCard>

        {/* Key Points */}

        <ResultCard
          icon={ListChecks}
          title="Key Points"
          subtitle={`${keyPoints.length} essentials to remember`}
        >
          {keyPoints.length > 0 ? (
            <ul className="space-y-3">
              {keyPoints.map(
                (point, i) => (
                  <li
                    key={`${point}-${i}`}
                    className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-accent text-xs font-bold text-accent-foreground">
                      {i + 1}
                    </span>

                    <span className="text-sm leading-relaxed text-muted-foreground">
                      {point}
                    </span>
                  </li>
                )
              )}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No key points available.
            </p>
          )}
        </ResultCard>

        {/* Quiz */}

        <ResultCard
          icon={HelpCircle}
          title="Quiz Questions"
          subtitle="Check your understanding"
        >
          {quiz.length > 0 ? (
            <ol className="space-y-5">
              {quiz.map(
                (q, qi) => (
                  <li
                    key={`${q.question}-${qi}`}
                  >
                    <p className="text-sm font-semibold">
                      {qi + 1}.{" "}
                      {q.question}
                    </p>

                    <div className="mt-3 grid gap-2">

                      {q.options.map(
                        (
                          option,
                          oi
                        ) => {
                          const chosen =
                            picked[qi] ===
                            oi;

                          const correct =
                            option ===
                            q.answer;

                          return (
                            <button
                              key={`${option}-${oi}`}
                              type="button"
                              onClick={() =>
                                setPicked(
                                  (p) => ({
                                    ...p,
                                    [qi]:
                                      oi,
                                  })
                                )
                              }
                              className={cn(
                                "rounded-xl border border-border bg-card px-3.5 py-2.5 text-left text-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary",

                                chosen &&
                                  correct &&
                                  "border-success bg-success/10 text-foreground",

                                chosen &&
                                  !correct &&
                                  "border-destructive bg-destructive/10 text-foreground"
                              )}
                            >
                              {option}
                            </button>
                          );
                        }
                      )}

                    </div>

                    {picked[qi] !==
                      undefined && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Correct answer:{" "}
                        {q.answer}
                      </p>
                    )}
                  </li>
                )
              )}
            </ol>
          ) : (
            <p className="text-sm text-muted-foreground">
              No quiz questions available.
            </p>
          )}
        </ResultCard>

        {/* Transcript */}

        <ResultCard
          icon={Layers}
          title="Transcript"
          subtitle="Original lecture transcript"
        >
          <div className="max-h-96 overflow-y-auto rounded-xl bg-muted/40 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {result.transcript ||
                "No transcript available."}
            </p>
          </div>
        </ResultCard>

      </div>
    </div>
  );
}