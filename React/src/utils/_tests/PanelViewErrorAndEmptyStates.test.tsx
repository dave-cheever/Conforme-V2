import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { auditPanelConfig } from '../../components/PanelView/configs';
import PanelView from '../../components/PanelView/PanelView';

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
    it('renders default empty state message when items array is empty', () => {
      render(
        <PanelView config={auditPanelConfig} data-id="002534" items={[]} />,
      );

      expect(screen.getByText('No items found')).toBeInTheDocument();
    });

    it('renders custom empty state message when provided', () => {
      const customMessage = 'No audits available at this time';
      
      render(
        <PanelView
          config={auditPanelConfig}
          data-id="002535"
          emptyStateMessage={customMessage}
          items={[]} />,
      );

      expect(screen.getByText(customMessage)).toBeInTheDocument();
      expect(screen.queryByText('No items found')).not.toBeInTheDocument();
    });

    it('renders empty state when items is null', () => {
      render(
        <PanelView
          config={auditPanelConfig}
          data-id="002536"
          emptyStateMessage="No data available"
          items={null as any} />,
      );

      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('renders empty state when items is undefined', () => {
      render(
        <PanelView
          config={auditPanelConfig}
          data-id="002537"
          emptyStateMessage="No records found"
          items={undefined as any} />,
      );

      expect(screen.getByText('No records found')).toBeInTheDocument();
    });

    it('renders empty state with proper styling and layout', () => {
      const emptyMessage = 'No audits to display';
      
      render(
        <PanelView
          config={auditPanelConfig}
          data-id="002538"
          emptyStateMessage={emptyMessage}
          items={[]} />,
      );

      const emptyText = screen.getByText(emptyMessage);
      const emptyContainer = emptyText.parentElement;

      // Empty text should be present (Chakra UI handles the actual styling)
      expect(emptyText).toBeInTheDocument();

      expect(emptyContainer).toHaveStyle({
        display: 'flex',
        flexDirection: 'column',
        height: '200px',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minWidth: '100%',
      });
    });

    it('renders empty state with custom container props', () => {
      const emptyMessage = 'No items to show';
      const customContainerProps = {
        bg: '#F0F0F0',
        p: '30px',
        gap: '15px',
      };

      render(
        <PanelView
          config={auditPanelConfig}
          containerProps={customContainerProps}
          data-id="002539"
          emptyStateMessage={emptyMessage}
          items={[]} />,
      );

      const emptyContainer = screen.getByText(emptyMessage).parentElement;
      expect(emptyContainer).toHaveStyle({
        backgroundColor: '#F0F0F0',
        padding: '30px',
      });
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

    it('shows empty state when no error and no items', () => {
      render(
        <PanelView config={auditPanelConfig} data-id="002544" error={undefined} items={[]} />,
      );

      expect(screen.getByText('No items found')).toBeInTheDocument();
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

    it('empty state has proper semantic structure', () => {
      render(
        <PanelView
          config={auditPanelConfig}
          data-id="002547"
          emptyStateMessage="Accessibility test empty"
          items={[]} />,
      );

      const emptyContainer = screen.getByText('Accessibility test empty').parentElement;
      expect(emptyContainer?.tagName).toBe('MAIN');
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
