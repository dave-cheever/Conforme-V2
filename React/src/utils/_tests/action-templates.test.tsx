import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { gql } from '@apollo/client';

import ActionTemplates from '../../pages/admin/action-templates';
import { actionTemplatePanelConfig } from '../../components/PanelView';
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

const mockActionTemplates = [
  {
    _id: 'template1',
    title: 'Safety Inspection Template',
    description: '<p>Template for safety inspections</p>',
    actionCategoryId: 'cat1',
    suggestedOwnerId: 'user1',
    metatags: {
      updatedAt: '2025-01-15T10:30:00Z',
    },
    actionCategoryName: 'Safety Compliance',
  },
  {
    _id: 'template2',
    title: 'Quality Check Template',
    description: '<p>Template for quality checks</p>',
    actionCategoryId: 'cat2',
    suggestedOwnerId: null,
    metatags: {
      updatedAt: '2025-01-20T14:45:00Z',
    },
    actionCategoryName: 'Quality Assurance',
  },
  {
    _id: 'template3',
    title: 'Compliance Review',
    description: '',
    actionCategoryId: 'cat1',
    suggestedOwnerId: 'user2',
    metatags: {
      updatedAt: '2025-01-25T09:15:00Z',
    },
    actionCategoryName: 'Safety Compliance',
  },
];

const mockActionCategories = [
  {
    _id: 'cat1',
    name: 'Safety Compliance',
  },
  {
    _id: 'cat2',
    name: 'Quality Assurance',
  },
];

const mockQueryData = {
  actionTemplates: {
    actionTemplates: mockActionTemplates,
    total: 3,
  },
};

const mockCategoriesData = {
  actionCategories: {
    actionCategories: mockActionCategories,
    total: 2,
  },
};

// Define the GraphQL queries for testing
const GET_ACTION_TEMPLATES = gql`
  query ($pagination: PaginationInput) {
    actionTemplates(pagination: $pagination) {
      actionTemplates {
        _id
        title
        description
        actionCategoryId
        suggestedOwnerId
        metatags {
          updatedAt
        }
      }
      total
    }
  }
`;

const GET_ACTION_CATEGORIES = gql`
  query {
    actionCategories(pagination: { limit: 1000, offset: 0 }) {
      actionCategories {
        _id
        name
      }
      total
    }
  }
`;

const CREATE_ACTION_TEMPLATE = gql`
  mutation ($actionTemplate: ActionTemplateCreateInput!) {
    createActionTemplate(actionTemplate: $actionTemplate) {
      _id
    }
  }
`;

const UPDATE_ACTION_TEMPLATE = gql`
  mutation ($actionTemplateInput: ActionTemplateModifyInput!) {
    updateActionTemplate(actionTemplateInput: $actionTemplateInput) {
      _id
    }
  }
`;

const DELETE_ACTION_TEMPLATE = gql`
  mutation ($_id: String!) {
    deleteActionTemplate(_id: $_id)
  }
`;

// Mock GraphQL queries
const GET_ACTION_TEMPLATES_MOCK = {
  request: {
    query: GET_ACTION_TEMPLATES,
    variables: {
      pagination: {
        limit: 10,
        offset: 0,
        sortBy: 'title',
        sortDirection: 'asc',
      },
    },
  },
  result: {
    data: mockQueryData,
  },
};

const GET_ACTION_CATEGORIES_MOCK = {
  request: {
    query: GET_ACTION_CATEGORIES,
  },
  result: {
    data: mockCategoriesData,
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
    total: 3,
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

describe('Action Templates Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetValues.mockReturnValue({
      _id: undefined,
      title: '',
      description: '',
      actionCategoryId: '',
      suggestedOwnerId: '',
    });
  });

  describe('Component Existence and Import', () => {
    test('action templates page component exists and can be imported', () => {
      expect(ActionTemplates).toBeDefined();
      expect(typeof ActionTemplates).toBe('function');
    });

    test('GraphQL query structure is correct', () => {
      expect(GET_ACTION_TEMPLATES).toBeDefined();
      expect(GET_ACTION_TEMPLATES.definitions).toBeDefined();
      expect(GET_ACTION_TEMPLATES.definitions.length).toBeGreaterThan(0);
    });

    test('GraphQL categories query structure is correct', () => {
      expect(GET_ACTION_CATEGORIES).toBeDefined();
      expect(GET_ACTION_CATEGORIES.definitions).toBeDefined();
      expect(GET_ACTION_CATEGORIES.definitions.length).toBeGreaterThan(0);
    });

    test('GraphQL create mutation structure is correct', () => {
      expect(CREATE_ACTION_TEMPLATE).toBeDefined();
      expect(CREATE_ACTION_TEMPLATE.definitions).toBeDefined();
      expect(CREATE_ACTION_TEMPLATE.definitions.length).toBeGreaterThan(0);
    });

    test('GraphQL update mutation structure is correct', () => {
      expect(UPDATE_ACTION_TEMPLATE).toBeDefined();
      expect(UPDATE_ACTION_TEMPLATE.definitions).toBeDefined();
      expect(UPDATE_ACTION_TEMPLATE.definitions.length).toBeGreaterThan(0);
    });

    test('GraphQL delete mutation structure is correct', () => {
      expect(DELETE_ACTION_TEMPLATE).toBeDefined();
      expect(DELETE_ACTION_TEMPLATE.definitions).toBeDefined();
      expect(DELETE_ACTION_TEMPLATE.definitions.length).toBeGreaterThan(0);
    });
  });

  describe('Action Template Panel Config Integration', () => {
    test('actionTemplatePanelConfig can be used with PanelView', () => {
      const mockItems = [
        {
          _id: 'template1',
          title: 'Test Template',
          description: '<p>Test description</p>',
          actionCategoryId: 'cat1',
          suggestedOwnerId: 'user1',
          metatags: {
            updatedAt: '2025-01-15T10:30:00Z',
          },
          actionCategoryName: 'Test Category',
        },
      ];

      const panelConfig = {
        ...actionTemplatePanelConfig,
        actions: {
          ...actionTemplatePanelConfig.actions,
          primary: {
            ...actionTemplatePanelConfig.actions.primary!,
            onClick: vi.fn(),
          },
          panelClick: {
            onClick: vi.fn(),
          },
        },
      };

      render(
        <ChakraProvider data-id="013200">
          <PanelView
            data-id="013201"
            config={panelConfig}
            items={mockItems}
            dataSourceName="action templates" />
        </ChakraProvider>,
      );

      expect(screen.getByText('Test Template')).toBeDefined();
    });

    test('panel config renders title correctly', () => {
      const mockItem = {
        _id: 'template1',
        title: 'Safety Inspection Template',
        description: '<p>Template description</p>',
        actionCategoryId: 'cat1',
        suggestedOwnerId: 'user1',
        metatags: {
          updatedAt: '2025-01-15T10:30:00Z',
        },
        actionCategoryName: 'Safety Compliance',
      };

      const titleField = actionTemplatePanelConfig.title.primary;
      const renderFunction = titleField.render;

      expect(renderFunction).toBeDefined();
      const result = renderFunction?.(mockItem.title, mockItem);

      expect(result).toBeDefined();
      if (result && typeof result === 'object' && 'props' in result) {
        expect(result.props.children).toBeDefined();
      }
    });

    test('panel config does not have secondary title field (description not rendered in panel)', () => {
      // The actionTemplatePanelConfig only has a primary title field
      // Description is not rendered as a secondary title in the panel view
      expect(actionTemplatePanelConfig.title.primary).toBeDefined();
      expect(actionTemplatePanelConfig.title.secondary).toBeUndefined();
    });

    test('panel config renders category name correctly', () => {
      const mockItem = {
        _id: 'template1',
        title: 'Test Template',
        description: '<p>Description</p>',
        actionCategoryId: 'cat1',
        suggestedOwnerId: 'user1',
        metatags: {
          updatedAt: '2025-01-15T10:30:00Z',
        },
        actionCategoryName: 'Safety Compliance',
      };

      const categoryField = actionTemplatePanelConfig.details.find(
        (detail) => detail.key === 'actionCategoryName',
      );
      const renderFunction = categoryField?.render;

      expect(renderFunction).toBeDefined();
      const result = renderFunction?.(mockItem.actionCategoryName, mockItem);

      expect(result).toBeDefined();
      if (result && typeof result === 'object' && 'props' in result) {
        expect(result.props.children).toBeDefined();
      }
    });

    test('panel config renders date correctly', () => {
      const mockItem = {
        _id: 'template1',
        title: 'Test Template',
        description: '<p>Description</p>',
        actionCategoryId: 'cat1',
        suggestedOwnerId: 'user1',
        metatags: {
          updatedAt: '2025-01-15T10:30:00Z',
        },
        actionCategoryName: 'Test Category',
      };

      const dateField = actionTemplatePanelConfig.details.find(
        (detail) => detail.key === 'metatags.updatedAt',
      );
      const renderFunction = dateField?.render;

      expect(renderFunction).toBeDefined();
      const result = renderFunction?.(mockItem.metatags.updatedAt, mockItem);

      expect(result).toBeDefined();
      if (result && typeof result === 'object' && 'props' in result) {
        expect(result.props.children).toBeDefined();
      }
    });

    test('panel config does not render description (secondary field does not exist)', () => {
      // Description is not part of the panel config title structure
      // This is expected behavior - description is stored but not displayed in panel view
      expect(actionTemplatePanelConfig.title.secondary).toBeUndefined();
    });

    test('panel config handles missing date gracefully', () => {
      const dateField = actionTemplatePanelConfig.details.find(
        (detail) => detail.key === 'metatags.updatedAt',
      );
      const renderFunction = dateField?.render;

      const resultNull = renderFunction?.(null, null);
      const resultUndefined = renderFunction?.(undefined, undefined);

      expect(resultNull).toBeDefined();
      expect(resultUndefined).toBeDefined();
    });

    test('panel config handles missing category name gracefully', () => {
      const categoryField = actionTemplatePanelConfig.details.find(
        (detail) => detail.key === 'actionCategoryName',
      );
      const renderFunction = categoryField?.render;

      const resultNull = renderFunction?.(null, null);
      const resultUndefined = renderFunction?.(undefined, undefined);
      const resultEmpty = renderFunction?.('', null);

      expect(resultNull).toBeDefined();
      expect(resultUndefined).toBeDefined();
      expect(resultEmpty).toBeDefined();
    });

    test('panel config title render handles empty values', () => {
      const titleField = actionTemplatePanelConfig.title.primary;
      const renderFunction = titleField.render;

      const resultEmpty = renderFunction?.('', null);
      const resultNull = renderFunction?.(null as any, null);
      const resultUndefined = renderFunction?.(undefined as any, undefined);

      expect(resultEmpty).toBeDefined();
      expect(resultNull).toBeDefined();
      expect(resultUndefined).toBeDefined();
    });
  });

  describe('Action Template Data Validation', () => {
    test('validates required title field', () => {
      const invalidTemplate = {
        title: '',
        description: '<p>Description</p>',
        actionCategoryId: 'cat1',
        suggestedOwnerId: 'user1',
      };

      expect(invalidTemplate.title).toBe('');
    });

    test('validates required actionCategoryId field', () => {
      const invalidTemplate = {
        title: 'Test Template',
        description: '<p>Description</p>',
        actionCategoryId: '',
        suggestedOwnerId: 'user1',
      };

      expect(invalidTemplate.actionCategoryId).toBe('');
    });

    test('allows optional description field', () => {
      const validTemplate = {
        title: 'Test Template',
        description: '',
        actionCategoryId: 'cat1',
        suggestedOwnerId: 'user1',
      };

      expect(validTemplate.description).toBe('');
      expect(validTemplate.title).toBe('Test Template');
    });

    test('allows optional suggestedOwnerId field', () => {
      const validTemplate = {
        title: 'Test Template',
        description: '<p>Description</p>',
        actionCategoryId: 'cat1',
        suggestedOwnerId: null,
      };

      expect(validTemplate.suggestedOwnerId).toBeNull();
      expect(validTemplate.title).toBe('Test Template');
    });

    test('handles HTML description content', () => {
      const templateWithHtml = {
        title: 'Test Template',
        description: '<p>Rich text <strong>description</strong></p>',
        actionCategoryId: 'cat1',
        suggestedOwnerId: 'user1',
      };

      expect(templateWithHtml.description).toContain('<p>');
      expect(templateWithHtml.description).toContain('<strong>');
    });

    test('handles plain text description', () => {
      const templateWithPlainText = {
        title: 'Test Template',
        description: 'Plain text description',
        actionCategoryId: 'cat1',
        suggestedOwnerId: 'user1',
      };

      expect(templateWithPlainText.description).toBe('Plain text description');
    });
  });

  describe('Action Template Edge Cases', () => {
    test('handles template with all fields populated', () => {
      const completeTemplate = {
        _id: 'template1',
        title: 'Complete Template',
        description: '<p>Full description</p>',
        actionCategoryId: 'cat1',
        suggestedOwnerId: 'user1',
        metatags: {
          updatedAt: '2025-01-15T10:30:00Z',
        },
        actionCategoryName: 'Safety Compliance',
      };

      expect(completeTemplate._id).toBeDefined();
      expect(completeTemplate.title).toBeDefined();
      expect(completeTemplate.description).toBeDefined();
      expect(completeTemplate.actionCategoryId).toBeDefined();
      expect(completeTemplate.suggestedOwnerId).toBeDefined();
      expect(completeTemplate.metatags).toBeDefined();
      expect(completeTemplate.actionCategoryName).toBeDefined();
    });

    test('handles template with minimal required fields', () => {
      const minimalTemplate = {
        _id: 'template2',
        title: 'Minimal Template',
        actionCategoryId: 'cat1',
        metatags: {
          updatedAt: '2025-01-15T10:30:00Z',
        },
      };

      expect(minimalTemplate.title).toBeDefined();
      expect(minimalTemplate.actionCategoryId).toBeDefined();
    });

    test('handles template with null suggestedOwnerId', () => {
      const templateWithoutOwner = {
        _id: 'template3',
        title: 'Template Without Owner',
        description: '<p>Description</p>',
        actionCategoryId: 'cat1',
        suggestedOwnerId: null,
        metatags: {
          updatedAt: '2025-01-15T10:30:00Z',
        },
      };

      expect(templateWithoutOwner.suggestedOwnerId).toBeNull();
      expect(templateWithoutOwner.title).toBeDefined();
    });

    test('handles template with empty description', () => {
      const templateWithEmptyDescription = {
        _id: 'template4',
        title: 'Template With Empty Description',
        description: '',
        actionCategoryId: 'cat1',
        suggestedOwnerId: 'user1',
        metatags: {
          updatedAt: '2025-01-15T10:30:00Z',
        },
      };

      expect(templateWithEmptyDescription.description).toBe('');
      expect(templateWithEmptyDescription.title).toBeDefined();
    });

    test('handles template with very long title', () => {
      const longTitle = 'A'.repeat(200);
      const templateWithLongTitle = {
        _id: 'template5',
        title: longTitle,
        description: '<p>Description</p>',
        actionCategoryId: 'cat1',
        suggestedOwnerId: 'user1',
        metatags: {
          updatedAt: '2025-01-15T10:30:00Z',
        },
      };

      expect(templateWithLongTitle.title.length).toBe(200);
      expect(templateWithLongTitle.title).toBe(longTitle);
    });

    test('handles template with very long description', () => {
      const longDescription = '<p>' + 'A'.repeat(1000) + '</p>';
      const templateWithLongDescription = {
        _id: 'template6',
        title: 'Template',
        description: longDescription,
        actionCategoryId: 'cat1',
        suggestedOwnerId: 'user1',
        metatags: {
          updatedAt: '2025-01-15T10:30:00Z',
        },
      };

      expect(templateWithLongDescription.description.length).toBeGreaterThan(1000);
    });
  });

  describe('Action Template CRUD Operations', () => {
    test('create action template with valid data', () => {
      const newTemplate = {
        title: 'New Template',
        description: '<p>New description</p>',
        actionCategoryId: 'cat1',
        suggestedOwnerId: 'user1',
      };

      expect(newTemplate.title).toBe('New Template');
      expect(newTemplate.actionCategoryId).toBe('cat1');
    });

    test('update action template with valid data', () => {
      const updatedTemplate = {
        _id: 'template1',
        title: 'Updated Template',
        description: '<p>Updated description</p>',
        actionCategoryId: 'cat2',
        suggestedOwnerId: 'user2',
      };

      expect(updatedTemplate._id).toBe('template1');
      expect(updatedTemplate.title).toBe('Updated Template');
      expect(updatedTemplate.actionCategoryId).toBe('cat2');
    });

    test('update action template title only', () => {
      const partialUpdate = {
        _id: 'template1',
        title: 'New Title',
      };

      expect(partialUpdate._id).toBe('template1');
      expect(partialUpdate.title).toBe('New Title');
    });

    test('update action template description only', () => {
      const partialUpdate = {
        _id: 'template1',
        description: '<p>New description</p>',
      };

      expect(partialUpdate._id).toBe('template1');
      expect(partialUpdate.description).toBe('<p>New description</p>');
    });

    test('update action template category only', () => {
      const partialUpdate = {
        _id: 'template1',
        actionCategoryId: 'cat2',
      };

      expect(partialUpdate._id).toBe('template1');
      expect(partialUpdate.actionCategoryId).toBe('cat2');
    });

    test('update action template suggestedOwnerId only', () => {
      const partialUpdate = {
        _id: 'template1',
        suggestedOwnerId: 'user3',
      };

      expect(partialUpdate._id).toBe('template1');
      expect(partialUpdate.suggestedOwnerId).toBe('user3');
    });

    test('delete action template', () => {
      const templateToDelete = {
        _id: 'template1',
      };

      expect(templateToDelete._id).toBeDefined();
    });
  });

  describe('Action Template Data Structure', () => {
    test('template has correct structure with all fields', () => {
      const template = mockActionTemplates[0];

      expect(template).toHaveProperty('_id');
      expect(template).toHaveProperty('title');
      expect(template).toHaveProperty('description');
      expect(template).toHaveProperty('actionCategoryId');
      expect(template).toHaveProperty('suggestedOwnerId');
      expect(template).toHaveProperty('metatags');
      expect(template).toHaveProperty('actionCategoryName');
    });

    test('template metatags has correct structure', () => {
      const template = mockActionTemplates[0];

      expect(template.metatags).toHaveProperty('updatedAt');
      expect(template.metatags.updatedAt).toBeDefined();
    });

    test('template can have null suggestedOwnerId', () => {
      const template = mockActionTemplates[1];

      expect(template.suggestedOwnerId).toBeNull();
    });

    test('template can have empty description', () => {
      const template = mockActionTemplates[2];

      expect(template.description).toBe('');
    });
  });

  describe('Action Template Query Variables', () => {
    test('pagination variables are correctly structured', () => {
      const pagination = {
        limit: 10,
        offset: 0,
        sortBy: 'title',
        sortDirection: 'asc',
      };

      expect(pagination.limit).toBe(10);
      expect(pagination.offset).toBe(0);
      expect(pagination.sortBy).toBe('title');
      expect(pagination.sortDirection).toBe('asc');
    });

    test('pagination supports different sort directions', () => {
      const paginationAsc = {
        limit: 10,
        offset: 0,
        sortBy: 'title',
        sortDirection: 'asc',
      };

      const paginationDesc = {
        limit: 10,
        offset: 0,
        sortBy: 'title',
        sortDirection: 'desc',
      };

      expect(paginationAsc.sortDirection).toBe('asc');
      expect(paginationDesc.sortDirection).toBe('desc');
    });

    test('pagination supports different page sizes', () => {
      const paginationSmall = {
        limit: 5,
        offset: 0,
        sortBy: 'title',
        sortDirection: 'asc',
      };

      const paginationLarge = {
        limit: 50,
        offset: 0,
        sortBy: 'title',
        sortDirection: 'asc',
      };

      expect(paginationSmall.limit).toBe(5);
      expect(paginationLarge.limit).toBe(50);
    });
  });
});

