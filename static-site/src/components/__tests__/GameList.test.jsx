import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import GameList from '../GameList'

// Mock GameCard component
vi.mock('../GameCard', () => ({
  default: ({ game }) => (
    <li data-testid={`game-card-${game.id}`} className="card">
      <div>{game.title}</div>
    </li>
  )
}))

const mockGames = [
  {
    id: '1',
    title: 'Game One',
    description: 'First game',
    category: 'puzzle',
    thumb: 'https://example.com/thumb1.jpg',
    url: 'https://example.com/game1'
  },
  {
    id: '2',
    title: 'Game Two',
    description: 'Second game',
    category: 'action',
    thumb: 'https://example.com/thumb2.jpg',
    url: 'https://example.com/game2'
  },
  {
    id: '3',
    title: 'Game Three',
    description: 'Third game',
    category: 'strategy',
    thumb: 'https://example.com/thumb3.jpg',
    url: 'https://example.com/game3'
  },
  {
    id: '4',
    title: 'Game Four',
    description: 'Fourth game',
    category: 'puzzle',
    thumb: 'https://example.com/thumb4.jpg',
    url: 'https://example.com/game4'
  },
  {
    id: '5',
    title: 'Game Five',
    description: 'Fifth game',
    category: 'action',
    thumb: 'https://example.com/thumb5.jpg',
    url: 'https://example.com/game5'
  },
  {
    id: '6',
    title: 'Game Six',
    description: 'Sixth game',
    category: 'strategy',
    thumb: 'https://example.com/thumb6.jpg',
    url: 'https://example.com/game6'
  }
]

function renderGameList(games = mockGames) {
  return render(
    <BrowserRouter>
      <GameList items={games} />
    </BrowserRouter>
  )
}

describe('GameList', () => {
  it('should render all games correctly', () => {
    renderGameList()

    // Check that all games are rendered
    expect(screen.getByTestId('game-card-1')).toBeInTheDocument()
    expect(screen.getByTestId('game-card-2')).toBeInTheDocument()
    expect(screen.getByTestId('game-card-3')).toBeInTheDocument()
    expect(screen.getByTestId('game-card-4')).toBeInTheDocument()
    expect(screen.getByTestId('game-card-5')).toBeInTheDocument()
    expect(screen.getByTestId('game-card-6')).toBeInTheDocument()

    // Check game titles are displayed
    expect(screen.getByText('Game One')).toBeInTheDocument()
    expect(screen.getByText('Game Two')).toBeInTheDocument()
    expect(screen.getByText('Game Three')).toBeInTheDocument()
  })

  it('should have proper grid structure', () => {
    renderGameList()

    const gameList = screen.getByRole('list')
    expect(gameList).toHaveClass('grid', 'onecol')
  })

  it('should show ad after first game', () => {
    renderGameList()

    // Check for ad iframe
    const adIframe = screen.getByTitle('Advertisement')
    expect(adIframe).toBeInTheDocument()
    expect(adIframe).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin allow-top-navigation-by-user-activation allow-popups')
    
    // Check iframe has the expected style attribute
    const style = adIframe.getAttribute('style')
    expect(style).toContain('width: 100%')
    expect(style).toContain('height: 250px')
    expect(style).toContain('border: 0')
  })

  it('should show ezoic ad placeholders every 5 games', () => {
    renderGameList()

    // Should have ezoic ad after 5th game (index 4)
    const ezoicAd = screen.getByText((content, element) => {
      return element?.id === 'ezoic-ad-5'
    })
    expect(ezoicAd).toBeInTheDocument()
  })

  it('should handle empty games list', () => {
    renderGameList([])

    const gameList = screen.getByRole('list')
    expect(gameList).toBeInTheDocument()
    expect(gameList).toBeEmptyDOMElement()
  })

  it('should handle null/undefined games list', () => {
    renderGameList(null)

    const gameList = screen.getByRole('list')
    expect(gameList).toBeInTheDocument()
    expect(gameList).toBeEmptyDOMElement()
  })

  it('should render single game without errors', () => {
    const singleGame = [mockGames[0]]
    renderGameList(singleGame)

    expect(screen.getByTestId('game-card-1')).toBeInTheDocument()
    expect(screen.getByText('Game One')).toBeInTheDocument()
    
    // Should still show ad after first game
    expect(screen.getByTitle('Advertisement')).toBeInTheDocument()
  })

  it('should not show ezoic ads for less than 5 games', () => {
    const fewGames = mockGames.slice(0, 3)
    renderGameList(fewGames)

    // Should not have any ezoic ads
    expect(screen.queryByText((content, element) => {
      return element?.id?.startsWith('ezoic-ad-')
    })).not.toBeInTheDocument()
  })

  it('should show multiple ezoic ads for many games', () => {
    const manyGames = Array.from({ length: 12 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Game ${i + 1}`,
      description: `Game ${i + 1} description`,
      category: 'puzzle',
      thumb: `https://example.com/thumb${i + 1}.jpg`,
      url: `https://example.com/game${i + 1}`
    }))

    renderGameList(manyGames)

    // Should have ezoic ads after 5th and 10th games
    expect(screen.getByText((content, element) => {
      return element?.id === 'ezoic-ad-5'
    })).toBeInTheDocument()
    
    expect(screen.getByText((content, element) => {
      return element?.id === 'ezoic-ad-10'
    })).toBeInTheDocument()
  })

  it('should have proper ad container styling', () => {
    renderGameList()

    // Find the ad container by looking for the iframe's parent
    const adIframe = screen.getByTitle('Advertisement')
    const adContainer = adIframe.parentElement
    
    // CSS modules generate hashed class names, so we check if it contains the expected pattern
    expect(adContainer.className).toMatch(/adContainer/)
  })

  it('should contain proper ad script configuration', () => {
    renderGameList()

    const adIframe = screen.getByTitle('Advertisement')
    const srcDoc = adIframe.getAttribute('srcDoc')
    
    // Check that the ad configuration is present
    expect(srcDoc).toContain('window.atOptions')
    expect(srcDoc).toContain('268fd9be7cb5acbc21f157c5611ba04f')
    expect(srcDoc).toContain('www.highperformanceformat.com')
    expect(srcDoc).toContain('\'height\': 250')
    expect(srcDoc).toContain('\'width\': 300')
  })

  it('should maintain game order', () => {
    renderGameList()

    const gameCards = screen.getAllByTestId(/^game-card-/)
    const gameIds = gameCards.map(card => card.getAttribute('data-testid').replace('game-card-', ''))
    
    expect(gameIds).toEqual(['1', '2', '3', '4', '5', '6'])
  })
})