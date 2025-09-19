import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { 
  ErrorFallback, 
  GameErrorFallback, 
  DataErrorFallback, 
  NetworkErrorFallback 
} from '../ErrorBoundary'

// Mock console.error to avoid noise in tests
const originalError = console.error
beforeAll(() => {
  console.error = vi.fn()
})

afterAll(() => {
  console.error = originalError
})

describe('ErrorFallback', () => {
  const mockError = new Error('Test error message')
  const mockReset = vi.fn()

  beforeEach(() => {
    mockReset.mockClear()
  })

  it('renders error message and retry button', () => {
    render(<ErrorFallback error={mockError} resetErrorBoundary={mockReset} />)
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Try again')).toBeInTheDocument()
    expect(screen.getByText('Reload page')).toBeInTheDocument()
  })

  it('renders custom title when provided', () => {
    render(
      <ErrorFallback 
        error={mockError} 
        resetErrorBoundary={mockReset} 
        title="Custom Error Title" 
      />
    )
    
    expect(screen.getByText('Custom Error Title')).toBeInTheDocument()
  })

  it('shows error details when expanded', () => {
    render(<ErrorFallback error={mockError} resetErrorBoundary={mockReset} />)
    
    const detailsButton = screen.getByText('Error details')
    fireEvent.click(detailsButton)
    
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('calls resetErrorBoundary when retry button is clicked', () => {
    render(<ErrorFallback error={mockError} resetErrorBoundary={mockReset} />)
    
    const retryButton = screen.getByText('Try again')
    fireEvent.click(retryButton)
    
    expect(mockReset).toHaveBeenCalledTimes(1)
  })

  it('reloads page when reload button is clicked', () => {
    const mockReload = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    })

    render(<ErrorFallback error={mockError} resetErrorBoundary={mockReset} />)
    
    const reloadButton = screen.getByText('Reload page')
    fireEvent.click(reloadButton)
    
    expect(mockReload).toHaveBeenCalledTimes(1)
  })
})

describe('GameErrorFallback', () => {
  const mockError = new Error('Game loading failed')
  const mockReset = vi.fn()

  beforeEach(() => {
    mockReset.mockClear()
  })

  it('renders game-specific error message', () => {
    render(<GameErrorFallback error={mockError} resetErrorBoundary={mockReset} />)
    
    expect(screen.getByText('Unable to load game')).toBeInTheDocument()
    expect(screen.getByText("We're having trouble loading the game right now.")).toBeInTheDocument()
  })

  it('has try again and go home buttons', () => {
    render(<GameErrorFallback error={mockError} resetErrorBoundary={mockReset} />)
    
    expect(screen.getByText('Try again')).toBeInTheDocument()
    expect(screen.getByText('Go to home')).toBeInTheDocument()
  })

  it('calls resetErrorBoundary when try again is clicked', () => {
    render(<GameErrorFallback error={mockError} resetErrorBoundary={mockReset} />)
    
    const tryAgainButton = screen.getByText('Try again')
    fireEvent.click(tryAgainButton)
    
    expect(mockReset).toHaveBeenCalledTimes(1)
  })
})

describe('DataErrorFallback', () => {
  const mockError = new Error('Data fetch failed')
  const mockReset = vi.fn()

  beforeEach(() => {
    mockReset.mockClear()
  })

  it('renders data-specific error message', () => {
    render(<DataErrorFallback error={mockError} resetErrorBoundary={mockReset} />)
    
    expect(screen.getByText('Unable to load data')).toBeInTheDocument()
    expect(screen.getByText('We\'re having trouble loading the data. Please try again.')).toBeInTheDocument()
  })

  it('renders custom data type when provided', () => {
    render(
      <DataErrorFallback 
        error={mockError} 
        resetErrorBoundary={mockReset} 
        dataType="games" 
      />
    )
    
    expect(screen.getByText('Unable to load games')).toBeInTheDocument()
    expect(screen.getByText('We\'re having trouble loading the games. Please try again.')).toBeInTheDocument()
  })

  it('has retry button', () => {
    render(<DataErrorFallback error={mockError} resetErrorBoundary={mockReset} />)
    
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })
})

describe('NetworkErrorFallback', () => {
  const mockError = new Error('Network request failed')
  const mockReset = vi.fn()

  beforeEach(() => {
    mockReset.mockClear()
    // Reset navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    })
  })

  it('renders network error message when online', () => {
    render(<NetworkErrorFallback error={mockError} resetErrorBoundary={mockReset} />)
    
    expect(screen.getByText('Connection problem')).toBeInTheDocument()
    expect(screen.getByText("We're having trouble connecting to our servers.")).toBeInTheDocument()
  })

  it('renders offline message when offline', () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    })

    render(<NetworkErrorFallback error={mockError} resetErrorBoundary={mockReset} />)
    
    expect(screen.getByText("You're offline")).toBeInTheDocument()
    expect(screen.getByText('Please check your internet connection and try again.')).toBeInTheDocument()
    expect(screen.getByText('This page will automatically retry when you\'re back online.')).toBeInTheDocument()
  })

  it('has try again button', () => {
    render(<NetworkErrorFallback error={mockError} resetErrorBoundary={mockReset} />)
    
    expect(screen.getByText('Try again')).toBeInTheDocument()
  })
})