import { test, expect } from '@playwright/test'

const mockYoutubeResponse = {
  info: {
    id: 'dQw4w9WgXcQ',
    title: 'テスト動画',
    channelTitle: 'Test Channel',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    duration: 'PT5M',
  },
  transcript: [
    { text: 'こんにちは', start: 0, duration: 2 },
    { text: '世界', start: 2, duration: 3 },
    { text: 'テスト', start: 5, duration: 2 },
  ],
}

test.describe('Main Flow', () => {
  test('shows landing page with title and input', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('h1')).toContainText('Kiko')
    await expect(page.getByPlaceholder(/YouTube URL/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /학습 시작/i })).toBeVisible()
    await expect(page.getByText('OpenAI API Key')).toBeVisible()
  })

  test('shows error for invalid URL submission', async ({ page }) => {
    await page.goto('/')

    await page.getByPlaceholder(/YouTube URL/i).fill('https://google.com')
    await page.getByRole('button', { name: /학습 시작/i }).click()

    await expect(page.getByText(/유효한 YouTube URL/i)).toBeVisible()
  })

  test('accepts valid YouTube URL and shows loading state',
      async ({ page }) => {
    await page.goto('/')

    await page.route('/api/youtube*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockYoutubeResponse),
      })
    })

    await page.getByPlaceholder(/YouTube URL/i).fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    await page.getByRole('button', { name: /학습 시작/i }).click()

    await expect(page.getByRole('heading', { name: '스크립트' })).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: /こんにちは/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /世界/ })).toBeVisible()
  })

  test('clicking transcript entry shows verify panel', async ({ page }) => {
    await page.goto('/')

    await page.route('/api/youtube*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...mockYoutubeResponse,
          transcript: [{ text: 'こんにちは', start: 0, duration: 2 }],
        }),
      })
    })

    await page.getByPlaceholder(/YouTube URL/i).fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    await page.getByRole('button', { name: /학습 시작/i }).click()

    await page.getByText('こんにちは').click()

    await expect(page.getByText('선택된 문장')).toBeVisible()
    await expect(page.getByPlaceholder(/한국어 번역/i)).toBeVisible()
  })

  test('shows video player and transcript error when transcript fails', async ({ page }) => {
    await page.goto('/')

    await page.route('/api/youtube*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          info: mockYoutubeResponse.info,
          transcript: [],
          transcriptError: '자막 추출 실패: YouTube IP blocked',
        }),
      })
    })

    await page.getByPlaceholder(/YouTube URL/i).fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    await page.getByRole('button', { name: /학습 시작/i }).click()

    // Video player section should still appear
    await expect(page.getByRole('heading', { name: '스크립트' })).toBeVisible({ timeout: 10000 })
    // Transcript error notice should be shown
    await expect(page.getByText('자막을 불러올 수 없습니다')).toBeVisible()
  })

  test('shows error when verifying without API key', async ({ page }) => {
    await page.goto('/')

    await page.route('/api/youtube*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...mockYoutubeResponse,
          transcript: [{ text: 'こんにちは', start: 0, duration: 2 }],
        }),
      })
    })

    await page.getByPlaceholder(/YouTube URL/i).fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    await page.getByRole('button', { name: /학습 시작/i }).click()

    await page.getByText('こんにちは').click()
    await expect(page.getByText('선택된 문장')).toBeVisible()

    await page.getByPlaceholder(/한국어 번역/i).fill('안녕하세요')
    await page.getByRole('button', { name: /번역 검증/i }).click()

    await expect(page.getByText(/API Key를 먼저 입력/)).toBeVisible()
  })
})
