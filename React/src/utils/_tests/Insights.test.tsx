import { MockedProvider } from '@apollo/client/testing';
import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import * as filtersContextModule from '../../contexts/FiltersProvider';
import * as useDeviceModule from '../../hooks/useDevice';
import Insights, { GET_QUESTIONS_CATEGORIES } from '../../pages/insights/index';
import * as insightsModule from '../../pages/insights/index';

// Mock the child components
vi.mock('../../pages/insights/actions', () => ({
  default: ({ 'data-id': dataId }: { 'data-id': string }) => (
    <div data-id="001484" data-testid={`actions-insights-${dataId}`}>
      Actions Insights Component
    </div>
  ),
}));

vi.mock('../../pages/insights/answers', () => ({
  default: ({
    answerType,
    'data-id': dataId,
    questionsCategoriesId,
  }: {
    answerType: string;
    'data-id': string;
    questionsCategoriesId: string;
  }) => (
    <div data-id="001485" data-testid={`answers-insights-${dataId}`}>
      Answers Insights Component - {answerType} - {questionsCategoriesId}
    </div>
  ),
}));

vi.mock('../../pages/insights/audits', () => ({
  default: ({ 'data-id': dataId }: { 'data-id': string }) => (
    <div data-id="001486" data-testid={`audits-insights-${dataId}`}>
      Audits Insights Component
    </div>
  ),
}));

// Mock other dependencies
vi.mock('../../hooks/useDevice', () => ({
  default: vi.fn(() => 'desktop'),
}));

vi.mock('../../contexts/FiltersProvider', () => ({
  useFiltersContext: vi.fn(() => ({
    setUsedFilters: vi.fn(),
    setShowFiltersPanel: vi.fn(),
  })),
}));

vi.mock('../../components/FilterButton', () => ({
  default: ({ 'data-id': dataId, insightsFilter }: { 'data-id': string; insightsFilter?: boolean }) => (
    <button data-id="001487" data-testid={`filter-button-${dataId}`} type="button">
      Filter Button {insightsFilter ? '(Insights)' : ''}
    </button>
  ),
}));

vi.mock('../../components/Filters/QuickFilters', () => ({
  default: ({ 'data-id': dataId, w }: { 'data-id': string; w: string | string[] }) => (
    <div data-id="001488" data-testid={`quick-filters-${dataId}`} style={{ width: Array.isArray(w) ? w[0] : w }}>
      Quick Filters Component
    </div>
  ),
}));

vi.mock('../../components/Header', () => ({
  default: ({
    breadcrumbs,
    mobileBreadcrumbs,
    children,
    'data-id': dataId,
  }: {
    breadcrumbs: string[];
    mobileBreadcrumbs: string[];
    children: React.ReactNode;
    'data-id': string;
  }) => (
    <div data-id="001489" data-testid={`header-${dataId}`}>
      <div data-id="001490">Breadcrumbs: {breadcrumbs.join(' > ')}</div>
      <div data-id="001491">Mobile Breadcrumbs: {mobileBreadcrumbs.join(' > ')}</div>
      {children}
    </div>
  ),
}));

vi.mock('../../components/Loader', () => ({
  default: ({ center, 'data-id': dataId }: { center?: boolean; 'data-id': string }) => (
    <div data-id="001492" data-center={center} data-testid={`loader-${dataId}`}>
      Loading...
    </div>
  ),
}));

// Mock i18next
vi.mock('i18next', () => ({
  t: (key: string) => key,
}));

// Mock theme
const mockTheme = {
  colors: {},
};

// Helper for elements that use data-id (not data-testid)
const getByDataId = (id: string) => document.querySelector(`[data-id="${id}"]`);

// Mock ChakraProvider wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return (
    <ChakraProvider data-id="001493" theme={mockTheme}>
      <MockedProvider data-id="001494" mocks={[]}>
        {children}
      </MockedProvider>
    </ChakraProvider>
  );
}

describe('Insights', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(
      <TestWrapper data-id="001495">
        <Insights data-id="001496" />
      </TestWrapper>,
    );

    expect(screen.getByTestId('loader-000713')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders error state when query fails', async () => {
    const errorMocks = [
      {
        request: {
          query: GET_QUESTIONS_CATEGORIES,
          variables: {
            questionsCategoryQuery: {
              showInInsights: true,
            },
          },
        },
        error: new Error('GraphQL error'),
      },
    ];

    render(
      <ChakraProvider data-id="001497" theme={mockTheme}>
        <MockedProvider data-id="001498" mocks={errorMocks}>
          <Insights data-id="001499" />
        </MockedProvider>
      </ChakraProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('GraphQL error')).toBeInTheDocument();
    });
  });

  test('renders insights with default panels when data loads', async () => {
    const mocks = [
      {
        request: {
          query: GET_QUESTIONS_CATEGORIES,
          variables: {
            questionsCategoryQuery: {
              showInInsights: true,
            },
          },
        },
        result: {
          data: {
            questionsCategories: [],
          },
        },
      },
    ];

    render(
      <ChakraProvider data-id="001500" theme={mockTheme}>
        <MockedProvider data-id="001501" mocks={mocks}>
          <Insights data-id="001502" />
        </MockedProvider>
      </ChakraProvider>,
    );

    await waitFor(() => {
      // Check that header is rendered
      expect(screen.getByTestId('header-000708')).toBeInTheDocument();
      expect(screen.getByText('Breadcrumbs: Insights')).toBeInTheDocument();

      // Check that QuickFilters is rendered for desktop
      expect(screen.getByTestId('quick-filters-000711')).toBeInTheDocument();

      // Check that FilterPills is rendered
      expect(getByDataId('000715')).toBeTruthy();

      // Check that default panels are rendered
      expect(screen.getByText('Audits')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();

      // Check that the first panel (Audits) is selected by default
      expect(screen.getByTestId('audits-insights-000704')).toBeInTheDocument();
    });
  });

  test('renders insights with question categories when data loads', async () => {
    const mocks = [
      {
        request: {
          query: GET_QUESTIONS_CATEGORIES,
          variables: {
            questionsCategoryQuery: {
              showInInsights: true,
            },
          },
        },
        result: {
          data: {
            questionsCategories: [
              { _id: 'cat1', name: 'What is your favorite animal?', showInInsights: true },
              { _id: 'cat2', name: 'What is your favorite food?', showInInsights: true },
            ],
          },
        },
      },
    ];

    render(
      <ChakraProvider data-id="001503" theme={mockTheme}>
        <MockedProvider data-id="001504" mocks={mocks}>
          <Insights data-id="001505" />
        </MockedProvider>
      </ChakraProvider>,
    );

    await waitFor(() => {
      // Check that all panels are rendered
      expect(screen.getByText('Audits')).toBeInTheDocument();
      expect(screen.getByText('What is your favorite animal?')).toBeInTheDocument();
      expect(screen.getByText('What is your favorite food?')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();

      // Check that the first panel (Audits) is selected by default
      expect(screen.getByTestId('audits-insights-000704')).toBeInTheDocument();
    });
  });

  test('renders mobile layout when device is mobile', async () => {
    // Mock useDevice to return mobile
    vi.mocked(useDeviceModule.default).mockReturnValue('mobile');

    const mocks = [
      {
        request: {
          query: GET_QUESTIONS_CATEGORIES,
          variables: {
            questionsCategoryQuery: {
              showInInsights: true,
            },
          },
        },
        result: {
          data: {
            questionsCategories: [],
          },
        },
      },
    ];

    render(
      <ChakraProvider data-id="001506" theme={mockTheme}>
        <MockedProvider data-id="001507" mocks={mocks}>
          <Insights data-id="001508" />
        </MockedProvider>
      </ChakraProvider>,
    );

    await waitFor(() => {
      // Check that FilterButton is rendered for mobile
      expect(screen.getByTestId('filter-button-000709')).toBeInTheDocument();
      expect(screen.getByText('Filter Button (Insights)')).toBeInTheDocument();

      // Check that QuickFilters is NOT rendered for mobile
      expect(screen.queryByTestId('quick-filters-000711')).not.toBeInTheDocument();
    });
  });

  test('handles panel selection correctly', async () => {
    const mocks = [
      {
        request: {
          query: GET_QUESTIONS_CATEGORIES,
          variables: {
            questionsCategoryQuery: {
              showInInsights: true,
            },
          },
        },
        result: {
          data: {
            questionsCategories: [{ _id: 'cat1', name: 'Test Category', showInInsights: true }],
          },
        },
      },
    ];

    render(
      <ChakraProvider data-id="001509" theme={mockTheme}>
        <MockedProvider data-id="001510" mocks={mocks}>
          <Insights data-id="001511" />
        </MockedProvider>
      </ChakraProvider>,
    );

    await waitFor(() => {
      // Initially, Audits should be selected (first tab)
      expect(screen.getByTestId('audits-insights-000704')).toBeInTheDocument();
      // Answers tab should be present but not visible initially (it's the second tab)
      expect(screen.getByTestId('answers-insights-000705')).toBeInTheDocument();

      // Click on the Test Category pill
      const testCategoryPill = screen.getByText('Test Category');
      testCategoryPill.click();

      // Now the Test Category component should be rendered
      expect(screen.getByTestId('answers-insights-000705')).toBeInTheDocument();
      expect(screen.getByText('Answers Insights Component - Test Category - cat1')).toBeInTheDocument();
    });
  });

  test('applies correct data-id attributes', async () => {
    // Ensure we're in desktop mode for this test
    vi.mocked(useDeviceModule.default).mockReturnValue('desktop');

    const mocks = [
      {
        request: {
          query: GET_QUESTIONS_CATEGORIES,
          variables: {
            questionsCategoryQuery: {
              showInInsights: true,
            },
          },
        },
        result: {
          data: {
            questionsCategories: [],
          },
        },
      },
    ];

    render(
      <ChakraProvider data-id="001512" theme={mockTheme}>
        <MockedProvider data-id="001513" mocks={mocks}>
          <Insights data-id="001514" />
        </MockedProvider>
      </ChakraProvider>,
    );

    await waitFor(() => {
      // Check that all components have correct data-id attributes
      expect(screen.getByTestId('header-000708')).toBeInTheDocument(); // Header
      expect(screen.getByTestId('quick-filters-000711')).toBeInTheDocument(); // QuickFilters
      expect(getByDataId('000715')).toBeTruthy(); // FilterPills
      expect(screen.getByTestId('audits-insights-000704')).toBeInTheDocument(); // AuditsInsights
    });
  });

  test('renders insights styles correctly', () => {
    // This test verifies that the insightsStyles export is available
    const { insightsStyles } = insightsModule;

    expect(insightsStyles).toBeDefined();
    expect(insightsStyles.insights).toBeDefined();
    expect(insightsStyles.insights.header).toBeDefined();
    expect(insightsStyles.insights.secondaryText).toBeDefined();
  });

  test('handles empty questions categories gracefully', async () => {
    const mocks = [
      {
        request: {
          query: GET_QUESTIONS_CATEGORIES,
          variables: {
            questionsCategoryQuery: {
              showInInsights: true,
            },
          },
        },
        result: {
          data: {
            questionsCategories: null,
          },
        },
      },
    ];

    render(
      <ChakraProvider data-id="001515" theme={mockTheme}>
        <MockedProvider data-id="001516" mocks={mocks}>
          <Insights data-id="001517" />
        </MockedProvider>
      </ChakraProvider>,
    );

    await waitFor(() => {
      // Should still render the default panels (Audits and Actions)
      expect(screen.getByText('Audits')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
      expect(screen.getByTestId('audits-insights-000704')).toBeInTheDocument();
    });
  });

  test('calls setUsedFilters with correct filters for each panel', async () => {
    const mockSetUsedFilters = vi.fn();
    const mockSetShowFiltersPanel = vi.fn();

    // Mock the context with spy functions
    vi.mocked(filtersContextModule.useFiltersContext).mockReturnValue({
      setUsedFilters: mockSetUsedFilters,
      setShowFiltersPanel: mockSetShowFiltersPanel,
    } as any);

    const mocks = [
      {
        request: {
          query: GET_QUESTIONS_CATEGORIES,
          variables: {
            questionsCategoryQuery: {
              showInInsights: true,
            },
          },
        },
        result: {
          data: {
            questionsCategories: [],
          },
        },
      },
    ];

    render(
      <ChakraProvider data-id="001518" theme={mockTheme}>
        <MockedProvider data-id="001519" mocks={mocks}>
          <Insights data-id="001520" />
        </MockedProvider>
      </ChakraProvider>,
    );

    await waitFor(() => {
      // Should call setUsedFilters with Audits filters initially
      expect(mockSetUsedFilters).toHaveBeenCalledWith(['walkType', 'status', 'locationsIds', 'businessUnitsIds', 'usersIds']);
    });
  });
});
