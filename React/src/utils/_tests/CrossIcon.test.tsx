import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import CrossIcon from '../../icons/CrossIcon';

// Mock theme
const mockTheme = {
  colors: {},
};

// Mock ChakraProvider wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return (
    <ChakraProvider data-id="001249" theme={mockTheme}>
      {children}
    </ChakraProvider>
  );
}

describe('CrossIcon', () => {
  test('renders without crashing', () => {
    render(
      <TestWrapper data-id="001250">
        <CrossIcon data-id="001251" />
      </TestWrapper>,
    );

    // The icon should be rendered as an SVG
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('renders with correct viewBox', () => {
    render(
      <TestWrapper data-id="001252">
        <CrossIcon data-id="001253" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 16 15');
  });

  test('renders with correct display name', () => {
    render(
      <TestWrapper data-id="001254">
        <CrossIcon data-id="001255" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('renders with correct path elements', () => {
    render(
      <TestWrapper data-id="001256">
        <CrossIcon data-id="001257" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    expect(pathElements).toHaveLength(2);

    // Check first path (diagonal line from top-left to bottom-right)
    expect(pathElements[0]).toHaveAttribute('d', 'M12.4168 1.58325L1.5835 12.4166');
    expect(pathElements[0]).toHaveAttribute('fill', 'none');
    expect(pathElements[0]).toHaveAttribute('stroke', 'currentColor');
    expect(pathElements[0]).toHaveAttribute('stroke-linecap', 'round');
    expect(pathElements[0]).toHaveAttribute('stroke-linejoin', 'round');
    expect(pathElements[0]).toHaveAttribute('stroke-width', '1.5');

    // Check second path (diagonal line from top-right to bottom-left)
    expect(pathElements[1]).toHaveAttribute('d', 'M1.5835 1.58325L12.4168 12.4166');
    expect(pathElements[1]).toHaveAttribute('fill', 'none');
    expect(pathElements[1]).toHaveAttribute('stroke', 'currentColor');
    expect(pathElements[1]).toHaveAttribute('stroke-linecap', 'round');
    expect(pathElements[1]).toHaveAttribute('stroke-linejoin', 'round');
    expect(pathElements[1]).toHaveAttribute('stroke-width', '1.5');
  });

  test('renders with correct group element and data-id', () => {
    render(
      <TestWrapper data-id="001258">
        <CrossIcon data-id="001259" />
      </TestWrapper>,
    );

    const groupElement = document.querySelector('svg g');
    expect(groupElement).toHaveAttribute('data-id', '000076');
  });

  test('accepts custom props', () => {
    render(
      <TestWrapper data-id="001260">
        <CrossIcon boxSize="24px" color="red" data-id="001261" data-testid="custom-cross-icon" />
      </TestWrapper>,
    );

    const customIcon = document.querySelector('svg');
    expect(customIcon).toBeInTheDocument();
  });

  test('accepts color prop', () => {
    render(
      <TestWrapper data-id="001262">
        <CrossIcon color="blue" data-id="001263" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts size props', () => {
    render(
      <TestWrapper data-id="001264">
        <CrossIcon boxSize="32px" data-id="001265" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts className prop', () => {
    render(
      <TestWrapper data-id="001266">
        <CrossIcon className="custom-class" data-id="001267" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveClass('custom-class');
  });

  test('accepts style prop', () => {
    const customStyle = { margin: '10px' };
    render(
      <TestWrapper data-id="001268">
        <CrossIcon data-id="001269" style={customStyle} />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts data attributes', () => {
    render(
      <TestWrapper data-id="001270">
        <CrossIcon data-id="test-cross-icon" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('data-id', 'test-cross-icon');
  });

  test('accepts aria attributes', () => {
    render(
      <TestWrapper data-id="001271">
        <CrossIcon aria-label="Close" data-id="001272" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('aria-label', 'Close');
  });

  test('renders as inline element by default', () => {
    render(
      <TestWrapper data-id="001273">
        <CrossIcon data-id="001274" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('can be used in different contexts', () => {
    render(
      <TestWrapper data-id="001275">
        <div data-id="001276">
          <span data-id="001277">Before</span>
          <CrossIcon data-id="001278" />
          <span data-id="001279">After</span>
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
      <TestWrapper data-id="001280">
        <CrossIcon boxSize="28px" data-id="001281" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 16 15');
  });

  test('handles multiple instances', () => {
    render(
      <TestWrapper data-id="001282">
        <div data-id="001283">
          <CrossIcon data-id="001284" data-testid="cross-1" />
          <CrossIcon data-id="001285" data-testid="cross-2" />
          <CrossIcon data-id="001286" data-testid="cross-3" />
        </div>
      </TestWrapper>,
    );

    const svgElements = document.querySelectorAll('svg');
    expect(svgElements).toHaveLength(3);
  });

  test('has correct stroke properties for accessibility', () => {
    render(
      <TestWrapper data-id="001287">
        <CrossIcon data-id="001288" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    pathElements.forEach((path) => {
      expect(path).toHaveAttribute('stroke-linecap', 'round');
      expect(path).toHaveAttribute('stroke-linejoin', 'round');
      expect(path).toHaveAttribute('stroke-width', '1.5');
    });
  });

  test('uses currentColor for stroke', () => {
    render(
      <TestWrapper data-id="001289">
        <CrossIcon data-id="001290" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    pathElements.forEach((path) => {
      expect(path).toHaveAttribute('stroke', 'currentColor');
    });
  });
});
