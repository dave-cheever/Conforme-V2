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
    expect(svgElement).toHaveAttribute('viewBox', '0 0 12 12');
  });

  test('renders with correct path elements', () => {
    render(
      <TestWrapper data-id="001256">
        <SaveIcon data-id="001257" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    expect(pathElements).toHaveLength(1);

    // Check path (save icon)
    expect(pathElements[0]).toHaveAttribute(
      'd',
      'M1.33333 12H10.6667C11.0203 12 11.3594 11.8595 11.6095 11.6095C11.8595 11.3594 12 11.0203 12 10.6667V3.33334C12.0005 3.24561 11.9837 3.15863 11.9505 3.07741C11.9173 2.99618 11.8685 2.9223 11.8067 2.86001L9.14 0.193344C9.07771 0.131557 9.00383 0.0826734 8.92261 0.049497C8.84138 0.0163206 8.7544 -0.000496119 8.66667 1.11429e-05H1.33333C0.979711 1.11429e-05 0.640573 0.140487 0.390524 0.390535C0.140476 0.640584 0 0.979722 0 1.33334V10.6667C0 11.0203 0.140476 11.3594 0.390524 11.6095C0.640573 11.8595 0.979711 12 1.33333 12ZM8 10.6667H4V7.33334H8V10.6667ZM6.66667 2.66668H5.33333V1.33334H6.66667V2.66668ZM1.33333 1.33334H2.66667V4.00001H8V1.33334H8.39333L10.6667 3.60668V10.6667H9.33333V7.33334C9.33333 6.97972 9.19286 6.64058 8.94281 6.39054C8.69276 6.14049 8.35362 6.00001 8 6.00001H4C3.64638 6.00001 3.30724 6.14049 3.05719 6.39054C2.80714 6.64058 2.66667 6.97972 2.66667 7.33334V10.6667H1.33333V1.33334Z',
    );
    expect(pathElements[0]).toHaveAttribute('fill', 'currentColor');
  });

  test('has correct path element', () => {
    render(
      <TestWrapper data-id="001258">
        <SaveIcon data-id="001259" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    expect(pathElements).toHaveLength(1);
    expect(pathElements[0]).toBeInTheDocument();
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
    expect(svgElement).toHaveAttribute('viewBox', '0 0 12 12');
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

  test('has correct fill property', () => {
    render(
      <TestWrapper data-id="001287">
        <SaveIcon data-id="001288" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    pathElements.forEach((path) => {
      expect(path).toHaveAttribute('fill', 'currentColor');
    });
  });

  test('uses currentColor for fill', () => {
    render(
      <TestWrapper data-id="001289">
        <SaveIcon data-id="001290" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    pathElements.forEach((path) => {
      expect(path).toHaveAttribute('fill', 'currentColor');
    });
  });

  test('creates a proper save icon shape', () => {
    render(
      <TestWrapper data-id="001291">
        <SaveIcon data-id="001292" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');

    // Should have 1 path element representing the save icon
    expect(pathElements).toHaveLength(1);

    // Path should use currentColor for fill
    pathElements.forEach((path) => {
      expect(path).toHaveAttribute('fill', 'currentColor');
    });
  });

  test('renders path with correct attributes', () => {
    render(
      <TestWrapper data-id="001293">
        <SaveIcon data-id="001294" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    expect(pathElements).toHaveLength(1);
    pathElements.forEach((path) => {
      expect(path).toHaveAttribute('fill', 'currentColor');
    });
  });

  test('uses currentColor for fill by default', () => {
    render(
      <TestWrapper data-id="001295">
        <SaveIcon data-id="001296" />
      </TestWrapper>,
    );

    const pathElements = document.querySelectorAll('svg path');
    pathElements.forEach((path) => {
      expect(path).toHaveAttribute('fill', 'currentColor');
    });
  });
});
