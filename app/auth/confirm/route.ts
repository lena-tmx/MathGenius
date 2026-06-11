import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function getSafeNextPath(value: string | null, origin: string): string {
  if (!value) {
    return "/dashboard";
  }

  if (value.includes("\\") || value.includes("%5c") || value.includes("%5C")) {
    return "/dashboard";
  }

  try {
    const resolvedUrl = new URL(value, origin);

    if (resolvedUrl.origin !== origin) {
      return "/dashboard";
    }

    return `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
  } catch {
    return "/dashboard";
  }
}

function getFailedConfirmRedirect(origin: string, nextPath: string): URL {
  const url = new URL("/login", origin);
  url.searchParams.set("confirm", "failed");
  url.searchParams.set("next", nextPath);
  return url;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = getSafeNextPath(
    requestUrl.searchParams.get("next"),
    requestUrl.origin,
  );
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!code || !supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(
      getFailedConfirmRedirect(requestUrl.origin, nextPath),
    );
  }

  let response = NextResponse.redirect(new URL(nextPath, requestUrl.origin));

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    response = NextResponse.redirect(
      getFailedConfirmRedirect(requestUrl.origin, nextPath),
    );
  }

  return response;
}
