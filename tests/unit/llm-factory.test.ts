import { describe, it, expect } from 'vitest'
import { createLLMProvider } from '@/lib/llm/factory'

describe('createLLMProvider', () => {
  it('creates OpenAI provider by default', () => {
    const provider = createLLMProvider()
    expect(provider.name).toBe('openai')
  })

  it('creates OpenAI provider when specified', () => {
    const provider = createLLMProvider('openai', { apiKey: 'test-key' })
    expect(provider.name).toBe('openai')
  })

  it('throws for unknown provider', () => {
    expect(() => createLLMProvider('unknown')).toThrow('지원하지 않는 LLM 프로바이더')
  })
})
