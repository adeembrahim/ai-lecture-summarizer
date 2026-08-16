import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Upload,
  FileAudio,
  Sparkles,
  ListChecks,
  HelpCircle,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-ai-lecture.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Lecture Summarizer — Turn Lectures into Study Notes" },
      {
        name: "description",
        content:
          "Upload lecture audio or video and instantly get an AI summary, key points, quiz questions, and flashcards. Supports MP3, MP4 and WAV.",
      },
      { property: "og:title", content: "AI Lecture Summarizer" },
      {
        property: "og:description",
        content:
          "Upload your lecture audio or video and instantly receive a summary, key points, and revision questions using AI.",
      },
    ],
  }),
  component: Home,
});

const features = [
  {
    icon: Sparkles,
    title: "Smart Summary",
    text: "A concise recap of the entire lecture.",
  },
  {
    icon: ListChecks,
    title: "Key Points",
    text: "The essentials, extracted and ordered.",
  },
  {
    icon: HelpCircle,
    title: "Quiz Questions",
    text: "Test yourself before the exam.",
  },
];
function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-accent/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            <Sparkles className="h-3.5 w-3.5" /> AI study assistant
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            AI <span className="gradient-text">Lecture Summarizer</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Upload your lecture audio or video and instantly receive a summary, key points, and
            revision questions using AI.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/upload">
                <Upload /> Upload Lecture
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="rounded-2xl">
              <Link to="/history">
                View History <ArrowRight />
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <FileAudio className="h-4 w-4 shrink-0 text-primary" />
            <span>Supported formats:</span>
            {["MP3", "MP4", "WAV"].map((f) => (
              <span
                key={f}
                className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="animate-fade-up glass-panel relative rounded-4xl p-3 sm:p-4">
          <img
            src={heroImage}
            alt="Student using an AI assistant to summarize a university lecture recording"
            width={1280}
            height={960}
            className="animate-float w-full rounded-3xl"
          />
        </div>
      </section>

      <section className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="surface-card animate-fade-up rounded-3xl p-6">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-accent-foreground">
              <f.icon className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-base font-bold">{f.title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
