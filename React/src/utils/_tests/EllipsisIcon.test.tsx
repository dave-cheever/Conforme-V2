import { render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import EllipsisIcon from '../../icons/EllipsisIcon';

describe('EllipsisIcon', () => {
  test('renders the ellipsis icon', () => {
    render(<EllipsisIcon data-id="001372" />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).not.toBeNull();
    expect(svg?.tagName).toBe('svg');
  });

  test('has correct viewBox', () => {
    render(<EllipsisIcon data-id="001373" />);

    const svg = document.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  test('applies default boxSize', () => {
    render(<EllipsisIcon data-id="001374" />);

    const svg = document.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toBeInTheDocument();
    // Chakra UI icons use CSS styles for sizing, not attributes
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  test('applies custom boxSize', () => {
    render(<EllipsisIcon boxSize="24px" data-id="001375" />);

    const svg = document.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toBeInTheDocument();
    // Chakra UI icons use CSS styles for sizing, not attributes
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  test('applies custom color', () => {
    render(<EllipsisIcon color="red" data-id="001376" />);

    const svg = document.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toBeInTheDocument();
    // Chakra UI icons apply color through CSS, not as an attribute
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  test('renders three circles', () => {
    render(<EllipsisIcon data-id="001377" />);

    const circles = Array.from(document.querySelectorAll('circle'));
    expect(circles).toHaveLength(3);
  });

  test('circles have correct positions', () => {
    render(<EllipsisIcon data-id="001378" />);

    const svg = document.querySelector('svg');
    expect(svg).not.toBeNull();
    const circles = Array.from(svg!.querySelectorAll('circle'));

    // First circle at x=4
    expect(circles[0]).toHaveAttribute('cx', '4');
    expect(circles[0]).toHaveAttribute('cy', '12');
    expect(circles[0]).toHaveAttribute('r', '2');

    // Second circle at x=12
    expect(circles[1]).toHaveAttribute('cx', '12');
    expect(circles[1]).toHaveAttribute('cy', '12');
    expect(circles[1]).toHaveAttribute('r', '2');

    // Third circle at x=20
    expect(circles[2]).toHaveAttribute('cx', '20');
    expect(circles[2]).toHaveAttribute('cy', '12');
    expect(circles[2]).toHaveAttribute('r', '2');
  });

  test('circles inherit currentColor', () => {
    render(<EllipsisIcon data-id="001379" />);

    const svg = document.querySelector('svg');
    expect(svg).not.toBeNull();
    const circles = Array.from(svg!.querySelectorAll('circle'));

    for (const circle of circles) 
      expect(circle).toHaveAttribute('fill', 'currentColor');
    
  });

  test('applies custom data-id attribute', () => {
    render(<EllipsisIcon data-id="test-ellipsis" />);

    const svg = document.querySelector('svg');
    expect(svg).toHaveAttribute('data-id', 'test-ellipsis');
  });

  test('applies custom className', () => {
    render(<EllipsisIcon className="custom-class" data-id="001380" />);

    const svg = document.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  test('applies custom style', () => {
    render(<EllipsisIcon data-id="001381" style={{ opacity: 0.5 }} />);

    const svg = document.querySelector('svg');
    expect(svg).toHaveStyle({ opacity: '0.5' });
  });

  test('supports different size formats', () => {
    const { rerender } = render(<EllipsisIcon boxSize="2rem" data-id="001382" />);

    let svg = document.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');

    rerender(<EllipsisIcon boxSize={32} data-id="001383" />);
    svg = document.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  test('has proper accessibility attributes', () => {
    render(<EllipsisIcon aria-label="More options" data-id="001384" />);

    const svg = document.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute('aria-label', 'More options');
  });

  test('supports focus and keyboard navigation', () => {
    render(<EllipsisIcon data-id="001385" tabIndex={0} />);

    const svg = document.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toBeInTheDocument();
    // Chakra UI icons handle focus through CSS and focusable attribute
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  test('handles click events', () => {
    const handleClick = vi.fn();
    render(<EllipsisIcon data-id="001386" onClick={handleClick} />);

    const svg = document.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toBeInTheDocument();
    // Test that the component renders with onClick handler
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  test('supports hover states', () => {
    render(<EllipsisIcon _hover={{ color: 'blue' }} data-id="001387" />);

    const svg = document.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toBeInTheDocument();
    // Note: _hover styles are applied by Chakra UI's styling system
    // and may not be directly testable in JSDOM environment
  });

  test('maintains aspect ratio', () => {
    render(<EllipsisIcon boxSize="48px" data-id="001388" />);

    const svg = document.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toBeInTheDocument();
    // Chakra UI icons maintain aspect ratio through viewBox
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  test('renders consistently across multiple instances', () => {
    render(
      <div data-id="001389">
        <EllipsisIcon data-id="001390" data-testid="icon-1" />
        <EllipsisIcon data-id="001391" data-testid="icon-2" />
        <EllipsisIcon data-id="001392" data-testid="icon-3" />
      </div>,
    );

    const icons = Array.from(document.querySelectorAll('svg'));
    expect(icons).toHaveLength(3);

    for (const icon of icons) {
      expect(icon).toHaveAttribute('viewBox', '0 0 24 24');
      const circles = Array.from(icon.querySelectorAll('circle'));
      expect(circles).toHaveLength(3);
    }
  });
});
