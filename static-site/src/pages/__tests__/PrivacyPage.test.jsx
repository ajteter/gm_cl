import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import PrivacyPage from '../PrivacyPage'

// Mock the useSEO hook
vi.mock('../../hooks/useSEO', () => ({
  usePrivacySEO: vi.fn()
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('PrivacyPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the privacy policy page', () => {
    renderWithRouter(<PrivacyPage />)

    expect(screen.getByText('Privacy Policy & Disclaimer')).toBeInTheDocument()
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
  })

  it('renders the last updated date', () => {
    renderWithRouter(<PrivacyPage />)

    expect(screen.getByText(/Last updated: August 28, 2025/)).toBeInTheDocument()
  })

  it('renders main sections', () => {
    renderWithRouter(<PrivacyPage />)

    // Check for main section headings
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
    expect(screen.getByText('Disclaimer')).toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    renderWithRouter(<PrivacyPage />)

    expect(screen.getAllByRole('heading')).toHaveLength(3) // h1 + 2 h2s
  })

  it('has proper CSS classes applied', () => {
    const { container } = renderWithRouter(<PrivacyPage />)

    expect(container.querySelector('.container')).toBeInTheDocument()
  })

  it('contains important privacy information', () => {
    renderWithRouter(<PrivacyPage />)

    // Check for key privacy concepts
    expect(screen.getByText(/We and our advertising partners use cookies/)).toBeInTheDocument()
    expect(screen.getByText(/By using our website, you hereby consent/)).toBeInTheDocument()
  })

  it('includes disclaimer information', () => {
    renderWithRouter(<PrivacyPage />)

    expect(screen.getByText(/The games provided on this website are sourced from third-party sites/)).toBeInTheDocument()
    expect(screen.getByText(/This website acts as an aggregator/)).toBeInTheDocument()
  })
})