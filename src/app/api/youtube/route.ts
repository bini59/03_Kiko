import { NextRequest, NextResponse } from "next/server";
import { fetchVideoInfo } from "@/lib/youtube/client";
import { fetchTranscript } from "@/lib/youtube/transcript";

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json(
      { error: "videoId 파라미터가 필요합니다" },
      { status: 400 }
    );
  }

  try {
    const [info, transcript] = await Promise.all([
      fetchVideoInfo(videoId),
      fetchTranscript(videoId),
    ]);

    return NextResponse.json({ info, transcript });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
