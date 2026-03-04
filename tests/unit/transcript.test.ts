import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockExecFile } = vi.hoisted(() => ({
  mockExecFile: vi.fn(),
}))

vi.mock('child_process', () => ({
  execFile: mockExecFile,
}))

import { fetchTranscript } from '@/lib/youtube/transcript'

describe('fetchTranscript', () => {
  beforeEach(() => {
    mockExecFile.mockReset()
  })

  it('parses transcript entries from python output', async () => {
    const mockEntries = [
      { text: 'こんにちは', start: 0.0, duration: 2.5 },
      { text: '世界', start: 2.5, duration: 3.0 },
    ]

    mockExecFile.mockImplementation(
      (_cmd: string, _args: string[], _opts: object, callback: Function) => {
        callback(null, JSON.stringify(mockEntries), '')
      },
    )

    const result = await fetchTranscript('testVideoId', 'ja')

    expect(result).toEqual(mockEntries)
    expect(mockExecFile).toHaveBeenCalledWith(
      'python3',
      expect.arrayContaining(['testVideoId', 'ja']),
      expect.any(Object),
      expect.any(Function),
    )
  })

  it('throws error when python script fails', async () => {
    mockExecFile.mockImplementation(
      (_cmd: string, _args: string[], _opts: object, callback: Function) => {
        callback(new Error('Process failed'), '', '자막 추출 실패')
      },
    )

    await expect(fetchTranscript('testVideoId', 'ja')).rejects.toThrow(
      '자막 추출 실패',
    )
  })

  it('throws error when python returns error json', async () => {
    mockExecFile.mockImplementation(
      (_cmd: string, _args: string[], _opts: object, callback: Function) => {
        callback(
          { code: 1 },
          JSON.stringify({ error: 'No transcript found' }),
          '',
        )
      },
    )

    await expect(fetchTranscript('testVideoId', 'ja')).rejects.toThrow()
  })
})
