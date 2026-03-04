import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchVideoInfo } from '@/lib/youtube/client'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('fetchVideoInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns video info for valid video ID', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [{
          id: 'dQw4w9WgXcQ',
          snippet: {
            title: 'Test Video',
            channelTitle: 'Test Channel',
            thumbnails: { medium: { url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg' } },
          },
          contentDetails: { duration: 'PT3M32S' },
        }],
      }),
    })

    const result = await fetchVideoInfo('dQw4w9WgXcQ')

    expect(result).toEqual({
      id: 'dQw4w9WgXcQ',
      title: 'Test Video',
      channelTitle: 'Test Channel',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
      duration: 'PT3M32S',
    })
  })

  it('throws error when video not found', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [] }),
    })

    await expect(fetchVideoInfo('invalid')).rejects.toThrow('영상을 찾을 수 없습니다')
  })

  it('throws error on API failure', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 403 })

    await expect(fetchVideoInfo('dQw4w9WgXcQ')).rejects.toThrow('YouTube API 요청 실패')
  })
})
