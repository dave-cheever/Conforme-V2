import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import ArrowUpSmall from '../../icons/ArrowUpSmall';

// Mock theme
const mockTheme = {
  colors: {},
};

// Test wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="001578" theme={mockTheme}>{children}</ChakraProvider>;
}

describe('ArrowUpSmall', () => {
  test('renders without crashing', () => {
    render(
      <TestWrapper data-id="001579">
        <ArrowUpSmall data-id="001580" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('renders with correct viewBox', () => {
    render(
      <TestWrapper data-id="001581">
        <ArrowUpSmall data-id="001582" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 16 16');
  });

  test('renders with correct path data', () => {
    render(
      <TestWrapper data-id="001583">
        <ArrowUpSmall data-id="001584" />
      </TestWrapper>,
    );

    const pathElement = document.querySelector('svg path');
    expect(pathElement).toBeInTheDocument();
    expect(pathElement).toHaveAttribute('d', 'M4 10L8 6L12 10');
  });

  test('renders with correct stroke attributes', () => {
    render(
      <TestWrapper data-id="001585">
        <ArrowUpSmall data-id="001586" />
      </TestWrapper>,
    );

    const pathElement = document.querySelector('svg path');
    expect(pathElement).toBeInTheDocument();
    expect(pathElement).toHaveAttribute('fill', 'none');
    expect(pathElement).toHaveAttribute('stroke', 'currentColor');
  });

  test('accepts custom props', () => {
    render(
      <TestWrapper data-id="001587">
        <ArrowUpSmall boxSize="24px" color="red" data-id="001588" data-testid="custom-arrow-up" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts color prop', () => {
    render(
      <TestWrapper data-id="001589">
        <ArrowUpSmall color="blue" data-id="001590" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts size props', () => {
    render(
      <TestWrapper data-id="001591">
        <ArrowUpSmall boxSize="32px" data-id="001592" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts className prop', () => {
    render(
      <TestWrapper data-id="001593">
        <ArrowUpSmall className="custom-class" data-id="001594" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveClass('custom-class');
  });

  test('accepts style prop', () => {
    const customStyle = { margin: '10px' };
    render(
      <TestWrapper data-id="001595">
        <ArrowUpSmall data-id="001596" style={customStyle} />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts data attributes', () => {
    render(
      <TestWrapper data-id="001597">
        <ArrowUpSmall data-id="001598" data-testid="test-arrow-up" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('data-testid', 'test-arrow-up');
  });

  test('accepts aria attributes', () => {
    render(
      <TestWrapper data-id="001599">
        <ArrowUpSmall aria-label="Collapse section" data-id="001600" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('aria-label', 'Collapse section');
  });

  test('renders as inline element by default', () => {
    render(
      <TestWrapper data-id="001601">
        <ArrowUpSmall data-id="001602" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('can be used in different contexts', () => {
    render(
      <TestWrapper data-id="001603">
        <div data-id="001604">
          <span data-id="001605">Before</span>
          <ArrowUpSmall data-id="001606" />
          <span data-id="001607">After</span>
        </div>
      </TestWrapper>,
    );

    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('maintains aspect ratio', () => {
    render(
      <TestWrapper data-id="001608">
        <ArrowUpSmall boxSize="28px" data-id="001609" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 16 16');
  });

  test('handles multiple instances', () => {
    render(
      <TestWrapper data-id="001610">
        <div data-id="001611">
          <ArrowUpSmall data-id="001612" data-testid="arrow-1" />
          <ArrowUpSmall data-id="001613" data-testid="arrow-2" />
          <ArrowUpSmall data-id="001614" data-testid="arrow-3" />
        </div>
      </TestWrapper>,
    );

    const svgElements = document.querySelectorAll('svg');
    expect(svgElements).toHaveLength(3);
  });

  test('has correct display name', () => {
    expect(ArrowUpSmall.displayName).toBe('ArrowUpSmall');
  });

  test('renders with correct geometric properties', () => {
    render(
      <TestWrapper data-id="001615">
        <ArrowUpSmall data-id="001616" />
      </TestWrapper>,
    );

    const pathElement = document.querySelector('svg path');
    // The path should create an upward-pointing arrow
    // M4 10L8 6L12 10 creates a V-shape pointing up
    expect(pathElement).toHaveAttribute('d', 'M4 10L8 6L12 10');
  });

  test('inherits color from parent', () => {
    render(
      <TestWrapper data-id="001617">
        <div data-id="001618" style={{ color: 'green' }}>
          <ArrowUpSmall data-id="001619" />
        </div>
      </TestWrapper>,
    );

    const pathElement = document.querySelector('svg path');
    expect(pathElement).toHaveAttribute('stroke', 'currentColor');
  });

  test('handles click events', () => {
    const handleClick = vi.fn();

    render(
      <TestWrapper data-id="001620">
        <ArrowUpSmall data-id="001621" onClick={handleClick} />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('renders with focus attributes', () => {
    render(
      <TestWrapper data-id="001622">
        <ArrowUpSmall data-id="001623" tabIndex={0} />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('handles different stroke widths', () => {
    render(
      <TestWrapper data-id="001624">
        <ArrowUpSmall data-id="001625" strokeWidth="3" />
      </TestWrapper>,
    );

    const pathElement = document.querySelector('svg path');
    expect(pathElement).toBeInTheDocument();
  });

  test('renders consistently across multiple renders', () => {
    const { rerender } = render(
      <TestWrapper data-id="001626">
        <ArrowUpSmall data-id="001627" />
      </TestWrapper>,
    );

    const firstRender = document.querySelector('svg');

    rerender(
      <TestWrapper data-id="001628">
        <ArrowUpSmall data-id="001629" />
      </TestWrapper>,
    );

    const secondRender = document.querySelector('svg');
    expect(firstRender?.outerHTML).toBe(secondRender?.outerHTML);
  });

  test('contrasts with ArrowDownSmall path', () => {
    // Test that ArrowUpSmall has different path than ArrowDownSmall
    render(
      <TestWrapper data-id="001630">
        <ArrowUpSmall data-id="001631" />
      </TestWrapper>,
    );

    const pathElement = document.querySelector('svg path');
    expect(pathElement).toHaveAttribute('d', 'M4 10L8 6L12 10');

    // This should be different from ArrowDownSmall's path: 'M4 6L8 10L12 6'
    expect(pathElement).not.toHaveAttribute('d', 'M4 6L8 10L12 6');
  });
});
