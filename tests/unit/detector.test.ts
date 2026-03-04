import { describe, it, expect } from 'vitest'
import { getJapaneseRatio, isJapaneseText } from '@/lib/japanese/detector'

describe('getJapaneseRatio', () => {
  it('returns 1.0 for pure hiragana', () => {
    expect(getJapaneseRatio('こんにちは')).toBe(1.0)
  })

  it('returns 1.0 for pure katakana', () => {
    expect(getJapaneseRatio('カタカナ')).toBe(1.0)
  })

  it('returns 1.0 for kanji', () => {
    expect(getJapaneseRatio('日本語')).toBe(1.0)
  })

  it('returns ratio for mixed content', () => {
    // "Hello こんにちは" → 5 Japanese chars out of 10 non-space chars
    const ratio = getJapaneseRatio('Hello こんにちは')
    expect(ratio).toBeCloseTo(0.5, 1)
  })

  it('returns 0 for pure English', () => {
    expect(getJapaneseRatio('Hello World')).toBe(0)
  })

  it('returns 0 for empty string', () => {
    expect(getJapaneseRatio('')).toBe(0)
  })

  it('handles mixed hiragana/katakana/kanji', () => {
    const ratio = getJapaneseRatio('日本語のカタカナとひらがな')
    expect(ratio).toBe(1.0)
  })
})

describe('isJapaneseText', () => {
  it('returns true when Japanese ratio exceeds threshold', () => {
    expect(isJapaneseText('こんにちは世界')).toBe(true)
  })

  it('returns false for English text', () => {
    expect(isJapaneseText('Hello World')).toBe(false)
  })

  it('returns true for mixed content above threshold', () => {
    // Default threshold is 0.3
    expect(isJapaneseText('This is こんにちは世界 test')).toBe(true)
  })

  it('respects custom threshold', () => {
    expect(isJapaneseText('Hello こんにちは', 0.8)).toBe(false)
    expect(isJapaneseText('Hello こんにちは', 0.3)).toBe(true)
  })
})
