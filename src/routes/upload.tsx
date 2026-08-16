import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";

import {
  UploadCloud,
  FileAudio,
  X,
  Languages,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";
import "@/lib/amplify";
import { fetchAuthSession } from "aws-amplify/auth";
const API_URL =
  "https://qnbvjqf5x0.execute-api.us-east-1.amazonaws.com";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      {
        title: "Upload a Lecture — AI Lecture Summarizer",
      },
      {
        name: "description",
        content:
          "Drag and drop your lecture recording, pick Arabic or English, and generate an AI summary in seconds.",
      },
      {
        property: "og:title",
        content: "Upload a Lecture — AI Lecture Summarizer",
      },
      {
        property: "og:description",
        content:
          "Drag and drop your lecture recording and generate an AI summary in seconds.",
      },
    ],
  }),

  component: UploadPage,
});

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadPage() {
  const navigate = useNavigate();

  const inputRef =
    useRef<HTMLInputElement>(null);

  const [dragging, setDragging] =
    useState(false);

  const [file, setFile] =
    useState<File | null>(null);

  const [progress, setProgress] =
    useState(0);

  const [language, setLanguage] =
    useState<"en" | "ar">("en");

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const selectFile = (f: File) => {
    setFile(f);
    setProgress(0);
    setError("");
  };

  const uploadFile = async () => {
    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setError("");
      setProgress(5);

      console.log(
        "Getting upload URL..."
      );

      // Original file information
      const extension =
        file.name.includes(".")
          ? file.name.substring(
              file.name.lastIndexOf(".")
            )
          : "";

      const baseName =
        file.name.includes(".")
          ? file.name.substring(
              0,
              file.name.lastIndexOf(".")
            )
          : file.name;

      // Create a UNIQUE lecture ID
      const lectureId =
        `${baseName}-${Date.now()}`;

      // Add selected language to S3 filename
      const fileNameWithLanguage =
        `${lectureId}__${language}${extension}`;

      console.log(
        "Lecture ID:",
        lectureId
      );

      console.log(
        "S3 file name:",
        fileNameWithLanguage
      );

      console.log(
        "Selected language:",
        language
      );

      // ------------------------------------------------
      // 1. Get Presigned URL
      // ------------------------------------------------
const session = await fetchAuthSession();

const idToken = session.tokens?.idToken?.toString();

if (!idToken) {
  throw new Error("You must be signed in to upload a lecture.");
}

const response = await fetch(
  `${API_URL}/generate-upload-url?fileName=${encodeURIComponent(
    fileNameWithLanguage
  )}`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  }
);

      if (!response.ok) {
        throw new Error(
          `Failed to get upload URL: ${response.status}`
        );
      }

      const data =
        await response.json();

      console.log(
        "API response:",
        data
      );

      const uploadUrl =
        data.uploadUrl;

      if (!uploadUrl) {
        throw new Error(
          "API did not return an uploadUrl."
        );
      }

      setProgress(15);

      // ------------------------------------------------
      // 2. Upload directly to S3
      // ------------------------------------------------

      console.log(
        "Uploading file to S3..."
      );

      const uploadResponse =
        await fetch(
          uploadUrl,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                file.type ||
                "application/octet-stream",
            },

            body: file,
          }
        );

      if (!uploadResponse.ok) {
        throw new Error(
          `S3 upload failed: ${uploadResponse.status}`
        );
      }

      setProgress(100);

      console.log(
        "File uploaded successfully to S3."
      );

      // ------------------------------------------------
      // 3. Save current lecture information
      // ------------------------------------------------

      sessionStorage.setItem(
        "lectureId",
        lectureId
      );

      sessionStorage.setItem(
        "lectureFileName",
        fileNameWithLanguage
      );

      sessionStorage.setItem(
        "lectureLanguage",
        language
      );

      console.log(
        "Saved lectureId:",
        lectureId
      );

      // ------------------------------------------------
      // 4. Go to Processing
      // ------------------------------------------------

      setTimeout(() => {
        navigate({
          to: "/processing",
        });
      }, 500);

    } catch (err) {
      console.error(
        "Upload error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while uploading the file."
      );

      setProgress(0);

    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">

      <PageHeader
        eyebrow="Step 1 of 3"
        title="Upload your lecture"
        description="Audio or video, up to 2 hours. We support MP3, MP4 and WAV files."
      />

      <div className="animate-fade-up mt-10 space-y-6">

        {/* Upload Area */}

        <div
          role="button"
          tabIndex={0}

          onClick={() =>
            !uploading &&
            inputRef.current?.click()
          }

          onKeyDown={(e) => {
            if (
              (e.key === "Enter" ||
                e.key === " ") &&
              !uploading
            ) {
              inputRef.current?.click();
            }
          }}

          onDragOver={(e) => {
            e.preventDefault();

            if (!uploading) {
              setDragging(true);
            }
          }}

          onDragLeave={() =>
            setDragging(false)
          }

          onDrop={(e) => {
            e.preventDefault();

            setDragging(false);

            if (uploading) {
              return;
            }

            const f =
              e.dataTransfer.files?.[0];

            if (f) {
              selectFile(f);
            }
          }}

          className={cn(
            "grid cursor-pointer place-items-center rounded-3xl border-2 border-dashed border-border bg-card/60 px-6 py-14 text-center transition-all duration-300 hover:border-primary hover:bg-accent/40",

            dragging &&
              "border-primary bg-accent/60 shadow-glow",

            uploading &&
              "pointer-events-none opacity-70"
          )}
        >

          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">

            <UploadCloud className="h-7 w-7" />

          </span>

          <p className="mt-5 text-lg font-bold">
            Drag & drop your file here
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            or{" "}
            <span className="font-semibold text-primary">
              browse
            </span>{" "}
            from your device
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="audio/*,video/*,.mp3,.mp4,.wav"
            className="hidden"

            onChange={(e) => {
              const f =
                e.target.files?.[0];

              if (f) {
                selectFile(f);
              }
            }}
          />

        </div>

        {/* Selected File */}

        {file && (
          <div className="surface-card animate-fade-up rounded-2xl p-5">

            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">

              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">

                <FileAudio className="h-5 w-5" />

              </span>

              <div className="min-w-0">

                <p className="truncate text-sm font-semibold">
                  {file.name}
                </p>

                <p className="text-xs text-muted-foreground">

                  {formatSize(file.size)}

                  {" · "}

                  {uploading
                    ? `Uploading ${progress}%`
                    : progress === 100
                    ? "Uploaded"
                    : "Ready"}

                </p>

              </div>

              <Button
                variant="ghost"
                size="icon"
                aria-label="Remove file"
                disabled={uploading}

                onClick={() => {
                  setFile(null);
                  setProgress(0);
                  setError("");
                }}
              >
                <X />
              </Button>

            </div>

            <Progress
              value={progress}
              className="mt-4 h-2"
            />

          </div>
        )}

        {/* Language */}

        <div className="surface-card rounded-2xl p-5">

          <div className="flex items-center gap-2">

            <Languages className="h-4 w-4 text-primary" />

            <h2 className="text-sm font-bold">
              Summary language
            </h2>

          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">

            {(
              [
                {
                  id: "en",
                  label: "English",
                  hint: "English summary",
                },
                {
                  id: "ar",
                  label: "العربية",
                  hint: "ملخص باللغة العربية",
                },
              ] as const
            ).map((opt) => (

              <button
                key={opt.id}
                type="button"
                disabled={uploading}

                onClick={() =>
                  setLanguage(opt.id)
                }

                className={cn(
                  "rounded-2xl border border-border bg-card px-4 py-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-primary",

                  language === opt.id &&
                    "border-primary bg-accent/60 shadow-glow"
                )}
              >

                <span className="block text-sm font-semibold">
                  {opt.label}
                </span>

                <span className="block text-xs text-muted-foreground">
                  {opt.hint}
                </span>

              </button>

            ))}

          </div>

        </div>

        {/* Error */}

        {error && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">

            <strong>
              Upload failed:
            </strong>{" "}

            {error}

          </div>
        )}

        {/* Generate */}

        <Button
          variant="hero"
          size="xl"
          className="w-full"

          disabled={
            !file ||
            uploading
          }

          onClick={uploadFile}
        >

          <Sparkles />

          {uploading
            ? `Uploading ${progress}%...`
            : "Generate Summary"}

        </Button>

      </div>
    </div>
  );
}