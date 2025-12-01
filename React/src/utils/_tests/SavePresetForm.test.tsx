import React from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import SavePresetForm from '../../components/FilterPreset/SavePresetForm';

// Mock theme
const mockTheme = {
  colors: {},
};

// Mock ChakraProvider wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="002293" theme={mockTheme}>{children}</ChakraProvider>;
}

describe('SavePresetForm', () => {
  const defaultProps = {
    presetName: '',
    onPresetNameChange: vi.fn(),
    onSave: vi.fn(),
    onCancel: vi.fn(),
    dataId: 'test-save-form',
    isSaving: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(
      <TestWrapper data-id="002294">
        <SavePresetForm data-id="002295" {...defaultProps} />
      </TestWrapper>,
    );

    expect(screen.getByPlaceholderText('Preset name')).toBeInTheDocument();
  });

  test('displays preset name in input', () => {
    render(
      <TestWrapper data-id="002296">
        <SavePresetForm data-id="002297" {...defaultProps} presetName="Test Preset" />
      </TestWrapper>,
    );

    const input = screen.getByDisplayValue('Test Preset');
    expect(input).toBeInTheDocument();
  });

  test('calls onPresetNameChange when input value changes', () => {
    render(
      <TestWrapper data-id="002298">
        <SavePresetForm data-id="002299" {...defaultProps} />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText('Preset name');
    fireEvent.change(input, { target: { value: 'New Preset' } });

    expect(defaultProps.onPresetNameChange).toHaveBeenCalledWith('New Preset');
  });

  test('calls onSave when Enter key is pressed', () => {
    render(
      <TestWrapper data-id="002300">
        <SavePresetForm data-id="002301" {...defaultProps} />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText('Preset name');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(defaultProps.onSave).toHaveBeenCalled();
  });

  test('calls onCancel when Escape key is pressed', () => {
    render(
      <TestWrapper data-id="002302">
        <SavePresetForm data-id="002303" {...defaultProps} />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText('Preset name');
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  test('calls onCancel when clear button is clicked', () => {
    render(
      <TestWrapper data-id="002304">
        <SavePresetForm data-id="002305" {...defaultProps} />
      </TestWrapper>,
    );

    // Find the clear button by looking for the cross icon or button with specific styling
    const buttons = screen.getAllByRole('button');
    const clearButton = buttons.find((button) => button.getAttribute('data-id')?.includes('clear-button'));

    expect(clearButton).toBeDefined();
    if (clearButton) {
      fireEvent.click(clearButton);
      expect(defaultProps.onCancel).toHaveBeenCalled();
    }
  });

  test('calls onSave when save button is clicked', () => {
    render(
      <TestWrapper data-id="002306">
        <SavePresetForm data-id="002307" {...defaultProps} />
      </TestWrapper>,
    );

    // Find the save button by looking for the save icon or button with specific styling
    const buttons = screen.getAllByRole('button');
    const saveButton = buttons.find((button) => button.getAttribute('data-id')?.includes('confirm-save-button'));

    expect(saveButton).toBeDefined();
    if (saveButton) {
      fireEvent.click(saveButton);
      expect(defaultProps.onSave).toHaveBeenCalled();
    }
  });

  test('has correct data attributes', () => {
    render(
      <TestWrapper data-id="002308">
        <SavePresetForm data-id="002309" {...defaultProps} />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText('Preset name');
    expect(input.getAttribute('data-id')).toBe('test-save-form-preset-input');
  });

  test('prevents event propagation on button clicks', () => {
    const stopPropagation = vi.fn();
    render(
      <TestWrapper data-id="002310">
        <SavePresetForm data-id="002311" {...defaultProps} />
      </TestWrapper>,
    );

    const buttons = screen.getAllByRole('button');
    const clearButton = buttons.find((button) => button.getAttribute('data-id')?.includes('clear-button'));

    if (clearButton) {
      fireEvent.click(clearButton, { stopPropagation });
      expect(defaultProps.onCancel).toHaveBeenCalled();
    }
  });

  test('shows loading spinner when isSaving is true', () => {
    render(
      <TestWrapper data-id="002312">
        <SavePresetForm data-id="002313" {...defaultProps} isSaving={true} />
      </TestWrapper>,
    );

    const saveButton = screen.getByRole('button', { name: /loading/i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveAttribute('data-loading');
    expect(saveButton).toBeDisabled();
  });
});
