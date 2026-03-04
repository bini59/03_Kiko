import { describe, it, expect, vi, beforeEach } from 'vitest'
import { OpenAIProvider } from '@/lib/llm/openai'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('OpenAIProvider', () => {
  const provider = new OpenAIProvider({ apiKey: 'test-api-key' })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('has name "openai"', () => {
    expect(provider.name).toBe('openai')
  })

  it('sends correct request and parses response', async () => {
    const mockResponse = {
      isCorrect: false,
      score: 70,
      correctedTranslation: '안녕하세요',
      explanation: '번역이 대체로 맞지만 뉘앙스가 다릅니다',
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            content: JSON.stringify(mockResponse),
          },
        }],
      }),
    })

    const result = await provider.verify({
      japanese: 'こんにちは',
      userTranslation: '안녕',
    })

    expect(result).toEqual(mockResponse)
    expect(mockFetch).toHaveBeenCalledOnce()

    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toBe('https://api.openai.com/v1/chat/completions')
    expect(options.method).toBe('POST')
    expect(options.headers.Authorization).toBe('Bearer test-api-key')

    const body = JSON.parse(options.body)
    expect(body.model).toBe('gpt-4o-mini')
  })

  it('throws on API error with message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({
        error: { message: 'Rate limit exceeded' },
      }),
    })

    await expect(
      provider.verify({ japanese: 'テスト', userTranslation: '테스트' })
    ).rejects.toThrow('OpenAI API 오류: Rate limit exceeded')
  })
})
