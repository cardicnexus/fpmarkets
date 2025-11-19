import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies });

    // Try to fetch with a simple count
    const { count, error: countError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // Try to fetch one profile
    const { data: sampleData, error: sampleError } = await supabase
      .from("profiles")
      .select("*")
      .limit(1);

    // Get all profiles
    const { data: allProfiles, error: allError } = await supabase
      .from("profiles")
      .select("*");

    return NextResponse.json({
      status: "ok",
      diagnostics: {
        count: {
          count,
          error: countError?.message || null,
        },
        sample: {
          data: sampleData,
          error: sampleError?.message || null,
        },
        all: {
          count: allProfiles?.length || 0,
          data: allProfiles,
          error: allError?.message || null,
        },
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: "error",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
