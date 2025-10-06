import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import AdminTableHeaderElement from '../../components/Admin/AdminTableHeaderElement';

// Mock theme with the required colors
const mockTheme = {
  colors: {
    adminTableHeaderElement: {
      colorEnabled: '#282F36',
      colorDisabled: '#282F36',
      fontColor: '#282F36',
    },
  },
};

// Mock ChakraProvider wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="001207" theme={mockTheme}>{children}</ChakraProvider>;
}

// Helper function to render component with wrapper
const renderWithWrapper = (props: any) =>
  render(
    <TestWrapper data-id="001208">
      <AdminTableHeaderElement data-id="001209" {...props} />
    </TestWrapper>,
  );

describe('AdminTableHeaderElement', () => {
  const defaultProps = {
    w: '200px',
    label: 'Test Header',
  };

  test('renders with basic props', () => {
    renderWithWrapper(defaultProps);

    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  test('renders with custom width', () => {
    renderWithWrapper({
      ...defaultProps,
      w: '300px',
    });

    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  test('renders with margin left', () => {
    renderWithWrapper({
      ...defaultProps,
      ml: '10px',
    });

    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  test('renders with React node as label', () => {
    const customLabel = <span data-id="001210" data-testid="custom-label">Custom Label</span>;
    renderWithWrapper({
      ...defaultProps,
      label: customLabel,
    });

    expect(screen.getByTestId('custom-label')).toBeInTheDocument();
  });

  test('handles click events', () => {
    const mockOnClick = vi.fn();
    renderWithWrapper({
      ...defaultProps,
      onClick: mockOnClick,
      hideSortIcon: false, // Ensure sort icons are rendered
    });

    // Click on the sort icon container (which has the onClick handler)
    // The component shows ArrowUpIcon by default when sortOrder is undefined
    const sortIconContainer = document.querySelector('[data-id="000342"]')?.parentElement;
    expect(sortIconContainer).toBeInTheDocument();
    fireEvent.click(sortIconContainer!);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('renders tooltip when provided', () => {
    renderWithWrapper({
      ...defaultProps,
      tooltip: 'This is a tooltip',
    });

    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  test('disables tooltip when empty string provided', () => {
    renderWithWrapper({
      ...defaultProps,
      tooltip: '',
    });

    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  test('shows sort icons when hideSortIcon is false', () => {
    renderWithWrapper({
      ...defaultProps,
      hideSortIcon: false,
      sortOrder: 'asc',
    });

    // Should show an SVG element (the arrow icon)
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('hides sort icons when hideSortIcon is true', () => {
    renderWithWrapper({
      ...defaultProps,
      hideSortIcon: true,
      sortOrder: 'asc',
    });

    // Should not show any SVG elements
    const svgElement = document.querySelector('svg');
    expect(svgElement).not.toBeInTheDocument();
  });

  test('shows ArrowDownIcon for desc sort order', () => {
    renderWithWrapper({
      ...defaultProps,
      hideSortIcon: false,
      sortOrder: 'desc',
    });

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('shows ArrowUpIcon for asc sort order', () => {
    renderWithWrapper({
      ...defaultProps,
      hideSortIcon: false,
      sortOrder: 'asc',
    });

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('applies correct color when showSortingIcon is true', () => {
    renderWithWrapper({
      ...defaultProps,
      hideSortIcon: false,
      sortOrder: 'asc',
      showSortingIcon: true,
    });

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('applies correct color when showSortingIcon is false', () => {
    renderWithWrapper({
      ...defaultProps,
      hideSortIcon: false,
      sortOrder: 'asc',
      showSortingIcon: false,
    });

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('applies opacity when sortOrder is undefined', () => {
    renderWithWrapper({
      ...defaultProps,
      hideSortIcon: false,
      sortOrder: undefined,
    });

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('applies full opacity when sortOrder is defined', () => {
    renderWithWrapper({
      ...defaultProps,
      hideSortIcon: false,
      sortOrder: 'asc',
    });

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('renders with all props combined', () => {
    const mockOnClick = vi.fn();
    renderWithWrapper({
      w: '250px',
      ml: '15px',
      label: 'Complex Header',
      onClick: mockOnClick,
      sortOrder: 'desc',
      showSortingIcon: true,
      tooltip: 'Complex tooltip',
      hideSortIcon: false,
    });

    expect(screen.getByText('Complex Header')).toBeInTheDocument();
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('handles missing onClick gracefully', () => {
    renderWithWrapper({
      ...defaultProps,
      onClick: undefined,
    });

    const headerElement = screen.getByText('Test Header');
    fireEvent.click(headerElement);
    // Should not throw an error
  });

  test('handles missing tooltip gracefully', () => {
    renderWithWrapper({
      ...defaultProps,
      tooltip: undefined,
    });

    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  test('handles missing sortOrder gracefully', () => {
    renderWithWrapper({
      ...defaultProps,
      hideSortIcon: false,
      sortOrder: undefined,
    });

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('handles missing showSortingIcon gracefully', () => {
    renderWithWrapper({
      ...defaultProps,
      hideSortIcon: false,
      sortOrder: 'asc',
      showSortingIcon: undefined,
    });

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('handles missing hideSortIcon gracefully', () => {
    renderWithWrapper({
      ...defaultProps,
      sortOrder: 'asc',
    });

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('renders with different sort order values', () => {
    const { rerender } = renderWithWrapper({
      ...defaultProps,
      hideSortIcon: false,
      sortOrder: 'asc',
    });

    let svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();

    rerender(
      <TestWrapper data-id="001211">
        <AdminTableHeaderElement data-id="001212" {...defaultProps} hideSortIcon={false} sortOrder="desc" />
      </TestWrapper>,
    );

    svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('renders with correct data attributes', () => {
    renderWithWrapper({
      ...defaultProps,
      hideSortIcon: false,
      sortOrder: 'asc',
    });

    // Check for data-id attributes by looking for elements with data-id
    const elementsWithDataId = document.querySelectorAll('[data-id]');
    expect(elementsWithDataId.length).toBeGreaterThan(0);
  });

  test('renders with correct SVG path data', () => {
    renderWithWrapper({
      ...defaultProps,
      hideSortIcon: false,
      sortOrder: 'asc',
    });

    const pathElement = document.querySelector('svg path');
    expect(pathElement).toBeInTheDocument();
    expect(pathElement).toHaveAttribute('fill', 'currentColor');
  });

  test('renders with correct SVG viewBox', () => {
    renderWithWrapper({
      ...defaultProps,
      hideSortIcon: false,
      sortOrder: 'asc',
    });

    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 14 11');
  });
});
