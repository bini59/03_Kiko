const YOUTUBE_REGEX = /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/

export function extractVideoId(url: string): string | null {
  if (!url) return null

  const match = url.match(YOUTUBE_REGEX)
  return match ? match[1] : null
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null
}
