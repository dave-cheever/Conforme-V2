import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { auditPanelConfig } from '../../components/PanelView/configs';
import PanelView from '../../components/PanelView/PanelView';

// Helper to query by data-id
const getByDataId = (id: string) => document.querySelector(`[data-id="${id}"]`);

// Mock the useDevice hook
vi.mock('../../hooks/useDevice', () => ({
  default: () => 'desktop',
}));

// Mock the AvatarCell component
vi.mock('../../components/Table/Cells/AvatarCell', () => ({
  default: ({ users, noDataText }: { users: any[]; noDataText: string }) => (
    <div data-id="002526" data-testid="avatar-cell">
      {users.length > 0 ? users.map((user, index) => (
        <span data-id="002527" data-testid={`user-${index}`} key={index}>
          {user.displayName || user.name || 'Unknown User'}
        </span>
      )) : <span data-id="002528" data-testid="no-data">{noDataText}</span>}
    </div>
  ),
}));

// Mock the StatusCell component
vi.mock('../../components/Table/Cells/StatusCell', () => ({
  default: ({ status }: { status: string }) => (
    <div data-id="002529" data-testid="status-cell">{status}</div>
  ),
}));

// Mock audit data for testing
const mockAuditData = [
  {
    _id: '1',
    name: 'Test Audit 1',
    status: 'completed',
    auditType: { name: 'Safety Audit' },
    dueDate: '2024-01-15',
    auditor: { displayName: 'John Doe' },
  },
  {
    _id: '2',
    name: 'Test Audit 2',
    status: 'inProgress',
    auditType: { name: 'Quality Audit' },
    dueDate: '2024-02-20',
    auditor: { displayName: 'Jane Smith' },
  },
];

describe('PanelView Error and Empty States', () => {
  describe('Error State', () => {
    it('renders error message when error prop is provided', () => {
      const errorMessage = 'Failed to load audits. Please try again.';
      
      render(
        <PanelView
          config={auditPanelConfig}
          data-id="002530"
          error={errorMessage}
          items={[]} />,
      );

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      // Error text should be present and styled (Chakra UI handles the actual styling)
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('renders error state with custom container props', () => {
      const errorMessage = 'Network error occurred';
      const customContainerProps = {
        bg: '#FF0000',
        p: '20px',
        gap: '10px',
      };

      render(
        <PanelView
          config={auditPanelConfig}
          containerProps={customContainerProps}
          data-id="002531"
          error={errorMessage}
          items={[]} />,
      );

      const errorContainer = screen.getByText(errorMessage).parentElement;
      expect(errorContainer).toHaveStyle({
        backgroundColor: '#FF0000',
        padding: '20px',
      });
    });

    it('prioritizes error state over empty state when both conditions are met', () => {
      const errorMessage = 'Database connection failed';
      
      render(
        <PanelView
          config={auditPanelConfig}
          data-id="002532"
          emptyStateMessage="No audits found"
          error={errorMessage}
          items={[]} />,
      );

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.queryByText('No audits found')).not.toBeInTheDocument();
    });

    it('renders error state with proper styling and layout', () => {
      const errorMessage = 'API timeout error';
      
      render(
        <PanelView
          config={auditPanelConfig}
          data-id="002533"
          error={errorMessage}
          items={[]} />,
      );

      const errorText = screen.getByText(errorMessage);
      const errorContainer = errorText.parentElement;

      // Error text should be present (Chakra UI handles the actual styling)
      expect(errorText).toBeInTheDocument();

      expect(errorContainer).toHaveStyle({
        display: 'flex',
        flexDirection: 'column',
        height: '200px',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minWidth: '100%',
      });
    });
  });

  describe('Empty State', () => {
    // PanelView doesn't handle empty states - it just renders empty content
    it('renders empty content when items array is empty', () => {
      render(
        <PanelView config={auditPanelConfig} data-id="002534" items={[]} />,
      );

      // PanelView renders the container but no items (uses data-id, not data-testid)
      expect(getByDataId('panel-view-items')).toBeInTheDocument();
      expect(getByDataId('panel-2')).not.toBeInTheDocument();
    });

    it('renders empty content when items is null', () => {
      render(
        <PanelView
          config={auditPanelConfig}
          data-id="002536"
          items={null as any} />,
      );

      // PanelView renders the container but no items (uses data-id, not data-testid)
      expect(getByDataId('panel-view-items')).toBeInTheDocument();
      expect(getByDataId('panel-2')).not.toBeInTheDocument();
    });

    it('renders empty content when items is undefined', () => {
      render(
        <PanelView
          config={auditPanelConfig}
          data-id="002537"
          items={undefined as any} />,
      );

      // PanelView renders the container but no items (uses data-id, not data-testid)
      expect(getByDataId('panel-view-items')).toBeInTheDocument();
      expect(getByDataId('panel-2')).not.toBeInTheDocument();
    });
  });

  describe('Normal State (with data)', () => {
    it('renders normal panel view when items are provided and no error', () => {
      render(
        <PanelView config={auditPanelConfig} data-id="002540" items={mockAuditData} />,
      );

      // Should not show error or empty state messages
      expect(screen.queryByText('No items found')).not.toBeInTheDocument();
      expect(screen.queryByText(/Failed to load/)).not.toBeInTheDocument();
      
      // Should render actual panel content
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('renders normal panel view when error is empty string', () => {
      render(
        <PanelView config={auditPanelConfig} data-id="002541" error="" items={mockAuditData} />,
      );

      // Should render normal content, not error state
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText(/Failed to load/)).not.toBeInTheDocument();
    });

    it('renders normal panel view when error is null', () => {
      render(
        <PanelView
          config={auditPanelConfig}
          data-id="002542"
          error={null as any}
          items={mockAuditData} />,
      );

      // Should render normal content, not error state
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText(/Failed to load/)).not.toBeInTheDocument();
    });
  });

  describe('State Priority', () => {
    it('shows error state when error is provided, regardless of items', () => {
      const errorMessage = 'Critical system error';
      
      render(
        <PanelView
          config={auditPanelConfig}
          data-id="002543"
          error={errorMessage}
          // Has data but error takes priority
          items={mockAuditData} />,
      );

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.queryByTestId('avatar-cell')).not.toBeInTheDocument();
    });

    it('shows empty content when no error and no items', () => {
      render(
        <PanelView config={auditPanelConfig} data-id="002544" error={undefined} items={[]} />,
      );

      // PanelView renders the container but no items (uses data-id, not data-testid)
      expect(getByDataId('panel-view-items')).toBeInTheDocument();
      expect(getByDataId('panel-2')).not.toBeInTheDocument();
      expect(screen.queryByText(/Failed to load/)).not.toBeInTheDocument();
    });

    it('shows normal state when no error and has items', () => {
      render(
        <PanelView
          config={auditPanelConfig}
          data-id="002545"
          error={undefined}
          items={mockAuditData} />,
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('No items found')).not.toBeInTheDocument();
      expect(screen.queryByText(/Failed to load/)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('error state has proper semantic structure', () => {
      const errorMessage = 'Accessibility test error';
      
      render(
        <PanelView
          config={auditPanelConfig}
          data-id="002546"
          error={errorMessage}
          items={[]} />,
      );

      const errorContainer = screen.getByText(errorMessage).parentElement;
      expect(errorContainer?.tagName).toBe('MAIN');
    });

    it('empty content has proper semantic structure', () => {
      render(
        <PanelView
          config={auditPanelConfig}
          data-id="002547"
          items={[]} />,
      );

      const panelViewItems = getByDataId('panel-view-items');
      const mainContainer = panelViewItems?.closest('main');
      expect(mainContainer).toBeInTheDocument();
    });

    it('normal state has proper semantic structure', () => {
      render(
        <PanelView config={auditPanelConfig} data-id="002548" items={mockAuditData} />,
      );

      const mainContainer = screen.getByText('John Doe').closest('main');
      expect(mainContainer).toBeInTheDocument();
    });
  });
});
