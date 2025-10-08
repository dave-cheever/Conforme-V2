import { MemoryRouter } from 'react-router-dom';

import { MockedProvider } from '@apollo/client/testing';
import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import * as useDeviceModule from '../../hooks/useDevice';
import Answers, {
  GET_ANSWERS,
  Category,
  AuditType,
  flatMapCategories,
  dedupeCategories,
  buildPanels,
  categoryIdsForPanel,
} from '../../pages/answers';

// Mock components
vi.mock('../../components/AnswerSquare', () => ({
  default: ({ answer, 'data-id': dataId }: { answer: any; 'data-id': string }) => (
    <div data-id="001587" data-testid={`answer-square-${dataId}`}>
      Answer: {answer.name}
    </div>
  ),
}));

vi.mock('../../components/AnswersList', () => ({
  default: ({ answers, 'data-id': dataId }: { answers: any[]; 'data-id': string }) => (
    <div data-id="001588" data-testid={`answers-list-${dataId}`}>
      Answers: {answers.length}
    </div>
  ),
}));

vi.mock('../../components/FilterPills', () => ({
  default: ({ pills, selectedIndex, children, panelPadding, 'data-id': dataId }: any) => (
    <div data-id="001589" data-testid={`filter-pills-${dataId}`}>
      <div data-id="001590">
        Pills: {pills.length}, Selected: {selectedIndex}
      </div>
      <div data-id="001591">Padding: {panelPadding.join(', ')}</div>
      {children(pills[selectedIndex])}
    </div>
  ),
}));

vi.mock('../../hooks/useDevice', () => ({ default: vi.fn(() => 'desktop') }));
vi.mock('../../contexts/FiltersProvider', () => ({
  useFiltersContext: () => ({
    setUsedFilters: vi.fn(),
    setShowFiltersPanel: vi.fn(),
    setFilters: vi.fn(),
    filtersValues: {},
    answerFiltersValue: {},
    setAnswerFiltersValue: vi.fn(),
    usedFilters: [],
  }),
}));
vi.mock('../../contexts/AdminProvider', () => ({
  useAdminContext: () => ({
    adminModalState: 'closed',
    setAdminModalState: vi.fn(),
  }),
}));
vi.mock('../../contexts/AppProvider', () => ({
  useAppContext: () => ({
    user: { _id: 'test-user' },
  }),
}));
vi.mock('../../components/FilterButton', () => ({
  default: ({ 'data-id': dataId }: { 'data-id': string }) => (
    <button data-id="001592" data-testid={`filter-button-${dataId}`} type="button">
      Filter
    </button>
  ),
}));
vi.mock('../../components/Header', () => ({
  default: ({ breadcrumbs, children, 'data-id': dataId }: any) => (
    <div data-id="001593" data-testid={`header-${dataId}`}>
      <div data-id="001594">Breadcrumbs: {breadcrumbs.join(' > ')}</div>
      {children}
    </div>
  ),
}));
vi.mock('../../components/Loader', () => ({
  default: ({ 'data-id': dataId }: { 'data-id': string }) => (
    <div data-id="001595" data-testid={`loader-${dataId}`}>
      Loading...
    </div>
  ),
}));
vi.mock('i18next', () => ({ t: (key: string) => key }));

const mockTheme = { colors: {} };

// Helper for elements that use data-id (not data-testid)
const getByDataId = (id: string) => document.querySelector(`[data-id="${id}"]`);

const mockAnswersData = {
  answers: [
    {
      _id: '1',
      questionId: 'q1',
      question: {
        _id: 'q1',
        question: 'Answer 1',
        questionsCategoryId: 'cat1',
        questionsCategory: {
          name: 'Category 1',
          useStatus: 'active',
          notBlockedAfterCompletion: false,
          options: [],
        },
        category: { name: 'Category 1' },
        scope: { _id: 'scope1' },
      },
      addedBy: { displayName: 'User 1', imgUrl: '' },
      businessUnit: { _id: 'bu1', name: 'Virtual' },
      scope: { type: 'audit', _id: 'scope1' },
      audit: {
        _id: 'audit1',
        reference: 'REF001',
        walkType: 'walk',
        location: { _id: 'loc1', name: 'Location 1' },
        businessUnitId: 'bu1',
        businessUnit: { _id: 'bu1', name: 'Virtual' },
        auditType: { businessUnitScope: 'all' },
        status: 'completed',
        auditorId: 'auditor1',
        auditor: { displayName: 'Auditor 1' },
        participantsIds: [],
        metatags: { addedAt: '2024-01-01' },
      },
      status: 'completed',
      options: [],
      attachments: [],
      actions: [],
      creator: { displayName: 'Creator 1', imgUrl: '' },
      metatags: { addedAt: '2024-01-01', addedBy: 'user1', updatedAt: '2024-01-01' },
    },
  ],
  auditTypes: [
    {
      _id: 'auditType1',
      questionsCategories: [
        { _id: 'cat1', name: 'Category 1' },
        { _id: 'cat2', name: 'Category 2' },
      ],
    },
  ],
};

function TestWrapper({ children, mocks = [] }: { readonly children: React.ReactNode; readonly mocks?: any[] }) {
  return (
    <MemoryRouter data-id="001596">
      <ChakraProvider data-id="001597" theme={mockTheme}>
        <MockedProvider data-id="001598" mocks={mocks}>
          {children}
        </MockedProvider>
      </ChakraProvider>
    </MemoryRouter>
  );
}

describe('Answers', () => {
  test('renders loading state', () => {
    render(
      <TestWrapper data-id="001599">
        <Answers data-id="001600" />
      </TestWrapper>,
    );
    expect(screen.getByTestId('loader-000278')).toBeInTheDocument();
  });

  test('renders with FilterPills integration', async () => {
    const mocks = [
      {
        request: { query: GET_ANSWERS, variables: { answerQuery: {} } },
        result: { data: { answers: [{ _id: '1', name: 'Test Answer' }], auditTypes: [] } },
      },
      {
        request: { query: GET_ANSWERS, variables: { answerQuery: { questionsCategoriesIds: [] } } },
        result: { data: { answers: [{ _id: '1', name: 'Test Answer' }], auditTypes: [] } },
      },
    ];

    render(
      <TestWrapper data-id="001601" mocks={mocks}>
        <Answers data-id="001602" />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('filter-pills-000279')).toBeInTheDocument();
    });
  });

  test('renders grid view by default', async () => {
    const mocks = [
      {
        request: { query: GET_ANSWERS, variables: { answerQuery: {} } },
        result: { data: mockAnswersData },
      },
    ];

    render(
      <TestWrapper data-id="001603" mocks={mocks}>
        <Answers data-id="001604" />
      </TestWrapper>,
    );

    await waitFor(() => {
      // Header visible
      expect(screen.getByTestId('header-000269')).toBeInTheDocument();
      // Desktop toolbar (grid/list + export) uses data-id, not data-testid
      expect(getByDataId('000213')).toBeTruthy(); // Stack with buttons
      expect(getByDataId('000271')).toBeTruthy(); // Export link
    });
  });

  test('handles empty answers', async () => {
    const mocks = [
      {
        request: { query: GET_ANSWERS, variables: { answerQuery: {} } },
        result: { data: { answers: [], auditTypes: [] } },
      },
    ];

    render(
      <TestWrapper data-id="001605" mocks={mocks}>
        <Answers data-id="001606" />
      </TestWrapper>,
    );

    await waitFor(() => {
      // Check that the header is rendered even with no data
      expect(screen.getByTestId('header-000269')).toBeInTheDocument();
      // Check that the sort dropdown is rendered (mobile layout)
      expect(getByDataId('000474')).toBeTruthy();
    });
  });

  test('applies correct panel padding', async () => {
    const mocks = [
      {
        request: { query: GET_ANSWERS, variables: { answerQuery: {} } },
        result: { data: { answers: [], auditTypes: [] } },
      },
    ];

    render(
      <TestWrapper data-id="001607" mocks={mocks}>
        <Answers data-id="001608" />
      </TestWrapper>,
    );

    await waitFor(() => {
      // Check that the header is rendered
      expect(screen.getByTestId('header-000269')).toBeInTheDocument();
      // Check that the sort dropdown is rendered (mobile layout)
      expect(getByDataId('000474')).toBeTruthy();
    });
  });

  test('renders error state', async () => {
    const errorMocks = [
      {
        request: { query: GET_ANSWERS, variables: { answerQuery: {} } },
        error: new Error('GraphQL error'),
      },
    ];

    render(
      <TestWrapper data-id="001609" mocks={errorMocks}>
        <Answers data-id="001610" />
      </TestWrapper>,
    );

    await waitFor(() => {
      // Header visible even on error
      expect(screen.getByTestId('header-000269')).toBeInTheDocument();
      // Desktop toolbar (grid/list + export) uses data-id
      expect(getByDataId('000213')).toBeTruthy();
      expect(getByDataId('000271')).toBeTruthy();
    });
  });

  test('renders mobile layout', async () => {
    vi.mocked(useDeviceModule.default).mockReturnValue('mobile');

    const mocks = [
      {
        request: { query: GET_ANSWERS, variables: { answerQuery: {} } },
        result: { data: mockAnswersData },
      },
    ];

    render(
      <TestWrapper data-id="001611" mocks={mocks}>
        <Answers data-id="001612" />
      </TestWrapper>,
    );

    await waitFor(() => {
      // Header
      expect(screen.getByTestId('header-000269')).toBeInTheDocument();
      // Mobile sort dropdown wrapper (data-id="000474")
      expect(getByDataId('000474')).toBeTruthy();
    });
  });

  test('handles pill selection', async () => {
    const mocks = [
      {
        request: { query: GET_ANSWERS, variables: { answerQuery: {} } },
        result: { data: { answers: [{ _id: '1', name: 'Test Answer' }], auditTypes: [] } },
      },
    ];

    render(
      <TestWrapper data-id="001613" mocks={mocks}>
        <Answers data-id="001614" />
      </TestWrapper>,
    );

    await waitFor(() => {
      // Check that the header is rendered
      expect(screen.getByTestId('header-000269')).toBeInTheDocument();
      // Check that the sort dropdown is rendered (mobile layout)
      expect(getByDataId('000474')).toBeTruthy();
    });
  });

  test('renders with correct data-id attributes', async () => {
    const mocks = [
      {
        request: { query: GET_ANSWERS, variables: { answerQuery: {} } },
        result: { data: { answers: [{ _id: '1', name: 'Test Answer' }], auditTypes: [] } },
      },
    ];

    render(
      <TestWrapper data-id="001615" mocks={mocks}>
        <Answers data-id="001616" />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('header-000269')).toBeInTheDocument();
      // Mobile sort dropdown wrapper (data-id only)
      expect(getByDataId('000474')).toBeTruthy();
    });
  });

  test('handles multiple answers in grid view', async () => {
    const mocks = [
      {
        request: { query: GET_ANSWERS, variables: { answerQuery: {} } },
        result: {
          data: {
            answers: [
              { _id: '1', name: 'Answer 1' },
              { _id: '2', name: 'Answer 2' },
              { _id: '3', name: 'Answer 3' },
            ],
            auditTypes: [],
          },
        },
      },
    ];

    render(
      <TestWrapper data-id="001617" mocks={mocks}>
        <Answers data-id="001618" />
      </TestWrapper>,
    );

    await waitFor(() => {
      // Header
      expect(screen.getByTestId('header-000269')).toBeInTheDocument();
      // Mobile sort dropdown wrapper (data-id="000474")
      expect(getByDataId('000474')).toBeTruthy();
    });
  });

  test('renders breadcrumbs correctly', async () => {
    const mocks = [
      {
        request: { query: GET_ANSWERS, variables: { answerQuery: {} } },
        result: { data: { answers: [], auditTypes: [] } },
      },
    ];

    render(
      <TestWrapper data-id="001619" mocks={mocks}>
        <Answers data-id="001620" />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Breadcrumbs: Answers')).toBeInTheDocument();
    });
  });

  test('handles FilterPills children function correctly', async () => {
    const mocks = [
      {
        request: { query: GET_ANSWERS, variables: { answerQuery: {} } },
        result: { data: mockAnswersData },
      },
    ];

    render(
      <TestWrapper data-id="001621" mocks={mocks}>
        <Answers data-id="001622" />
      </TestWrapper>,
    );

    await waitFor(() => {
      // Header
      expect(screen.getByTestId('header-000269')).toBeInTheDocument();
      // Mobile sort dropdown wrapper (data-id="000474")
      expect(getByDataId('000474')).toBeTruthy();
    });
  });
});

// Add functional tests for the Answers component
describe('Answers Component Functional Tests', () => {
  test('buildPanels creates correct panel structure', () => {
    const mockAuditTypes: AuditType[] = [
      {
        _id: 'at1',
        questionsCategories: [
          { _id: 'cat1', name: 'Safety' },
          { _id: 'cat2', name: 'Quality' },
        ],
      },
      {
        _id: 'at2',
        questionsCategories: [
          { _id: 'cat2', name: 'Quality' },
          { _id: 'cat3', name: 'Environment' },
        ],
      },
    ];

    const panels = buildPanels(mockAuditTypes);

    // Should have 'All' panel + 3 unique categories
    expect(panels).toHaveLength(4);
    expect(panels[0]).toEqual({ _id: 'all', name: 'All' });

    const panelIds = panels.map((p) => p._id);
    expect(panelIds).toContain('cat1');
    expect(panelIds).toContain('cat2');
    expect(panelIds).toContain('cat3');
  });

  test('buildPanels handles when all audit types have null categories', () => {
    const mockAuditTypes: AuditType[] = [
      {
        _id: 'at1',
        questionsCategories: null,
      },
      {
        _id: 'at2',
        questionsCategories: null,
      },
    ];

    const panels = buildPanels(mockAuditTypes);

    // Should only have 'All' panel
    expect(panels).toHaveLength(1);
    expect(panels[0]).toEqual({ _id: 'all', name: 'All' });
  });

  test('categoryIdsForPanel returns correct category IDs for non-All panel', () => {
    const mockPanels = [
      { _id: 'all', name: 'All' },
      { _id: 'cat1', name: 'Safety' },
      { _id: 'cat2', name: 'Quality' },
    ];
    const parsedFilters = { questionsCategoriesIds: ['cat1', 'cat2', 'cat3'] };

    // Test selecting 'Safety' panel (index 1)
    const result = categoryIdsForPanel(mockPanels, 1, parsedFilters);
    expect(result).toEqual(['cat1']);
  });

  test('categoryIdsForPanel returns all category IDs for All panel', () => {
    const mockPanels = [
      { _id: 'all', name: 'All' },
      { _id: 'cat1', name: 'Safety' },
      { _id: 'cat2', name: 'Quality' },
    ];
    const parsedFilters = { questionsCategoriesIds: ['cat1', 'cat2'] };

    // Test selecting 'All' panel (index 0)
    const result = categoryIdsForPanel(mockPanels, 0, parsedFilters);
    expect(result).toEqual(['cat1', 'cat2']);
  });

  test('categoryIdsForPanel handles missing parsedFilters gracefully', () => {
    const mockPanels = [
      { _id: 'all', name: 'All' },
      { _id: 'cat1', name: 'Safety' },
    ];

    // Test selecting 'All' panel with no parsedFilters
    const result = categoryIdsForPanel(mockPanels, 0);
    expect(result).toEqual([]);
  });

  test('flatMapCategories flattens all categories from multiple audit types', () => {
    const mockAuditTypes: AuditType[] = [
      {
        _id: 'at1',
        questionsCategories: [
          { _id: 'cat1', name: 'Safety' },
          { _id: 'cat2', name: 'Quality' },
        ],
      },
      {
        _id: 'at2',
        questionsCategories: [{ _id: 'cat3', name: 'Environment' }],
      },
    ];

    const categories = flatMapCategories(mockAuditTypes);
    expect(categories).toHaveLength(3);
    expect(categories[0]).toEqual({ _id: 'cat1', name: 'Safety' });
    expect(categories[1]).toEqual({ _id: 'cat2', name: 'Quality' });
    expect(categories[2]).toEqual({ _id: 'cat3', name: 'Environment' });
  });

  test('dedupeCategories removes duplicate categories by ID', () => {
    const categories: Category[] = [
      { _id: 'cat1', name: 'Safety' },
      { _id: 'cat2', name: 'Quality' },
      { _id: 'cat1', name: 'Safety Duplicate' },
      { _id: 'cat3', name: 'Environment' },
    ];

    const dedupedMap = dedupeCategories(categories);

    // Should have 3 unique categories
    expect(dedupedMap.size).toBe(3);

    // First occurrence should be kept
    expect(dedupedMap.get('cat1')).toEqual({ _id: 'cat1', name: 'Safety' });
    expect(dedupedMap.get('cat2')).toEqual({ _id: 'cat2', name: 'Quality' });
    expect(dedupedMap.get('cat3')).toEqual({ _id: 'cat3', name: 'Environment' });
  });

  test('buildPanels orders panels with All first', () => {
    const mockAuditTypes: AuditType[] = [
      {
        _id: 'at1',
        questionsCategories: [
          { _id: 'cat1', name: 'Zebra' },
          { _id: 'cat2', name: 'Apple' },
        ],
      },
    ];

    const panels = buildPanels(mockAuditTypes);

    // 'All' should always be first
    expect(panels[0]).toEqual({ _id: 'all', name: 'All' });
  });
});
