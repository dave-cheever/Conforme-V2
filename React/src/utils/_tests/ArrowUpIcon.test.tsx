import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import ArrowUpIcon from '../../icons/ArrowUpIcon';

// Mock theme
const mockTheme = {
  colors: {},
};

// Mock ChakraProvider wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="001213" theme={mockTheme}>{children}</ChakraProvider>;
}

describe('ArrowUpIcon', () => {
  test('renders without crashing', () => {
    render(
      <TestWrapper data-id="001214">
        <ArrowUpIcon data-id="001215" />
      </TestWrapper>,
    );

    // The icon should be rendered as an SVG
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('renders with correct viewBox', () => {
    render(
      <TestWrapper data-id="001216">
        <ArrowUpIcon data-id="001217" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 14 11');
  });

  test('renders with correct path data', () => {
    render(
      <TestWrapper data-id="001218">
        <ArrowUpIcon data-id="001219" />
      </TestWrapper>,
    );

    const pathElement = document.querySelector('svg path');
    expect(pathElement).toBeInTheDocument();
    expect(pathElement).toHaveAttribute(
      'd',
      'M6.33203 3.50033H12.332V4.83366H6.33203V3.50033ZM6.33203 6.16699H10.9987V7.50033H6.33203V6.16699ZM6.33203 0.833659H13.6654V2.16699H6.33203V0.833659ZM6.33203 8.83366H9.66537V10.167H6.33203V8.83366ZM2.33203 10.8337H3.66536V2.83366H5.66536L2.9987 0.166992L0.332031 2.83366H2.33203V10.8337Z',
    );
  });

  test('applies fill currentColor by default', () => {
    render(
      <TestWrapper data-id="001220">
        <ArrowUpIcon data-id="001221" />
      </TestWrapper>,
    );

    const pathElement = document.querySelector('svg path');
    expect(pathElement).toHaveAttribute('fill', 'currentColor');
  });

  test('accepts custom props', () => {
    render(
      <TestWrapper data-id="001222">
        <ArrowUpIcon data-id="001223" boxSize="24px" color="red" data-testid="custom-arrow-up" />
      </TestWrapper>,
    );

    const customIcon = document.querySelector('svg');
    expect(customIcon).toBeInTheDocument();
  });

  test('accepts color prop', () => {
    render(
      <TestWrapper data-id="001224">
        <ArrowUpIcon data-id="001225" color="blue" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts size props', () => {
    render(
      <TestWrapper data-id="001226">
        <ArrowUpIcon data-id="001227" boxSize="32px" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts className prop', () => {
    render(
      <TestWrapper data-id="001228">
        <ArrowUpIcon data-id="001229" className="custom-class" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveClass('custom-class');
  });

  test('accepts style prop', () => {
    const customStyle = { margin: '10px' };
    render(
      <TestWrapper data-id="001230">
        <ArrowUpIcon data-id="001231" style={customStyle} />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts data attributes', () => {
    render(
      <TestWrapper data-id="001232">
        <ArrowUpIcon data-id="test-arrow-up" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('data-id', 'test-arrow-up');
  });

  test('accepts aria attributes', () => {
    render(
      <TestWrapper data-id="001233">
        <ArrowUpIcon data-id="001234" aria-label="Sort ascending" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('aria-label', 'Sort ascending');
  });

  test('renders as inline element by default', () => {
    render(
      <TestWrapper data-id="001235">
        <ArrowUpIcon data-id="001236" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('can be used in different contexts', () => {
    render(
      <TestWrapper data-id="001237">
        <div data-id="001238">
          <span data-id="001239">Before</span>
          <ArrowUpIcon data-id="001240" />
          <span data-id="001241">After</span>
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
      <TestWrapper data-id="001242">
        <ArrowUpIcon data-id="001243" boxSize="28px" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 14 11');
  });

  test('handles multiple instances', () => {
    render(
      <TestWrapper data-id="001244">
        <div data-id="001245">
          <ArrowUpIcon data-id="001246" data-testid="arrow-1" />
          <ArrowUpIcon data-id="001247" data-testid="arrow-2" />
          <ArrowUpIcon data-id="001248" data-testid="arrow-3" />
        </div>
      </TestWrapper>,
    );

    const svgElements = document.querySelectorAll('svg');
    expect(svgElements).toHaveLength(3);
  });
});
