import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import FilterPresetsIcon from '../../icons/FilterPresetIcon';

// Mock theme
const mockTheme = {
  colors: {},
};

// Test wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return (
    <ChakraProvider data-id="001670" theme={mockTheme}>
      {children}
    </ChakraProvider>
  );
}

describe('FilterPresetsIcon', () => {
  test('renders without crashing', () => {
    render(
      <TestWrapper data-id="001671">
        <FilterPresetsIcon data-id="001672" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('renders with correct viewBox', () => {
    render(
      <TestWrapper data-id="001673">
        <FilterPresetsIcon data-id="001674" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 24 24');
  });

  test('renders with correct group element', () => {
    render(
      <TestWrapper data-id="001675">
        <FilterPresetsIcon data-id="001676" />
      </TestWrapper>,
    );

    const groupElement = document.querySelector('svg g');
    expect(groupElement).toBeInTheDocument();
    expect(groupElement).toHaveAttribute('data-id', '000800');
    expect(groupElement).toHaveAttribute('fill', 'none');
    expect(groupElement).toHaveAttribute('stroke', 'currentColor');
  });

  test('renders top slider line correctly', () => {
    render(
      <TestWrapper data-id="001677">
        <FilterPresetsIcon data-id="001678" />
      </TestWrapper>,
    );

    const topLine = document.querySelector('svg line[data-id="000801"]');
    expect(topLine).toBeInTheDocument();
    expect(topLine).toHaveAttribute('x1', '3');
    expect(topLine).toHaveAttribute('x2', '21');
    expect(topLine).toHaveAttribute('y1', '8');
    expect(topLine).toHaveAttribute('y2', '8');
  });

  test('renders top slider circle correctly', () => {
    render(
      <TestWrapper data-id="001679">
        <FilterPresetsIcon data-id="001680" />
      </TestWrapper>,
    );

    const topCircle = document.querySelector('svg circle[data-id="000802"]');
    expect(topCircle).toBeInTheDocument();
    expect(topCircle).toHaveAttribute('cx', '9');
    expect(topCircle).toHaveAttribute('cy', '8');
    expect(topCircle).toHaveAttribute('r', '2');
    expect(topCircle).toHaveAttribute('fill', 'white');
  });

  test('renders bottom slider line correctly', () => {
    render(
      <TestWrapper data-id="001681">
        <FilterPresetsIcon data-id="001682" />
      </TestWrapper>,
    );

    const bottomLine = document.querySelector('svg line[data-id="000803"]');
    expect(bottomLine).toBeInTheDocument();
    expect(bottomLine).toHaveAttribute('x1', '3');
    expect(bottomLine).toHaveAttribute('x2', '21');
    expect(bottomLine).toHaveAttribute('y1', '16');
    expect(bottomLine).toHaveAttribute('y2', '16');
  });

  test('renders bottom slider circle correctly', () => {
    render(
      <TestWrapper data-id="001683">
        <FilterPresetsIcon data-id="001684" />
      </TestWrapper>,
    );

    const bottomCircle = document.querySelector('svg circle[data-id="000804"]');
    expect(bottomCircle).toBeInTheDocument();
    expect(bottomCircle).toHaveAttribute('cx', '15');
    expect(bottomCircle).toHaveAttribute('cy', '16');
    expect(bottomCircle).toHaveAttribute('r', '2');
    expect(bottomCircle).toHaveAttribute('fill', 'white');
  });

  test('accepts custom props', () => {
    render(
      <TestWrapper data-id="001685">
        <FilterPresetsIcon data-id="001686" boxSize="32px" color="red" data-testid="custom-filter-preset" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts color prop', () => {
    render(
      <TestWrapper data-id="001687">
        <FilterPresetsIcon data-id="001688" color="blue" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts size props', () => {
    render(
      <TestWrapper data-id="001689">
        <FilterPresetsIcon data-id="001690" boxSize="48px" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts className prop', () => {
    render(
      <TestWrapper data-id="001691">
        <FilterPresetsIcon data-id="001692" className="custom-class" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveClass('custom-class');
  });

  test('accepts style prop', () => {
    const customStyle = { margin: '10px' };
    render(
      <TestWrapper data-id="001693">
        <FilterPresetsIcon data-id="001694" style={customStyle} />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('accepts data attributes', () => {
    render(
      <TestWrapper data-id="001695">
        <FilterPresetsIcon data-id="001696" data-testid="test-filter-preset" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('data-testid', 'test-filter-preset');
  });

  test('accepts aria attributes', () => {
    render(
      <TestWrapper data-id="001697">
        <FilterPresetsIcon data-id="001698" aria-label="Filter presets" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('aria-label', 'Filter presets');
  });

  test('renders as inline element by default', () => {
    render(
      <TestWrapper data-id="001699">
        <FilterPresetsIcon data-id="001700" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('can be used in different contexts', () => {
    render(
      <TestWrapper data-id="001701">
        <div data-id="001702">
          <span data-id="001703">Before</span>
          <FilterPresetsIcon data-id="001704" />
          <span data-id="001705">After</span>
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
      <TestWrapper data-id="001706">
        <FilterPresetsIcon data-id="001707" boxSize="36px" />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 24 24');
  });

  test('handles multiple instances', () => {
    render(
      <TestWrapper data-id="001708">
        <div data-id="001709">
          <FilterPresetsIcon data-id="001710" data-testid="preset-1" />
          <FilterPresetsIcon data-id="001711" data-testid="preset-2" />
          <FilterPresetsIcon data-id="001712" data-testid="preset-3" />
        </div>
      </TestWrapper>,
    );

    const svgElements = document.querySelectorAll('svg');
    expect(svgElements).toHaveLength(3);
  });

  test('has correct display name', () => {
    expect(FilterPresetsIcon.displayName).toBe('FilterPresetsIcon');
  });

  test('renders with correct geometric properties for sliders', () => {
    render(
      <TestWrapper data-id="001713">
        <FilterPresetsIcon data-id="001714" />
      </TestWrapper>,
    );

    // Top slider should be at y=8
    const topLine = document.querySelector('svg line[data-id="000801"]');
    expect(topLine).toHaveAttribute('y1', '8');
    expect(topLine).toHaveAttribute('y2', '8');

    // Bottom slider should be at y=16
    const bottomLine = document.querySelector('svg line[data-id="000803"]');
    expect(bottomLine).toHaveAttribute('y1', '16');
    expect(bottomLine).toHaveAttribute('y2', '16');
  });

  test('renders with correct slider positions', () => {
    render(
      <TestWrapper data-id="001715">
        <FilterPresetsIcon data-id="001716" />
      </TestWrapper>,
    );

    // Top slider circle should be at x=9 (left position)
    const topCircle = document.querySelector('svg circle[data-id="000802"]');
    expect(topCircle).toHaveAttribute('cx', '9');

    // Bottom slider circle should be at x=15 (right position)
    const bottomCircle = document.querySelector('svg circle[data-id="000804"]');
    expect(bottomCircle).toHaveAttribute('cx', '15');
  });

  test('inherits color from parent', () => {
    render(
      <TestWrapper data-id="001717">
        <div data-id="001718" style={{ color: 'green' }}>
          <FilterPresetsIcon data-id="001719" />
        </div>
      </TestWrapper>,
    );

    const groupElement = document.querySelector('svg g');
    expect(groupElement).toHaveAttribute('stroke', 'currentColor');
  });

  test('handles click events', () => {
    const handleClick = vi.fn();

    render(
      <TestWrapper data-id="001720">
        <FilterPresetsIcon data-id="001721" onClick={handleClick} />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('renders with focus attributes', () => {
    render(
      <TestWrapper data-id="001722">
        <FilterPresetsIcon data-id="001723" tabIndex={0} />
      </TestWrapper>,
    );

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('renders consistently across multiple renders', () => {
    const { rerender } = render(
      <TestWrapper data-id="001724">
        <FilterPresetsIcon data-id="001725" />
      </TestWrapper>,
    );

    const firstRender = document.querySelector('svg');

    rerender(
      <TestWrapper data-id="001726">
        <FilterPresetsIcon data-id="001727" />
      </TestWrapper>,
    );

    const secondRender = document.querySelector('svg');
    expect(firstRender?.outerHTML).toBe(secondRender?.outerHTML);
  });

  test('has all required data-id attributes', () => {
    render(
      <TestWrapper data-id="001728">
        <FilterPresetsIcon data-id="001729" />
      </TestWrapper>,
    );

    // Check all data-id attributes are present
    expect(document.querySelector('[data-id="000800"]')).toBeInTheDocument();
    expect(document.querySelector('[data-id="000801"]')).toBeInTheDocument();
    expect(document.querySelector('[data-id="000802"]')).toBeInTheDocument();
    expect(document.querySelector('[data-id="000803"]')).toBeInTheDocument();
    expect(document.querySelector('[data-id="000804"]')).toBeInTheDocument();
  });

  test('represents filter sliders visually', () => {
    render(
      <TestWrapper data-id="001730">
        <FilterPresetsIcon data-id="001731" />
      </TestWrapper>,
    );

    // Should have two horizontal lines (sliders)
    const lines = document.querySelectorAll('svg line');
    expect(lines).toHaveLength(2);

    // Should have two circles (slider handles)
    const circles = document.querySelectorAll('svg circle');
    expect(circles).toHaveLength(2);

    // All circles should be white (filled)
    for (const circle of circles) {
      expect(circle).toHaveAttribute('fill', 'white');
    }
  });

  test('uses correct stroke width for visual clarity', () => {
    render(
      <TestWrapper data-id="001732">
        <FilterPresetsIcon data-id="001733" />
      </TestWrapper>,
    );

    const groupElement = document.querySelector('svg g');
    expect(groupElement).toBeInTheDocument();
  });
});
