import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import HomePage from '../HomePage'

// Mock the useGames hook
vi.mock('../../hooks/useGames', () => ({
  default: vi.fn()
}))

// Mock the GameList component
vi.mock('../../components/GameList', () => ({
  default: ({ items }) => (
    <div data-testid="game-list">
      {`${items?.length || 0} games`}
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
  useHomeSEO: vi.fn()
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

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('HomePage', () => {
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

    renderWithRouter(<HomePage />)

    expect(screen.getByTestId('loading-state-manager')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders error state when there is an error', () => {
    const errorMessage = 'Failed to load games'
    useGames.mockReturnValue({
      games: [],
      loading: false,
      error: errorMessage,
      refetch: vi.fn()
    })

    renderWithRouter(<HomePage />)

    expect(screen.getByTestId('loading-state-manager')).toBeInTheDocument()
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
  })

  it('renders games when loaded successfully', async () => {
    useGames.mockReturnValue({
      games: mockGames,
      loading: false,
      error: null,
      refetch: vi.fn()
    })

    renderWithRouter(<HomePage />)

    await waitFor(() => {
      expect(screen.getByTestId('game-list')).toBeInTheDocument()
      // The mock GameList component shows the count of games passed to it
      expect(screen.getByText('2 games')).toBeInTheDocument()
    })
  })

  it('renders empty state when no games are available', async () => {
    useGames.mockReturnValue({
      games: [],
      loading: false,
      error: null,
      refetch: vi.fn()
    })

    renderWithRouter(<HomePage />)

    await waitFor(() => {
      expect(screen.getByTestId('game-list')).toBeInTheDocument()
      expect(screen.getByText('0 games')).toBeInTheDocument()
    })
  })

  it('has proper page structure', () => {
    useGames.mockReturnValue({
      games: mockGames,
      loading: false,
      error: null,
      refetch: vi.fn()
    })

    renderWithRouter(<HomePage />)

    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})