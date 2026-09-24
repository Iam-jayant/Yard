// apps/web/app/(auth)/login/page.tsx
// Login page — "Sign in with GitHub" via Supabase OAuth
// No form, no inputs. One button. Supabase handles the rest.

"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signInWithGitHub() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        scopes: "repo read:user user:email",
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // If no error, the browser redirects to GitHub — no need to setLoading(false)
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0d0d0d",
        color: "#e2e2e2",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          marginBottom: "0.5rem",
        }}
      >
        Yard
      </h1>
      <p
        style={{
          color: "#666",
          marginBottom: "2rem",
          fontSize: "0.9rem",
        }}
      >
        Sign in to claim plots and start building.
      </p>

      <button
        onClick={signInWithGitHub}
        disabled={loading}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: loading ? "#333" : "#e2e2e2",
          color: "#0d0d0d",
          border: "none",
          borderRadius: "6px",
          fontSize: "1rem",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "'JetBrains Mono', monospace",
          transition: "all 0.15s ease",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        {loading ? "Redirecting..." : "Sign in with GitHub"}
      </button>

      {error && (
        <p style={{ color: "#ff4444", marginTop: "1rem", fontSize: "0.85rem" }}>
          {error}
        </p>
      )}

      <p
        style={{
          marginTop: "3rem",
          color: "#444",
          fontSize: "0.75rem",
        }}
      >
        No sign-up needed. GitHub is your identity.
      </p>
    </main>
  );
}
