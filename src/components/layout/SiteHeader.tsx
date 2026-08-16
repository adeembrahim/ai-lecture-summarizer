import { Link, useNavigate } from "@tanstack/react-router";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";

import { signOut } from "aws-amplify/auth";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/upload", label: "Upload" },
  { to: "/results", label: "Results" },
  { to: "/history", label: "History" },
] as const;

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const navigate = useNavigate();

  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      await signOut();

      await navigate({
        to: "/login",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      setSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <span className="truncate text-base font-bold sm:text-lg">
            AI Lecture Summarizer
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{
                  className:
                    "bg-accent text-accent-foreground",
                }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {item.label}
              </Link>
            ))}

            <Button
              variant="ghost"
              onClick={handleSignOut}
              disabled={signingOut}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {signingOut ? "Signing out..." : "Sign out"}
            </Button>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
            className="rounded-xl"
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
          <Button
          variant="ghost"
        onClick={handleSignOut}
        disabled={signingOut}
         className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
         >
  {signingOut ? "Signing out..." : "Sign out"}
</Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle navigation"
            className="rounded-xl md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="animate-fade-up border-t border-border/60 px-4 py-2 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{
                className: "text-foreground",
              }}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent"
            >
              {item.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground hover:bg-accent disabled:opacity-50"
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </nav>
      )}
    </header>
  );
}