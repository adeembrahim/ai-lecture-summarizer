import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, className }: PageHeaderProps) {
  return (
    <div className={cn("animate-fade-up text-center", className)}>
      {eyebrow && (
        <span className="inline-flex items-center rounded-full border border-border bg-accent/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
          {eyebrow}
        </span>
      )}
      <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{title}</h1>
      {description && (
        <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
