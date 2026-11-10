import { NextResponse } from "next/server";

// export const runtime = "nodejs";

export async function POST(request: Request) {
  let message: unknown;
  try {
    const body = await request.json();
    message = body?.message;
  } catch {
    return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 });
  }
  if (typeof message !== "string" || !message.trim() || message.length > 2000) {
    return NextResponse.json({ error: "Message must be between 1 and 2000 characters." }, { status: 400 });
  }

  // Server-side only. Never expose internal backend URLs in NEXT_PUBLIC_* variables.
  const backend = process.env.FASTAPI_URL || "http://127.0.0.1:8000";
  try {
    const response = await fetch(`${backend}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message.trim() }),
      cache: "no-store",
      signal: AbortSignal.timeout(120_000),
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: response.status === 422 ? "Your message was rejected by the AI backend." : "The AI backend could not complete this request." },
        { status: response.status === 422 ? 422 : 502 }
      );
    }
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || !("reply" in data) || typeof data.reply !== "string") {
      return NextResponse.json({ error: "Unexpected response from the AI backend." }, { status: 502 });
    }
    return NextResponse.json({ reply: data.reply }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(
      { error: "Could not connect to the AI backend. Check that FastAPI is running." },
      { status: 502 }
    );
  }
}
