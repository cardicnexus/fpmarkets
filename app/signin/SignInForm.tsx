"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type FormMessage = {
  type: "error" | "info";
  content: string;
};

export default function SignInForm() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<FormMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Verify auth-helpers client available
    (async () => {
      try {
        await supabase.auth.getUser();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Authentication configuration is incomplete.";
        setInitializationError(message);
        setFormMessage({ type: "error", content: message });
      }
    })();
  }, [supabase]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      const fallbackMessage = initializationError ?? "Authentication is currently unavailable. Please try again later.";
      setFormMessage({ type: "error", content: fallbackMessage });
      return;
    }
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    if (!email || !password) {
      setFormMessage({ type: "error", content: "Provide both an email address and password." });
      return;
    }

    setIsSubmitting(true);
    setFormMessage(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setFormMessage({ type: "error", content: error.message });
      setIsSubmitting(false);
      return;
    }

    // After sign in, ensure session is available then navigate
    try {
      const { data } = await supabase.auth.getUser();
      if ((data as any)?.user) {
        router.push("/mine");
      } else {
        // small delay then navigate
        setTimeout(() => router.push("/mine"), 300);
      }
    } catch (err) {
      setTimeout(() => router.push("/mine"), 300);
    }
  };

  const handleGoogle = async () => {
    if (!supabase) {
      const fallbackMessage = initializationError ?? "Authentication is currently unavailable. Please try again later.";
      setFormMessage({ type: "error", content: fallbackMessage });
      return;
    }

    setIsSubmitting(true);
    setFormMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/mine` : "/mine",
        queryParams: {
          prompt: "consent",
        },
      },
    });

    if (error) {
      setFormMessage({ type: "error", content: error.message });
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        <label className="auth__field" htmlFor="signin-email">
          <span>Email</span>
          <input
            id="signin-email"
            type="email"
            name="email"
            placeholder="demo@fpmarkets.app"
            autoComplete="email"
            required
            disabled={isSubmitting}
          />
        </label>

        <label className="auth__field" htmlFor="signin-password">
          <span>Password</span>
          <input
            id="signin-password"
            type="password"
            name="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            disabled={isSubmitting}
          />
        </label>

        <button type="submit" className="auth__submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <button type="button" className="auth__google" onClick={handleGoogle} disabled={isSubmitting}>
        <span className="auth__google-icon" aria-hidden>
          G
        </span>
        Continue with Google
      </button>

      {formMessage ? (
        <p
          className={formMessage.type === "error" ? "auth__message auth__message--error" : "auth__message"}
          role="status"
        >
          {formMessage.content}
        </p>
      ) : null}
    </>
  );
}
