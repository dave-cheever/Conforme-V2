import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import ArrowDownSmall from '../../icons/ArrowDownSmall';

// Mock theme
const mockTheme = {
  colors: {},
};

// Test wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="001526" theme={mockTheme}>{children}</ChakraProvider>;
}

describe('ArrowDownSmall', () => {
  test('renders without crashing', () => {
    render(
      <TestWrapper data-id="001527">
        <ArrowDownSmall data-id="001528" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('renders with correct viewBox', () => {
    render(
      <TestWrapper data-id="001529">
        <ArrowDownSmall data-id="001530" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 16 16');
  });

  test('renders with correct path data', () => {
    render(
      <TestWrapper data-id="001531">
        <ArrowDownSmall data-id="001532" />
      </TestWrapper>,
    );

    const pathElement = document.querySelector('svg path');
    expect(pathElement).toBeInTheDocument();
    expect(pathElement).toHaveAttribute('d', 'M4 6L8 10L12 6');
  });

  test('renders with correct stroke attributes', () => {
    render(
      <TestWrapper data-id="001533">
        <ArrowDownSmall data-id="001534" />
      </TestWrapper>,
    );

    const pathElement = document.querySelector('svg path');
    expect(pathElement).toBeInTheDocument();
    expect(pathElement).toHaveAttribute('fill', 'none');
    expect(pathElement).toHaveAttribute('stroke', 'currentColor');
  });

  test('accepts custom props', () => {
    render(
      <TestWrapper data-id="001535">
        <ArrowDownSmall
          data-id="001536"
          boxSize="24px"
          color="red"
          data-testid="custom-arrow-down" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts color prop', () => {
    render(
      <TestWrapper data-id="001537">
        <ArrowDownSmall data-id="001538" color="blue" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts size props', () => {
    render(
      <TestWrapper data-id="001539">
        <ArrowDownSmall data-id="001540" boxSize="32px" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts className prop', () => {
    render(
      <TestWrapper data-id="001541">
        <ArrowDownSmall data-id="001542" className="custom-class" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveClass('custom-class');
  });

  test('accepts style prop', () => {
    const customStyle = { margin: '10px' };
    render(
      <TestWrapper data-id="001543">
        <ArrowDownSmall data-id="001544" style={customStyle} />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts data attributes', () => {
    render(
      <TestWrapper data-id="001545">
        <ArrowDownSmall data-id="001546" data-testid="test-arrow-down" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('data-testid', 'test-arrow-down');
  });

  test('accepts aria attributes', () => {
    render(
      <TestWrapper data-id="001547">
        <ArrowDownSmall data-id="001548" aria-label="Expand section" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('aria-label', 'Expand section');
  });

  test('renders as inline element by default', () => {
    render(
      <TestWrapper data-id="001549">
        <ArrowDownSmall data-id="001550" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('can be used in different contexts', () => {
    render(
      <TestWrapper data-id="001551">
        <div data-id="001552">
          <span data-id="001553">Before</span>
          <ArrowDownSmall data-id="001554" />
          <span data-id="001555">After</span>
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
      <TestWrapper data-id="001556">
        <ArrowDownSmall data-id="001557" boxSize="28px" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 16 16');
  });

  test('handles multiple instances', () => {
    render(
      <TestWrapper data-id="001558">
        <div data-id="001559">
          <ArrowDownSmall data-id="001560" data-testid="arrow-1" />
          <ArrowDownSmall data-id="001561" data-testid="arrow-2" />
          <ArrowDownSmall data-id="001562" data-testid="arrow-3" />
        </div>
      </TestWrapper>,
    );

    const svgElements = document.querySelectorAll('svg');
    expect(svgElements).toHaveLength(3);
  });

  test('has correct display name', () => {
    expect(ArrowDownSmall.displayName).toBe('ArrowDownSmall');
  });

  test('renders with correct geometric properties', () => {
    render(
      <TestWrapper data-id="001563">
        <ArrowDownSmall data-id="001564" />
      </TestWrapper>,
    );

    const pathElement = document.querySelector('svg path');
    // The path should create a downward-pointing arrow
    // M4 6L8 10L12 6 creates a V-shape pointing down
    expect(pathElement).toHaveAttribute('d', 'M4 6L8 10L12 6');
  });

  test('inherits color from parent', () => {
    render(
      <TestWrapper data-id="001565">
        <div data-id="001566" style={{ color: 'green' }}>
          <ArrowDownSmall data-id="001567" />
        </div>
      </TestWrapper>,
    );

    const pathElement = document.querySelector('svg path');
    expect(pathElement).toHaveAttribute('stroke', 'currentColor');
  });

  test('handles click events', () => {
    const handleClick = vi.fn();

    render(
      <TestWrapper data-id="001568">
        <ArrowDownSmall data-id="001569" onClick={handleClick} />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('renders with focus attributes', () => {
    render(
      <TestWrapper data-id="001570">
        <ArrowDownSmall data-id="001571" tabIndex={0} />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('handles different stroke widths', () => {
    render(
      <TestWrapper data-id="001572">
        <ArrowDownSmall data-id="001573" strokeWidth="3" />
      </TestWrapper>,
    );

    const pathElement = document.querySelector('svg path');
    expect(pathElement).toBeInTheDocument();
  });

  test('renders consistently across multiple renders', () => {
    const { rerender } = render(
      <TestWrapper data-id="001574">
        <ArrowDownSmall data-id="001575" />
      </TestWrapper>,
    );

    const firstRender = document.querySelector('svg');

    rerender(
      <TestWrapper data-id="001576">
        <ArrowDownSmall data-id="001577" />
      </TestWrapper>,
    );

    const secondRender = document.querySelector('svg');
    expect(firstRender?.outerHTML).toBe(secondRender?.outerHTML);
  });
});
