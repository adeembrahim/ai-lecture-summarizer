import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import { useState } from "react";

import "@/lib/amplify";

import {
  signIn,
  resetPassword,
  confirmResetPassword,
} from "aws-amplify/auth";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [confirmNewPassword, setConfirmNewPassword] =
    useState("");

  const [resetStep, setResetStep] =
    useState<"email" | "code">("email");

  // ----------------------------------------
  // Normal login
  // ----------------------------------------

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");
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

  // ----------------------------------------
  // Send reset code
  // ----------------------------------------

  const handleSendResetCode = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await resetPassword({
        username: email,
      });

      console.log(
        "Reset password result:",
        result
      );

      setResetStep("code");

      setMessage(
        "A password reset code has been sent to your email."
      );
    } catch (err) {
      console.error(
        "Reset password error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to send reset code."
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // Confirm new password
  // ----------------------------------------

  const handleConfirmReset = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (newPassword !== confirmNewPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: resetCode,
        newPassword,
      });

      setMessage(
        "Password reset successfully! You can now sign in."
      );

      setTimeout(() => {
        setShowForgotPassword(false);
        setResetStep("email");
        setResetCode("");
        setNewPassword("");
        setConfirmNewPassword("");
        setMessage("");
      }, 1500);
    } catch (err) {
      console.error(
        "Confirm reset error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // Forgot password screen
  // ----------------------------------------

  if (showForgotPassword) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
        <PageHeader
          eyebrow="Account recovery"
          title="Forgot password?"
          description={
            resetStep === "email"
              ? "Enter your email address and we'll send you a verification code."
              : "Enter the verification code and choose a new password."
          }
        />

        {resetStep === "email" ? (
          <form
            onSubmit={handleSendResetCode}
            className="surface-card mt-8 space-y-5 rounded-3xl p-6 sm:p-8"
          >
            <div>
              <label
                htmlFor="reset-email"
                className="text-sm font-semibold"
              >
                Email
              </label>

              <input
                id="reset-email"
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
                ? "Sending..."
                : "Send verification code"}
            </Button>

            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setError("");
                setMessage("");
              }}
              className="w-full text-center text-sm font-semibold text-primary hover:underline"
            >
              Back to sign in
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleConfirmReset}
            className="surface-card mt-8 space-y-5 rounded-3xl p-6 sm:p-8"
          >
            <div>
              <label
                htmlFor="reset-code"
                className="text-sm font-semibold"
              >
                Verification code
              </label>

              <input
                id="reset-code"
                type="text"
                value={resetCode}
                onChange={(event) =>
                  setResetCode(
                    event.target.value
                  )
                }
                required
                maxLength={6}
                autoComplete="one-time-code"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-lg tracking-widest outline-none focus:border-primary"
                placeholder="123456"
              />
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="text-sm font-semibold"
              >
                New password
              </label>

              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(
                    event.target.value
                  )
                }
                required
                autoComplete="new-password"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-new-password"
                className="text-sm font-semibold"
              >
                Confirm new password
              </label>

              <input
                id="confirm-new-password"
                type="password"
                value={confirmNewPassword}
                onChange={(event) =>
                  setConfirmNewPassword(
                    event.target.value
                  )
                }
                required
                autoComplete="new-password"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                placeholder="Repeat new password"
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
                ? "Resetting..."
                : "Reset password"}
            </Button>

            <button
              type="button"
              onClick={() => {
                setResetStep("email");
                setResetCode("");
                setNewPassword("");
                setConfirmNewPassword("");
                setError("");
                setMessage("");
              }}
              className="w-full text-center text-sm font-semibold text-primary hover:underline"
            >
              Use a different email
            </button>
          </form>
        )}
      </div>
    );
  }

  // ----------------------------------------
  // Normal login screen
  // ----------------------------------------

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
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-semibold"
            >
              Password
            </label>

            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(true);
                setError("");
                setMessage("");
              }}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>

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