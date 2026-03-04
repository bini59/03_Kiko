"use client";

import { useState, FormEvent } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { extractVideoId } from "@/lib/utils/url";

interface YouTubeInputProps {
  onSubmit: (videoId: string) => void;
  loading?: boolean;
}

export function YouTubeInput({ onSubmit, loading = false }: YouTubeInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const videoId = extractVideoId(url);
    if (!videoId) {
      setError("유효한 YouTube URL을 입력해주세요");
      return;
    }

    onSubmit(videoId);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-start w-full">
      <div className="flex-1">
        <Input
          placeholder="YouTube URL을 입력하세요"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          error={error}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "로딩중..." : "학습 시작"}
      </Button>
    </form>
  );
}
