import { render, screen } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import PlayPage from '../PlayPage'

// Mock the useSEO hook
vi.mock('../../hooks/useSEO', () => ({
  usePlaySEO: vi.fn()
}))

const renderWithRouter = (component, initialEntries = ['/game/play']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  )
}

describe('PlayPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders error message when no game URL is provided', () => {
    renderWithRouter(<PlayPage />)

    expect(screen.getByText('游戏链接无效。')).toBeInTheDocument()
    expect(screen.getByText('返回首页')).toBeInTheDocument()
  })

  it('renders game iframe when valid URL is provided', () => {
    renderWithRouter(<PlayPage />, ['/game/play?url=https://example.com/game'])

    expect(screen.getByTitle('Game')).toBeInTheDocument()
    expect(screen.getByText('More Games')).toBeInTheDocument()
  })

  it('handles navigation back to home', () => {
    renderWithRouter(<PlayPage />)

    const homeButton = screen.getByText('返回首页')
    expect(homeButton).toBeInTheDocument()
  })

  it('shows loading overlay initially when game is provided', () => {
    renderWithRouter(<PlayPage />, ['/game/play?url=https://example.com/game'])

    // The loading overlay should be present initially
    expect(screen.getByTitle('Game')).toBeInTheDocument()
  })

  it('renders ad container when game is loaded', () => {
    renderWithRouter(<PlayPage />, ['/game/play?url=https://example.com/game'])

    expect(screen.getByTitle('Advertisement')).toBeInTheDocument()
  })

  it('has proper CSS classes applied', () => {
    const { container } = renderWithRouter(<PlayPage />)

    expect(container.querySelector('[class*="container"]')).toBeInTheDocument()
    expect(container.querySelector('[class*="error"]')).toBeInTheDocument()
  })
})