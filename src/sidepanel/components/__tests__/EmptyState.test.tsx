import { render, screen } from '@testing-library/react'
import EmptyState from '../EmptyState'

describe('EmptyState', () => {
  it('should render title and description', () => {
    render(<EmptyState title="No Data" description="Nothing to show" />)
    expect(screen.getByText('No Data')).toBeInTheDocument()
    expect(screen.getByText('Nothing to show')).toBeInTheDocument()
  })

  it('should render icon when provided', () => {
    const icon = <div data-testid="custom-icon">📋</div>
    render(<EmptyState title="Title" description="Description" icon={icon} />)
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('should not render icon when not provided', () => {
    const { container } = render(<EmptyState title="Title" description="Description" />)
    const iconContainer = container.querySelector('.mb-4.flex.justify-center')
    expect(iconContainer).not.toBeInTheDocument()
  })

  it('should have proper styling classes', () => {
    const { container } = render(<EmptyState title="Title" description="Description" />)
    expect(container.querySelector('.flex.items-center.justify-center.h-full')).toBeInTheDocument()
    expect(container.querySelector('.text-center.p-8')).toBeInTheDocument()
  })
})
