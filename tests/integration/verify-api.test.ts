import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/llm/factory', () => ({
  createLLMProvider: vi.fn(() => ({
    name: 'openai',
    verify: vi.fn().mockResolvedValue({
      isCorrect: true,
      score: 95,
      correctedTranslation: '안녕하세요',
      explanation: '정확한 번역입니다',
    }),
  })),
}))

import { POST } from '@/app/api/verify/route'

describe('POST /api/verify', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns verification result for valid request', async () => {
    const request = new NextRequest('http://localhost:3000/api/verify', {
      method: 'POST',
      body: JSON.stringify({
        japanese: 'こんにちは',
        userTranslation: '안녕하세요',
        apiKey: 'test-key',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.isCorrect).toBe(true)
    expect(data.score).toBe(95)
  })

  it('returns 400 for missing fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/verify', {
      method: 'POST',
      body: JSON.stringify({ japanese: 'こんにちは' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('returns 400 for missing apiKey', async () => {
    const request = new NextRequest('http://localhost:3000/api/verify', {
      method: 'POST',
      body: JSON.stringify({
        japanese: 'こんにちは',
        userTranslation: '안녕하세요',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toContain('API Key')
  })
})
