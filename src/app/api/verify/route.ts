import { NextRequest, NextResponse } from "next/server";
import { createLLMProvider } from "@/lib/llm/factory";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { japanese, userTranslation, apiKey } = body;

    if (!japanese || !userTranslation) {
      return NextResponse.json(
        { error: "japanese와 userTranslation 필드가 필요합니다" },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API Key가 필요합니다" },
        { status: 400 }
      );
    }

    const provider = createLLMProvider("openai", { apiKey });
    const result = await provider.verify({ japanese, userTranslation });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
