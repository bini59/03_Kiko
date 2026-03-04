import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTranscriptSync } from '@/hooks/useTranscriptSync'
import { TranscriptEntry } from '@/lib/youtube/types'

const transcript: TranscriptEntry[] = [
  { text: 'Line 1', start: 0, duration: 2 },
  { text: 'Line 2', start: 2, duration: 3 },
  { text: 'Line 3', start: 5, duration: 2 },
  { text: 'Line 4', start: 7, duration: 3 },
]

describe('useTranscriptSync', () => {
  it('returns -1 when currentTime is before first entry', () => {
    const { result } = renderHook(() => useTranscriptSync(transcript, -1))
    expect(result.current).toBe(-1)
  })

  it('returns index 0 for time within first entry', () => {
    const { result } = renderHook(() => useTranscriptSync(transcript, 1))
    expect(result.current).toBe(0)
  })

  it('returns index 1 for time within second entry', () => {
    const { result } = renderHook(() => useTranscriptSync(transcript, 3))
    expect(result.current).toBe(1)
  })

  it('returns last index for time at last entry', () => {
    const { result } = renderHook(() => useTranscriptSync(transcript, 8))
    expect(result.current).toBe(3)
  })

  it('returns -1 for empty transcript', () => {
    const { result } = renderHook(() => useTranscriptSync([], 5))
    expect(result.current).toBe(-1)
  })

  it('updates when currentTime changes', () => {
    const { result, rerender } = renderHook(
      ({ time }) => useTranscriptSync(transcript, time),
      { initialProps: { time: 1 } }
    )
    expect(result.current).toBe(0)

    rerender({ time: 6 })
    expect(result.current).toBe(2)
  })
})
