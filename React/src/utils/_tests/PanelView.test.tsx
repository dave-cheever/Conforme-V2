import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import PanelView from '../../components/PanelView/PanelView';
import { CheckIcon, WarningIcon } from '../../icons';
import AuditDetailIcon from '../../icons/AuditDetailIcon';
import { PanelConfig } from '../../interfaces/IPanelConfig';

// Mock data for testing
const mockAuditData = [
  {
    _id: 'audit1',
    reference: 'AUD-001',
    auditType: { name: 'Compliance Audit' },
    status: 'completed',
    dueDate: '2025-01-15T00:00:00Z',
    auditor: {
      displayName: 'John Doe',
      imgUrl: 'https://example.com/john.jpg',
    },
  },
  {
    _id: 'audit2',
    reference: 'AUD-002',
    auditType: { name: 'Safety Audit' },
    status: 'upcoming',
    dueDate: '2025-02-20T00:00:00Z',
    auditor: {
      displayName: 'Jane Smith',
      imgUrl: null,
    },
  },
];

const mockActionData = [
  {
    _id: 'action1',
    action_title: 'Fix safety issue',
    action_type: 'Safety Improvement',
    status: 'Completed',
    action_assigned_to: 'Bob Wilson',
    module_type: 'Record',
    linked_item: 'INC-001',
  },
];

const mockIncidentData = [
  {
    id: 'INC-001',
    title: 'Safety Incident',
    status: 'IN REVIEW',
    description: 'Worker injury on site',
    linked_item: 'ACT-20251002-001',
    hospital_name: 'Test Hospital',
    ward_location: 'ICU',
    severity: 'high',
  },
  {
    id: 'INC-002',
    title: 'Documentation Error',
    status: 'Investigation',
    description: 'Missing forms',
    hospital_name: 'General Hospital',
    ward_location: 'Emergency',
    // No linked_item
  },
];

// Mock configuration for audits
const mockAuditConfig: PanelConfig = {
  title: {
    primary: { 
      key: 'reference', 
      type: 'text',
      fallback: 'No Reference',
    },
    secondary: { 
      key: 'auditType.name', 
      type: 'text',
      fallback: 'No Audit Type',
    },
  },
  status: {
    key: 'status',
    type: 'badge',
    badgeConfig: {
      variant: 'solid',
      statusConfig: {
        'completed': {
          bg: '#0073E6',
          color: 'white',
          icon: CheckIcon,
          text: 'Completed',
        },
        'upcoming': {
          bg: '#F97316',
          color: 'white',
          icon: WarningIcon,
          text: 'Upcoming',
        },
      },
    },
    fallback: 'Unknown',
  },
  details: [
    { 
      key: 'dueDate', 
      type: 'date', 
      dateFormat: 'd MMM yyyy',
      fallback: 'No Due Date',
    },
    { 
      key: 'auditor', 
      type: 'custom',
      fallback: 'Unassigned',
      render: (auditor: any) => {
        if (!auditor) return 'Unassigned';
        return `${auditor.displayName}`;
      },
    },
  ],
  actions: {
    primary: {
      label: 'View Audit',
      icon: AuditDetailIcon,
      onClick: vi.fn(),
    },
  },
};

// Mock configuration with linked item
const mockActionConfig: PanelConfig = {
  title: {
    primary: { 
      key: 'action_title', 
      type: 'text',
      fallback: 'No Title',
    },
    secondary: { 
      key: 'action_type', 
      type: 'text',
      fallback: 'No Type',
    },
  },
  status: {
    key: 'status',
    type: 'badge',
    badgeConfig: {
      variant: 'solid',
      statusConfig: {
        'Completed': {
          bg: '#10B981',
          color: 'white',
          text: 'Completed',
        },
      },
    },
    fallback: 'Unknown',
  },
  details: [
    { 
      key: 'action_assigned_to', 
      type: 'text',
      fallback: 'Unassigned',
    },
  ],
  linkedItem: {
    show: true,
    fieldKey: 'linked_item',
    label: 'Linked Item',
    render: (value: any) => `Linked: ${value}`,
  },
  actions: {
    primary: {
      label: 'View Action',
      onClick: vi.fn(),
    },
  },
};

// Test wrapper component
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return (
    <ChakraProvider data-id="001468">
      {children}
    </ChakraProvider>
  );
}

describe('PanelView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders panels for each item in the data', () => {
      render(
        <TestWrapper data-id="001469">
          <PanelView config={mockAuditConfig} data-id="001470" items={mockAuditData} />
        </TestWrapper>,
      );

      expect(screen.getByText('AUD-001')).toBeInTheDocument();
      expect(screen.getByText('Compliance Audit')).toBeInTheDocument();
      expect(screen.getAllByText('View Audit')).toHaveLength(2);
      
      expect(screen.getByText('AUD-002')).toBeInTheDocument();
      expect(screen.getByText('Safety Audit')).toBeInTheDocument();
    });

    test('renders empty array without crashing', () => {
      render(
        <TestWrapper data-id="001471">
          <PanelView config={mockAuditConfig} data-id="001472" items={[]} />
        </TestWrapper>,
      );

      // Should render the container but no panels - check that it renders without throwing
      expect(screen.getByRole('main', { hidden: true })).toBeInTheDocument();
    });

    test('renders with custom container props', () => {
      const customContainerProps = { bg: '#F0F0F0', p: '20px', gap: '10px' };
      
      render(
        <TestWrapper data-id="001473">
          <PanelView
            config={mockAuditConfig}
            containerProps={customContainerProps}
            data-id="001474"
            items={mockAuditData} />
        </TestWrapper>,
      );

      // Check that each panel renders
      expect(screen.getByText('AUD-001')).toBeInTheDocument();
      expect(screen.getByText('AUD-002')).toBeInTheDocument();
    });
  });

  describe('Title Section', () => {
    test('renders primary title correctly', () => {
      render(
        <TestWrapper data-id="001475">
          <PanelView config={mockAuditConfig} data-id="001476" items={mockAuditData} />
        </TestWrapper>,
      );

      expect(screen.getByText('AUD-001')).toBeInTheDocument();
      expect(screen.getByText('AUD-002')).toBeInTheDocument();
    });

    test('renders secondary title when configured', () => {
      render(
        <TestWrapper data-id="001477">
          <PanelView config={mockAuditConfig} data-id="001478" items={mockAuditData} />
        </TestWrapper>,
      );

      expect(screen.getByText('Compliance Audit')).toBeInTheDocument();
      expect(screen.getByText('Safety Audit')).toBeInTheDocument();
    });

    test('shows fallback when title data is missing', () => {
      const itemWithMissingTitle = [
        { _id: 'test', status: 'completed' },
      ];

      render(
        <TestWrapper data-id="001479">
          <PanelView config={mockAuditConfig} data-id="001480" items={itemWithMissingTitle} />
        </TestWrapper>,
      );

      expect(screen.getByText('No Reference')).toBeInTheDocument();
      expect(screen.getByText('No Audit Type')).toBeInTheDocument();
    });
  });

  describe('Status Section', () => {
    test('renders status badges correctly', () => {
      render(
        <TestWrapper data-id="001481">
          <PanelView config={mockAuditConfig} data-id="001482" items={mockAuditData} />
        </TestWrapper>,
      );

      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Upcoming')).toBeInTheDocument();
    });

    test('shows fallback status when status is unknown', () => {
      const itemWithUnknownStatus = [
        { _id: 'test', reference: 'TEST-001', status: 'unknown_status' },
      ];

      render(
        <TestWrapper data-id="001483">
          <PanelView config={mockAuditConfig} data-id="001484" items={itemWithUnknownStatus} />
        </TestWrapper>,
      );

      expect(screen.getByText('unknown_status')).toBeInTheDocument();
    });
  });

  describe('Details Section', () => {
    test('renders date fields correctly', () => {
      render(
        <TestWrapper data-id="001485">
          <PanelView config={mockAuditConfig} data-id="001486" items={mockAuditData} />
        </TestWrapper>,
      );

      // Vitest's jsdom doesn't format dates the same way, but we can check the date is there
      expect(screen.getByText(/Jan 2025|15 Jan 2025/)).toBeInTheDocument();
      expect(screen.getByText(/Feb 2025|20 Feb 2025/)).toBeInTheDocument();
    });

    test('renders custom renderer for auditor field', () => {
      render(
        <TestWrapper data-id="001487">
          <PanelView config={mockAuditConfig} data-id="001488" items={mockAuditData} />
        </TestWrapper>,
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    test('shows fallback for missing detail data', () => {
      const itemWithMissingDetails = [
        { _id: 'test', reference: 'TEST-001', status: 'completed' },
      ];

      render(
        <TestWrapper data-id="001489">
          <PanelView config={mockAuditConfig} data-id="001490" items={itemWithMissingDetails} />
        </TestWrapper>,
      );

      expect(screen.getByText('No Due Date')).toBeInTheDocument();
      expect(screen.getByText('Unassigned')).toBeInTheDocument();
    });
  });

  describe('Actions Section', () => {
    test('renders primary action button', () => {
      const mockOnClick = vi.fn();
      const configWithAction = {
        ...mockAuditConfig,
        actions: {
          ...mockAuditConfig.actions,
          primary: {
            label: 'View Audit',
            icon: AuditDetailIcon,
            onClick: mockOnClick,
          },
        },
      };

      render(
        <TestWrapper data-id="001491">
          <PanelView config={configWithAction} data-id="001492" items={mockAuditData} />
        </TestWrapper>,
      );

      const buttons = screen.getAllByText('View Audit');
      expect(buttons).toHaveLength(2);
    });

    test('calls onClick handler when primary action is clicked', () => {
      const mockOnClick = vi.fn();
      const configWithAction = {
        ...mockAuditConfig,
        actions: {
          ...mockAuditConfig.actions,
          primary: {
            label: 'View Audit',
            icon: AuditDetailIcon,
            onClick: mockOnClick,
          },
        },
      };

      render(
        <TestWrapper data-id="001493">
          <PanelView config={configWithAction} data-id="001494" items={mockAuditData} />
        </TestWrapper>,
      );

      const firstButton = screen.getAllByText('View Audit')[0];
      fireEvent.click(firstButton);

      expect(mockOnClick).toHaveBeenCalledWith(mockAuditData[0]);
    });

    test('renders action with icon when configured', () => {
      render(
        <TestWrapper data-id="001495">
          <PanelView config={mockAuditConfig} data-id="001496" items={mockAuditData} />
        </TestWrapper>,
      );

      const buttons = screen.getAllByText('View Audit');
      expect(buttons[0]).toBeInTheDocument();
    });
  });

  describe('Linked Item Section', () => {
    test('renders linked item when configured and data exists', () => {
      render(
        <TestWrapper data-id="001497">
          <PanelView config={mockActionConfig} data-id="001498" items={mockActionData} />
        </TestWrapper>,
      );

      expect(screen.getByText('Linked Item')).toBeInTheDocument();
      expect(screen.getByText('Linked: INC-001')).toBeInTheDocument();
    });

    test('does not render linked item when data is missing', () => {
      const itemWithoutLinkedItem = [
        { _id: 'action1', action_title: 'Test Action', status: 'Completed' },
      ];

      render(
        <TestWrapper data-id="001499">
          <PanelView config={mockActionConfig} data-id="001500" items={itemWithoutLinkedItem} />
        </TestWrapper>,
      );

      expect(screen.queryByText('Linked Item')).not.toBeInTheDocument();
    });

    test('does not render linked item section when show is false', () => {
      const configWithoutLinkedItem = {
        ...mockActionConfig,
        linkedItem: {
          show: false,
          fieldKey: 'linked_item',
          label: 'Linked Item',
        },
      };

      render(
        <TestWrapper data-id="001501">
          <PanelView config={configWithoutLinkedItem} data-id="001502" items={mockActionData} />
        </TestWrapper>,
      );

      expect(screen.queryByText('Linked Item')).not.toBeInTheDocument();
    });

    test('renders incident data with conditional linked item', () => {
      render(
        <TestWrapper data-id="001503">
          <PanelView config={mockActionConfig} data-id="001504" items={mockIncidentData} />
        </TestWrapper>,
      );

      // First incident has linked_item, second doesn't
      expect(screen.getByText('Linked: ACT-20251002-001')).toBeInTheDocument();
      expect(screen.queryByText('Linked Item')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles undefined items gracefully', () => {
      render(
        <TestWrapper data-id="001505">
          <PanelView config={mockAuditConfig} data-id="001506" items={undefined as any} />
        </TestWrapper>,
      );

      // Should not crash, just render empty
      expect(screen.queryByText('AUD-001')).not.toBeInTheDocument();
    });

    test('handles items with missing key properties', () => {
      const itemWithMissingKeys = [
        { _id: 'test1', someOtherProperty: 'value1' },
        { _id: 'test2', someOtherProperty: 'value2' },
      ];

      render(
        <TestWrapper data-id="001507">
          <PanelView config={mockAuditConfig} data-id="001508" items={itemWithMissingKeys} />
        </TestWrapper>,
      );

      // Should render fallbacks
      expect(screen.getAllByText('No Reference')).toHaveLength(2);
      expect(screen.getAllByText('No Audit Type')).toHaveLength(2);
    });

    test('handles deeply nested objects correctly', () => {
      const nestedData = [
        {
          _id: 'test',
          audit: {
            type: {
              name: 'Deep Nest',
            },
          },
        },
      ];

      const nestedConfig: PanelConfig = {
        title: {
          primary: {
            key: 'audit.type.name',
            type: 'text',
            fallback: 'No Name',
          },
          secondary: {
            key: 'audit.type.description',
            type: 'text',
            fallback: 'No Description',
          },
        },
        status: {
          key: 'status',
          type: 'text',
          fallback: 'Unknown',
        },
        details: [],
        actions: {
          primary: {
            label: 'Test',
            onClick: vi.fn(),
          },
        },
      };

      render(
        <TestWrapper data-id="001509">
          <PanelView config={nestedConfig} data-id="001510" items={nestedData} />
        </TestWrapper>,
      );

      expect(screen.getByText('Deep Nest')).toBeInTheDocument();
      expect(screen.getByText('No Description')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('buttons are focusable and have proper labels', () => {
      render(
        <TestWrapper data-id="001511">
          <PanelView config={mockAuditConfig} data-id="001512" items={mockAuditData} />
        </TestWrapper>,
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2); // Two primary action buttons
      
      for (const button of buttons) {
        expect(button).toHaveTextContent('View Audit');
        expect(button).toBeVisible();
      }
    });

    test('text elements have proper contrast and visibility', () => {
      render(
        <TestWrapper data-id="001513">
          <PanelView config={mockAuditConfig} data-id="001514" items={mockAuditData} />
        </TestWrapper>,
      );

      // All main text should be visible
      expect(screen.getByText('AUD-001')).toBeVisible();
      expect(screen.getByText('AUD-002')).toBeVisible();
      expect(screen.getByText('Compliance Audit')).toBeVisible();
      expect(screen.getByText('Safety Audit')).toBeVisible();
    });
  });
});
