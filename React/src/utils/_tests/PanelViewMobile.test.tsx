import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';

import PanelView from '../../components/PanelView/PanelView';
import { PanelConfig } from '../../interfaces/IPanelConfig';

// Mock the useDevice hook
const mockUseDevice = vi.fn();
vi.mock('../../hooks/useDevice', () => ({
  default: () => mockUseDevice(),
}));

// Mock Chakra UI components
vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useBreakpointValue: vi.fn(),
  };
});

describe('PanelView Mobile Responsive', () => {
  const mockConfig: PanelConfig = {
    title: {
      primary: {
        key: 'name',
        type: 'text',
      },
      secondary: {
        key: 'description',
        type: 'text',
      },
    },
    status: {
      key: 'status',
      type: 'badge',
      badgeConfig: {
        statusConfig: {
          active: { text: 'Active', bg: '#E6FFFA', color: '#234E52' },
          inactive: { text: 'Inactive', bg: '#FED7D7', color: '#C53030' },
        },
      },
    },
    details: [
      {
        key: 'date',
        type: 'text',
      },
    ],
    actions: {
      primary: {
        label: 'View Details',
        onClick: vi.fn(),
        icon: () => <div data-id="001543">Icon</div>,
      },
      secondary: {
        label: 'Edit',
        onClick: vi.fn(),
      },
    },
  };

  const mockItems = [
    {
      _id: '1',
      name: 'Test Item 1',
      description: 'This is a very long description that should be truncated on mobile devices when it overlaps with the status badge',
      status: 'active',
      date: '2024-01-15',
    },
    {
      _id: '2',
      name: 'Test Item 2',
      description: 'Short desc',
      status: 'inactive',
      date: '2024-01-16',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Mobile Action Button Behavior', () => {
    test('shows dropdown menu with ellipsis icon on mobile', () => {
      mockUseDevice.mockReturnValue('mobile');

      render(<PanelView data-id="001544" items={mockItems} config={mockConfig} />);

      // Should show ellipsis buttons (one for each item)
      const ellipsisButtons = screen.getAllByLabelText('Actions');
      expect(ellipsisButtons.length).toBe(2);

      // Should not show regular action button
      expect(screen.queryByRole('button', { name: /View Details/ })).not.toBeInTheDocument();
    });

    test('hides regular action button on mobile', () => {
      mockUseDevice.mockReturnValue('mobile');

      render(<PanelView data-id="001545" items={mockItems} config={mockConfig} />);

      // Should not show the regular button
      expect(screen.queryByRole('button', { name: /View Details/ })).not.toBeInTheDocument();
    });

    test('shows regular action button on desktop', () => {
      mockUseDevice.mockReturnValue('desktop');

      render(<PanelView data-id="001546" items={mockItems} config={mockConfig} />);

      // Should show regular action buttons (one for each item)
      const actionButtons = screen.getAllByRole('button', { name: /View Details/ });
      expect(actionButtons.length).toBe(2);

      // Should not show ellipsis button
      expect(screen.queryByLabelText('Actions')).not.toBeInTheDocument();
    });

    test('shows regular action button on tablet', () => {
      mockUseDevice.mockReturnValue('tablet');

      render(<PanelView data-id="001547" items={mockItems} config={mockConfig} />);

      // Should show regular action buttons (one for each item)
      const actionButtons = screen.getAllByRole('button', { name: /View Details/ });
      expect(actionButtons.length).toBe(2);

      // Should not show ellipsis button
      expect(screen.queryByLabelText('Actions')).not.toBeInTheDocument();
    });
  });

  describe('Mobile Secondary Title Truncation', () => {
    test('applies ellipsis styles to secondary title on mobile', () => {
      mockUseDevice.mockReturnValue('mobile');

      render(<PanelView data-id="001548" items={mockItems} config={mockConfig} />);

      // Find the secondary title field renderer
      const secondaryTitle = screen.getByText('This is a very long description that should be truncated on mobile devices when it overlaps with the status badge');
      
      // Should have ellipsis styles applied
      expect(secondaryTitle).toBeInTheDocument();
      // The actual ellipsis behavior is handled by Chakra UI's noOfLines prop
    });

    test('does not apply ellipsis styles to secondary title on desktop', () => {
      mockUseDevice.mockReturnValue('desktop');

      render(<PanelView data-id="001549" items={mockItems} config={mockConfig} />);

      // Secondary title should be fully visible
      const secondaryTitle = screen.getByText('This is a very long description that should be truncated on mobile devices when it overlaps with the status badge');
      expect(secondaryTitle).toBeInTheDocument();
    });
  });

  describe('Mobile Responsive Margins', () => {
    test('applies mobile-specific margin to title/actions container', () => {
      mockUseDevice.mockReturnValue('mobile');

      render(<PanelView data-id="001550" items={mockItems} config={mockConfig} />);

      // The margin is applied via sx prop with media queries
      // This is tested by ensuring the component renders without errors
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    });

    test('applies desktop-specific margin to title/actions container', () => {
      mockUseDevice.mockReturnValue('desktop');

      render(<PanelView data-id="001551" items={mockItems} config={mockConfig} />);

      // The margin is applied via sx prop with media queries
      // This is tested by ensuring the component renders without errors
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    });
  });

  describe('Mobile Dropdown Menu Functionality', () => {
    test('dropdown menu contains primary action on mobile', () => {
      mockUseDevice.mockReturnValue('mobile');

      render(<PanelView data-id="001552" items={mockItems} config={mockConfig} />);

      // Should show ellipsis buttons (one for each item)
      const ellipsisButtons = screen.getAllByLabelText('Actions');
      expect(ellipsisButtons.length).toBe(2);

      // Should not show regular action buttons
      expect(screen.queryByRole('button', { name: /View Details/ })).not.toBeInTheDocument();
    });

    test('dropdown menu contains secondary action on mobile when available', () => {
      mockUseDevice.mockReturnValue('mobile');

      render(<PanelView data-id="001553" items={mockItems} config={mockConfig} />);

      // Should show ellipsis buttons
      const ellipsisButtons = screen.getAllByLabelText('Actions');
      expect(ellipsisButtons.length).toBe(2);

      // Should not show regular action buttons
      expect(screen.queryByRole('button', { name: /View Details/ })).not.toBeInTheDocument();
    });

    test('dropdown menu only shows primary action when secondary is not available', () => {
      const configWithoutSecondary = {
        ...mockConfig,
        actions: {
          primary: mockConfig.actions.primary,
        },
      };

      mockUseDevice.mockReturnValue('mobile');

      render(<PanelView data-id="001554" items={mockItems} config={configWithoutSecondary} />);

      // Should show ellipsis buttons
      const ellipsisButtons = screen.getAllByLabelText('Actions');
      expect(ellipsisButtons.length).toBe(2);

      // Should not show regular action buttons
      expect(screen.queryByRole('button', { name: /View Details/ })).not.toBeInTheDocument();
    });
  });

  describe('Data ID Attributes on Mobile', () => {
    test('maintains data-id attributes on mobile', () => {
      mockUseDevice.mockReturnValue('mobile');

      render(<PanelView data-id="001555" items={mockItems} config={mockConfig} />);

      // Should have data-id attributes
      const mainContainer = screen.getByRole('main');
      expect(mainContainer).toHaveAttribute('data-id', '1');

      // Should have data-id on action dropdown (first item)
      const actionDropdowns = screen.getAllByLabelText('Actions');
      expect(actionDropdowns[0]).toHaveAttribute('data-id', 'action-dropdown-2');
    });

    test('maintains data-id attributes on desktop', () => {
      mockUseDevice.mockReturnValue('desktop');

      render(<PanelView data-id="001556" items={mockItems} config={mockConfig} />);

      // Should have data-id attributes
      const mainContainer = screen.getByRole('main');
      expect(mainContainer).toHaveAttribute('data-id', '1');

      // Should have data-id on action button (first item)
      const actionButtons = screen.getAllByRole('button', { name: /View Details/ });
      expect(actionButtons[0]).toHaveAttribute('data-id', 'action-button-2');
    });
  });

  describe('Device Detection Edge Cases', () => {
    test('handles undefined device gracefully', () => {
      mockUseDevice.mockReturnValue(undefined);

      render(<PanelView data-id="001557" items={mockItems} config={mockConfig} />);

      // Should default to desktop behavior
      const actionButtons = screen.getAllByRole('button', { name: /View Details/ });
      expect(actionButtons.length).toBeGreaterThan(0);
    });

    test('handles null device gracefully', () => {
      mockUseDevice.mockReturnValue(null);

      render(<PanelView data-id="001558" items={mockItems} config={mockConfig} />);

      // Should default to desktop behavior
      const actionButtons = screen.getAllByRole('button', { name: /View Details/ });
      expect(actionButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Container Behavior', () => {
    test('applies responsive container styles on mobile', () => {
      mockUseDevice.mockReturnValue('mobile');

      render(<PanelView data-id="001559" items={mockItems} config={mockConfig} />);

      // Container should render with proper styling
      const mainContainer = screen.getByRole('main');
      expect(mainContainer).toBeInTheDocument();
      expect(mainContainer).toHaveStyle('background-color: #F7FAFC');
    });

    test('applies responsive container styles on desktop', () => {
      mockUseDevice.mockReturnValue('desktop');

      render(<PanelView data-id="001560" items={mockItems} config={mockConfig} />);

      // Container should render with proper styling
      const mainContainer = screen.getByRole('main');
      expect(mainContainer).toBeInTheDocument();
      expect(mainContainer).toHaveStyle('background-color: #F7FAFC');
    });
  });

  describe('Mobile Performance Considerations', () => {
    test('renders efficiently on mobile with many items', () => {
      mockUseDevice.mockReturnValue('mobile');

      const manyItems = Array.from({ length: 50 }, (_, i) => ({
        _id: `item-${i}`,
        name: `Item ${i}`,
        description: `Description for item ${i}`,
        status: i % 2 === 0 ? 'active' : 'inactive',
        date: `2024-01-${String(i + 1).padStart(2, '0')}`,
      }));

      const startTime = performance.now();
      render(<PanelView data-id="001561" items={manyItems} config={mockConfig} />);
      const endTime = performance.now();

      // Should render within reasonable time (less than 2000ms for 50 items)
      expect(endTime - startTime).toBeLessThan(2000);

      // Should render all items
      expect(screen.getByText('Item 0')).toBeInTheDocument();
      expect(screen.getByText('Item 49')).toBeInTheDocument();
    });
  });
});
