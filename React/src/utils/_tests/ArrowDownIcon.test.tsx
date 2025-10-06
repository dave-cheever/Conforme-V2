import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import ArrowDownIcon from '../../icons/ArrowDownIcon';

// Mock theme
const mockTheme = {
  colors: {},
};

// Mock ChakraProvider wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="001249" theme={mockTheme}>{children}</ChakraProvider>;
}

describe('ArrowDownIcon', () => {
  test('renders without crashing', () => {
    render(
      <TestWrapper data-id="001250">
        <ArrowDownIcon data-id="001251" />
      </TestWrapper>,
    );

    // The icon should be rendered as an SVG
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('renders with correct viewBox', () => {
    render(
      <TestWrapper data-id="001252">
        <ArrowDownIcon data-id="001253" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 14 11');
  });

  test('renders with correct path data', () => {
    render(
      <TestWrapper data-id="001254">
        <ArrowDownIcon data-id="001255" />
      </TestWrapper>,
    );

    const pathElement = document.querySelector('svg path');
    expect(pathElement).toBeInTheDocument();
    expect(pathElement).toHaveAttribute(
      'd',
      'M2.9987 10.8337L5.66536 8.16699H3.66536V0.166992H2.33203V8.16699H0.332031L2.9987 10.8337ZM6.33203 2.83366H12.332V4.16699H6.33203V2.83366ZM6.33203 5.50033H10.9987V6.83366H6.33203V5.50033ZM6.33203 0.166992H13.6654V1.50033H6.33203V0.166992ZM6.33203 8.16699H9.66537V9.50033H6.33203V8.16699Z',
    );
  });

  test('applies fill currentColor by default', () => {
    render(
      <TestWrapper data-id="001256">
        <ArrowDownIcon data-id="001257" />
      </TestWrapper>,
    );

    const pathElement = document.querySelector('svg path');
    expect(pathElement).toHaveAttribute('fill', 'currentColor');
  });

  test('accepts custom props', () => {
    render(
      <TestWrapper data-id="001258">
        <ArrowDownIcon
          data-id="001259"
          boxSize="24px"
          color="red"
          data-testid="custom-arrow-down" />
      </TestWrapper>,
    );

    const customIcon = document.querySelector('svg');
    expect(customIcon).toBeInTheDocument();
  });

  test('accepts color prop', () => {
    render(
      <TestWrapper data-id="001260">
        <ArrowDownIcon data-id="001261" color="blue" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts size props', () => {
    render(
      <TestWrapper data-id="001262">
        <ArrowDownIcon data-id="001263" boxSize="32px" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts className prop', () => {
    render(
      <TestWrapper data-id="001264">
        <ArrowDownIcon data-id="001265" className="custom-class" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveClass('custom-class');
  });

  test('accepts style prop', () => {
    const customStyle = { margin: '10px' };
    render(
      <TestWrapper data-id="001266">
        <ArrowDownIcon data-id="001267" style={customStyle} />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts data attributes', () => {
    render(
      <TestWrapper data-id="001268">
        <ArrowDownIcon data-id="test-arrow-down" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('data-id', 'test-arrow-down');
  });

  test('accepts aria attributes', () => {
    render(
      <TestWrapper data-id="001269">
        <ArrowDownIcon data-id="001270" aria-label="Sort descending" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('aria-label', 'Sort descending');
  });

  test('renders as inline element by default', () => {
    render(
      <TestWrapper data-id="001271">
        <ArrowDownIcon data-id="001272" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('can be used in different contexts', () => {
    render(
      <TestWrapper data-id="001273">
        <div data-id="001274">
          <span data-id="001275">Before</span>
          <ArrowDownIcon data-id="001276" />
          <span data-id="001277">After</span>
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
      <TestWrapper data-id="001278">
        <ArrowDownIcon data-id="001279" boxSize="28px" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 14 11');
  });

  test('handles multiple instances', () => {
    render(
      <TestWrapper data-id="001280">
        <div data-id="001281">
          <ArrowDownIcon data-id="001282" data-testid="arrow-1" />
          <ArrowDownIcon data-id="001283" data-testid="arrow-2" />
          <ArrowDownIcon data-id="001284" data-testid="arrow-3" />
        </div>
      </TestWrapper>,
    );

    const svgElements = document.querySelectorAll('svg');
    expect(svgElements).toHaveLength(3);
  });
});
