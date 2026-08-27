import { createServerClient } from "@supabase/ssr";
import { type JwtPayload } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { getServerEnvironment } from "@/lib/env/server";

export async function refreshSession(request: NextRequest): Promise<{
  claims: JwtPayload | null;
  response: NextResponse;
}> {
  let response = NextResponse.next({ request });
  const environment = getServerEnvironment();

  const supabase = createServerClient(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data, error } = await supabase.auth.getClaims();

  return {
    claims: error ? null : (data?.claims ?? null),
    response,
  };
}
