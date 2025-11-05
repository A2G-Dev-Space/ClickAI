import { render, screen } from '@testing-library/react'
import LoadingIndicator from '../LoadingIndicator'

describe('LoadingIndicator', () => {
  it('should render loading indicator', () => {
    const { container } = render(<LoadingIndicator />)
    expect(container.querySelector('.flex.items-center.justify-center')).toBeInTheDocument()
  })

  it('should render three dots', () => {
    const { container } = render(<LoadingIndicator />)
    const dots = container.querySelectorAll('.w-2.h-2.bg-primary-600.rounded-full')
    expect(dots).toHaveLength(3)
  })

  it('should have animation classes', () => {
    const { container } = render(<LoadingIndicator />)
    const dots = container.querySelectorAll('.animate-bounce')
    expect(dots.length).toBeGreaterThan(0)
  })
})
