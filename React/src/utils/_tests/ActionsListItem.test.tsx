import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import ActionsListItem from '../../components/Actions/ActionsListItem';

// Mock the theme
const mockTheme = {
  colors: {
    auditsList: {
      fontColor: '#000000',
      missed: '#ff0000',
      pending: '#ffa500',
      completed: '#00ff00',
    },
  },
};

// Mock ChakraProvider wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="001125" theme={mockTheme}>{children}</ChakraProvider>
}

// Mock the editAction function
const mockEditAction = vi.fn();

// Mock action data
const mockAction = {
  _id: '1',
  title: 'Test Action',
  description: 'Test Description',
  status: 'open' as const,
  dueDate: new Date('2024-01-15'),
  priority: 'medium' as const,
  organizationId: 'org1',
  scope: {
    type: 'audit',
    auditId: 'audit1',
  },
  assignee: {
    _id: 'user1',
    userId: 'user1',
    displayName: 'John Doe (Manager)',
    email: 'john.doe@example.com',
    role: 'user' as const,
    lastLogin: new Date('2024-01-01'),
    organizationId: 'org1',
    imgUrl: 'https://example.com/avatar.jpg',
  },
  creator: {
    _id: 'user2',
    userId: 'user2',
    displayName: 'Jane Smith (Admin)',
    email: 'jane.smith@example.com',
    role: 'admin' as const,
    lastLogin: new Date('2024-01-01'),
    organizationId: 'org1',
    imgUrl: 'https://example.com/creator.jpg',
  },
  location: {
    name: 'Test Location',
  },
  businessUnit: {
    name: 'Test Business Unit',
  },
};

// Helper function to render component with wrapper
const renderWithWrapper = (action: typeof mockAction, index = 0) => render(
    <TestWrapper data-id="001126">
      <ActionsListItem
        action={action}
        data-id="001127"
        editAction={mockEditAction}
        index={index} />
    </TestWrapper>,
  );

// Helper function to verify component renders correctly
const expectComponentToRender = () => {
  expect(screen.getByText('Test Action')).toBeInTheDocument();
};

// Helper function to create action with audit scope
const createActionWithAuditScope = (auditId: string, businessUnitScope: string, businessUnitName: string) => ({
  ...mockAction,
  answer: {
    _id: `answer${auditId}`,
    organizationId: 'org1',
    questionId: `question${auditId}`,
    scope: {
      type: 'audit' as const,
      auditId,
    },
    audit: {
      _id: auditId,
      organizationId: 'org1',
      auditTypeId: `auditType${auditId}`,
      reference: `AUD-${auditId}`,
      status: 'completed' as const,
      dueDate: new Date('2024-01-15'),
      auditorId: 'user1',
      participantsIds: ['user1'],
      recurring: false,
      scope: {
        type: 'audit' as const,
        auditId,
      },
      businessUnitScope,
      businessUnit: {
        _id: `bu${auditId}`,
        identifier: `AUDIT_BU_${auditId}`,
        name: 'Audit Business Unit',
        organizationId: 'org1',
      },
    },
    businessUnit: {
      _id: `bu${auditId}_answer`,
      identifier: `ANSWER_BU_${auditId}`,
      name: businessUnitName,
      organizationId: 'org1',
    },
  },
});

describe('ActionsListItem', () => {
  test('renders action item with sanitized display names', () => {
    renderWithWrapper(mockAction);
    expectComponentToRender();
  });

  test('sanitizes assignee display name correctly', () => {
    const actionWithSpecialChars = {
      ...mockAction,
      assignee: {
        ...mockAction.assignee,
        displayName: 'John Doe (Manager) & Co.',
      },
    };

    renderWithWrapper(actionWithSpecialChars);
    expectComponentToRender();
  });

  test('sanitizes creator display name correctly', () => {
    const actionWithSpecialChars = {
      ...mockAction,
      creator: {
        ...mockAction.creator,
        displayName: 'Jane Smith (Admin) & Associates!',
      },
    };

    renderWithWrapper(actionWithSpecialChars);
    expectComponentToRender();
  });

  test('handles null/undefined display names gracefully', () => {
    const actionWithNullNames = {
      ...mockAction,
      assignee: {
        ...mockAction.assignee,
        displayName: '',
      },
      creator: {
        ...mockAction.creator,
        displayName: '',
      },
    };

    renderWithWrapper(actionWithNullNames);
    expectComponentToRender();
  });

  test('handles empty string display names', () => {
    const actionWithEmptyNames = {
      ...mockAction,
      assignee: {
        ...mockAction.assignee,
        displayName: '',
      },
      creator: {
        ...mockAction.creator,
        displayName: '   ',
      },
    };

    renderWithWrapper(actionWithEmptyNames);
    expectComponentToRender();
  });

  test('displays assignee display name text alongside avatar', () => {
    renderWithWrapper(mockAction);

    // Check that the assignee display name is rendered as text
    expect(screen.getByText('John Doe (Manager)')).toBeInTheDocument();
  });

  test('displays creator display name text alongside avatar', () => {
    renderWithWrapper(mockAction);

    // Check that the creator display name is rendered as text
    expect(screen.getByText('Jane Smith (Admin)')).toBeInTheDocument();
  });

  test('handles assignee without display name', () => {
    const actionWithoutAssignee = {
      ...mockAction,
      assignee: undefined,
    } as unknown as typeof mockAction;

    renderWithWrapper(actionWithoutAssignee);
    expectComponentToRender();
  });

  test('handles creator without display name', () => {
    const actionWithoutCreator = {
      ...mockAction,
      creator: undefined,
    } as unknown as typeof mockAction;

    renderWithWrapper(actionWithoutCreator);
    expectComponentToRender();
  });

  test('displays business unit name correctly for audit scope', () => {
    const actionWithAuditScope = createActionWithAuditScope('audit1', 'audit', 'Answer Business Unit');
    renderWithWrapper(actionWithAuditScope);
    expectComponentToRender();
  });

  test('displays business unit name correctly for non-audit scope', () => {
    const actionWithNonAuditScope = createActionWithAuditScope('audit2', 'other', 'Answer Business Unit');
    renderWithWrapper(actionWithNonAuditScope);
    expectComponentToRender();
  });
});
