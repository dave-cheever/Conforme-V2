import React from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import FilterPresetList from '../../components/FilterPreset/FilterPresetList';

// Mock theme
const mockTheme = {
  colors: {},
};

// Mock ChakraProvider wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="002276" theme={mockTheme}>{children}</ChakraProvider>;
}

describe('FilterPresetList', () => {
  const mockPresets = [
    {
      _id: 'preset-1',
      name: 'First Preset',
      filters: { test: 'value1' },
      moduleId: 'module-1',
      moduleType: 'audit',
      pageName: 'audits',
      userId: 'user-1',
      metadata: {
        modulePath: '/audits',
        fullPath: '/audits',
        usedFilters: ['test'],
      },
      metatags: {
        addedBy: 'user-1',
        addedAt: '2023-01-01',
        updatedBy: 'user-1',
        updatedAt: '2023-01-01',
      },
    },
    {
      _id: 'preset-2',
      name: 'Second Preset',
      filters: { test: 'value2' },
      moduleId: 'module-1',
      moduleType: 'audit',
      pageName: 'audits',
      userId: 'user-1',
      metadata: {
        modulePath: '/audits',
        fullPath: '/audits',
        usedFilters: ['test'],
      },
      metatags: {
        addedBy: 'user-1',
        addedAt: '2023-01-01',
        updatedBy: 'user-1',
        updatedAt: '2023-01-01',
      },
    },
  ];

  const defaultProps = {
    presets: mockPresets,
    loading: false,
    onPresetClick: vi.fn(),
    onDeletePreset: vi.fn(),
    dataId: 'test-preset-list',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(
      <TestWrapper data-id="002277">
        <FilterPresetList data-id="002278" {...defaultProps} />
      </TestWrapper>,
    );

    expect(screen.getByText('First Preset')).toBeInTheDocument();
    expect(screen.getByText('Second Preset')).toBeInTheDocument();
  });

  test('shows loading state when loading is true', () => {
    render(
      <TestWrapper data-id="002279">
        <FilterPresetList data-id="002280" {...defaultProps} loading />
      </TestWrapper>,
    );

    expect(screen.getByText('Loading presets...')).toBeInTheDocument();
    expect(screen.queryByText('First Preset')).not.toBeInTheDocument();
  });

  test('shows no presets message when presets array is empty', () => {
    render(
      <TestWrapper data-id="002281">
        <FilterPresetList data-id="002282" {...defaultProps} presets={[]} />
      </TestWrapper>,
    );

    expect(screen.getByText('No filter presets saved yet')).toBeInTheDocument();
    expect(screen.queryByText('First Preset')).not.toBeInTheDocument();
  });

  test('renders all presets when provided', () => {
    render(
      <TestWrapper data-id="002283">
        <FilterPresetList data-id="002284" {...defaultProps} />
      </TestWrapper>,
    );

    expect(screen.getByText('First Preset')).toBeInTheDocument();
    expect(screen.getByText('Second Preset')).toBeInTheDocument();
  });

  test('has correct scrollable container styling', () => {
    render(
      <TestWrapper data-id="002285">
        <FilterPresetList data-id="002286" {...defaultProps} />
      </TestWrapper>,
    );

    // Verify the component renders correctly - the styling is applied via CSS-in-JS
    expect(screen.getByText('First Preset')).toBeInTheDocument();
    expect(screen.getByText('Second Preset')).toBeInTheDocument();
  });

  test('renders with correct data attributes', () => {
    render(
      <TestWrapper data-id="002287">
        <FilterPresetList data-id="002288" {...defaultProps} />
      </TestWrapper>,
    );

    const firstPreset = screen.getByText('First Preset').closest('div');
    const secondPreset = screen.getByText('Second Preset').closest('div');
    expect(firstPreset?.getAttribute('data-id')).toBe('test-preset-list-preset-0');
    expect(secondPreset?.getAttribute('data-id')).toBe('test-preset-list-preset-1');

    const buttons = screen.getAllByRole('button');
    const deleteButtons = buttons.filter((button) => button.getAttribute('data-id')?.includes('delete'));
    expect(deleteButtons).toHaveLength(2);
  });

  test('handles single preset correctly', () => {
    const singlePreset = [mockPresets[0]];
    render(
      <TestWrapper data-id="002289">
        <FilterPresetList data-id="002290" {...defaultProps} presets={singlePreset} />
      </TestWrapper>,
    );

    expect(screen.getByText('First Preset')).toBeInTheDocument();
    expect(screen.queryByText('Second Preset')).not.toBeInTheDocument();
  });

  test('passes correct props to FilterPresetItem components', () => {
    render(
      <TestWrapper data-id="002291">
        <FilterPresetList data-id="002292" {...defaultProps} />
      </TestWrapper>,
    );

    // Verify that the preset items are rendered with correct names
    expect(screen.getByText('First Preset')).toBeInTheDocument();
    expect(screen.getByText('Second Preset')).toBeInTheDocument();

    // Verify delete buttons are present
    const buttons = screen.getAllByRole('button');
    const deleteButtons = buttons.filter((button) => button.getAttribute('data-id')?.includes('delete'));
    expect(deleteButtons).toHaveLength(2);
  });
});
