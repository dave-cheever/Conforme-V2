import { BrowserRouter } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import UserFilter from '../../components/Filters/UserFilter';
import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import useNavigate from '../../hooks/useNavigate';
import updateLocalStorageFilter from '../../utils/filterStorage';

// Mock the contexts and hooks
vi.mock('../../contexts/AppProvider');
vi.mock('../../contexts/FiltersProvider');
vi.mock('../../hooks/useNavigate');
vi.mock('../../utils/filterStorage');
vi.mock('../../components/UsersSelector', () => ({
  default: ({ selected, selectedRole, handleChange }) => (
    <div
      data-id="003167"
      data-testid="users-selector"
      data-selected-role={selectedRole}>
      {selected?.map((userId) => (
        <div data-id="003168" key={userId} data-testid={`selected-user-${userId}`}>
          {userId}
        </div>
      ))}
    </div>
  ),
}));

const mockSetFilters = vi.fn();
const mockUpdateLocalStorageFilter = vi.fn();

const defaultContextValues = {
  filtersValues: {},
  setFilters: mockSetFilters,
  setFiltersValues: vi.fn(),
  appliedFilters: {},
  applyFilters: vi.fn(),
  applyFiltersImmediately: vi.fn(),
  clearFilters: vi.fn(),
  clearAllFilters: vi.fn(),
  resetFilters: vi.fn(),
  getFilterValue: vi.fn(),
  hasActiveFilters: false,
  isFilterActive: vi.fn(),
  toggleFilter: vi.fn(),
  updateFilter: vi.fn(),
  removeFilter: vi.fn(),
  addFilter: vi.fn(),
  setFilterValue: vi.fn(),
  getActiveFilters: vi.fn(),
  getFilterCount: vi.fn(),
  getFilterKeys: vi.fn(),
  hasFilter: vi.fn(),
  getFilter: vi.fn(),
  setFilter: vi.fn(),
  deleteFilter: vi.fn(),
  clearFilter: vi.fn(),
  resetFilter: vi.fn(),
  toggleFilterValue: vi.fn(),
  addFilterValue: vi.fn(),
  removeFilterValue: vi.fn(),
  setFilterValues: vi.fn(),
  getFilterValues: vi.fn(),
  hasFilterValue: vi.fn(),
  getFilterValueCount: vi.fn(),
  clearFilterValues: vi.fn(),
  resetFilterValues: vi.fn(),
  users: [],
  setUsedFilters: vi.fn(),
  usedFilters: {},
  sortingState: null,
  setSortingState: vi.fn(),
  auditFiltersValue: {},
  setAuditFiltersValue: vi.fn(),
  setShowFiltersPanel: vi.fn(),
  setDefaultFilters: vi.fn(),
};

const defaultAppValues = {
  module: {
    _id: 'test-module-id',
    type: 'audit',
  },
  user: {
    userId: 'test-user-id',
  },
  setRoles: vi.fn(),
  settings: {},
  setSettings: vi.fn(),
  setOrganizationConfig: vi.fn(),
  organizationConfig: {},
  setOrganization: vi.fn(),
};

const defaultNavigateValues = {
  navigate: vi.fn(),
  getPath: vi.fn(() => 'audits'),
  isPathActive: vi.fn(),
  navigateTo: vi.fn(),
  openInNewTab: vi.fn(),
};

const renderUserFilter = (contextOverrides = {}, appOverrides = {}, navigateOverrides = {}) => {
  vi.mocked(useFiltersContext).mockReturnValue({
    ...defaultContextValues,
    ...contextOverrides,
  } as any);
  vi.mocked(useAppContext).mockReturnValue({
    ...defaultAppValues,
    ...appOverrides,
  } as any);
  vi.mocked(useNavigate).mockReturnValue({
    ...defaultNavigateValues,
    ...navigateOverrides,
  } as any);
  vi.mocked(updateLocalStorageFilter).mockImplementation(mockUpdateLocalStorageFilter);

  return render(
    <ChakraProvider data-id="002500">
      <BrowserRouter data-id="002501">
        <UserFilter data-id="002502" />
      </BrowserRouter>
    </ChakraProvider>,
  );
};

describe('UserFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getInitialSelectedRole - Audits', () => {
    test('returns "participant" when participants are selected', () => {
      const filtersValues = {
        usersIds: {
          value: {
            participantsIds: ['user1', 'user2'],
            auditorsIds: [],
          },
        },
      };

      renderUserFilter({ filtersValues });

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('participant');
    });

    test('returns "auditor" when only auditors are selected', () => {
      const filtersValues = {
        usersIds: {
          value: {
            auditorsIds: ['user1', 'user2'],
            participantsIds: [],
          },
        },
      };

      renderUserFilter({ filtersValues });

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('auditor');
    });

    test('prioritizes "participant" when both participants and auditors are selected', () => {
      const filtersValues = {
        usersIds: {
          value: {
            participantsIds: ['user1', 'user2'],
            auditorsIds: ['user3', 'user4'],
          },
        },
      };

      renderUserFilter({ filtersValues });

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('participant');
    });

    test('returns "auditor" as default when no users are selected', () => {
      const filtersValues = {
        usersIds: {
          value: {
            auditorsIds: [],
            participantsIds: [],
          },
        },
      };

      renderUserFilter({ filtersValues });

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('auditor');
    });

    test('returns "auditor" when filtersValues.usersIds is undefined', () => {
      const filtersValues = {};

      renderUserFilter({ filtersValues });

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('auditor');
    });

    test('returns "auditor" when filtersValues.usersIds.value is undefined', () => {
      const filtersValues = {
        usersIds: {},
      };

      renderUserFilter({ filtersValues });

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('auditor');
    });

    test('handles participantsIds as undefined', () => {
      const filtersValues = {
        usersIds: {
          value: {
            auditorsIds: ['user1'],
          },
        },
      };

      renderUserFilter({ filtersValues });

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('auditor');
    });

    test('handles auditorsIds as undefined', () => {
      const filtersValues = {
        usersIds: {
          value: {
            participantsIds: ['user1'],
          },
        },
      };

      renderUserFilter({ filtersValues });

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('participant');
    });
  });

  describe('getInitialSelectedRole - Actions', () => {
    test('returns "assignee" when assignees are selected', () => {
      const filtersValues = {
        usersIds: {
          value: {
            assigneesIds: ['user1', 'user2'],
          },
        },
      };

      const navigateOverrides = {
        getPath: vi.fn(() => 'actions'),
      };

      renderUserFilter({ filtersValues }, {}, navigateOverrides);

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('assignee');
    });

    test('returns "assignee" as default when no assignees are selected', () => {
      const filtersValues = {
        usersIds: {
          value: {
            assigneesIds: [],
          },
        },
      };

      const navigateOverrides = {
        getPath: vi.fn(() => 'actions'),
      };

      renderUserFilter({ filtersValues }, {}, navigateOverrides);

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('assignee');
    });

    test('handles undefined assigneesIds', () => {
      const filtersValues = {
        usersIds: {
          value: {},
        },
      };

      const navigateOverrides = {
        getPath: vi.fn(() => 'actions'),
      };

      renderUserFilter({ filtersValues }, {}, navigateOverrides);

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('assignee');
    });
  });

  describe('getInitialSelectedRole - Answers', () => {
    test('returns "addedBy" when addedByIds are selected', () => {
      const filtersValues = {
        usersIds: {
          value: {
            addedByIds: ['user1', 'user2'],
          },
        },
      };

      const navigateOverrides = {
        getPath: vi.fn(() => 'answers'),
      };

      renderUserFilter({ filtersValues }, {}, navigateOverrides);

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('addedBy');
    });

    test('returns "addedBy" as default when no addedByIds are selected', () => {
      const filtersValues = {
        usersIds: {
          value: {
            addedByIds: [],
          },
        },
      };

      const navigateOverrides = {
        getPath: vi.fn(() => 'answers'),
      };

      renderUserFilter({ filtersValues }, {}, navigateOverrides);

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('addedBy');
    });

    test('handles undefined addedByIds', () => {
      const filtersValues = {
        usersIds: {
          value: {},
        },
      };

      const navigateOverrides = {
        getPath: vi.fn(() => 'answers'),
      };

      renderUserFilter({ filtersValues }, {}, navigateOverrides);

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('addedBy');
    });
  });

  describe('getInitialSelectedRole - Tracker', () => {
    test('returns "responsible" when responsibleIds are selected', () => {
      const filtersValues = {
        usersIds: {
          value: {
            responsibleIds: ['user1', 'user2'],
            accountableIds: [],
            contributorIds: [],
            followerIds: [],
          },
        },
      };

      const appOverrides = {
        module: {
          _id: 'test-module-id',
          type: 'tracker',
        },
      };

      renderUserFilter({ filtersValues }, appOverrides);

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('responsible');
    });

    test('returns "accountable" when accountableIds are selected', () => {
      const filtersValues = {
        usersIds: {
          value: {
            responsibleIds: [],
            accountableIds: ['user1', 'user2'],
            contributorIds: [],
            followerIds: [],
          },
        },
      };

      const appOverrides = {
        module: {
          _id: 'test-module-id',
          type: 'tracker',
        },
      };

      renderUserFilter({ filtersValues }, appOverrides);

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('accountable');
    });

    test('returns "contributor" when contributorIds are selected', () => {
      const filtersValues = {
        usersIds: {
          value: {
            responsibleIds: [],
            accountableIds: [],
            contributorIds: ['user1', 'user2'],
            followerIds: [],
          },
        },
      };

      const appOverrides = {
        module: {
          _id: 'test-module-id',
          type: 'tracker',
        },
      };

      renderUserFilter({ filtersValues }, appOverrides);

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('contributor');
    });

    test('returns "follower" when followerIds are selected', () => {
      const filtersValues = {
        usersIds: {
          value: {
            responsibleIds: [],
            accountableIds: [],
            contributorIds: [],
            followerIds: ['user1', 'user2'],
          },
        },
      };

      const appOverrides = {
        module: {
          _id: 'test-module-id',
          type: 'tracker',
        },
      };

      renderUserFilter({ filtersValues }, appOverrides);

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('follower');
    });

    test('prioritizes roles in order: responsible > accountable > contributor > follower', () => {
      const filtersValues = {
        usersIds: {
          value: {
            responsibleIds: ['user1'],
            accountableIds: ['user2'],
            contributorIds: ['user3'],
            followerIds: ['user4'],
          },
        },
      };

      const appOverrides = {
        module: {
          _id: 'test-module-id',
          type: 'tracker',
        },
      };

      renderUserFilter({ filtersValues }, appOverrides);

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('responsible');
    });

    test('returns "responsible" as default when no tracker users are selected', () => {
      const filtersValues = {
        usersIds: {
          value: {
            responsibleIds: [],
            accountableIds: [],
            contributorIds: [],
            followerIds: [],
          },
        },
      };

      const appOverrides = {
        module: {
          _id: 'test-module-id',
          type: 'tracker',
        },
      };

      renderUserFilter({ filtersValues }, appOverrides);

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('responsible');
    });

    test('handles undefined tracker filter values', () => {
      const filtersValues = {
        usersIds: {
          value: {},
        },
      };

      const appOverrides = {
        module: {
          _id: 'test-module-id',
          type: 'tracker',
        },
      };

      renderUserFilter({ filtersValues }, appOverrides);

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('responsible');
    });
  });

  describe('selectedRole state updates', () => {
    test('updates selectedRole when filtersValues change to show participant', () => {
      const { rerender } = renderUserFilter({
        filtersValues: {
          usersIds: {
            value: {
              auditorsIds: ['user1'],
              participantsIds: [],
            },
          },
        },
      });

      let select = screen.getByRole('combobox');
      expect(select).toHaveValue('auditor');

      // Update filtersValues to have participants
      vi.mocked(useFiltersContext).mockReturnValue({
        ...defaultContextValues,
        filtersValues: {
          usersIds: {
            value: {
              auditorsIds: [],
              participantsIds: ['user2', 'user3'],
            },
          },
        },
      } as any);

      rerender(
        <ChakraProvider data-id="002500">
          <BrowserRouter data-id="002501">
            <UserFilter data-id="002502" />
          </BrowserRouter>
        </ChakraProvider>,
      );

      select = screen.getByRole('combobox');
      expect(select).toHaveValue('participant');
    });

    test('does not update selectedRole when user manually changes dropdown', () => {
      renderUserFilter({
        filtersValues: {
          usersIds: {
            value: {
              auditorsIds: ['user1'],
              participantsIds: [],
            },
          },
        },
      });

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('auditor');

      // User manually changes to participant
      fireEvent.change(select, { target: { value: 'participant' } });
      expect(select).toHaveValue('participant');
    });
  });

  describe('Select component rendering', () => {
    test('renders Select with correct value prop', () => {
      const filtersValues = {
        usersIds: {
          value: {
            participantsIds: ['user1'],
            auditorsIds: [],
          },
        },
      };

      renderUserFilter({ filtersValues });

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(select).toHaveValue('participant');
    });

    test('Select onChange updates selectedRole', () => {
      renderUserFilter({
        filtersValues: {
          usersIds: {
            value: {
              auditorsIds: ['user1'],
              participantsIds: [],
            },
          },
        },
      });

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('auditor');

      fireEvent.change(select, { target: { value: 'participant' } });
      expect(select).toHaveValue('participant');
    });
  });

  describe('Edge cases', () => {
    test('handles empty arrays for all role types', () => {
      const filtersValues = {
        usersIds: {
          value: {
            auditorsIds: [],
            participantsIds: [],
            assigneesIds: [],
            addedByIds: [],
            responsibleIds: [],
            accountableIds: [],
            contributorIds: [],
            followerIds: [],
          },
        },
      };

      renderUserFilter({ filtersValues });

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('auditor');
    });

    test('handles null values gracefully', () => {
      const filtersValues = {
        usersIds: {
          value: {
            auditorsIds: null,
            participantsIds: null,
          },
        },
      };

      renderUserFilter({ filtersValues });

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('auditor');
    });

    test('handles missing module type', () => {
      const appOverrides = {
        module: null,
      };

      renderUserFilter({}, appOverrides);

      const select = screen.getByRole('combobox');
      // Should default to auditor for audits path
      expect(select).toHaveValue('auditor');
    });
  });
});

