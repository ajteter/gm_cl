import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LoadingSpinner, { 
  LoadingDots, 
  LoadingProgressBar, 
  LoadingSkeleton 
} from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveAttribute('aria-label', 'Loading')
  })

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Loading games..." />)
    
    expect(screen.getByText('Loading games...')).toBeInTheDocument()
  })

  it('applies size classes correctly', () => {
    const { rerender } = render(<LoadingSpinner size="small" />)
    expect(document.querySelector('.spinner-small')).toBeInTheDocument()
    
    rerender(<LoadingSpinner size="large" />)
    expect(document.querySelector('.spinner-large')).toBeInTheDocument()
  })

  it('applies color classes correctly', () => {
    const { rerender } = render(<LoadingSpinner color="secondary" />)
    expect(document.querySelector('.spinner-secondary')).toBeInTheDocument()
    
    rerender(<LoadingSpinner color="white" />)
    expect(document.querySelector('.spinner-white')).toBeInTheDocument()
  })

  it('renders inline when specified', () => {
    render(<LoadingSpinner inline={true} />)
    
    expect(document.querySelector('.loading-spinner-container.inline')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-spinner" />)
    
    expect(document.querySelector('.custom-spinner')).toBeInTheDocument()
  })
})

describe('LoadingDots', () => {
  it('renders with default props', () => {
    render(<LoadingDots />)
    
    const dots = screen.getByRole('status')
    expect(dots).toBeInTheDocument()
    expect(dots).toHaveAttribute('aria-label', 'Loading')
  })

  it('renders correct number of dots', () => {
    render(<LoadingDots count={5} />)
    
    const dotElements = document.querySelectorAll('.loading-dot')
    expect(dotElements).toHaveLength(5)
  })

  it('applies animation delays correctly', () => {
    render(<LoadingDots count={3} />)
    
    const dots = document.querySelectorAll('.loading-dot')
    expect(dots[0]).toHaveStyle('animation-delay: 0s')
    expect(dots[1]).toHaveStyle('animation-delay: 0.2s')
    expect(dots[2]).toHaveStyle('animation-delay: 0.4s')
  })

  it('applies size and color classes', () => {
    render(<LoadingDots size="large" color="secondary" />)
    
    expect(document.querySelector('.dots-large')).toBeInTheDocument()
    expect(document.querySelector('.dots-secondary')).toBeInTheDocument()
  })
})

describe('LoadingProgressBar', () => {
  it('renders indeterminate progress bar by default', () => {
    render(<LoadingProgressBar />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
    expect(document.querySelector('.indeterminate')).toBeInTheDocument()
  })

  it('renders determinate progress bar with value', () => {
    render(<LoadingProgressBar progress={75} indeterminate={false} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '75')
    expect(document.querySelector('.determinate')).toBeInTheDocument()
    
    const bar = document.querySelector('.progress-bar')
    expect(bar).toHaveStyle('width: 75%')
  })

  it('shows percentage when enabled', () => {
    render(<LoadingProgressBar progress={50} showPercentage={true} />)
    
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('clamps progress value between 0 and 100', () => {
    const { rerender } = render(<LoadingProgressBar progress={-10} indeterminate={false} />)
    
    let progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '0')
    
    rerender(<LoadingProgressBar progress={150} indeterminate={false} />)
    progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '100')
  })

  it('applies height and color classes', () => {
    render(<LoadingProgressBar height="thick" color="success" />)
    
    expect(document.querySelector('.progress-thick')).toBeInTheDocument()
    expect(document.querySelector('.progress-success')).toBeInTheDocument()
  })
})

describe('LoadingSkeleton', () => {
  it('renders single skeleton line', () => {
    render(<LoadingSkeleton />)
    
    const skeleton = screen.getByRole('status')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveAttribute('aria-label', 'Loading content')
  })

  it('renders multiple skeleton lines', () => {
    render(<LoadingSkeleton lines={3} />)
    
    const skeletons = screen.getAllByRole('status')
    expect(skeletons).toHaveLength(3)
    
    // Last line should be 75% width
    const lastSkeleton = skeletons[skeletons.length - 1]
    expect(lastSkeleton).toHaveStyle('width: 75%')
  })

  it('applies custom dimensions', () => {
    render(<LoadingSkeleton width="200px" height="2rem" />)
    
    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveStyle('width: 200px')
    expect(skeleton).toHaveStyle('height: 2rem')
  })

  it('applies animation class by default', () => {
    render(<LoadingSkeleton />)
    
    expect(document.querySelector('.animated')).toBeInTheDocument()
  })

  it('applies static class when animation disabled', () => {
    render(<LoadingSkeleton animated={false} />)
    
    expect(document.querySelector('.static')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<LoadingSkeleton className="custom-skeleton" />)
    
    expect(document.querySelector('.custom-skeleton')).toBeInTheDocument()
  })
})