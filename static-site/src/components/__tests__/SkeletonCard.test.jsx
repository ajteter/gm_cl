import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SkeletonCard from '../SkeletonCard'

describe('SkeletonCard', () => {
  it('should render skeleton card structure correctly', () => {
    render(<SkeletonCard />)

    // Check that the main card element is rendered
    const cardElement = screen.getByRole('listitem')
    expect(cardElement).toBeInTheDocument()
    expect(cardElement).toHaveClass('card')
  })

  it('should render media section with skeleton thumbnail', () => {
    render(<SkeletonCard />)

    // Check media container
    const mediaElement = document.querySelector('.media')
    expect(mediaElement).toBeInTheDocument()

    // Check skeleton thumbnail
    const thumbElement = document.querySelector('.thumb.skeleton')
    expect(thumbElement).toBeInTheDocument()
  })

  it('should render content section with skeleton text elements', () => {
    render(<SkeletonCard />)

    // Check content container
    const contentElement = document.querySelector('.content')
    expect(contentElement).toBeInTheDocument()

    // Check skeleton text elements
    const skeletonTextElements = document.querySelectorAll('.skeleton.skeleton-text')
    expect(skeletonTextElements).toHaveLength(2)

    // Check small skeleton text element
    const skeletonTextSmElement = document.querySelector('.skeleton.skeleton-text-sm')
    expect(skeletonTextSmElement).toBeInTheDocument()
  })

  it('should have proper CSS classes for skeleton animation', () => {
    render(<SkeletonCard />)

    // Check that all skeleton elements have the skeleton class
    const allSkeletonElements = document.querySelectorAll('.skeleton')
    expect(allSkeletonElements).toHaveLength(4) // thumb + 2 text + 1 text-sm

    // Verify each skeleton element has the skeleton class
    allSkeletonElements.forEach(element => {
      expect(element).toHaveClass('skeleton')
    })
  })

  it('should render as a list item for proper semantic structure', () => {
    render(<SkeletonCard />)

    const listItem = screen.getByRole('listitem')
    expect(listItem).toBeInTheDocument()
    expect(listItem.tagName).toBe('LI')
  })

  it('should maintain consistent structure with GameCard', () => {
    render(<SkeletonCard />)

    // Should have the same basic structure as GameCard
    const cardElement = screen.getByRole('listitem')
    expect(cardElement).toHaveClass('card')

    // Should have media and content sections
    const mediaElement = document.querySelector('.media')
    const contentElement = document.querySelector('.content')
    
    expect(mediaElement).toBeInTheDocument()
    expect(contentElement).toBeInTheDocument()
  })

  it('should not have any interactive elements', () => {
    render(<SkeletonCard />)

    // Skeleton cards should not have buttons or links
    const buttons = screen.queryAllByRole('button')
    const links = screen.queryAllByRole('link')
    
    expect(buttons).toHaveLength(0)
    expect(links).toHaveLength(0)
  })

  it('should not have any text content', () => {
    render(<SkeletonCard />)

    // Skeleton cards should not display actual text content
    const cardElement = screen.getByRole('listitem')
    expect(cardElement.textContent.trim()).toBe('')
  })
})