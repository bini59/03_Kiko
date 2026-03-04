export interface VideoInfo {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration: string;
}

export interface TranscriptEntry {
  text: string;
  start: number;
  duration: number;
}

export interface VideoData {
  info: VideoInfo;
  transcript: TranscriptEntry[];
}
