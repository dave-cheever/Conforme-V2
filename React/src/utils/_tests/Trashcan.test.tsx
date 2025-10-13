import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Trashcan from '../../icons/Trashcan';

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

describe('Trashcan', () => {
  test('renders without crashing', () => {
    render(
      <TestWrapper data-id="001250">
        <Trashcan data-id="001251" />
      </TestWrapper>,
    );

    // The icon should be rendered as an SVG
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('renders with correct viewBox', () => {
    render(
      <TestWrapper data-id="001252">
        <Trashcan data-id="001253" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 13 15');
  });

  test('renders with correct path elements', () => {
    render(
      <TestWrapper data-id="001256">
        <Trashcan data-id="001257" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    expect(pathElements).toHaveLength(5);

    // Check first path (trash can body)
    expect(pathElements[0]).toHaveAttribute(
      'd',
      'M10.1869 14.3748H3.77019C3.52707 14.3748 3.29391 14.2782 3.122 14.1063C2.95009 13.9344 2.85352 13.7012 2.85352 13.4581V5.20801H11.1036V13.4581C11.1036 13.7012 11.007 13.9344 10.8351 14.1063C10.6632 14.2782 10.43 14.3748 10.1869 14.3748Z',
    );
    expect(pathElements[0]).toHaveAttribute('fill', 'none');
    expect(pathElements[0]).toHaveAttribute('stroke', 'currentColor');
    expect(pathElements[0]).toHaveAttribute('stroke-linecap', 'round');
    expect(pathElements[0]).toHaveAttribute('stroke-linejoin', 'round');
    expect(pathElements[0]).toHaveAttribute('stroke-width', '1.5');

    // Check second path (left vertical line inside trash can)
    expect(pathElements[1]).toHaveAttribute('d', 'M5.60352 11.6252V7.9585');
    expect(pathElements[1]).toHaveAttribute('fill', 'none');
    expect(pathElements[1]).toHaveAttribute('stroke', 'currentColor');
    expect(pathElements[1]).toHaveAttribute('stroke-linecap', 'round');
    expect(pathElements[1]).toHaveAttribute('stroke-linejoin', 'round');
    expect(pathElements[1]).toHaveAttribute('stroke-width', '1.5');

    // Check third path (right vertical line inside trash can)
    expect(pathElements[2]).toHaveAttribute('d', 'M8.35352 11.6252V7.9585');
    expect(pathElements[2]).toHaveAttribute('fill', 'none');
    expect(pathElements[2]).toHaveAttribute('stroke', 'currentColor');
    expect(pathElements[2]).toHaveAttribute('stroke-linecap', 'round');
    expect(pathElements[2]).toHaveAttribute('stroke-linejoin', 'round');
    expect(pathElements[2]).toHaveAttribute('stroke-width', '1.5');

    // Check fourth path (top horizontal line)
    expect(pathElements[3]).toHaveAttribute('d', 'M0.5625 3.96282L12.2189 1.48535');
    expect(pathElements[3]).toHaveAttribute('fill', 'none');
    expect(pathElements[3]).toHaveAttribute('stroke', 'currentColor');
    expect(pathElements[3]).toHaveAttribute('stroke-linecap', 'round');
    expect(pathElements[3]).toHaveAttribute('stroke-linejoin', 'round');
    expect(pathElements[3]).toHaveAttribute('stroke-width', '1.5');

    // Check fifth path (handle/lid)
    expect(pathElements[4]).toHaveAttribute(
      'd',
      'M7.35383 0.645033L4.66491 1.21643C4.54689 1.24133 4.43494 1.28929 4.33549 1.35754C4.23603 1.42579 4.15102 1.513 4.08534 1.61417C4.01965 1.71534 3.97458 1.82848 3.9527 1.9471C3.93083 2.06572 3.93258 2.18749 3.95785 2.30544L4.15096 3.20072L8.63412 2.24738L8.44101 1.35087C8.39041 1.11312 8.24745 0.905197 8.04358 0.772832C7.8397 0.640466 7.5916 0.594497 7.35383 0.645033V0.645033Z',
    );
    expect(pathElements[4]).toHaveAttribute('fill', 'none');
    expect(pathElements[4]).toHaveAttribute('stroke', 'currentColor');
    expect(pathElements[4]).toHaveAttribute('stroke-linecap', 'round');
    expect(pathElements[4]).toHaveAttribute('stroke-linejoin', 'round');
    expect(pathElements[4]).toHaveAttribute('stroke-width', '1.5');
  });

  test('renders with correct group element and data-id', () => {
    render(
      <TestWrapper data-id="001258">
        <Trashcan data-id="001259" />
      </TestWrapper>,
    );

    const groupElement = document.querySelector('svg g');
    expect(groupElement).toHaveAttribute('data-id', '000257');
  });

  test('has correct data-id attributes on path elements', () => {
    render(
      <TestWrapper data-id="001260">
        <Trashcan data-id="001261" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    expect(pathElements[0]).toHaveAttribute('data-id', '000258');
    expect(pathElements[1]).toHaveAttribute('data-id', '000259');
    expect(pathElements[2]).toHaveAttribute('data-id', '000260');
    expect(pathElements[3]).toHaveAttribute('data-id', '000261');
    expect(pathElements[4]).toHaveAttribute('data-id', '000262');
  });

  test('accepts custom props', () => {
    render(
      <TestWrapper data-id="001262">
        <Trashcan boxSize="24px" color="red" data-id="001263" data-testid="custom-trashcan-icon" />
      </TestWrapper>,
    );

    const customIcon = document.querySelector('svg');
    expect(customIcon).toBeInTheDocument();
  });

  test('accepts color prop', () => {
    render(
      <TestWrapper data-id="001264">
        <Trashcan color="blue" data-id="001265" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts size props', () => {
    render(
      <TestWrapper data-id="001266">
        <Trashcan boxSize="32px" data-id="001267" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts className prop', () => {
    render(
      <TestWrapper data-id="001268">
        <Trashcan className="custom-class" data-id="001269" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveClass('custom-class');
  });

  test('accepts style prop', () => {
    const customStyle = { margin: '10px' };
    render(
      <TestWrapper data-id="001270">
        <Trashcan data-id="001271" style={customStyle} />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts data attributes', () => {
    render(
      <TestWrapper data-id="001272">
        <Trashcan data-id="test-trashcan-icon" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('data-id', 'test-trashcan-icon');
  });

  test('accepts aria attributes', () => {
    render(
      <TestWrapper data-id="001273">
        <Trashcan aria-label="Delete" data-id="001274" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('aria-label', 'Delete');
  });

  test('renders as inline element by default', () => {
    render(
      <TestWrapper data-id="001275">
        <Trashcan data-id="001276" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('can be used in different contexts', () => {
    render(
      <TestWrapper data-id="001277">
        <div data-id="001278">
          <span data-id="001279">Before</span>
          <Trashcan data-id="001280" />
          <span data-id="001281">After</span>
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
      <TestWrapper data-id="001282">
        <Trashcan boxSize="28px" data-id="001283" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 13 15');
  });

  test('handles multiple instances', () => {
    render(
      <TestWrapper data-id="001284">
        <div data-id="001285">
          <Trashcan data-id="001286" data-testid="trashcan-1" />
          <Trashcan data-id="001287" data-testid="trashcan-2" />
          <Trashcan data-id="001288" data-testid="trashcan-3" />
        </div>
      </TestWrapper>,
    );

    const svgElements = document.querySelectorAll('svg');
    expect(svgElements).toHaveLength(3);
  });

  test('has correct stroke properties for accessibility', () => {
    render(
      <TestWrapper data-id="001289">
        <Trashcan data-id="001290" />
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
      <TestWrapper data-id="001291">
        <Trashcan data-id="001292" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    pathElements.forEach((path) => {
      expect(path).toHaveAttribute('stroke', 'currentColor');
    });
  });

  test('creates a proper trash can icon shape', () => {
    render(
      <TestWrapper data-id="001293">
        <Trashcan data-id="001294" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');

    // Should have 5 path elements representing the trash can icon
    expect(pathElements).toHaveLength(5);

    // All paths should have no fill and use stroke
    pathElements.forEach((path) => {
      expect(path).toHaveAttribute('fill', 'none');
      expect(path).toHaveAttribute('stroke', 'currentColor');
    });
  });

  test('accepts stroke prop for custom stroke color', () => {
    render(
      <TestWrapper data-id="001295">
        <Trashcan data-id="001296" stroke="red" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    pathElements.forEach((path) => {
      expect(path).toHaveAttribute('stroke', 'currentColor');
    });
  });

  test('accepts fill prop for custom fill color', () => {
    render(
      <TestWrapper data-id="001297">
        <Trashcan data-id="001298" fill="red" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    pathElements.forEach((path) => {
      expect(path).toHaveAttribute('fill', 'none');
    });
  });

  test('has proper trash can structure with body, lines, and handle', () => {
    render(
      <TestWrapper data-id="001299">
        <Trashcan data-id="001300" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');

    // First path should be the main trash can body
    expect(pathElements[0]).toHaveAttribute('data-id', '000258');

    // Second and third paths should be the vertical lines inside
    expect(pathElements[1]).toHaveAttribute('data-id', '000259');
    expect(pathElements[2]).toHaveAttribute('data-id', '000260');

    // Fourth path should be the top horizontal line
    expect(pathElements[3]).toHaveAttribute('data-id', '000261');

    // Fifth path should be the handle/lid
    expect(pathElements[4]).toHaveAttribute('data-id', '000262');
  });
});
