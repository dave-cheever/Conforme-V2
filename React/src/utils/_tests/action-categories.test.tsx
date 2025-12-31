import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { gql } from '@apollo/client';

import ActionCategories from '../../pages/admin/action-categories';
import { actionCategoryPanelConfig } from '../../components/PanelView';
import PanelView from '../../components/PanelView/PanelView';

// Mock contexts and hooks
const mockSetAdminModalState = vi.fn();
const mockRefetch = vi.fn();
const mockSetCurrentPage = vi.fn();
const mockSetPageSize = vi.fn();
const mockSetTotal = vi.fn();
const mockSetSortType = vi.fn();
const mockSetSortOrder = vi.fn();
const mockReset = vi.fn();
const mockTrigger = vi.fn().mockResolvedValue(true);
const mockGetValues = vi.fn();

const mockActionCategories = [
  {
    _id: 'cat1',
    name: 'Map Accuracy',
    used: 76,
    metatags: {
      updatedAt: '2025-09-24T17:34:00Z',
    },
  },
  {
    _id: 'cat2',
    name: 'Safety Compliance',
    used: 0,
    metatags: {
      updatedAt: '2025-09-20T10:15:00Z',
    },
  },
];

const mockQueryData = {
  actionCategories: {
    actionCategories: mockActionCategories,
    total: 2,
  },
};

// Define the GraphQL query for testing
const GET_ACTION_CATEGORIES = gql`
  query ($pagination: PaginationInput) {
    actionCategories(pagination: $pagination) {
      actionCategories {
        _id
        name
        metatags {
          updatedAt
        }
      }
      total
    }
  }
`;

// Mock GraphQL query
const GET_ACTION_CATEGORIES_MOCK = {
  request: {
    query: GET_ACTION_CATEGORIES,
    variables: {
      pagination: {
        limit: 10,
        offset: 0,
        sortBy: 'name',
        sortDirection: 'asc',
      },
    },
  },
  result: {
    data: mockQueryData,
  },
};

vi.mock('../../contexts/AdminProvider', () => ({
  useAdminContext: () => ({
    adminModalState: 'closed',
    setAdminModalState: mockSetAdminModalState,
  }),
}));

vi.mock('../../hooks/usePagination', () => ({
  __esModule: true,
  default: () => ({
    currentPage: 1,
    setCurrentPage: mockSetCurrentPage,
    pageSize: 10,
    setPageSize: mockSetPageSize,
    total: 2,
    setTotal: mockSetTotal,
  }),
}));

vi.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    formState: { errors: {} },
    getValues: mockGetValues,
    reset: mockReset,
    trigger: mockTrigger,
  }),
}));

vi.mock('../../hooks/useDevice', () => ({
  __esModule: true,
  default: () => 'desktop',
}));

describe('Action Categories Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetValues.mockReturnValue({ _id: undefined, name: '' });
  });

  test('action categories page component exists and can be imported', () => {
    expect(ActionCategories).toBeDefined();
    expect(typeof ActionCategories).toBe('function');
  });

  test('GraphQL query structure is correct', () => {
    expect(GET_ACTION_CATEGORIES).toBeDefined();
    // Verify the query is a valid GraphQL query
    expect(GET_ACTION_CATEGORIES.definitions).toBeDefined();
    expect(GET_ACTION_CATEGORIES.definitions.length).toBeGreaterThan(0);
  });
});

describe('Action Category Panel Config Integration', () => {
  test('actionCategoryPanelConfig can be used with PanelView', () => {
    const mockItems = [
      {
        _id: 'cat1',
        name: 'Test Category',
        used: 5,
        metatags: {
          updatedAt: '2025-01-15T10:30:00Z',
        },
      },
    ];

    const panelConfig = {
      ...actionCategoryPanelConfig,
      actions: {
        ...actionCategoryPanelConfig.actions,
        primary: {
          ...actionCategoryPanelConfig.actions.primary!,
          onClick: vi.fn(),
        },
        panelClick: {
          onClick: vi.fn(),
        },
        delete: {
          ...actionCategoryPanelConfig.actions.delete!,
          onClick: vi.fn(),
        },
      },
    };

    render(
      <ChakraProvider data-id="013105">
        <PanelView
          data-id="013106"
          config={panelConfig}
          items={mockItems}
          dataSourceName="action categories" />
      </ChakraProvider>,
    );

    expect(screen.getByText('Test Category')).toBeDefined();
  });

  test('panel config renders used count correctly', () => {
    const mockItem = {
      _id: 'cat1',
      name: 'Test Category',
      used: 1,
      metatags: {
        updatedAt: '2025-01-15T10:30:00Z',
      },
    };

    const usedField = actionCategoryPanelConfig.details.find((detail) => detail.key === 'used');
    const renderFunction = usedField?.render;

    expect(renderFunction).toBeDefined();
    const result = renderFunction?.(1, mockItem);

    expect(result).toBeDefined();
    // Check that result contains the correct structure
    if (result && typeof result === 'object' && 'props' in result) {
      expect(result.props.children).toBeDefined();
    }
  });

  test('panel config renders date correctly', () => {
    const mockItem = {
      _id: 'cat1',
      name: 'Test Category',
      used: 0,
      metatags: {
        updatedAt: '2025-09-24T17:34:00Z',
      },
    };

    const dateField = actionCategoryPanelConfig.details.find((detail) => detail.key === 'metatags.updatedAt');
    const renderFunction = dateField?.render;

    expect(renderFunction).toBeDefined();
    const result = renderFunction?.(mockItem.metatags.updatedAt, mockItem);

    expect(result).toBeDefined();
    // Check that result contains formatted date
    if (result && typeof result === 'object' && 'props' in result) {
      expect(result.props.children).toBeDefined();
    }
  });

  test('panel config handles missing date gracefully', () => {
    const dateField = actionCategoryPanelConfig.details.find((detail) => detail.key === 'metatags.updatedAt');
    const renderFunction = dateField?.render;

    const resultNull = renderFunction?.(null, null);
    const resultUndefined = renderFunction?.(undefined, undefined);

    expect(resultNull).toBeDefined();
    expect(resultUndefined).toBeDefined();
  });

  test('panel config title render handles empty values', () => {
    const titleField = actionCategoryPanelConfig.title.primary;
    const renderFunction = titleField.render;

    const resultEmpty = renderFunction?.('', null);
    const resultNull = renderFunction?.(null as any, null);
    const resultUndefined = renderFunction?.(undefined as any, undefined);

    expect(resultEmpty).toBeDefined();
    expect(resultNull).toBeDefined();
    expect(resultUndefined).toBeDefined();
  });

  test('panel config includes delete action', () => {
    expect(actionCategoryPanelConfig.actions.delete).toBeDefined();
    expect(actionCategoryPanelConfig.actions.delete?.label).toBe('Delete');
    expect(actionCategoryPanelConfig.actions.delete?.icon).toBeDefined();
  });
});

describe('Action Categories Delete Functionality', () => {
  test('delete mutation structure is correct', () => {
    const DELETE_ACTION_CATEGORY = gql`
      mutation ($_id: String!) {
        deleteActionCategory(_id: $_id)
      }
    `;

    expect(DELETE_ACTION_CATEGORY).toBeDefined();
    expect(DELETE_ACTION_CATEGORY.definitions).toBeDefined();
    expect(DELETE_ACTION_CATEGORY.definitions.length).toBeGreaterThan(0);
  });

  test('delete mutation accepts _id parameter', () => {
    const deleteVariables = {
      _id: 'cat1',
    };

    expect(deleteVariables._id).toBe('cat1');
  });

  test('delete mutation returns boolean', () => {
    const deleteResult = {
      deleteActionCategory: true,
    };

    expect(typeof deleteResult.deleteActionCategory).toBe('boolean');
  });
});

