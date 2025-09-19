import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import GamePage from '../GamePage'

// Mock the useGames hook
vi.mock('../../hooks/useGames', () => ({
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
  useGameSEO: vi.fn()
}))

import useGames from '../../hooks/useGames'

const mockGames = [
  {
    id: '1',
    title: 'Test Game 1',
    namespace: 'test-game-1',
    description: 'A test game',
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
  },
  {
    id: '2',
    title: 'Test Game 2',
    namespace: 'test-game-2',
    description: 'Another test game',
    category: 'puzzle',
    orientation: 'portrait',
    quality_score: 90,
    width: 600,
    height: 800,
    date_modified: '2024-01-02',
    date_published: '2024-01-02',
    thumb: 'https://example.com/thumb2.jpg',
    image: 'https://example.com/image2.jpg',
    url: 'https://example.com/game2'
  }
]

const renderWithRouter = (component, initialEntries = ['/game/test-game-1']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  )
}

describe('GamePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state when games are loading', () => {
    useGames.mockReturnValue({
      games: [],
      loading: true,
      error: null,
      refetch: vi.fn()
    })

    renderWithRouter(<GamePage />, ['/game?id=1'])

    expect(screen.getByText('Loading game...')).toBeInTheDocument()
    expect(screen.getByText('More Games')).toBeInTheDocument()
  })

  it('renders error state when there is an error loading games', () => {
    const errorMessage = 'Failed to load games'
    useGames.mockReturnValue({
      games: [],
      loading: false,
      error: errorMessage,
      refetch: vi.fn()
    })

    renderWithRouter(<GamePage />, ['/game?id=1'])

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
    expect(screen.getAllByText('More Games')).toHaveLength(2)
  })

  it('renders game when found by id', async () => {
    useGames.mockReturnValue({
      games: mockGames,
      loading: false,
      error: null,
      refetch: vi.fn()
    })

    renderWithRouter(<GamePage />, ['/game?id=1'])

    await waitFor(() => {
      expect(screen.getByTestId('game-client-ui')).toBeInTheDocument()
      expect(screen.getByTestId('game-info')).toBeInTheDocument()
      expect(screen.getAllByText('Test Game 1')).toHaveLength(2)
    })
  })

  it('renders error when game is not found', async () => {
    useGames.mockReturnValue({
      games: mockGames,
      loading: false,
      error: null,
      refetch: vi.fn()
    })

    renderWithRouter(<GamePage />, ['/game?id=999'])

    await waitFor(() => {
      expect(screen.getByText('Game not found')).toBeInTheDocument()
      expect(screen.getByText('Retry')).toBeInTheDocument()
    })
  })

  it('renders error when no game ID is provided', async () => {
    useGames.mockReturnValue({
      games: mockGames,
      loading: false,
      error: null,
      refetch: vi.fn()
    })

    renderWithRouter(<GamePage />, ['/game'])

    await waitFor(() => {
      expect(screen.getByText('No game ID provided')).toBeInTheDocument()
    })
  })

  it('has proper page structure when game is loaded', async () => {
    useGames.mockReturnValue({
      games: mockGames,
      loading: false,
      error: null,
      refetch: vi.fn()
    })

    renderWithRouter(<GamePage />, ['/game?id=1'])

    await waitFor(() => {
      expect(screen.getByTestId('game-client-ui')).toBeInTheDocument()
    })
  })
})