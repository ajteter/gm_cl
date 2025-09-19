import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import withErrorBoundary, { useErrorHandler } from '../withErrorBoundary'

// Mock console.error to avoid noise in tests
const originalError = console.error
beforeAll(() => {
  console.error = vi.fn()
})

afterAll(() => {
  console.error = originalError
})

// Test component that can throw errors
function TestComponent({ shouldThrow = false, onRetry }) {
  if (shouldThrow) {
    throw new Error('Test component error')
  }
  
  return (
    <div>
      <h1>Test Component</h1>
      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  )
}

// Test component that uses error handler hook
function TestComponentWithHook() {
  const { throwError } = useErrorHandler()
  
  return (
    <div>
      <h1>Test Component with Hook</h1>
      <button onClick={() => throwError(new Error('Hook error'))}>
        Throw Error
      </button>
    </div>
  )
}

describe('withErrorBoundary', () => {
  it('renders component normally when no error occurs', () => {
    const WrappedComponent = withErrorBoundary(TestComponent)
    
    render(<WrappedComponent />)
    
    expect(screen.getByText('Test Component')).toBeInTheDocument()
  })

  it('renders error fallback when component throws error', () => {
    const WrappedComponent = withErrorBoundary(TestComponent)
    
    render(<WrappedComponent shouldThrow={true} />)
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Try again')).toBeInTheDocument()
  })

  it('uses custom title when provided', () => {
    const WrappedComponent = withErrorBoundary(TestComponent, {
      title: 'Custom Error Title'
    })
    
    render(<WrappedComponent shouldThrow={true} />)
    
    expect(screen.getByText('Custom Error Title')).toBeInTheDocument()
  })

  it('uses game error fallback for game components', () => {
    const WrappedComponent = withErrorBoundary(TestComponent, {
      fallbackType: 'game'
    })
    
    render(<WrappedComponent shouldThrow={true} />)
    
    expect(screen.getByText('Unable to load game')).toBeInTheDocument()
  })

  it('uses data error fallback for data components', () => {
    const WrappedComponent = withErrorBoundary(TestComponent, {
      fallbackType: 'data',
      dataType: 'games'
    })
    
    render(<WrappedComponent shouldThrow={true} />)
    
    expect(screen.getByText('Unable to load games')).toBeInTheDocument()
  })

  it('uses network error fallback for network errors', () => {
    const NetworkErrorComponent = () => {
      throw new Error('Failed to fetch data')
    }
    
    const WrappedComponent = withErrorBoundary(NetworkErrorComponent)
    
    render(<WrappedComponent />)
    
    expect(screen.getByText('Connection problem')).toBeInTheDocument()
  })

  it('calls custom error handler when provided', () => {
    const mockErrorHandler = vi.fn()
    const WrappedComponent = withErrorBoundary(TestComponent, {
      onError: mockErrorHandler
    })
    
    render(<WrappedComponent shouldThrow={true} />)
    
    expect(mockErrorHandler).toHaveBeenCalledTimes(1)
    expect(mockErrorHandler).toHaveBeenCalledWith(
      expect.any(Error),
      expect.any(Object)
    )
  })

  it('calls custom reset handler when retry is clicked', () => {
    const mockResetHandler = vi.fn()
    const WrappedComponent = withErrorBoundary(TestComponent, {
      onReset: mockResetHandler
    })
    
    render(<WrappedComponent shouldThrow={true} />)
    
    const retryButton = screen.getByText('Try again')
    fireEvent.click(retryButton)
    
    expect(mockResetHandler).toHaveBeenCalledTimes(1)
  })

  it('calls onRetry prop when reset is triggered', () => {
    const mockOnRetry = vi.fn()
    const WrappedComponent = withErrorBoundary(TestComponent)
    
    render(<WrappedComponent shouldThrow={true} onRetry={mockOnRetry} />)
    
    const retryButton = screen.getByText('Try again')
    fireEvent.click(retryButton)
    
    expect(mockOnRetry).toHaveBeenCalledTimes(1)
  })

  it('sets correct display name', () => {
    const WrappedComponent = withErrorBoundary(TestComponent)
    
    expect(WrappedComponent.displayName).toBe('withErrorBoundary(TestComponent)')
  })
})

describe('useErrorHandler', () => {
  it('throws error when throwError is called', () => {
    const WrappedComponent = withErrorBoundary(TestComponentWithHook)
    
    render(<WrappedComponent />)
    
    const throwButton = screen.getByText('Throw Error')
    fireEvent.click(throwButton)
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('can reset error state', () => {
    function TestComponentWithReset() {
      const { throwError, resetError } = useErrorHandler()
      
      return (
        <div>
          <h1>Test Component with Reset</h1>
          <button onClick={() => throwError(new Error('Hook error'))}>
            Throw Error
          </button>
          <button onClick={resetError}>
            Reset Error
          </button>
        </div>
      )
    }

    const WrappedComponent = withErrorBoundary(TestComponentWithReset)
    
    const { rerender } = render(<WrappedComponent />)
    
    // Initially should render normally
    expect(screen.getByText('Test Component with Reset')).toBeInTheDocument()
    
    // Throw error
    const throwButton = screen.getByText('Throw Error')
    fireEvent.click(throwButton)
    
    // Should show error boundary
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    
    // Reset and rerender
    const retryButton = screen.getByText('Try again')
    fireEvent.click(retryButton)
    
    rerender(<WrappedComponent />)
    
    // Should render normally again
    expect(screen.getByText('Test Component with Reset')).toBeInTheDocument()
  })
})