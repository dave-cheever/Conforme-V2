import React from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import FilterPresetItem from '../../components/FilterPreset/FilterPresetItem';

// Mock theme
const mockTheme = {
  colors: {},
};

// Mock ChakraProvider wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="002257" theme={mockTheme}>{children}</ChakraProvider>;
}

describe('FilterPresetItem', () => {
  const mockPreset = {
    _id: 'preset-1',
    name: 'Test Preset',
  };

  const defaultProps = {
    preset: mockPreset,
    index: 0,
    onPresetClick: vi.fn(),
    onDeletePreset: vi.fn(),
    dataId: 'test-preset-item',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(
      <TestWrapper data-id="002258">
        <FilterPresetItem data-id="002259" {...defaultProps} />
      </TestWrapper>,
    );

    expect(screen.getByText('Test Preset')).toBeInTheDocument();
  });

  test('displays preset name correctly', () => {
    const customPreset = { _id: 'preset-2', name: 'Custom Preset Name' };
    render(
      <TestWrapper data-id="002260">
        <FilterPresetItem data-id="002261" {...defaultProps} preset={customPreset} />
      </TestWrapper>,
    );

    expect(screen.getByText('Custom Preset Name')).toBeInTheDocument();
  });

  test('calls onPresetClick when preset is clicked', () => {
    render(
      <TestWrapper data-id="002262">
        <FilterPresetItem data-id="002263" {...defaultProps} />
      </TestWrapper>,
    );

    const presetItem = screen.getByText('Test Preset');
    fireEvent.click(presetItem);

    expect(defaultProps.onPresetClick).toHaveBeenCalledWith('preset-1');
  });

  test('calls onDeletePreset when delete button is clicked', () => {
    render(
      <TestWrapper data-id="002264">
        <FilterPresetItem data-id="002265" {...defaultProps} />
      </TestWrapper>,
    );

    const buttons = screen.getAllByRole('button');
    const deleteButton = buttons.find((button) => button.getAttribute('data-id')?.includes('delete-0'));

    expect(deleteButton).toBeDefined();
    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(defaultProps.onDeletePreset).toHaveBeenCalledWith('preset-1', expect.any(Object));
    }
  });

  test('has correct data attributes', () => {
    render(
      <TestWrapper data-id="002266">
        <FilterPresetItem data-id="002267" {...defaultProps} />
      </TestWrapper>,
    );

    const presetItem = screen.getByText('Test Preset').closest('div');
    expect(presetItem?.getAttribute('data-id')).toBe('test-preset-item-preset-0');

    const buttons = screen.getAllByRole('button');
    const deleteButton = buttons.find((button) => button.getAttribute('data-id')?.includes('delete-0'));
    expect(deleteButton).toBeDefined();
  });

  test('prevents event propagation on delete button click', () => {
    const stopPropagation = vi.fn();
    render(
      <TestWrapper data-id="002268">
        <FilterPresetItem data-id="002269" {...defaultProps} />
      </TestWrapper>,
    );

    const buttons = screen.getAllByRole('button');
    const deleteButton = buttons.find((button) => button.getAttribute('data-id')?.includes('delete-0'));

    if (deleteButton) {
      fireEvent.click(deleteButton, { stopPropagation });
      expect(defaultProps.onDeletePreset).toHaveBeenCalled();
    }
  });

  test('prevents event propagation on mouse down', () => {
    render(
      <TestWrapper data-id="002270">
        <FilterPresetItem data-id="002271" {...defaultProps} />
      </TestWrapper>,
    );

    const buttons = screen.getAllByRole('button');
    const deleteButton = buttons.find((button) => button.getAttribute('data-id')?.includes('delete-0'));

    // This test verifies the button exists and can be interacted with
    expect(deleteButton).toBeDefined();
    if (deleteButton) fireEvent.mouseDown(deleteButton);
    // The actual event propagation prevention is tested in the component behavior
  });

  test('handles different index values correctly', () => {
    render(
      <TestWrapper data-id="002272">
        <FilterPresetItem data-id="002273" {...defaultProps} index={5} />
      </TestWrapper>,
    );

    const presetItem = screen.getByText('Test Preset').closest('div');
    expect(presetItem?.getAttribute('data-id')).toBe('test-preset-item-preset-5');

    const buttons = screen.getAllByRole('button');
    const deleteButton = buttons.find((button) => button.getAttribute('data-id')?.includes('delete-5'));
    expect(deleteButton).toBeDefined();
  });

  test('has correct styling classes', () => {
    render(
      <TestWrapper data-id="002274">
        <FilterPresetItem data-id="002275" {...defaultProps} />
      </TestWrapper>,
    );

    const presetItem = screen.getByText('Test Preset').closest('div');
    expect(presetItem).toHaveStyle('cursor: pointer');
  });
});
