import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { YouTubeInput } from '@/components/YouTubeInput'

describe('YouTubeInput', () => {
  it('renders input and button', () => {
    render(<YouTubeInput onSubmit={vi.fn()} />)
    expect(screen.getByPlaceholderText(/YouTube URL/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /학습 시작/i })).toBeInTheDocument()
  })

  it('calls onSubmit with videoId for valid URL', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<YouTubeInput onSubmit={onSubmit} />)

    const input = screen.getByPlaceholderText(/YouTube URL/i)
    await user.type(input, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    await user.click(screen.getByRole('button', { name: /학습 시작/i }))

    expect(onSubmit).toHaveBeenCalledWith('dQw4w9WgXcQ')
  })

  it('shows error for invalid URL', async () => {
    const user = userEvent.setup()
    render(<YouTubeInput onSubmit={vi.fn()} />)

    const input = screen.getByPlaceholderText(/YouTube URL/i)
    await user.type(input, 'https://google.com')
    await user.click(screen.getByRole('button', { name: /학습 시작/i }))

    expect(screen.getByText(/유효한 YouTube URL/i)).toBeInTheDocument()
  })

  it('disables button when loading', () => {
    render(<YouTubeInput onSubmit={vi.fn()} loading={true} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
