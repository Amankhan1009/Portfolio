import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/chatbot/knowledge";
import { checkRateLimit } from "@/lib/chatbot/rateLimiter";

export const runtime = "nodejs";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-120b";
const MAX_USER_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_TURNS = 8; // Retain last 8 turns (4 user + 4 assistant) to optimize token efficiency

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting by IP
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous-client";

    const rateLimit = checkRateLimit(ip, 15, 60 * 1000); // 15 requests per minute
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error:
            "Rate limit exceeded. Please wait a moment before sending another message.",
          retryAfter: rateLimit.resetSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.resetSeconds.toString(),
          },
        },
      );
    }

    // 2. Environment check
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "GROQ_API_KEY is not configured on the server. Please add your key to .env.local.",
        },
        { status: 503 },
      );
    }

    // 3. Parse and validate body
    const body = await req.json().catch(() => null);
    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        {
          error:
            "Invalid request payload. Expected { messages: ChatMessage[] }.",
        },
        { status: 400 },
      );
    }

    // Sanitize conversation history
    const rawMessages: unknown[] = body.messages;
    const sanitizedMessages: ChatMessage[] = [];

    for (const msg of rawMessages) {
      if (
        typeof msg === "object" &&
        msg !== null &&
        "role" in msg &&
        "content" in msg &&
        typeof (msg as { content: unknown }).content === "string"
      ) {
        const role = (msg as { role: unknown }).role;
        if (role === "user" || role === "assistant") {
          const content = (msg as { content: string }).content.trim();
          if (content.length > 0) {
            sanitizedMessages.push({
              role,
              content: content.slice(0, MAX_USER_MESSAGE_LENGTH),
            });
          }
        }
      }
    }

    if (sanitizedMessages.length === 0) {
      return NextResponse.json(
        { error: "No valid user messages found in request." },
        { status: 400 },
      );
    }

    // Keep only the most recent conversation context to avoid unnecessary token consumption
    const contextHistory = sanitizedMessages.slice(-MAX_HISTORY_TURNS);

    // 4. Prepend verified portfolio knowledge base system prompt
    const systemPrompt = buildSystemPrompt();
    const payloadMessages = [
      { role: "system", content: systemPrompt },
      ...contextHistory,
    ];

    // 5. Call Groq Cloud API with exact specified model
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

    const groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: payloadMessages,
        temperature: 0.3,
        max_tokens: 1024,
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!groqRes.ok) {
      const errText = await groqRes.text().catch(() => "");
      console.error(`Groq API Error (${groqRes.status}):`, errText);

      if (groqRes.status === 429) {
        return NextResponse.json(
          {
            error:
              "The AI service is experiencing high demand. Please try again shortly.",
          },
          { status: 429 },
        );
      }

      if (groqRes.status === 401) {
        return NextResponse.json(
          {
            error:
              "Authentication with Groq API failed. Please check the server GROQ_API_KEY.",
          },
          { status: 500 },
        );
      }

      return NextResponse.json(
        {
          error:
            "Failed to communicate with AI service. Please try again later.",
        },
        { status: 502 },
      );
    }

    const groqData = await groqRes.json();
    const replyContent =
      groqData?.choices?.[0]?.message?.content ||
      "I apologize, but I couldn't generate a response at this time.";

    return NextResponse.json({
      role: "assistant",
      content: replyContent,
      model: GROQ_MODEL,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        { error: "AI request timed out. Please try again." },
        { status: 504 },
      );
    }

    console.error("Chat route handler error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request." },
      { status: 500 },
    );
  }
}
