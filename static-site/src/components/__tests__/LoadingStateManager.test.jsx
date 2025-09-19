import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LoadingStateManager, { useLoadingState, withLoadingState } from '../LoadingStateManager'

// Mock timers for testing delays
vi.useFakeTimers()

describe('LoadingStateManager', () => {
  beforeEach(() => {
    vi.clearAllTimers()
  })

  it('renders children when not loading and has data', () => {
    render(
      <LoadingStateManager loading={false} data={['item1', 'item2']}>
        <div>Content loaded</div>
      </LoadingStateManager>
    )
    
    expect(screen.getByText('Content loaded')).toBeInTheDocument()
  })

  it('shows loading spinner when loading', () => {
    render(
      <LoadingStateManager loading={true} loadingType="spinner" loadingText="Loading data...">
        <div>Content</div>
      </LoadingStateManager>
    )
    
    expect(screen.getByText('Loading data...')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('shows loading dots when loadingType is dots', () => {
    render(
      <LoadingStateManager loading={true} loadingType="dots">
        <div>Content</div>
      </LoadingStateManager>
    )
    
    expect(document.querySelector('.loading-dots')).toBeInTheDocument()
  })

  it('shows skeleton loading when loadingType is skeleton', () => {
    render(
      <LoadingStateManager loading={true} loadingType="skeleton-games">
        <div>Content</div>
      </LoadingStateManager>
    )
    
    expect(document.querySelector('.grid.onecol')).toBeInTheDocument()
  })

  it('shows error state when error is present', () => {
    const mockRetry = vi.fn()
    
    render(
      <LoadingStateManager 
        loading={false} 
        error="Something went wrong" 
        retryFunction={mockRetry}
      >
        <div>Content</div>
      </LoadingStateManager>
    )
    
    expect(screen.getAllByText('Something went wrong')).toHaveLength(2)
    
    const retryButton = screen.getByText('Try again')
    fireEvent.click(retryButton)
    
    expect(mockRetry).toHaveBeenCalledTimes(1)
  })

  it('shows empty state when no data', () => {
    const mockRetry = vi.fn()
    
    render(
      <LoadingStateManager 
        loading={false} 
        data={[]} 
        retryFunction={mockRetry}
      >
        <div>Content</div>
      </LoadingStateManager>
    )
    
    expect(screen.getByText('No data available')).toBeInTheDocument()
    expect(screen.getByText("There's nothing to show right now.")).toBeInTheDocument()
    
    const refreshButton = screen.getByText('Refresh')
    fireEvent.click(refreshButton)
    
    expect(mockRetry).toHaveBeenCalledTimes(1)
  })

  it('uses custom error component when provided', () => {
    const CustomError = () => <div>Custom error message</div>
    
    render(
      <LoadingStateManager 
        loading={false} 
        error="Error" 
        errorComponent={<CustomError />}
      >
        <div>Content</div>
      </LoadingStateManager>
    )
    
    expect(screen.getByText('Custom error message')).toBeInTheDocument()
  })

  it('uses custom empty component when provided', () => {
    const CustomEmpty = () => <div>Custom empty message</div>
    
    render(
      <LoadingStateManager 
        loading={false} 
        data={[]} 
        emptyComponent={<CustomEmpty />}
      >
        <div>Content</div>
      </LoadingStateManager>
    )
    
    expect(screen.getByText('Custom empty message')).toBeInTheDocument()
  })

  it('respects showLoadingDelay', async () => {
    const { rerender } = render(
      <LoadingStateManager 
        loading={false} 
        showLoadingDelay={500}
        loadingText="Delayed loading"
      >
        <div>Content</div>
      </LoadingStateManager>
    )
    
    // Start loading
    rerender(
      <LoadingStateManager 
        loading={true} 
        showLoadingDelay={500}
        loadingText="Delayed loading"
      >
        <div>Content</div>
      </LoadingStateManager>
    )
    
    // Should not show loading immediately
    expect(screen.queryByText('Delayed loading')).not.toBeInTheDocument()
    
    // Fast forward past delay
    vi.advanceTimersByTime(500)
    
    await waitFor(() => {
      expect(screen.getByText('Delayed loading')).toBeInTheDocument()
    })
  })

  it('respects minLoadingTime', async () => {
    const { rerender } = render(
      <LoadingStateManager 
        loading={true} 
        minLoadingTime={1000}
        loadingText="Min time loading"
      >
        <div>Content</div>
      </LoadingStateManager>
    )
    
    // Should show loading
    expect(screen.getByText('Min time loading')).toBeInTheDocument()
    
    // Stop loading before min time
    vi.advanceTimersByTime(500)
    rerender(
      <LoadingStateManager 
        loading={false} 
        data={['data']}
        minLoadingTime={1000}
      >
        <div>Content loaded</div>
      </LoadingStateManager>
    )
    
    // Should still show loading
    expect(screen.getByText('Min time loading')).toBeInTheDocument()
    
    // Fast forward past min time
    vi.advanceTimersByTime(500)
    
    await waitFor(() => {
      expect(screen.getByText('Content loaded')).toBeInTheDocument()
    })
  })

  it('applies custom className', () => {
    render(
      <LoadingStateManager className="custom-manager" data={['data']}>
        <div>Content</div>
      </LoadingStateManager>
    )
    
    expect(document.querySelector('.custom-manager')).toBeInTheDocument()
  })
})

describe('useLoadingState', () => {
  function TestComponent({ asyncFunction }) {
    const { loading, error, data, execute, reset, setLoading, setError, setData } = useLoadingState()
    
    return (
      <div>
        <span>Loading: {loading.toString()}</span>
        <span>Error: {error || 'none'}</span>
        <span>Data: {data || 'none'}</span>
        <button onClick={() => execute(asyncFunction)}>Execute</button>
        <button onClick={reset}>Reset</button>
        <button onClick={() => setLoading(true)}>Set Loading</button>
        <button onClick={() => setError('Test error')}>Set Error</button>
        <button onClick={() => setData('Test data')}>Set Data</button>
      </div>
    )
  }

  it('initializes with default state', () => {
    render(<TestComponent />)
    
    expect(screen.getByText('Loading: false')).toBeInTheDocument()
    expect(screen.getByText('Error: none')).toBeInTheDocument()
    expect(screen.getByText('Data: none')).toBeInTheDocument()
  })

  it('executes async function successfully', async () => {
    const mockAsyncFunction = vi.fn().mockResolvedValue('success data')
    
    render(<TestComponent asyncFunction={mockAsyncFunction} />)
    
    const executeButton = screen.getByText('Execute')
    fireEvent.click(executeButton)
    
    // Should show loading
    expect(screen.getByText('Loading: true')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Loading: false')).toBeInTheDocument()
      expect(screen.getByText('Data: success data')).toBeInTheDocument()
      expect(screen.getByText('Error: none')).toBeInTheDocument()
    })
    
    expect(mockAsyncFunction).toHaveBeenCalledTimes(1)
  })

  it('handles async function errors', async () => {
    const mockAsyncFunction = vi.fn().mockRejectedValue(new Error('Async error'))
    
    render(<TestComponent asyncFunction={mockAsyncFunction} />)
    
    const executeButton = screen.getByText('Execute')
    fireEvent.click(executeButton)
    
    await waitFor(() => {
      expect(screen.getByText('Loading: false')).toBeInTheDocument()
      expect(screen.getByText('Error: Async error')).toBeInTheDocument()
      expect(screen.getByText('Data: none')).toBeInTheDocument()
    })
  })

  it('allows manual state updates', () => {
    render(<TestComponent />)
    
    // Set loading
    const setLoadingButton = screen.getByText('Set Loading')
    fireEvent.click(setLoadingButton)
    expect(screen.getByText('Loading: true')).toBeInTheDocument()
    
    // Set error
    const setErrorButton = screen.getByText('Set Error')
    fireEvent.click(setErrorButton)
    expect(screen.getByText('Error: Test error')).toBeInTheDocument()
    expect(screen.getByText('Loading: false')).toBeInTheDocument()
    
    // Set data
    const setDataButton = screen.getByText('Set Data')
    fireEvent.click(setDataButton)
    expect(screen.getByText('Data: Test data')).toBeInTheDocument()
    expect(screen.getByText('Error: none')).toBeInTheDocument()
  })

  it('resets state correctly', () => {
    render(<TestComponent />)
    
    // Set some state
    const setDataButton = screen.getByText('Set Data')
    fireEvent.click(setDataButton)
    expect(screen.getByText('Data: Test data')).toBeInTheDocument()
    
    // Reset
    const resetButton = screen.getByText('Reset')
    fireEvent.click(resetButton)
    
    expect(screen.getByText('Loading: false')).toBeInTheDocument()
    expect(screen.getByText('Error: none')).toBeInTheDocument()
    expect(screen.getByText('Data: none')).toBeInTheDocument()
  })
})

describe('withLoadingState', () => {
  function TestComponent({ data }) {
    return <div>Data: {data ? data.join(', ') : 'none'}</div>
  }

  it('wraps component with loading state manager', () => {
    const WrappedComponent = withLoadingState(TestComponent, {
      loadingType: 'spinner',
      loadingText: 'Loading wrapped component...'
    })
    
    render(
      <WrappedComponent 
        loading={true} 
        data={null}
      />
    )
    
    expect(screen.getByText('Loading wrapped component...')).toBeInTheDocument()
  })

  it('passes data to wrapped component when loaded', () => {
    const WrappedComponent = withLoadingState(TestComponent)
    
    render(
      <WrappedComponent 
        loading={false} 
        data={['item1', 'item2']}
      />
    )
    
    expect(screen.getByText('Data: item1, item2')).toBeInTheDocument()
  })

  it('shows error state when error is present', () => {
    const WrappedComponent = withLoadingState(TestComponent)
    const mockRetry = vi.fn()
    
    render(
      <WrappedComponent 
        loading={false} 
        error="Wrapped component error"
        onRetry={mockRetry}
      />
    )
    
    expect(screen.getByText('Wrapped component error')).toBeInTheDocument()
    
    const retryButton = screen.getByText('Try again')
    fireEvent.click(retryButton)
    
    expect(mockRetry).toHaveBeenCalledTimes(1)
  })

  it('sets correct display name', () => {
    const WrappedComponent = withLoadingState(TestComponent)
    
    expect(WrappedComponent.displayName).toBe('withLoadingState(TestComponent)')
  })
})