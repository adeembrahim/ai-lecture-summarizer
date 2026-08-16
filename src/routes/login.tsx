import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import { useState } from "react";

import { Amplify } from "aws-amplify";
import { signIn } from "aws-amplify/auth";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_ZZajqMPM0",
      userPoolClientId: "28megnb3bo2ud0dcdoj95u50rf",
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code" as const,
    },
  },
};

Amplify.configure(amplifyConfig, {
  ssr: true,
});

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signIn({
        username: email,
        password,
      });

      console.log("Sign in result:", result);

      if (result.isSignedIn) {
        await navigate({
          to: "/",
        });
      } else {
        setError(
          "Additional account verification is required."
        );
      }
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <PageHeader
        eyebrow="Welcome back"
        title="Sign in"
        description="Sign in to access your lectures and saved results."
      />

      <form
        onSubmit={handleLogin}
        className="surface-card mt-8 space-y-5 rounded-3xl p-6 sm:p-8"
      >
        <div>
          <label
            htmlFor="email"
            className="text-sm font-semibold"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
            autoComplete="email"
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-sm font-semibold"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
            autoComplete="current-password"
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            placeholder="Your password"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="hero"
          className="w-full"
          disabled={loading}
        >
          {loading
            ? "Signing in..."
            : "Sign in"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-primary hover:underline"
          >
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}