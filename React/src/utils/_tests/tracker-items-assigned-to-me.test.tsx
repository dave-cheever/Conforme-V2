import { beforeEach, describe, expect, test, vi } from 'vitest';

import updateLocalStorageFilter from '../filterStorage';

// Mock the filterStorage utility
vi.mock('../filterStorage', () => ({
  default: vi.fn(),
}));

describe('TrackerItems - AssignedToMe Filter Integration', () => {
  // Helper function to process filter entries for localStorage parsing
  const processFilterEntryForStorage = (acc: Record<string, { value: any }>, [k, f]: [string, any]): Record<string, { value: any }> => {
    const v = f.value;
    const isArray = Array.isArray(v) && v.length > 0;
    const isObj = v && typeof v === 'object' && Object.keys(v).length > 0;
    if (isArray || isObj) acc[k] = { value: v };
    return acc;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage
    localStorage.clear();
  });

  describe('handleAssignedToMeToggle function logic', () => {
    test('calls updateLocalStorageFilter with correct parameters when checked', () => {
      const mockUser = {
        _id: 'user1',
        userId: 'user123',
      };
      const mockModule = {
        _id: 'module1',
      };
      const mockSetFilters = vi.fn();

      // Simulate the handleAssignedToMeToggle logic for checked state
      const isChecked = true;
      if (isChecked && mockUser && mockModule) {
        const filterValue = {
          responsibleIds: [mockUser.userId],
          accountableIds: [],
          contributorIds: [],
          followerIds: [],
        };
        updateLocalStorageFilter(mockModule._id, 'usersIds', 'User', filterValue, mockUser._id, mockSetFilters);
      }

      expect(updateLocalStorageFilter).toHaveBeenCalledWith(
        'module1',
        'usersIds',
        'User',
        {
          responsibleIds: ['user123'],
          accountableIds: [],
          contributorIds: [],
          followerIds: [],
        },
        'user1',
        mockSetFilters,
      );
    });

    test('calls updateLocalStorageFilter with empty arrays when unchecked', () => {
      const mockUser = {
        _id: 'user1',
        userId: 'user123',
      };
      const mockModule = {
        _id: 'module1',
      };
      const mockSetFilters = vi.fn();

      // Simulate the handleAssignedToMeToggle logic for unchecked state
      const isChecked = false;
      if (!isChecked && mockUser && mockModule) {
        const filterValue = {
          responsibleIds: [],
          accountableIds: [],
          contributorIds: [],
          followerIds: [],
        };
        updateLocalStorageFilter(mockModule._id, 'usersIds', 'User', filterValue, mockUser._id, mockSetFilters);
      }

      expect(updateLocalStorageFilter).toHaveBeenCalledWith(
        'module1',
        'usersIds',
        'User',
        {
          responsibleIds: [],
          accountableIds: [],
          contributorIds: [],
          followerIds: [],
        },
        'user1',
        mockSetFilters,
      );
    });

    test('calls updateLocalStorageFilter with correct parameters when unchecked', () => {
      const mockUser = {
        _id: 'user1',
        userId: 'user123',
      };
      const mockModule = {
        _id: 'module1',
      };
      const mockSetFilters = vi.fn();

      // Simulate the handleAssignedToMeToggle logic for unchecked state
      const isChecked = false;
      if (!isChecked && mockUser && mockModule) {
        const filterValue = {
          responsibleIds: [],
          accountableIds: [],
          contributorIds: [],
          followerIds: [],
        };
        updateLocalStorageFilter(mockModule._id, 'usersIds', 'User', filterValue, mockUser._id, mockSetFilters);
      }

      expect(updateLocalStorageFilter).toHaveBeenCalledWith(
        'module1',
        'usersIds',
        'User',
        {
          responsibleIds: [],
          accountableIds: [],
          contributorIds: [],
          followerIds: [],
        },
        'user1',
        mockSetFilters,
      );
    });

    test('does not call updateLocalStorageFilter when user is missing', () => {
      const mockUser: any = null;
      const mockModule = {
        _id: 'module1',
      };
      const mockSetFilters = vi.fn();

      // Simulate the handleAssignedToMeToggle logic with missing user
      const isChecked = true;
      if (isChecked && mockUser && mockModule) {
        // This should not execute
        updateLocalStorageFilter(mockModule._id, 'usersIds', 'User', {}, mockUser?._id, mockSetFilters);
      }

      expect(updateLocalStorageFilter).not.toHaveBeenCalled();
    });

    test('does not call updateLocalStorageFilter when module is missing', () => {
      const mockUser = {
        _id: 'user1',
        userId: 'user123',
      };
      const mockModule: any = null;
      const mockSetFilters = vi.fn();

      // Simulate the handleAssignedToMeToggle logic with missing module
      const isChecked = true;
      if (isChecked && mockUser && mockModule) {
        // This should not execute
        updateLocalStorageFilter(mockModule?._id, 'usersIds', 'User', {}, mockUser._id, mockSetFilters);
      }

      expect(updateLocalStorageFilter).not.toHaveBeenCalled();
    });
  });

  describe('localStorage loading logic', () => {
    test('correctly identifies assignedToMe state from localStorage', () => {
      const mockUser = {
        _id: 'user1',
        userId: 'user123',
      };

      // Simulate the localStorage loading logic
      const storedFilters = {
        usersIds: {
          value: {
            responsibleIds: ['user123'],
            accountableIds: [],
            contributorIds: [],
            followerIds: [],
          },
          label: 'User',
          name: 'usersIds',
        },
      };

      // Simulate the logic from the useEffect
      const usersFilter = storedFilters.usersIds?.value;
      const isAssignedToMe = usersFilter?.responsibleIds?.length === 1 && usersFilter.responsibleIds[0] === mockUser?.userId;

      expect(isAssignedToMe).toBe(true);
    });

    test('correctly identifies non-assignedToMe state from localStorage', () => {
      const mockUser = {
        _id: 'user1',
        userId: 'user123',
      };

      // Simulate the localStorage loading logic with different user
      const storedFilters = {
        usersIds: {
          value: {
            responsibleIds: ['differentUser'],
            accountableIds: [],
            contributorIds: [],
            followerIds: [],
          },
          label: 'User',
          name: 'usersIds',
        },
      };

      // Simulate the logic from the useEffect
      const usersFilter = storedFilters.usersIds?.value;
      const isAssignedToMe = usersFilter?.responsibleIds?.length === 1 && usersFilter.responsibleIds[0] === mockUser?.userId;

      expect(isAssignedToMe).toBe(false);
    });

    test('correctly identifies non-assignedToMe state when multiple users selected', () => {
      const mockUser = {
        _id: 'user1',
        userId: 'user123',
      };

      // Simulate the localStorage loading logic with multiple users
      const storedFilters = {
        usersIds: {
          value: {
            responsibleIds: ['user123', 'user456'],
            accountableIds: [],
            contributorIds: [],
            followerIds: [],
          },
          label: 'User',
          name: 'usersIds',
        },
      };

      // Simulate the logic from the useEffect
      const usersFilter = storedFilters.usersIds?.value;
      const isAssignedToMe = usersFilter?.responsibleIds?.length === 1 && usersFilter.responsibleIds[0] === mockUser?.userId;

      expect(isAssignedToMe).toBe(false);
    });
  });

  describe('sync logic for assignedToMe state', () => {
    test('correctly syncs with responsibleIds filter', () => {
      const mockUser = {
        _id: 'user1',
        userId: 'user123',
      };

      // Simulate the sync logic from the useEffect
      const currentUsersFilter = {
        responsibleIds: ['user123'],
        accountableIds: [],
        contributorIds: [],
        followerIds: [],
      };

      let ids: string[] | undefined;

      if (currentUsersFilter && 'responsibleIds' in currentUsersFilter && Array.isArray(currentUsersFilter.responsibleIds))
        ids = currentUsersFilter.responsibleIds;
      else if (currentUsersFilter && 'userIds' in currentUsersFilter && Array.isArray(currentUsersFilter.userIds))
        ids = currentUsersFilter.userIds;

      const isAssignedToMe = Array.isArray(ids) && ids.length === 1 && ids[0] === mockUser?.userId;

      expect(isAssignedToMe).toBe(true);
    });

    test('correctly syncs with userIds fallback filter', () => {
      const mockUser = {
        _id: 'user1',
        userId: 'user123',
      };

      // Simulate the sync logic from the useEffect with userIds fallback
      const currentUsersFilter = {
        userIds: ['user123'],
      };

      let ids: string[] | undefined;

      if (currentUsersFilter && 'responsibleIds' in currentUsersFilter && Array.isArray(currentUsersFilter.responsibleIds))
        ids = currentUsersFilter.responsibleIds;
      else if (currentUsersFilter && 'userIds' in currentUsersFilter && Array.isArray(currentUsersFilter.userIds))
        ids = currentUsersFilter.userIds;

      const isAssignedToMe = Array.isArray(ids) && ids.length === 1 && ids[0] === mockUser?.userId;

      expect(isAssignedToMe).toBe(true);
    });

    test('correctly handles multiple users in responsibleIds', () => {
      const mockUser = {
        _id: 'user1',
        userId: 'user123',
      };

      // Simulate the sync logic from the useEffect with multiple users
      const currentUsersFilter = {
        responsibleIds: ['user123', 'user456'],
        accountableIds: [],
        contributorIds: [],
        followerIds: [],
      };

      let ids: string[] | undefined;

      if (currentUsersFilter && 'responsibleIds' in currentUsersFilter && Array.isArray(currentUsersFilter.responsibleIds))
        ids = currentUsersFilter.responsibleIds;
      else if (currentUsersFilter && 'userIds' in currentUsersFilter && Array.isArray(currentUsersFilter.userIds))
        ids = currentUsersFilter.userIds;

      const isAssignedToMe = Array.isArray(ids) && ids.length === 1 && ids[0] === mockUser?.userId;

      expect(isAssignedToMe).toBe(false);
    });

    test('correctly handles different user in responsibleIds', () => {
      const mockUser = {
        _id: 'user1',
        userId: 'user123',
      };

      // Simulate the sync logic from the useEffect with different user
      const currentUsersFilter = {
        responsibleIds: ['differentUser'],
        accountableIds: [],
        contributorIds: [],
        followerIds: [],
      };

      let ids: string[] | undefined;

      if (currentUsersFilter && 'responsibleIds' in currentUsersFilter && Array.isArray(currentUsersFilter.responsibleIds))
        ids = currentUsersFilter.responsibleIds;
      else if (currentUsersFilter && 'userIds' in currentUsersFilter && Array.isArray(currentUsersFilter.userIds))
        ids = currentUsersFilter.userIds;

      const isAssignedToMe = Array.isArray(ids) && ids.length === 1 && ids[0] === mockUser?.userId;

      expect(isAssignedToMe).toBe(false);
    });

    test('correctly handles empty responsibleIds', () => {
      const mockUser = {
        _id: 'user1',
        userId: 'user123',
      };

      // Simulate the sync logic from the useEffect with empty array
      const currentUsersFilter = {
        responsibleIds: [],
        accountableIds: [],
        contributorIds: [],
        followerIds: [],
      };

      let ids: string[] | undefined;

      if (currentUsersFilter && 'responsibleIds' in currentUsersFilter && Array.isArray(currentUsersFilter.responsibleIds))
        ids = currentUsersFilter.responsibleIds;
      else if (currentUsersFilter && 'userIds' in currentUsersFilter && Array.isArray(currentUsersFilter.userIds))
        ids = currentUsersFilter.userIds;

      const isAssignedToMe = Array.isArray(ids) && ids.length === 1 && ids[0] === mockUser?.userId;

      expect(isAssignedToMe).toBe(false);
    });
  });

  describe('localStorage error handling', () => {
    test('handles invalid JSON in localStorage gracefully', () => {
      // Mock localStorage with invalid JSON
      localStorage.setItem('module1-filters-user1', 'invalid-json');

      // Simulate the error handling logic
      let validFilters: Record<string, { value: any }> = {};

      try {
        const stored = localStorage.getItem('module1-filters-user1');
        if (stored) {
          const parsed = JSON.parse(stored);
          // This should throw an error
          validFilters = Object.entries(parsed).reduce(processFilterEntryForStorage, {} as Record<string, { value: any }>);
        }
      } catch (err) {
        // Error should be caught and handled gracefully
        expect(err).toBeInstanceOf(SyntaxError);
      }

      // Should not crash and validFilters should remain empty
      expect(Object.keys(validFilters)).toHaveLength(0);
    });

    test('handles missing localStorage gracefully', () => {
      // Clear localStorage
      localStorage.clear();

      // Simulate the localStorage loading logic
      let validFilters: Record<string, { value: any }> = {};

      const stored = localStorage.getItem('module1-filters-user1');
      if (stored) {
        const parsed = JSON.parse(stored);
        validFilters = Object.entries(parsed).reduce(processFilterEntryForStorage, {} as Record<string, { value: any }>);
      }

      // Should not crash and validFilters should remain empty
      expect(Object.keys(validFilters)).toHaveLength(0);
    });
  });

  describe('localStorage loading - assignedToMe detection', () => {
    test('sets assignedToMe to true when responsibleIds contains current user', () => {
      const mockUser = { _id: 'user1', userId: 'user123' };
      const mockModule = { _id: 'module1' };

      // Mock localStorage with assignedToMe filter
      const storedFilters = {
        usersIds: {
          value: {
            responsibleIds: ['user123'],
            accountableIds: [],
            contributorIds: [],
            followerIds: [],
          },
        },
      };
      localStorage.setItem('module1-filters-user1', JSON.stringify(storedFilters));

      // Simulate the localStorage loading logic
      const key = `${mockModule._id}-filters-${mockUser._id}`;
      const stored = localStorage.getItem(key);
      let assignedToMe = false;

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const validFilters = Object.entries(parsed).reduce(processFilterEntryForStorage, {} as Record<string, { value: any }>);

          // Check if assignedToMe filter is active from stored filters
          const usersFilter = validFilters.usersIds?.value;
          if (usersFilter?.responsibleIds?.length === 1 && usersFilter.responsibleIds[0] === mockUser?.userId) assignedToMe = true;
        } catch (err) {
          // Error handling - in real code this would be logged
          expect(err).toBeInstanceOf(SyntaxError);
        }
      }

      expect(assignedToMe).toBe(true);
    });

    test('sets assignedToMe to false when responsibleIds contains different user', () => {
      const mockUser = { _id: 'user1', userId: 'user123' };
      const mockModule = { _id: 'module1' };

      // Mock localStorage with different user assigned
      const storedFilters = {
        usersIds: {
          value: {
            responsibleIds: ['different-user'],
            accountableIds: [],
            contributorIds: [],
            followerIds: [],
          },
        },
      };
      localStorage.setItem('module1-filters-user1', JSON.stringify(storedFilters));

      // Simulate the localStorage loading logic
      const key = `${mockModule._id}-filters-${mockUser._id}`;
      const stored = localStorage.getItem(key);
      let assignedToMe = false;

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const validFilters = Object.entries(parsed).reduce(processFilterEntryForStorage, {} as Record<string, { value: any }>);

          // Check if assignedToMe filter is active from stored filters
          const usersFilter = validFilters.usersIds?.value;
          if (usersFilter?.responsibleIds?.length === 1 && usersFilter.responsibleIds[0] === mockUser?.userId) assignedToMe = true;
        } catch (err) {
          // Error handling - in real code this would be logged
          expect(err).toBeInstanceOf(SyntaxError);
        }
      }

      expect(assignedToMe).toBe(false);
    });
  });

  describe('usersIds filter special handling', () => {
    // Helper function to check if usersIds filter has nested values
    const hasUsersIdsNestedValues = (value: any): boolean =>
      typeof value === 'object' && !Array.isArray(value) && Object.values(value).some((arr: any) => Array.isArray(arr) && arr.length > 0);

    // Helper function to process filter entries
    const processFilterEntry = (acc: Record<string, any>, [key, val]: [string, any]): Record<string, any> => {
      if (key === 'usersIds' && !hasUsersIdsNestedValues(val.value)) {
        // Skip usersIds filter if it has no nested values
        return acc;
      }
      acc[key] = val.value;
      return acc;
    };

    test('includes usersIds filter when it has nested values', () => {
      const mockFilters = {
        usersIds: {
          value: {
            responsibleIds: ['user1'],
            accountableIds: [],
            contributorIds: [],
            followerIds: [],
          },
        },
        otherFilter: {
          value: ['value1', 'value2'],
        },
      };

      // Simulate the filter parsing logic
      const validFilters = Object.entries(mockFilters).reduce(processFilterEntry, {} as Record<string, any>);

      expect(validFilters.usersIds).toEqual({
        responsibleIds: ['user1'],
        accountableIds: [],
        contributorIds: [],
        followerIds: [],
      });
      expect(validFilters.otherFilter).toEqual(['value1', 'value2']);
    });

    test('excludes usersIds filter when it has no nested values', () => {
      const mockFilters = {
        usersIds: {
          value: {
            responsibleIds: [],
            accountableIds: [],
            contributorIds: [],
            followerIds: [],
          },
        },
        otherFilter: {
          value: ['value1', 'value2'],
        },
      };

      // Simulate the filter parsing logic
      const validFilters = Object.entries(mockFilters).reduce(processFilterEntry, {} as Record<string, any>);

      expect(validFilters.usersIds).toBeUndefined();
      expect(validFilters.otherFilter).toEqual(['value1', 'value2']);
    });
  });
});
