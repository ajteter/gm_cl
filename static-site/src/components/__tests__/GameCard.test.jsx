import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import GameCard from '../GameCard'

// Mock useNavigate and useLocation
const mockNavigate = vi.fn()
const mockLocation = { search: '' }

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation
  }
})

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    origin: 'https://example.com'
  },
  writable: true
})

const mockGame = {
  id: '1',
  title: 'Test Game',
  description: 'This is a test game description that might be quite long and should be expandable when clicked.',
  category: 'puzzle',
  thumb: 'https://example.com/thumb.jpg',
  url: 'https://example.com/game1'
}

function renderGameCard(game = mockGame) {
  return render(
    <BrowserRouter>
      <GameCard game={game} />
    </BrowserRouter>
  )
}

describe('GameCard', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockLocation.search = ''
  })

  it('should render game information correctly', () => {
    renderGameCard()

    expect(screen.getByText('Test Game')).toBeInTheDocument()
    expect(screen.getByText(/This is a test game description/)).toBeInTheDocument()
    expect(screen.getByText('puzzle')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '开始 Test Game' })).toBeInTheDocument()
    
    const image = screen.getByAltText('Test Game')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/thumb.jpg')
    expect(image).toHaveAttribute('loading', 'lazy')
  })

  it('should toggle description expansion when clicked', () => {
    renderGameCard()

    const description = screen.getByText(/This is a test game description/)
    
    // Initially not expanded
    expect(description).toHaveClass('desc')
    expect(description).not.toHaveClass('expanded')
    expect(description).toHaveAttribute('aria-expanded', 'false')

    // Click to expand
    fireEvent.click(description)
    
    expect(description).toHaveClass('desc', 'expanded')
    expect(description).toHaveAttribute('aria-expanded', 'true')

    // Click to collapse
    fireEvent.click(description)
    
    expect(description).toHaveClass('desc')
    expect(description).not.toHaveClass('expanded')
    expect(description).toHaveAttribute('aria-expanded', 'false')
  })

  it('should navigate to play page when play button is clicked', () => {
    renderGameCard()

    const playButton = screen.getByRole('button', { name: '开始 Test Game' })
    fireEvent.click(playButton)

    expect(mockNavigate).toHaveBeenCalledWith('/play?url=https%3A%2F%2Fexample.com%2Fgame1')
  })

  it('should navigate to play page when thumbnail is clicked', () => {
    renderGameCard()

    const thumbnailButton = screen.getByRole('button', { name: '打开 Test Game' })
    fireEvent.click(thumbnailButton)

    expect(mockNavigate).toHaveBeenCalledWith('/play?url=https%3A%2F%2Fexample.com%2Fgame1')
  })

  it('should preserve ad attribution parameters when navigating', () => {
    mockLocation.search = '?utm_source=google&utm_campaign=test&page=2'
    
    renderGameCard()

    const playButton = screen.getByRole('button', { name: '开始 Test Game' })
    fireEvent.click(playButton)

    // Should include utm parameters but exclude page parameter
    expect(mockNavigate).toHaveBeenCalledWith('/play?url=https%3A%2F%2Fexample.com%2Fgame1&utm_source=google&utm_campaign=test')
  })

  it('should show loading state when button is clicked', async () => {
    renderGameCard()

    const playButton = screen.getByRole('button', { name: '开始 Test Game' })
    
    // Initially not loading
    expect(playButton).not.toHaveClass('loading')
    expect(playButton).not.toBeDisabled()

    // Click button
    fireEvent.click(playButton)

    // Should show loading state
    expect(playButton).toHaveClass('loading')
    expect(playButton).toBeDisabled()
  })

  it('should show loading state on thumbnail when clicked', () => {
    renderGameCard()

    const thumbnailButton = screen.getByRole('button', { name: '打开 Test Game' })
    
    // Initially not loading
    expect(thumbnailButton).not.toHaveClass('loading')
    expect(thumbnailButton).not.toBeDisabled()

    // Click thumbnail
    fireEvent.click(thumbnailButton)

    // Should show loading state
    expect(thumbnailButton).toHaveClass('loading')
    expect(thumbnailButton).toBeDisabled()
  })

  it('should handle games with missing optional fields', () => {
    const minimalGame = {
      id: '2',
      title: 'Minimal Game',
      description: 'Short desc',
      category: 'action',
      thumb: 'https://example.com/thumb2.jpg',
      url: 'https://example.com/game2'
    }

    renderGameCard(minimalGame)

    expect(screen.getByText('Minimal Game')).toBeInTheDocument()
    expect(screen.getByText('Short desc')).toBeInTheDocument()
    expect(screen.getByText('action')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    renderGameCard()

    const thumbnailButton = screen.getByRole('button', { name: '打开 Test Game' })
    const playButton = screen.getByRole('button', { name: '开始 Test Game' })
    const description = screen.getByText(/This is a test game description/)
    const badge = screen.getByText('puzzle')

    expect(thumbnailButton).toHaveAttribute('aria-label', '打开 Test Game')
    expect(playButton).toHaveAttribute('aria-label', '开始 Test Game')
    expect(description).toHaveAttribute('role', 'button')
    expect(description).toHaveAttribute('aria-expanded')
    expect(badge).toHaveAttribute('aria-label', '分类')
  })

  it('should handle empty search parameters', () => {
    mockLocation.search = ''
    
    renderGameCard()

    const playButton = screen.getByRole('button', { name: '开始 Test Game' })
    fireEvent.click(playButton)

    expect(mockNavigate).toHaveBeenCalledWith('/play?url=https%3A%2F%2Fexample.com%2Fgame1')
  })

  it('should handle complex URL parameters correctly', () => {
    mockLocation.search = '?utm_source=facebook&utm_medium=cpc&utm_campaign=summer2024&gclid=abc123&page=3'
    
    renderGameCard()

    const playButton = screen.getByRole('button', { name: '开始 Test Game' })
    fireEvent.click(playButton)

    // Should preserve all utm and gclid parameters but exclude page
    const expectedUrl = '/play?url=https%3A%2F%2Fexample.com%2Fgame1&utm_source=facebook&utm_medium=cpc&utm_campaign=summer2024&gclid=abc123'
    expect(mockNavigate).toHaveBeenCalledWith(expectedUrl)
  })
})