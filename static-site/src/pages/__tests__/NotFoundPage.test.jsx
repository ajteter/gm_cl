import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import NotFoundPage from '../NotFoundPage'

// Mock the useSEO hook
vi.mock('../../hooks/useSEO', () => ({
  useNotFoundSEO: vi.fn()
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('NotFoundPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the 404 page', () => {
    renderWithRouter(<NotFoundPage />)

    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
  })

  it('renders the error message', () => {
    renderWithRouter(<NotFoundPage />)

    expect(screen.getByText(/The page you're looking for doesn't exist/)).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderWithRouter(<NotFoundPage />)

    expect(screen.getByRole('link', { name: 'Back to Games' })).toBeInTheDocument()
  })

  it('has correct navigation link URLs', () => {
    renderWithRouter(<NotFoundPage />)

    const backLink = screen.getByRole('link', { name: 'Back to Games' })
    expect(backLink).toHaveAttribute('href', '/game')
  })

  it('has proper semantic structure', () => {
    renderWithRouter(<NotFoundPage />)

    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('has proper CSS classes applied', () => {
    const { container } = renderWithRouter(<NotFoundPage />)

    expect(container.querySelector('.container')).toBeInTheDocument()
    expect(container.querySelector('.empty')).toBeInTheDocument()
  })

  it('displays the page title prominently', () => {
    renderWithRouter(<NotFoundPage />)

    const titleElement = screen.getByText('Page Not Found')
    expect(titleElement).toBeInTheDocument()
    expect(titleElement.tagName).toBe('H1')
  })
})