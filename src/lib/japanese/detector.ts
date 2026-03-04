// Unicode ranges for Japanese characters
const HIRAGANA = /[\u3040-\u309F]/
const KATAKANA = /[\u30A0-\u30FF]/
const KANJI = /[\u4E00-\u9FFF]/
const JAPANESE_CHAR = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/

export function getJapaneseRatio(text: string): number {
  if (!text) return 0

  const chars = text.replace(/\s/g, "")
  if (chars.length === 0) return 0

  const japaneseCount = Array.from(chars).filter((ch) => JAPANESE_CHAR.test(ch)).length
  return japaneseCount / chars.length
}

export function isJapaneseText(text: string, threshold: number = 0.3): boolean {
  return getJapaneseRatio(text) >= threshold
}

export { HIRAGANA, KATAKANA, KANJI }
