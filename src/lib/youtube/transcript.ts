import { TranscriptEntry } from "./types";
import * as childProcess from "child_process";

export async function fetchTranscript(
  videoId: string,
  lang: string = "ja"
): Promise<TranscriptEntry[]> {
  const pythonScript = `
import json, sys
from youtube_transcript_api import YouTubeTranscriptApi

try:
    ytt = YouTubeTranscriptApi()
    result = ytt.fetch(sys.argv[1], languages=[sys.argv[2]])
    entries = [{"text": s.text, "start": s.start, "duration": s.duration} for s in result.snippets]
    print(json.dumps(entries))
except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
`;

  return new Promise((resolve, reject) => {
    childProcess.execFile(
      "python3",
      ["-c", pythonScript, videoId, lang],
      { timeout: 15000 },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`자막 추출 실패: ${stderr || error.message}`));
          return;
        }

        try {
          const parsed = JSON.parse(stdout.trim());
          if (parsed.error) {
            reject(new Error(parsed.error));
            return;
          }
          resolve(parsed as TranscriptEntry[]);
        } catch {
          reject(new Error("자막 데이터 파싱 실패"));
        }
      }
    );
  });
}
