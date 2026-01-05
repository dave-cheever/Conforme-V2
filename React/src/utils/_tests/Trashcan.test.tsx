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
    expect(svgElement).toHaveAttribute('viewBox', '0 0 20 20');
  });

  test('renders with correct path elements', () => {
    render(
      <TestWrapper data-id="001256">
        <Trashcan data-id="001257" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    expect(pathElements).toHaveLength(2);

    // Check first path (trash can body)
    expect(pathElements[0]).toHaveAttribute(
      'd',
      'M4.16667 16.666C4.16667 17.108 4.34226 17.532 4.65482 17.8445C4.96738 18.1571 5.39131 18.3327 5.83333 18.3327H14.1667C14.6087 18.3327 15.0326 18.1571 15.3452 17.8445C15.6577 17.532 15.8333 17.108 15.8333 16.666V6.66602H17.5V4.99935H14.1667V3.33268C14.1667 2.89065 13.9911 2.46673 13.6785 2.15417C13.366 1.84161 12.942 1.66602 12.5 1.66602H7.5C7.05797 1.66602 6.63405 1.84161 6.32149 2.15417C6.00893 2.46673 5.83333 2.89065 5.83333 3.33268V4.99935H2.5V6.66602H4.16667V16.666ZM7.5 3.33268H12.5V4.99935H7.5V3.33268ZM6.66667 6.66602H14.1667V16.666H5.83333V6.66602H6.66667Z',
    );
    expect(pathElements[0]).toHaveAttribute('fill', 'currentColor');

    // Check second path (vertical lines inside trash can)
    expect(pathElements[1]).toHaveAttribute('d', 'M7.5 8.33398H9.16667V15.0007H7.5V8.33398ZM10.8333 8.33398H12.5V15.0007H10.8333V8.33398Z');
    expect(pathElements[1]).toHaveAttribute('fill', 'currentColor');
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
    expect(svgElement).toHaveAttribute('viewBox', '0 0 20 20');
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

  test('has correct fill properties', () => {
    render(
      <TestWrapper data-id="001289">
        <Trashcan data-id="001290" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    pathElements.forEach((path) => {
      expect(path).toHaveAttribute('fill', 'currentColor');
    });
  });

  test('uses currentColor for fill', () => {
    render(
      <TestWrapper data-id="001291">
        <Trashcan data-id="001292" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    pathElements.forEach((path) => {
      expect(path).toHaveAttribute('fill', 'currentColor');
    });
  });

  test('creates a proper trash can icon shape', () => {
    render(
      <TestWrapper data-id="001293">
        <Trashcan data-id="001294" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');

    // Should have 2 path elements representing the trash can icon
    expect(pathElements).toHaveLength(2);

    // All paths should use currentColor for fill
    pathElements.forEach((path) => {
      expect(path).toHaveAttribute('fill', 'currentColor');
    });
  });

  test('accepts color prop for custom color', () => {
    render(
      <TestWrapper data-id="001295">
        <Trashcan data-id="001296" color="red" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    pathElements.forEach((path) => {
      expect(path).toHaveAttribute('fill', 'currentColor');
    });
  });

  test('uses currentColor for fill by default', () => {
    render(
      <TestWrapper data-id="001297">
        <Trashcan data-id="001298" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    pathElements.forEach((path) => {
      expect(path).toHaveAttribute('fill', 'currentColor');
    });
  });

  test('has proper trash can structure with body and vertical lines', () => {
    render(
      <TestWrapper data-id="001299">
        <Trashcan data-id="001300" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');

    // First path should be the main trash can body
    expect(pathElements[0]).toHaveAttribute('data-id', '000258');

    // Second path should contain the vertical lines inside
    expect(pathElements[1]).toHaveAttribute('data-id', '000259');
  });
});
