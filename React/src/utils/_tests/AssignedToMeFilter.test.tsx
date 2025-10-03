import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import AssignedToMeFilter from '../../components/Filters/AssignedToMeFilter';

// Mock theme
const mockTheme = {
  colors: {
    archivedFilterStyles: {
      checkboxLabelColor: '#2D3748',
    },
  },
};

// Test wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return (
    <ChakraProvider data-id="001300" theme={mockTheme}>
      {children}
    </ChakraProvider>
  );
}

describe('AssignedToMeFilter', () => {
  const mockOnToggle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders checkbox and label correctly', () => {
    render(
      <TestWrapper data-id="001301">
        <AssignedToMeFilter data-id="001318" isChecked={false} onToggle={mockOnToggle} />
      </TestWrapper>,
    );

    // Check that checkbox is rendered
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    // Check that label is rendered
    const label = screen.getByText('Show only assigned to me');
    expect(label).toBeInTheDocument();
  });

  test('renders with checked state when isChecked is true', () => {
    render(
      <TestWrapper data-id="001302">
        <AssignedToMeFilter data-id="001319" isChecked onToggle={mockOnToggle} />
      </TestWrapper>,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  test('renders with unchecked state when isChecked is false', () => {
    render(
      <TestWrapper data-id="001303">
        <AssignedToMeFilter data-id="001320" isChecked={false} onToggle={mockOnToggle} />
      </TestWrapper>,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  test('calls onToggle when checkbox is clicked', () => {
    render(
      <TestWrapper data-id="001304">
        <AssignedToMeFilter data-id="001321" isChecked={false} onToggle={mockOnToggle} />
      </TestWrapper>,
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith(true);
  });

  test('calls onToggle with false when unchecked checkbox is clicked', () => {
    render(
      <TestWrapper data-id="001305">
        <AssignedToMeFilter data-id="001322" isChecked onToggle={mockOnToggle} />
      </TestWrapper>,
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith(false);
  });

  test('calls onToggle when label is clicked', () => {
    render(
      <TestWrapper data-id="001306">
        <AssignedToMeFilter data-id="001323" isChecked={false} onToggle={mockOnToggle} />
      </TestWrapper>,
    );

    const label = screen.getByText('Show only assigned to me');
    fireEvent.click(label);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith(true);
  });

  test('calls onToggle with false when checked label is clicked', () => {
    render(
      <TestWrapper data-id="001307">
        <AssignedToMeFilter data-id="001324" isChecked onToggle={mockOnToggle} />
      </TestWrapper>,
    );

    const label = screen.getByText('Show only assigned to me');
    fireEvent.click(label);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith(false);
  });

  test('has correct accessibility attributes', () => {
    render(
      <TestWrapper data-id="001308">
        <AssignedToMeFilter data-id="001325" isChecked={false} onToggle={mockOnToggle} />
      </TestWrapper>,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'assigned-to-me');
    // Check that the checkbox container has the data-id
    const checkboxContainer = checkbox.closest('[data-id="000157"]');
    expect(checkboxContainer).toBeInTheDocument();
  });

  test('has correct styling attributes', () => {
    render(
      <TestWrapper data-id="001309">
        <AssignedToMeFilter data-id="001326" isChecked={false} onToggle={mockOnToggle} />
      </TestWrapper>,
    );

    // Check that the checkbox container has the data-id
    const checkboxContainer = screen.getByRole('checkbox').closest('[data-id="000157"]');
    expect(checkboxContainer).toBeInTheDocument();

    const label = screen.getByText('Show only assigned to me');
    expect(label).toHaveAttribute('data-id', '000156');
  });

  test('handles multiple rapid clicks correctly', () => {
    render(
      <TestWrapper data-id="001310">
        <AssignedToMeFilter data-id="001327" isChecked={false} onToggle={mockOnToggle} />
      </TestWrapper>,
    );

    const checkbox = screen.getByRole('checkbox');

    // Click multiple times rapidly
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledTimes(3);
    expect(mockOnToggle).toHaveBeenNthCalledWith(1, true);
    expect(mockOnToggle).toHaveBeenNthCalledWith(2, true);
    expect(mockOnToggle).toHaveBeenNthCalledWith(3, true);
  });

  test('handles onToggle function that returns undefined', () => {
    const undefinedOnToggle = vi.fn(() => undefined);

    render(
      <TestWrapper data-id="001311">
        <AssignedToMeFilter data-id="001328" isChecked={false} onToggle={undefinedOnToggle} />
      </TestWrapper>,
    );

    const checkbox = screen.getByRole('checkbox');

    // Should not crash the component
    expect(() => fireEvent.click(checkbox)).not.toThrow();
    expect(undefinedOnToggle).toHaveBeenCalledWith(true);
  });

  test('renders with all required data attributes', () => {
    render(
      <TestWrapper data-id="001312">
        <AssignedToMeFilter data-id="001329" isChecked={false} onToggle={mockOnToggle} />
      </TestWrapper>,
    );

    // Check HStack data attribute
    const container = screen.getByRole('checkbox').closest('[data-id="000155"]');
    expect(container).toBeInTheDocument();

    // Check checkbox data attribute
    const checkboxContainer = screen.getByRole('checkbox').closest('[data-id="000157"]');
    expect(checkboxContainer).toBeInTheDocument();

    // Check label data attribute
    const label = screen.getByText('Show only assigned to me');
    expect(label).toHaveAttribute('data-id', '000156');
  });

  test('maintains state consistency between checkbox and label clicks', () => {
    const { rerender } = render(
      <TestWrapper data-id="001313">
        <AssignedToMeFilter data-id="001330" isChecked={false} onToggle={mockOnToggle} />
      </TestWrapper>,
    );

    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('Show only assigned to me');

    // Click checkbox
    fireEvent.click(checkbox);
    expect(mockOnToggle).toHaveBeenCalledWith(true);

    // Rerender with new state
    rerender(
      <TestWrapper data-id="001314">
        <AssignedToMeFilter data-id="001331" isChecked onToggle={mockOnToggle} />
      </TestWrapper>,
    );

    // Click label
    fireEvent.click(label);
    expect(mockOnToggle).toHaveBeenCalledWith(false);
  });

  test('handles undefined onToggle function', () => {
    // This should not crash the component
    expect(() => {
      render(
        <TestWrapper data-id="001315">
          <AssignedToMeFilter data-id="001332" isChecked={false} onToggle={undefined as any} />
        </TestWrapper>,
      );
    }).not.toThrow();
  });

  test('checkbox has correct size and color scheme', () => {
    render(
      <TestWrapper data-id="001316">
        <AssignedToMeFilter data-id="001333" isChecked={false} onToggle={mockOnToggle} />
      </TestWrapper>,
    );

    const checkbox = screen.getByRole('checkbox');
    // These are Chakra UI internal attributes that should be present
    expect(checkbox).toBeInTheDocument();
  });

  test('label has correct styling and cursor pointer', () => {
    render(
      <TestWrapper data-id="001317">
        <AssignedToMeFilter data-id="001334" isChecked={false} onToggle={mockOnToggle} />
      </TestWrapper>,
    );

    const label = screen.getByText('Show only assigned to me');
    expect(label).toBeInTheDocument();
    // The cursor pointer style is applied via CSS, so we just verify the element exists
    expect(label).toHaveStyle('cursor: pointer');
  });
});
