// apps/web/app/api/auth/callback/route.ts
// OAuth callback handler — Supabase redirects here after GitHub login
// Exchanges the auth code for a session, then syncs user to Prisma DB

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@yard/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const user = data.user;
      const githubMeta = user.user_metadata;

      // Sync user to Prisma DB on every login
      // Upsert: create if new, update avatar/email if changed
      await prisma.user.upsert({
        where: { githubId: String(githubMeta.provider_id) },
        update: {
          username: githubMeta.user_name || githubMeta.preferred_username,
          avatarUrl: githubMeta.avatar_url,
          email: user.email,
        },
        create: {
          githubId: String(githubMeta.provider_id),
          username: githubMeta.user_name || githubMeta.preferred_username,
          email: user.email,
          avatarUrl: githubMeta.avatar_url,
        },
      });

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth failed — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
