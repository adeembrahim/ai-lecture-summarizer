import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import { useState } from "react";

import { Amplify } from "aws-amplify";
import {
  signUp,
  confirmSignUp,
} from "aws-amplify/auth";

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

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [code, setCode] = useState("");
  const [showVerification, setShowVerification] =
    useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });

      console.log("Sign up result:", result);

      if (
        result.nextStep.signUpStep ===
        "CONFIRM_SIGN_UP"
      ) {
        setShowVerification(true);

        setMessage(
          "A verification code has been sent to your email."
        );
      } else {
        await navigate({
          to: "/login",
        });
      }
    } catch (err) {
      console.error("Sign up error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      console.log(
        "Confirmation result:",
        result
      );

      if (result.isSignUpComplete) {
        setMessage(
          "Account created successfully! Redirecting to sign in..."
        );

        setTimeout(() => {
          navigate({
            to: "/login",
          });
        }, 1500);
      }
    } catch (err) {
      console.error(
        "Verification error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Invalid verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  if (showVerification) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
        <PageHeader
          eyebrow="Almost there"
          title="Verify your email"
          description="Enter the verification code sent to your email address."
        />

        <form
          onSubmit={handleVerification}
          className="surface-card mt-8 space-y-5 rounded-3xl p-6 sm:p-8"
        >
          <div>
            <label
              htmlFor="code"
              className="text-sm font-semibold"
            >
              Verification code
            </label>

            <input
              id="code"
              type="text"
              value={code}
              onChange={(event) =>
                setCode(event.target.value)
              }
              required
              maxLength={6}
              autoComplete="one-time-code"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-lg tracking-widest outline-none focus:border-primary"
              placeholder="123456"
            />
          </div>

          {message && (
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
              {message}
            </div>
          )}

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
              ? "Verifying..."
              : "Verify email"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <PageHeader
        eyebrow="Get started"
        title="Create account"
        description="Create an account to save and access your lectures."
      />

      <form
        onSubmit={handleSignup}
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
            autoComplete="new-password"
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            placeholder="Create a password"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="text-sm font-semibold"
          >
            Confirm password
          </label>

          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
            }
            required
            autoComplete="new-password"
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            placeholder="Repeat your password"
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
            ? "Creating account..."
            : "Create account"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}