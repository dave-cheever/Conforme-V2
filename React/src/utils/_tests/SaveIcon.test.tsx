import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import SaveIcon from '../../icons/SaveIcon';

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

describe('SaveIcon', () => {
  test('renders without crashing', () => {
    render(
      <TestWrapper data-id="001250">
        <SaveIcon data-id="001251" />
      </TestWrapper>,
    );

    // The icon should be rendered as an SVG
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('renders with correct viewBox', () => {
    render(
      <TestWrapper data-id="001252">
        <SaveIcon data-id="001253" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 24 24');
  });

  test('renders with correct path elements', () => {
    render(
      <TestWrapper data-id="001256">
        <SaveIcon data-id="001257" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    expect(pathElements).toHaveLength(3);

    // Check first path (document outline)
    expect(pathElements[0]).toHaveAttribute(
      'd',
      'M21.5333 23H2.46667C2.07768 23 1.70463 22.8455 1.42958 22.5704C1.15452 22.2954 1 21.9223 1 21.5333V7.34871C1.00017 6.57081 1.30932 5.82482 1.85947 5.27484L5.27387 1.85947C5.54631 1.58695 5.86977 1.37077 6.22578 1.2233C6.58179 1.07583 6.96337 0.999954 7.34871 1H21.5333C21.9223 1 22.2954 1.15452 22.5704 1.42958C22.8455 1.70463 23 2.07768 23 2.46667V21.5333C23 21.9223 22.8455 22.2954 22.5704 22.5704C22.2954 22.8455 21.9223 23 21.5333 23Z',
    );
    expect(pathElements[0]).toHaveAttribute('fill', 'none');
    expect(pathElements[0]).toHaveAttribute('stroke', 'currentColor');
    expect(pathElements[0]).toHaveAttribute('stroke-linecap', 'round');
    expect(pathElements[0]).toHaveAttribute('stroke-linejoin', 'round');
    expect(pathElements[0]).toHaveAttribute('stroke-width', '1.5');

    // Check second path (floppy disk center circle)
    expect(pathElements[1]).toHaveAttribute(
      'd',
      'M9.79999 12.7333C9.79999 13.5113 10.109 14.2574 10.6591 14.8075C11.2092 15.3576 11.9554 15.6667 12.7333 15.6667C13.5113 15.6667 14.2574 15.3576 14.8075 14.8075C15.3576 14.2574 15.6667 13.5113 15.6667 12.7333C15.6667 11.9554 15.3576 11.2093 14.8075 10.6592C14.2574 10.109 13.5113 9.8 12.7333 9.8C11.9554 9.8 11.2092 10.109 10.6591 10.6592C10.109 11.2093 9.79999 11.9554 9.79999 12.7333Z',
    );
    expect(pathElements[1]).toHaveAttribute('fill', 'none');
    expect(pathElements[1]).toHaveAttribute('stroke', 'currentColor');
    expect(pathElements[1]).toHaveAttribute('stroke-linecap', 'round');
    expect(pathElements[1]).toHaveAttribute('stroke-linejoin', 'round');
    expect(pathElements[1]).toHaveAttribute('stroke-width', '1.5');

    // Check third path (floppy disk tab)
    expect(pathElements[2]).toHaveAttribute(
      'd',
      'M8.33334 1V3.93333C8.33334 4.32232 8.48787 4.69537 8.76292 4.97042C9.03797 5.24548 9.41103 5.4 9.80001 5.4H17.1333C17.5223 5.4 17.8954 5.24548 18.1704 4.97042C18.4455 4.69537 18.6 4.32232 18.6 3.93333V1',
    );
    expect(pathElements[2]).toHaveAttribute('fill', 'none');
    expect(pathElements[2]).toHaveAttribute('stroke', 'currentColor');
    expect(pathElements[2]).toHaveAttribute('stroke-linecap', 'round');
    expect(pathElements[2]).toHaveAttribute('stroke-linejoin', 'round');
    expect(pathElements[2]).toHaveAttribute('stroke-width', '1.5');
  });

  test('has correct data-id attributes on path elements', () => {
    render(
      <TestWrapper data-id="001258">
        <SaveIcon data-id="001259" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    expect(pathElements[0]).toHaveAttribute('data-id', '001060');
    expect(pathElements[1]).toHaveAttribute('data-id', '001061');
    expect(pathElements[2]).toHaveAttribute('data-id', '001062');
  });

  test('accepts custom props', () => {
    render(
      <TestWrapper data-id="001260">
        <SaveIcon boxSize="24px" color="red" data-id="001261" data-testid="custom-save-icon" />
      </TestWrapper>,
    );

    const customIcon = document.querySelector('svg');
    expect(customIcon).toBeInTheDocument();
  });

  test('accepts color prop', () => {
    render(
      <TestWrapper data-id="001262">
        <SaveIcon color="blue" data-id="001263" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts size props', () => {
    render(
      <TestWrapper data-id="001264">
        <SaveIcon boxSize="32px" data-id="001265" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts className prop', () => {
    render(
      <TestWrapper data-id="001266">
        <SaveIcon className="custom-class" data-id="001267" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveClass('custom-class');
  });

  test('accepts style prop', () => {
    const customStyle = { margin: '10px' };
    render(
      <TestWrapper data-id="001268">
        <SaveIcon data-id="001269" style={customStyle} />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts data attributes', () => {
    render(
      <TestWrapper data-id="001270">
        <SaveIcon data-id="test-save-icon" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('data-id', 'test-save-icon');
  });

  test('accepts aria attributes', () => {
    render(
      <TestWrapper data-id="001271">
        <SaveIcon aria-label="Save" data-id="001272" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('aria-label', 'Save');
  });

  test('renders as inline element by default', () => {
    render(
      <TestWrapper data-id="001273">
        <SaveIcon data-id="001274" />
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
          <SaveIcon data-id="001278" />
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
        <SaveIcon boxSize="28px" data-id="001281" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 24 24');
  });

  test('handles multiple instances', () => {
    render(
      <TestWrapper data-id="001282">
        <div data-id="001283">
          <SaveIcon data-id="001284" data-testid="save-1" />
          <SaveIcon data-id="001285" data-testid="save-2" />
          <SaveIcon data-id="001286" data-testid="save-3" />
        </div>
      </TestWrapper>,
    );

    const svgElements = document.querySelectorAll('svg');
    expect(svgElements).toHaveLength(3);
  });

  test('has correct stroke properties for accessibility', () => {
    render(
      <TestWrapper data-id="001287">
        <SaveIcon data-id="001288" />
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
        <SaveIcon data-id="001290" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    pathElements.forEach((path) => {
      expect(path).toHaveAttribute('stroke', 'currentColor');
    });
  });

  test('creates a proper floppy disk save icon shape', () => {
    render(
      <TestWrapper data-id="001291">
        <SaveIcon data-id="001292" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');

    // Should have 3 path elements representing the floppy disk icon
    expect(pathElements).toHaveLength(3);

    // All paths should have no fill and use stroke
    pathElements.forEach((path) => {
      expect(path).toHaveAttribute('fill', 'none');
      expect(path).toHaveAttribute('stroke', 'currentColor');
    });
  });

  test('accepts stroke prop for custom stroke color', () => {
    render(
      <TestWrapper data-id="001293">
        <SaveIcon data-id="001294" stroke="white" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    pathElements.forEach((path) => {
      expect(path).toHaveAttribute('stroke', 'currentColor');
    });
  });

  test('accepts fill prop for custom fill color', () => {
    render(
      <TestWrapper data-id="001295">
        <SaveIcon data-id="001296" fill="red" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    pathElements.forEach((path) => {
      expect(path).toHaveAttribute('fill', 'none');
    });
  });
});
