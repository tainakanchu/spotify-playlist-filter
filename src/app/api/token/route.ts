import { getToken } from "@/app/_lib/auth";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response(JSON.stringify({ error: "code is required" }), {
      status: 400,
    });
  }

  const token = await getToken(code);
  return new Response(JSON.stringify({ token }), { status: 200 });
}
