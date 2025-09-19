import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SkeletonCard from '../SkeletonCard'

// Integration test to verify SkeletonCard works in a list context
describe('SkeletonCard Integration', () => {
  it('should render multiple skeleton cards in a list', () => {
    render(
      <ul className="grid onecol">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </ul>
    )

    const skeletonCards = screen.getAllByRole('listitem')
    expect(skeletonCards).toHaveLength(3)

    // Each should have the proper structure
    skeletonCards.forEach(card => {
      expect(card).toHaveClass('card')
    })
  })

  it('should work correctly with CSS animations', () => {
    render(<SkeletonCard />)

    // Check that skeleton elements have the proper classes for animation
    const skeletonElements = document.querySelectorAll('.skeleton')
    expect(skeletonElements.length).toBeGreaterThan(0)

    // Verify the shimmer animation classes are applied
    const thumbSkeleton = document.querySelector('.thumb.skeleton')
    expect(thumbSkeleton).toBeInTheDocument()
    
    const textSkeletons = document.querySelectorAll('.skeleton-text')
    expect(textSkeletons.length).toBeGreaterThan(0)
    
    const smallTextSkeleton = document.querySelector('.skeleton-text-sm')
    expect(smallTextSkeleton).toBeInTheDocument()
  })

  it('should maintain proper accessibility in loading state', () => {
    render(
      <div role="main" aria-label="Loading games">
        <ul className="grid onecol">
          <SkeletonCard />
          <SkeletonCard />
        </ul>
      </div>
    )

    const mainElement = screen.getByRole('main')
    expect(mainElement).toHaveAttribute('aria-label', 'Loading games')

    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(2)
  })

  it('should be compatible with existing grid layout', () => {
    const { container } = render(
      <ul className="grid onecol">
        <SkeletonCard />
      </ul>
    )

    const gridElement = container.querySelector('.grid.onecol')
    expect(gridElement).toBeInTheDocument()

    const cardElement = container.querySelector('.card')
    expect(cardElement).toBeInTheDocument()
  })
})