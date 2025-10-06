import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';

// ---------- Global knobs the mocks read ----------
let MOCK_FILTERS_VALUES: any = {};
let MOCK_USED_FILTERS: string[] = ['usersIds', 'dueDate'];
let MOCK_LOADING = false;
let MOCK_AUDITS: any[] = [];
const MOCK_REFETCH = vi.fn();
let MOCK_SORTED_AUDITS: any[] = [];

// ---------- Shared spies ----------
const mockSetFilters = vi.fn();
const mockSetUsedFilters = vi.fn();
const mockSetDefaultFilters = vi.fn();
const mockSetShowFiltersPanel = vi.fn();
const mockSetAuditFiltersValue = vi.fn();
const mockSetResponsesStatusesCounts = vi.fn();
const mockSetAdminModalState = vi.fn();

const TEST_USER = { _id: 'u1-db', userId: 'u1-app', displayName: 'User One' };
const TEST_MODULE = { _id: 'm1', featureFlags: { enableSafetyWalk: true } };

// 1) i18next: ensure t() always returns a string so pluralize(...) is safe
vi.mock('react-i18next', async () => {
  // some projects import useTranslation from react-i18next too
  return {
    useTranslation: () => ({ t: (k: string) => k || 'audit' }),
  };
});
vi.mock('i18next', () => ({
  t: (k: string) => k || 'audit',
}));

// 2) Contexts
vi.mock('../../contexts/AppProvider', () => ({
  useAppContext: () => ({ user: TEST_USER, module: TEST_MODULE }),
}));

vi.mock('../../contexts/AdminProvider', () => ({
  useAdminContext: () => ({ adminModalState: 'closed', setAdminModalState: mockSetAdminModalState }),
}));

vi.mock('../../contexts/FiltersProvider', () => ({
  useFiltersContext: () => ({
    filtersValues: MOCK_FILTERS_VALUES,
    setUsedFilters: mockSetUsedFilters,
    setFilters: mockSetFilters,
    setDefaultFilters: mockSetDefaultFilters,
    setShowFiltersPanel: mockSetShowFiltersPanel,
    auditFiltersValue: {},
    setAuditFiltersValue: mockSetAuditFiltersValue,
    usedFilters: MOCK_USED_FILTERS,
    setResponsesStatusesCounts: mockSetResponsesStatusesCounts,
  }),
}));

// 3) Audit modal context/provider
vi.mock('../../contexts/AuditModalProvider', () => ({
  __esModule: true,
  default: ({ children }: any) => <>{children}</>,
  useAuditModalContext: () => ({
    audit: { _id: 'audit-modal-id' },
    reset: vi.fn(),
    trigger: vi.fn(),
  }),
}));

// 4) Device + Sort hooks
vi.mock('../../hooks/useDevice', () => ({ __esModule: true, default: () => 'desktop' }));

vi.mock('../../hooks/useSort', () => ({
  __esModule: true,
  default: () => ({
    sortedData: MOCK_SORTED_AUDITS,
    sortOrder: 'asc',
    sortType: 'auditor.displayName',
    setSortType: vi.fn(),
    setSortOrder: vi.fn(),
  }),
}));

// 5) Apollo: keep it deterministic & controllable
vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual<typeof import('@apollo/client')>('@apollo/client');
  return {
    ...actual,
    useQuery: () => ({
      data: { audits: MOCK_AUDITS },
      loading: MOCK_LOADING,
      error: false,
      refetch: MOCK_REFETCH,
    }),
    gql: (x: any) => x,
  };
});

// 6) Light stubs for heavy children
vi.mock('../../components/Audit/AuditModal', () => ({ default: () => <div data-id="001349" data-testid="audit-modal" /> }));
vi.mock('../../components/Audit/AuditsGroup', () => ({ default: () => <div data-id="001350" data-testid="audits-group" /> }));
vi.mock('../../components/Audit/AuditsList', () => ({ default: () => <div data-id="001351" data-testid="audits-list" /> }));
vi.mock('../../components/Audit/AuditSquare', () => ({ default: () => <div data-id="001352" data-testid="audit-square" /> }));
vi.mock('../../components/Loader', () => ({ default: () => <div data-id="001353" data-testid="loader" /> }));
vi.mock('../../components/Header', () => ({
  default: ({ children }: any) => (
    <div data-id="001354">
      <div data-id="001355" data-testid="header" />
      {children}
    </div>
  ),
}));
vi.mock('../../components/SortButton', () => ({ default: () => <div data-id="001356" data-testid="sort" /> }));

// CSVLink wrapper so DOM is trivial
vi.mock('react-csv', () => ({
  CSVLink: ({ children }: any) => <div data-id="001357" data-testid="csvlink">{children}</div>,
}));

// AssignedToMeFilter must expose isChecked and trigger onToggle
const assignedToToggleSpy = vi.fn();
vi.mock('../../components/Filters/AssignedToMeFilter', () => ({
  __esModule: true,
  default: ({ isChecked, onToggle }: { isChecked: boolean; onToggle: (v: boolean) => void }) => (
    <div data-id="001358">
      <span data-id="001359" data-testid="assigned-state">{String(isChecked)}</span>
      <button
        data-id="001360"
        type="button"
        data-testid="toggle-on"
        onClick={() => {
          assignedToToggleSpy('on');
          onToggle(true);
        }}>
        on
      </button>
      <button
        data-id="001361"
        type="button"
        data-testid="toggle-off"
        onClick={() => {
          assignedToToggleSpy('off');
          onToggle(false);
        }}>
        off
      </button>
    </div>
  ),
}));

// ChangeViewButton allows switching to list/group to exercise new helpers
vi.mock('../../components/ChangeViewButton', () => ({
  __esModule: true,
  default: ({ setViewMode }: { setViewMode: (v: string) => void }) => (
    <div data-id="001362" data-testid="change-view">
      <button
        data-id="001363"
        type="button"
        data-testid="to-group"
        onClick={() => setViewMode('group')}>
        group
      </button>
      <button
        data-id="001364"
        type="button"
        data-testid="to-list"
        onClick={() => setViewMode('list')}>
        list
      </button>
    </div>
  ),
}));

// 7) Spy: updateLocalStorageFilter must be called with exact payloads
const updateLocalStorageFilterSpy = vi.fn();
vi.mock('../../utils/filterStorage', () => ({
  __esModule: true,
  default: (...args: any[]) => updateLocalStorageFilterSpy(...args),
}));

// ---------- SUT import (after mocks) ----------
/* eslint-disable import/first */
import AuditsWithContext from '../../pages/audits';
/* eslint-enable import/first */

const renderPage = () => render(
  <BrowserRouter data-id="001515">
    <AuditsWithContext data-id="001365" />
  </BrowserRouter>
);

// ---------- Reset shared state ----------
beforeEach(() => {
  vi.clearAllMocks();
  MOCK_FILTERS_VALUES = {};
  MOCK_USED_FILTERS = ['usersIds', 'dueDate'];
  MOCK_LOADING = false;
  MOCK_AUDITS = [];
  MOCK_SORTED_AUDITS = [];
  MOCK_REFETCH.mockClear();
});

// ============================ TESTS ============================
describe('Audits – assignedToMe, filters, and new render helpers', () => {
  test('toggle ON calls updateLocalStorageFilter with my auditorsIds and sets isChecked=true', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(screen.getByTestId('assigned-state').textContent).toBe('false');

    await user.click(screen.getByTestId('toggle-on'));

    expect(screen.getByTestId('assigned-state').textContent).toBe('true');
    expect(updateLocalStorageFilterSpy).toHaveBeenCalledWith(
      TEST_MODULE._id,
      'usersIds',
      'User',
      { auditorsIds: [TEST_USER.userId], participantsIds: [] },
      TEST_USER._id,
      mockSetFilters,
    );
  });

  test('toggle OFF clears auditorsIds/participantsIds and sets isChecked=false', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByTestId('toggle-on'));
    await user.click(screen.getByTestId('toggle-off'));

    expect(screen.getByTestId('assigned-state').textContent).toBe('false');

    const last = updateLocalStorageFilterSpy.mock.calls.at(-1)!;
    expect(last[0]).toBe(TEST_MODULE._id);
    expect(last[1]).toBe('usersIds');
    expect(last[2]).toBe('User');
    expect(last[3]).toEqual({ auditorsIds: [], participantsIds: [] });
    expect(last[4]).toBe(TEST_USER._id);
    expect(last[5]).toBe(mockSetFilters);
  });

  test('parsing filters triggers refetch and sets assignedToMe=true when usersIds.auditorsIds has current user', () => {
    // dueDate array → effect flattens to first string; usersIds triggers assignedToMe=true
    MOCK_FILTERS_VALUES = {
      dueDate: { value: ['2025-01-10'] },
      usersIds: { value: { auditorsIds: [TEST_USER.userId] } },
    };

    renderPage();

    // refetch called with parsedFilters
    expect(MOCK_REFETCH).toHaveBeenCalledWith({
      auditQueryInput: { dueDate: '2025-01-10', usersIds: { auditorsIds: [TEST_USER.userId] } },
    });

    // assignedToMe from auditorsIds==me path
    expect(screen.getByTestId('assigned-state').textContent).toBe('true');
  });

  test('sync effect sets assignedToMe=true when usersIds.participantsIds equals my _id via getMyIds/isAssignedToMeFilter', async () => {
    // No localStorage → filtersInitialized becomes true in the first init effect
    MOCK_FILTERS_VALUES = { usersIds: { value: { participantsIds: [TEST_USER._id] } } };

    renderPage();

    // After init effect, sync effect runs and should set to true
    expect(await screen.findByTestId('assigned-state')).toHaveTextContent('true');
  });

  test('renderMainContent: loading branch shows Loader', () => {
    MOCK_LOADING = true;
    renderPage();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test('renderGroupView: empty state when sortedAudits is empty', async () => {
    const user = userEvent.setup();
    MOCK_SORTED_AUDITS = []; // nothing to show
    renderPage();

    await user.click(screen.getByTestId('to-group'));
    // empty state text rendered by renderEmptyState('000204')
    expect(screen.getByText(/No audits found\. Try adjusting the filters\./i)).toBeInTheDocument();
  });

  test('renderGroupView: shows AuditsGroup when sortedAudits has items', async () => {
    const user = userEvent.setup();
    MOCK_SORTED_AUDITS = [{ _id: 'a1', auditor: { displayName: 'X' } }];
    renderPage();

    await user.click(screen.getByTestId('to-group'));
    expect(screen.getByTestId('audits-group')).toBeInTheDocument();
  });
});
