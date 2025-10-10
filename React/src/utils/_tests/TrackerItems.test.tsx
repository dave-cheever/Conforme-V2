import { BrowserRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

// ---- Unit under test
import TrackerItems from '../../pages/tracker-items';

// ---- MUTABLE fixtures the hook-mocks will read
let MOCK_FILTERS_VALUES: any = {};
let MOCK_USED_FILTERS: string[] = ['usersIds']; // non-empty to pass the first effect
const mockSetFilters = vi.fn();
const mockSetUsedFilters = vi.fn();
const mockSetResponsesStatusesCounts = vi.fn();
const mockSetShowFiltersPanel = vi.fn();
const mockSetResponseFiltersValue = vi.fn();
const mockSetDefaultFilters = vi.fn();

// Provide stable user/module for all tests
const TEST_USER = { _id: 'u1-db', userId: 'u1-app', displayName: 'User One' };
const TEST_MODULE = { _id: 'm1', customQuestionsInDashboard: [] };

// ---- Mock contexts/hooks/components used by TrackerItems
vi.mock('../../contexts/AppProvider', () => ({
  useAppContext: () => ({ user: TEST_USER, module: TEST_MODULE }),
}));

// Mock translation function
vi.mock('i18next', () => ({
  t: (key: string) => key, // Return the key as the translation
}));

vi.mock('../../contexts/FiltersProvider', () => ({
  useFiltersContext: () => ({
    filtersValues: MOCK_FILTERS_VALUES,
    appliedFilters: MOCK_FILTERS_VALUES,
    setUsedFilters: mockSetUsedFilters,
    setFilters: mockSetFilters,
    applyFiltersImmediately: mockSetFilters,
    setResponsesStatusesCounts: mockSetResponsesStatusesCounts,
    setShowFiltersPanel: mockSetShowFiltersPanel,
    setResponseFiltersValue: mockSetResponseFiltersValue,
    setDefaultFilters: mockSetDefaultFilters,
    usedFilters: MOCK_USED_FILTERS,
  }),
}));

vi.mock('../../hooks/useDevice', () => ({
  __esModule: true,
  default: () => 'desktop',
}));

// Keep Sort state out of the way; TrackerItems passes setSortType/setSortOrder through
vi.mock('../../hooks/useSort', () => ({
  __esModule: true,
  default: () => ({
    sortOrder: 'asc',
    sortType: 'dueDate',
    setSortType: vi.fn(),
    setSortOrder: vi.fn(),
  }),
}));

// Apollo: prevent network, return minimal shapes used by effects
vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual<typeof import('@apollo/client')>('@apollo/client');
  return {
    ...actual,
    useQuery: () => ({ data: { responses: { total: 0 } }, loading: false }),
    useLazyQuery: () => [
      vi.fn(async () => ({
        data: { responses: { responses: [], total: 0 } },
        loading: false,
      })),
      { loading: false },
    ],
    gql: (x: any) => x,
  };
});

// Replace heavy children with stubs so we can observe props
// AssignedToMeFilter needs to expose isChecked and let us call onToggle
const assignedToToggleSpy = vi.fn();
vi.mock('../../components/Filters/AssignedToMeFilter', () => ({
  __esModule: true,
  default: ({ isChecked, onToggle }: { isChecked: boolean; onToggle: (v: boolean) => void }) => (
    <div data-id="001335">
      <span data-id="001336" data-testid="assigned-state">
        {String(isChecked)}
      </span>
      <button
        data-id="001337"
        data-testid="toggle-on"
        onClick={() => {
          assignedToToggleSpy('on');
          onToggle(true);
        }}
        type="button"
      >
        on
      </button>
      <button
        data-id="001338"
        data-testid="toggle-off"
        onClick={() => {
          assignedToToggleSpy('off');
          onToggle(false);
        }}
        type="button"
      >
        off
      </button>
    </div>
  ),
}));

// Other children can be no-ops
vi.mock('../../components/ChangeViewButton', () => ({ default: () => <div data-id="001339" data-testid="change-view" /> }));
vi.mock('../../components/Header', () => ({
  default: ({ children }: any) => (
    <div data-id="001340">
      <div data-id="001341" data-testid="header" />
      {children}
    </div>
  ),
}));
vi.mock('../../components/SortButton', () => ({ default: () => <div data-id="001342" data-testid="sort" /> }));
vi.mock('../../components/TrackerItem/TrackerItemsList', () => ({ default: () => <div data-id="001343" data-testid="list" /> }));
vi.mock('../../components/TrackerItem/TrackerItemSquare', () => ({ default: () => <div data-id="001344" data-testid="square" /> }));
vi.mock('../../components/TrackerItem/TrackerItemsGroup', () => ({ default: () => <div data-id="001345" data-testid="group" /> }));
vi.mock('../../components/Loader', () => ({ default: () => <div data-id="001346" data-testid="loader" /> }));
vi.mock('react-infinite-scroller', () => ({
  default: ({ children }: any) => (
    <div data-id="001347" data-testid="infinite">
      {children}
    </div>
  ),
}));

// Critically: spy on updateLocalStorageFilter so we can assert args
const updateLocalStorageFilterSpy = vi.fn();
vi.mock('../../utils/filterStorage', () => ({
  __esModule: true,
  default: (...args: any[]) => updateLocalStorageFilterSpy(...args),
}));

const renderPage = () =>
  render(
    <BrowserRouter data-id="001517">
      <TrackerItems data-id="001348" />
    </BrowserRouter>,
  );

beforeEach(() => {
  vi.clearAllMocks();
  // Default filters keep everything empty (so assignedToMe should be false)
  MOCK_FILTERS_VALUES = {};
  MOCK_USED_FILTERS = ['usersIds'];
});

// ---------------------------- TESTS ----------------------------
describe('TrackerItems assignedToMe & usersIds logic', () => {
  test('toggle ON updates localStorage with responsibleIds=[user.userId] and sets isChecked=true', async () => {
    const user = userEvent.setup();

    renderPage();

    // Initially false
    expect(screen.getByTestId('assigned-state').textContent).toBe('false');

    // Toggle ON
    await user.click(screen.getByTestId('toggle-on'));

    // AssignedToMe state reflected in child
    expect(screen.getByTestId('assigned-state').textContent).toBe('true');

    // Called with filled responsibleIds
    expect(updateLocalStorageFilterSpy).toHaveBeenCalledWith(
      TEST_MODULE._id,
      'usersIds',
      'User',
      {
        responsibleIds: [TEST_USER.userId],
        accountableIds: [],
        contributorIds: [],
        followerIds: [],
      },
      TEST_USER._id,
      mockSetFilters,
    );
  });

  test('toggle OFF clears responsibleIds and sets isChecked=false', async () => {
    const user = userEvent.setup();

    renderPage();

    // Turn on then off to hit both branches
    await user.click(screen.getByTestId('toggle-on'));
    await user.click(screen.getByTestId('toggle-off'));

    expect(screen.getByTestId('assigned-state').textContent).toBe('false');

    // Last call should be the "clear" payload
    const last = updateLocalStorageFilterSpy.mock.calls.at(-1);
    expect(last).toBeDefined();
    expect(last![0]).toBe(TEST_MODULE._id);
    expect(last![1]).toBe('usersIds');
    expect(last![2]).toBe('User');
    expect(last![3]).toEqual({
      responsibleIds: [],
      accountableIds: [],
      contributorIds: [],
      followerIds: [],
    });
    expect(last![4]).toBe(TEST_USER._id);
    expect(last![5]).toBe(mockSetFilters);
  });

  test('effect parses filtersValues and sets assignedToMe=true when usersIds.responsibleIds has current user', () => {
    MOCK_FILTERS_VALUES = {
      usersIds: { value: { responsibleIds: [TEST_USER.userId] } },
    };

    renderPage();
    expect(screen.getByTestId('assigned-state').textContent).toBe('true');
  });

  test('effect parses filtersValues and sets assignedToMe=true when usersIds.userIds has current user', () => {
    MOCK_FILTERS_VALUES = {
      usersIds: { value: { userIds: [TEST_USER.userId] } },
    };

    renderPage();
    expect(screen.getByTestId('assigned-state').textContent).toBe('true');
  });

  test('sync effect sets assignedToMe=false when usersIds contains a different id', () => {
    MOCK_FILTERS_VALUES = {
      usersIds: { value: { responsibleIds: ['someone-else'] } },
    };

    renderPage();
    expect(screen.getByTestId('assigned-state').textContent).toBe('false');
  });
});
