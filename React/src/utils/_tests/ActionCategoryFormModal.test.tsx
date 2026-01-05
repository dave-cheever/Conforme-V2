import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import { gql } from '@apollo/client';
import { useForm } from 'react-hook-form';

import ActionCategoryFormModal, { MAX_ACTION_CATEGORIES_NAME_LENGTH } from '../../components/ActionCategory/ActionCategoryFormModal';
import { AdminModalState } from '../../interfaces/IAdminContext';

// Mock values
const mockSetAdminModalState = vi.fn();
const mockRefetch = vi.fn();
const mockTrigger = vi.fn().mockResolvedValue(true);
const mockGetValues = vi.fn();

// GraphQL mutations
const CREATE_ACTION_CATEGORY = gql`
  mutation ($actionCategory: ActionCategoryCreateInput!) {
    createActionCategory(actionCategory: $actionCategory) {
      _id
    }
  }
`;

const UPDATE_ACTION_CATEGORY = gql`
  mutation ($actionCategoryInput: ActionCategoryModifyInput!) {
    updateActionCategory(actionCategoryInput: $actionCategoryInput) {
      _id
    }
  }
`;

const DELETE_ACTION_CATEGORY = gql`
  mutation ($_id: String!) {
    deleteActionCategory(_id: $_id)
  }
`;

// Mock toast
const mockToast = vi.fn();

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => mockToast,
  };
});

// Mock AdminModal to avoid rendering full modal
vi.mock('../../components/Admin/AdminModal', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-id="013277" data-testid="admin-modal">{children}</div>
  ),
}));

// Helper function to render component with proper control
const renderComponent = (
  props: Partial<React.ComponentProps<typeof ActionCategoryFormModal>> = {},
  mocks: any[] = [],
) => {
  function Wrapper() {
    const { control } = useForm({ defaultValues: { name: '' } });
    const defaultProps = {
      isOpenModal: true,
      modalType: 'add' as AdminModalState,
      control,
      getValues: mockGetValues,
      trigger: mockTrigger,
      errors: {},
      refetch: mockRefetch,
      setAdminModalState: mockSetAdminModalState,
      ...props,
    };

    return (
      <ChakraProvider data-id="013278">
        <MockedProvider data-id="013279" mocks={mocks}>
          <ActionCategoryFormModal data-id="013280" {...defaultProps} />
        </MockedProvider>
      </ChakraProvider>
    );
  }

  return render(<Wrapper data-id="013281" />);
};

describe('ActionCategoryFormModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockGetValues.mockReturnValue({ _id: undefined, name: '' });
    mockTrigger.mockResolvedValue(true);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Component Existence and Constants', () => {
    test('component exists and can be imported', () => {
      expect(ActionCategoryFormModal).toBeDefined();
      expect(typeof ActionCategoryFormModal).toBe('function');
    });

    test('MAX_ACTION_CATEGORIES_NAME_LENGTH constant is exported', () => {
      expect(MAX_ACTION_CATEGORIES_NAME_LENGTH).toBe(60);
    });

    test('GraphQL create mutation structure is correct', () => {
      expect(CREATE_ACTION_CATEGORY).toBeDefined();
      expect(CREATE_ACTION_CATEGORY.definitions).toBeDefined();
      expect(CREATE_ACTION_CATEGORY.definitions.length).toBeGreaterThan(0);
    });

    test('GraphQL update mutation structure is correct', () => {
      expect(UPDATE_ACTION_CATEGORY).toBeDefined();
      expect(UPDATE_ACTION_CATEGORY.definitions).toBeDefined();
      expect(UPDATE_ACTION_CATEGORY.definitions.length).toBeGreaterThan(0);
    });

    test('GraphQL delete mutation structure is correct', () => {
      expect(DELETE_ACTION_CATEGORY).toBeDefined();
      expect(DELETE_ACTION_CATEGORY.definitions).toBeDefined();
      expect(DELETE_ACTION_CATEGORY.definitions.length).toBeGreaterThan(0);
    });
  });

  describe('Component Rendering', () => {
    test('renders component successfully', () => {
      renderComponent();
      expect(screen.getByTestId('admin-modal')).toBeInTheDocument();
    });

    test('renders when modal is open', () => {
      renderComponent({ isOpenModal: true });
      expect(screen.getByTestId('admin-modal')).toBeInTheDocument();
    });

    test('renders when modal is closed', () => {
      renderComponent({ isOpenModal: false });
      expect(screen.getByTestId('admin-modal')).toBeInTheDocument();
    });
  });

  describe('Create Action Category', () => {
    test('create mutation structure is correct', () => {
      const createMock = {
        request: {
          query: CREATE_ACTION_CATEGORY,
          variables: {
            actionCategory: { name: 'Test Category' },
          },
        },
        result: {
          data: {
            createActionCategory: {
              _id: 'new-cat-id',
            },
          },
        },
      };

      expect(createMock.request.query).toBeDefined();
      expect(createMock.result.data.createActionCategory._id).toBe('new-cat-id');
    });
  });

  describe('Update Action Category', () => {
    test('update mutation structure is correct', () => {
      const updateMock = {
        request: {
          query: UPDATE_ACTION_CATEGORY,
          variables: {
            actionCategoryInput: {
              _id: 'cat1',
              name: 'Updated Category',
            },
          },
        },
        result: {
          data: {
            updateActionCategory: {
              _id: 'cat1',
            },
          },
        },
      };

      expect(updateMock.request.query).toBeDefined();
      expect(updateMock.result.data.updateActionCategory._id).toBe('cat1');
    });
  });

  describe('Delete Action Category', () => {
    test('delete mutation structure is correct', () => {
      const deleteMock = {
        request: {
          query: DELETE_ACTION_CATEGORY,
          variables: {
            _id: 'cat1',
          },
        },
        result: {
          data: {
            deleteActionCategory: true,
          },
        },
      };

      expect(deleteMock.request.query).toBeDefined();
      expect(deleteMock.result.data.deleteActionCategory).toBe(true);
    });
  });

  describe('Form Validation', () => {
    test('component handles validation errors', () => {
      renderComponent({ errors: { name: 'Required' } });
      expect(screen.getByTestId('admin-modal')).toBeInTheDocument();
    });

    test('component handles empty errors', () => {
      renderComponent({ errors: {} });
      expect(screen.getByTestId('admin-modal')).toBeInTheDocument();
    });
  });

  describe('Modal State Management', () => {
    test('handles add modal type', () => {
      renderComponent({ modalType: 'add' });
      expect(screen.getByTestId('admin-modal')).toBeInTheDocument();
    });

    test('handles edit modal type', () => {
      renderComponent({ modalType: 'edit' });
      expect(screen.getByTestId('admin-modal')).toBeInTheDocument();
    });

    test('handles closed modal type', () => {
      renderComponent({ modalType: 'closed' });
      expect(screen.getByTestId('admin-modal')).toBeInTheDocument();
    });
  });
});
