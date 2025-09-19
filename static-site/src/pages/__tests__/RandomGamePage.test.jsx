import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import RandomGamePage from '../RandomGamePage'

// Mock the useRandomGame hook
vi.mock('../../hooks/useRandomGame', () => ({
  default: vi.fn()
}))

// Mock the GameClientUI component
vi.mock('../../components/GameClientUI', () => ({
  default: ({ game, title }) => (
    <div data-testid="game-client-ui">
      <h1>{title}</h1>
      {game && <div data-testid="game-info">{game.title}</div>}
    </div>
  )
}))

// Mock the LoadingStateManager component
vi.mock('../../components/LoadingStateManager', () => ({
  default: ({ children, loading, error, data }) => (
    <div data-testid="loading-state-manager">
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && data && children}
    </div>
  )
}))

// Mock the useSEO hook
vi.mock('../../hooks/useSEO', () => ({
  useRandomGameSEO: vi.fn()
}))

import useRandomGame from '../../hooks/useRandomGame'

const mockGame = {
  id: '1',
  title: 'Daily Test Game',
  namespace: 'daily-test-game',
  description: 'A daily test game',
  category: 'action',
  orientation: 'landscape',
  quality_score: 85,
  width: 800,
  height: 600,
  date_modified: '2024-01-01',
  date_published: '2024-01-01',
  thumb: 'https://example.com/thumb1.jpg',
  image: 'https://example.com/image1.jpg',
  url: 'https://example.com/game1'
}

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('RandomGamePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state when game is loading', () => {
    useRandomGame.mockReturnValue({
      game: null,
      loading: true,
      error: null,
      refetch: vi.fn()
    })

    renderWithRouter(<RandomGamePage />)

    expect(screen.getByTestId('loading-state-manager')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders error state when there is an error', () => {
    const errorMessage = 'Failed to load random game'
    useRandomGame.mockReturnValue({
      game: null,
      loading: false,
      error: errorMessage,
      refetch: vi.fn()
    })

    renderWithRouter(<RandomGamePage />)

    expect(screen.getByTestId('loading-state-manager')).toBeInTheDocument()
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
  })

  it('renders game when loaded successfully', async () => {
    useRandomGame.mockReturnValue({
      game: mockGame,
      loading: false,
      error: null,
      refetch: vi.fn()
    })

    renderWithRouter(<RandomGamePage />)

    await waitFor(() => {
      expect(screen.getByTestId('game-client-ui')).toBeInTheDocument()
      expect(screen.getByTestId('game-info')).toBeInTheDocument()
      expect(screen.getByText('Daily Test Game')).toBeInTheDocument()
    })
  })

  it('displays correct title for random game', async () => {
    useRandomGame.mockReturnValue({
      game: mockGame,
      loading: false,
      error: null,
      refetch: vi.fn()
    })

    renderWithRouter(<RandomGamePage />)

    await waitFor(() => {
      expect(screen.getByText('1 DAY 1 GAME')).toBeInTheDocument()
    })
  })

  it('has proper page structure', () => {
    useRandomGame.mockReturnValue({
      game: mockGame,
      loading: false,
      error: null,
      refetch: vi.fn()
    })

    renderWithRouter(<RandomGamePage />)

    expect(screen.getByTestId('loading-state-manager')).toBeInTheDocument()
  })
})