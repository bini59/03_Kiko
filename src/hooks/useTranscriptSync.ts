import { useMemo } from "react";
import { TranscriptEntry } from "@/lib/youtube/types";

export function useTranscriptSync(
  transcript: TranscriptEntry[],
  currentTime: number
): number {
  return useMemo(() => {
    if (transcript.length === 0 || currentTime < 0) return -1;

    for (let i = transcript.length - 1; i >= 0; i--) {
      if (currentTime >= transcript[i].start) {
        return i;
      }
    }

    return -1;
  }, [transcript, currentTime]);
}
