import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import App from '../App'

// Mock all the hooks
vi.mock('../hooks/useGames', () => ({
  default: vi.fn()
}))

vi.mock('../hooks/useRandomGame', () => ({
  default: vi.fn()
}))

vi.mock('../hooks/useSEO', () => ({
  useHomeSEO: vi.fn(),
  useGameSEO: vi.fn(),
  useRandomGameSEO: vi.fn(),
  usePlaySEO: vi.fn(),
  usePrivacySEO: vi.fn(),
  useNotFoundSEO: vi.fn()
}))

// Mock components that might cause issues in tests
vi.mock('../components/GameList', () => ({
  default: ({ games }) => (
    <div data-testid="game-list">
      {games?.map(game => (
        <div key={game.id} data-testid={`game-${game.id}`}>
          {game.title}
        </div>
      ))}
    </div>
  )
}))

vi.mock('../components/GameClientUI', () => ({
  default: ({ game, title }) => (
    <div data-testid="game-client-ui">
      <h1>{title}</h1>
      {game && <div data-testid="game-info">{game.title}</div>}
    </div>
  )
}))

vi.mock('../components/LoadingStateManager', () => ({
  default: ({ children, loading, error, data }) => (
    <div data-testid="loading-state-manager">
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && data && children}
    </div>
  )
}))

import useGames from '../hooks/useGames'
import useRandomGame from '../hooks/useRandomGame'

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
  }
]

const renderWithRouter = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  )
}

describe('App Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock implementations
    useGames.mockReturnValue({
      games: mockGames,
      loading: false,
      error: null,
      refetch: vi.fn()
    })

    useRandomGame.mockReturnValue({
      game: mockGames[0],
      loading: false,
      error: null,
      refetch: vi.fn()
    })
  })

  describe('Routing', () => {
    it('renders HomePage on root route', async () => {
      renderWithRouter(['/'])

      await waitFor(() => {
        expect(screen.getByTestId('game-list')).toBeInTheDocument()
      })
    })

    it('renders RandomGamePage on /game/random route', async () => {
      renderWithRouter(['/game/random'])

      await waitFor(() => {
        expect(screen.getByTestId('game-client-ui')).toBeInTheDocument()
        expect(screen.getByText('Random Game')).toBeInTheDocument()
      })
    })

    it('renders GamePage on /game/:gameId route', async () => {
      renderWithRouter(['/game/test-game-1'])

      await waitFor(() => {
        expect(screen.getByTestId('game-client-ui')).toBeInTheDocument()
        expect(screen.getByTestId('game-info')).toBeInTheDocument()
      })
    })

    it('renders PlayPage on /play route', async () => {
      renderWithRouter(['/play'])

      await waitFor(() => {
        expect(screen.getByText('Play HTML5 Games')).toBeInTheDocument()
      })
    })

    it('renders PrivacyPage on /privacy-policy route', async () => {
      renderWithRouter(['/privacy-policy'])

      await waitFor(() => {
        expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
      })
    })

    it('renders NotFoundPage on unknown route', async () => {
      renderWithRouter(['/unknown-route'])

      await waitFor(() => {
        expect(screen.getByText('404')).toBeInTheDocument()
        expect(screen.getByText('Page Not Found')).toBeInTheDocument()
      })
    })
  })

  describe('Data Flow', () => {
    it('passes games data from useGames to HomePage', async () => {
      renderWithRouter(['/'])

      await waitFor(() => {
        expect(screen.getByTestId('game-list')).toBeInTheDocument()
        expect(screen.getByTestId('game-1')).toBeInTheDocument()
        expect(screen.getByText('Test Game 1')).toBeInTheDocument()
      })
    })

    it('passes random game data from useRandomGame to RandomGamePage', async () => {
      renderWithRouter(['/game/random'])

      await waitFor(() => {
        expect(screen.getByTestId('game-client-ui')).toBeInTheDocument()
        expect(screen.getByTestId('game-info')).toBeInTheDocument()
        expect(screen.getByText('Test Game 1')).toBeInTheDocument()
      })
    })

    it('handles loading states across routes', async () => {
      useGames.mockReturnValue({
        games: [],
        loading: true,
        error: null,
        refetch: vi.fn()
      })

      renderWithRouter(['/'])

      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('handles error states across routes', async () => {
      useGames.mockReturnValue({
        games: [],
        loading: false,
        error: 'Network error',
        refetch: vi.fn()
      })

      renderWithRouter(['/'])

      expect(screen.getByText('Error: Network error')).toBeInTheDocument()
    })
  })

  describe('Layout and Navigation', () => {
    it('renders Layout component on all routes', async () => {
      renderWithRouter(['/'])

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument()
      })
    })

    it('maintains layout when navigating between routes', async () => {
      const { rerender } = renderWithRouter(['/'])

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument()
      })

      // Simulate navigation to different route
      rerender(
        <MemoryRouter initialEntries={['/play']}>
          <App />
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument()
        expect(screen.getByText('Play HTML5 Games')).toBeInTheDocument()
      })
    })
  })

  describe('Error Boundaries', () => {
    it('handles component errors gracefully', async () => {
      // Mock a component that throws an error
      useGames.mockImplementation(() => {
        throw new Error('Component error')
      })

      renderWithRouter(['/'])

      // The error boundary should catch this and render fallback UI
      await waitFor(() => {
        expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()
      })
    })
  })
})