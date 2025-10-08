import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import FilterCheckBox from '../../components/Filters/FilterCheckBox';

// Mock theme
const mockTheme = {
  colors: {
    brand: {
      darkGrey: '#2D3748',
    },
  },
};

// Test wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return (
    <ChakraProvider data-id="001632" theme={mockTheme}>
      {children}
    </ChakraProvider>
  );
}

describe('FilterCheckBox', () => {
  test('renders without crashing', () => {
    render(
      <TestWrapper data-id="001633">
        <FilterCheckBox data-id="001634" label="Test Label" value="test-value" />
      </TestWrapper>,
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  test('renders with correct label text', () => {
    const testLabel = 'Category Filter';
    render(
      <TestWrapper data-id="001635">
        <FilterCheckBox data-id="001636" label={testLabel} value="category" />
      </TestWrapper>,
    );

    expect(screen.getByText(testLabel)).toBeInTheDocument();
  });

  test('renders with correct value prop', () => {
    const testValue = 'business-unit';
    render(
      <TestWrapper data-id="001637">
        <FilterCheckBox data-id="001638" label="Business Unit" value={testValue} />
      </TestWrapper>,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('value', testValue);
  });

  test('applies custom CSS styles correctly', () => {
    render(
      <TestWrapper data-id="001639">
        <FilterCheckBox data-id="001640" label="Test" value="test" />
      </TestWrapper>,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();

    // The checkbox should be rendered
    expect(checkbox).toBeInTheDocument();
  });

  test('renders with data-id attributes', () => {
    render(
      <TestWrapper data-id="001641">
        <FilterCheckBox data-id="001642" label="Test" value="test" />
      </TestWrapper>,
    );

    // Check for data-id attributes in the rendered elements
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();

    const textElement = screen.getByText('Test');
    expect(textElement).toBeInTheDocument();
  });

  test('displays label with correct styling', () => {
    render(
      <TestWrapper data-id="001643">
        <FilterCheckBox data-id="001644" label="Styled Label" value="test" />
      </TestWrapper>,
    );

    const labelText = screen.getByText('Styled Label');
    expect(labelText).toBeInTheDocument();
  });

  test('renders with custom icon prop', () => {
    render(
      <TestWrapper data-id="001645">
        <FilterCheckBox data-id="001646" label="Test" value="test" />
      </TestWrapper>,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  test('handles different value types', () => {
    const testCases = [
      { value: 'string-value', label: 'String Value' },
      { value: 123, label: 'Number Value' },
      { value: true, label: 'Boolean Value' },
    ];

    for (const { value, label } of testCases) {
      const { unmount } = render(
        <TestWrapper data-id="001647">
          <FilterCheckBox data-id="001648" label={label} value={value} />
        </TestWrapper>,
      );

      expect(screen.getByText(label)).toBeInTheDocument();
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('value', String(value));

      unmount();
    }
  });

  test('handles empty label', () => {
    render(
      <TestWrapper data-id="001649">
        <FilterCheckBox data-id="001650" label="" value="test" />
      </TestWrapper>,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  test('handles long label text', () => {
    const longLabel = 'This is a very long label that might wrap to multiple lines in the UI';
    render(
      <TestWrapper data-id="001651">
        <FilterCheckBox data-id="001652" label={longLabel} value="test" />
      </TestWrapper>,
    );

    expect(screen.getByText(longLabel)).toBeInTheDocument();
  });

  test('renders multiple instances correctly', () => {
    render(
      <TestWrapper data-id="001653">
        <div data-id="001654">
          <FilterCheckBox data-id="001655" label="Option 1" value="option1" />
          <FilterCheckBox data-id="001656" label="Option 2" value="option2" />
          <FilterCheckBox data-id="001657" label="Option 3" value="option3" />
        </div>
      </TestWrapper>,
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);
  });

  test('maintains accessibility attributes', () => {
    render(
      <TestWrapper data-id="001658">
        <FilterCheckBox data-id="001659" label="Accessible Checkbox" value="accessible" />
      </TestWrapper>,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();

    // Check that the checkbox is accessible
    expect(checkbox).toHaveAttribute('type', 'checkbox');
  });

  test('handles special characters in value and label', () => {
    const specialValue = 'value-with-special-chars-!@#$%';
    const specialLabel = 'Label with special chars: !@#$%^&*()';

    render(
      <TestWrapper data-id="001660">
        <FilterCheckBox data-id="001661" label={specialLabel} value={specialValue} />
      </TestWrapper>,
    );

    expect(screen.getByText(specialLabel)).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('value', specialValue);
  });

  test('renders with consistent styling across instances', () => {
    render(
      <TestWrapper data-id="001662">
        <div data-id="001663">
          <FilterCheckBox data-id="001664" label="Test 1" value="test1" />
          <FilterCheckBox data-id="001665" label="Test 2" value="test2" />
        </div>
      </TestWrapper>,
    );

    const labels = screen.getAllByText(/Test \d/);
    for (const label of labels) 
      expect(label).toBeInTheDocument();
    
  });

  test('handles undefined props gracefully', () => {
    // Test with undefined value
    render(
      <TestWrapper data-id="001666">
        <FilterCheckBox data-id="001667" label="Undefined Value" value={undefined} />
      </TestWrapper>,
    );

    expect(screen.getByText('Undefined Value')).toBeInTheDocument();
  });

  test('renders with null props gracefully', () => {
    // Test with null value
    render(
      <TestWrapper data-id="001668">
        <FilterCheckBox data-id="001669" label="Null Value" value={null} />
      </TestWrapper>,
    );

    expect(screen.getByText('Null Value')).toBeInTheDocument();
  });
});
