"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type FormMessage = {
  type: "error" | "info";
  content: string;
};

export default function SignupForm() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<FormMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        await supabase.auth.getUser();
      } catch (error) {
        if (!isMounted) return;
        const message =
          error instanceof Error ? error.message : "Authentication configuration is incomplete.";
        setInitializationError(message);
        setFormMessage({ type: "error", content: message });
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      const fallbackMessage =
        initializationError ?? "Authentication is currently unavailable. Please try again later.";
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

    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/signup/profile` : "/signup/profile";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setFormMessage({ type: "error", content: error.message });
      setIsSubmitting(false);
      return;
    }

    // Create profile record in Supabase
    if (data?.user?.id) {
      try {
        await supabase.from("profiles").insert([{
          user_id: data.user.id,
          email: email,
          balance: "0",
          is_approved: false,
          created_at: new Date().toISOString(),
        }]);
      } catch (err) {
        console.warn("Failed to create profile record:", err);
        // Continue anyway, user can complete profile later
      }
    }

    if (data?.session) {
      router.push("/signup/profile");
      return;
    }

    setFormMessage({
      type: "info",
      content: "Check your email to verify the account, then continue your profile setup.",
    });
    setIsSubmitting(false);
  };

  const handleGoogle = async () => {
    if (!supabase) {
      const fallbackMessage =
        initializationError ?? "Authentication is currently unavailable. Please try again later.";
      setFormMessage({ type: "error", content: fallbackMessage });
      return;
    }

    setIsSubmitting(true);
    setFormMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined" ? `${window.location.origin}/signup/profile` : "/signup/profile",
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
        <label className="auth__field" htmlFor="auth-email">
          <span>Email</span>
          <input
            id="auth-email"
            type="email"
            name="email"
            placeholder="demo@fpmarkets.app"
            autoComplete="email"
            required
            disabled={isSubmitting}
          />
        </label>

        <label className="auth__field" htmlFor="auth-password">
          <span>Password</span>
          <input
            id="auth-password"
            type="password"
            name="password"
            placeholder="••••••••"
            autoComplete="new-password"
            minLength={8}
            required
            disabled={isSubmitting}
          />
        </label>

        <button type="submit" className="auth__submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Sign up"}
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
