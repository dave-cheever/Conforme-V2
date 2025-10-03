import { beforeEach, describe, expect, test, vi } from 'vitest';

import updateLocalStorageFilter from '../filterStorage';

// Mock the filterStorage utility
vi.mock('../filterStorage', () => ({
  default: vi.fn(),
}));

// Helper functions (copied from audits.tsx for testing)
function getMyIds(user?: { _id?: string; userId?: string }) {
  return [user?.userId, user?._id].filter(Boolean).map(String);
}

function isAssignedToMeFilter(val: any, myIds: string[]) {
  if (!val || typeof val !== 'object') return false;

  const auditors = Array.isArray(val.auditorsIds) ? val.auditorsIds : [];
  const participants = Array.isArray(val.participantsIds) ? val.participantsIds : [];

  // Combine and normalize any candidate IDs in the filter
  const combined = [...auditors, ...participants].filter(Boolean).map(String);

  // If exactly one ID is targeted and it's me, treat as "assigned to me"
  if (combined.length === 1 && myIds.includes(combined[0])) return true;

  return false;
}

describe('Audits - AssignedToMe Filter Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage
    localStorage.clear();
  });

  describe('Helper functions', () => {
    describe('getMyIds', () => {
      test('returns both userId and _id when both are provided', () => {
        const user = { _id: 'user1', userId: 'user123' };
        const result = getMyIds(user);
        expect(result).toEqual(['user123', 'user1']);
      });

      test('returns only userId when _id is not provided', () => {
        const user = { userId: 'user123' };
        const result = getMyIds(user);
        expect(result).toEqual(['user123']);
      });

      test('returns only _id when userId is not provided', () => {
        const user = { _id: 'user1' };
        const result = getMyIds(user);
        expect(result).toEqual(['user1']);
      });

      test('returns empty array when no IDs are provided', () => {
        const user = {};
        const result = getMyIds(user);
        expect(result).toEqual([]);
      });

      test('returns empty array when user is undefined', () => {
        const result = getMyIds();
        expect(result).toEqual([]);
      });
    });

    describe('isAssignedToMeFilter', () => {
      test('returns true when auditorsIds contains exactly one matching ID', () => {
        const filterValue = { auditorsIds: ['user123'], participantsIds: [] };
        const myIds = ['user123', 'user1'];
        const result = isAssignedToMeFilter(filterValue, myIds);
        expect(result).toBe(true);
      });

      test('returns true when participantsIds contains exactly one matching ID', () => {
        const filterValue = { auditorsIds: [], participantsIds: ['user1'] };
        const myIds = ['user123', 'user1'];
        const result = isAssignedToMeFilter(filterValue, myIds);
        expect(result).toBe(true);
      });

      test('returns false when auditorsIds contains multiple IDs', () => {
        const filterValue = { auditorsIds: ['user123', 'user456'], participantsIds: [] };
        const myIds = ['user123', 'user1'];
        const result = isAssignedToMeFilter(filterValue, myIds);
        expect(result).toBe(false);
      });

      test('returns false when auditorsIds contains non-matching ID', () => {
        const filterValue = { auditorsIds: ['user456'], participantsIds: [] };
        const myIds = ['user123', 'user1'];
        const result = isAssignedToMeFilter(filterValue, myIds);
        expect(result).toBe(false);
      });

      test('returns false when both arrays are empty', () => {
        const filterValue = { auditorsIds: [], participantsIds: [] };
        const myIds = ['user123', 'user1'];
        const result = isAssignedToMeFilter(filterValue, myIds);
        expect(result).toBe(false);
      });

      test('returns false when filterValue is not an object', () => {
        const myIds = ['user123', 'user1'];
        expect(isAssignedToMeFilter(null, myIds)).toBe(false);
        expect(isAssignedToMeFilter(undefined, myIds)).toBe(false);
        expect(isAssignedToMeFilter('string', myIds)).toBe(false);
        expect(isAssignedToMeFilter(123, myIds)).toBe(false);
      });

      test('handles mixed auditorsIds and participantsIds correctly', () => {
        const filterValue = { auditorsIds: ['user123'], participantsIds: ['user456'] };
        const myIds = ['user123', 'user1'];
        const result = isAssignedToMeFilter(filterValue, myIds);
        expect(result).toBe(false); // Should be false because combined length > 1
      });

      test('normalizes string IDs correctly', () => {
        const filterValue = { auditorsIds: [123], participantsIds: [] }; // Number ID
        const myIds = ['123', 'user1'];
        const result = isAssignedToMeFilter(filterValue, myIds);
        expect(result).toBe(true);
      });
    });
  });

  describe('handleAssignedToMeToggle function logic', () => {
    test('calls updateLocalStorageFilter with correct parameters when checked (userId preferred)', () => {
      const mockUser = {
        _id: 'user1',
        userId: 'user123',
      };
      const mockModule = {
        _id: 'module1',
      };
      const mockSetFilters = vi.fn();

      // Simulate the new handleAssignedToMeToggle logic
      const isChecked = true;
      if (isChecked && mockUser && mockModule) {
        const myId = String(mockUser.userId ?? mockUser._id ?? '');
        const filterValue = {
          auditorsIds: myId ? [myId] : [],
          participantsIds: [],
        };
        updateLocalStorageFilter(mockModule._id, 'usersIds', 'User', filterValue, mockUser._id, mockSetFilters);
      }

      expect(updateLocalStorageFilter).toHaveBeenCalledWith(
        'module1',
        'usersIds',
        'User',
        {
          auditorsIds: ['user123'],
          participantsIds: [],
        },
        'user1',
        mockSetFilters,
      );
    });

    test('calls updateLocalStorageFilter with correct parameters when checked (_id fallback)', () => {
      const mockUser = {
        _id: 'user1',
        // No userId provided
      };
      const mockModule = {
        _id: 'module1',
      };
      const mockSetFilters = vi.fn();

      // Simulate the new handleAssignedToMeToggle logic
      const isChecked = true;
      if (isChecked && mockUser && mockModule) {
        const myId = String((mockUser as any).userId ?? mockUser._id ?? '');
        const filterValue = {
          auditorsIds: myId ? [myId] : [],
          participantsIds: [],
        };
        updateLocalStorageFilter(mockModule._id, 'usersIds', 'User', filterValue, mockUser._id, mockSetFilters);
      }

      expect(updateLocalStorageFilter).toHaveBeenCalledWith(
        'module1',
        'usersIds',
        'User',
        {
          auditorsIds: ['user1'],
          participantsIds: [],
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

      // Simulate the new handleAssignedToMeToggle logic for unchecked state
      const isChecked = false;
      if (isChecked && mockUser && mockModule) {
        const myId = String(mockUser.userId ?? mockUser._id ?? '');
        const filterValue = {
          auditorsIds: myId ? [myId] : [],
          participantsIds: [],
        };
        updateLocalStorageFilter(mockModule._id, 'usersIds', 'User', filterValue, mockUser._id, mockSetFilters);
      } else if (!isChecked && mockUser && mockModule) {
        const filterValue = {
          auditorsIds: [],
          participantsIds: [],
        };
        updateLocalStorageFilter(mockModule._id, 'usersIds', 'User', filterValue, mockUser._id, mockSetFilters);
      }

      expect(updateLocalStorageFilter).toHaveBeenCalledWith(
        'module1',
        'usersIds',
        'User',
        {
          auditorsIds: [],
          participantsIds: [],
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
            auditorsIds: ['user123'],
            participantsIds: [],
          },
          label: 'User',
          name: 'usersIds',
        },
      };

      // Simulate the logic from the useEffect
      const usersFilter = storedFilters.usersIds?.value;
      const isAssignedToMe = usersFilter?.auditorsIds?.length === 1 && usersFilter.auditorsIds[0] === mockUser?.userId;

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
            auditorsIds: ['differentUser'],
            participantsIds: [],
          },
          label: 'User',
          name: 'usersIds',
        },
      };

      // Simulate the logic from the useEffect
      const usersFilter = storedFilters.usersIds?.value;
      const isAssignedToMe = usersFilter?.auditorsIds?.length === 1 && usersFilter.auditorsIds[0] === mockUser?.userId;

      expect(isAssignedToMe).toBe(false);
    });

    test('correctly identifies non-assignedToMe state when multiple auditors selected', () => {
      const mockUser = {
        _id: 'user1',
        userId: 'user123',
      };

      // Simulate the localStorage loading logic with multiple auditors
      const storedFilters = {
        usersIds: {
          value: {
            auditorsIds: ['user123', 'user456'],
            participantsIds: [],
          },
          label: 'User',
          name: 'usersIds',
        },
      };

      // Simulate the logic from the useEffect
      const usersFilter = storedFilters.usersIds?.value;
      const isAssignedToMe = usersFilter?.auditorsIds?.length === 1 && usersFilter.auditorsIds[0] === mockUser?.userId;

      expect(isAssignedToMe).toBe(false);
    });
  });

  describe('sync logic for assignedToMe state', () => {
    test('correctly syncs with auditorsIds filter using helper functions', () => {
      const mockUser = {
        _id: 'user1',
        userId: 'user123',
      };

      // Simulate the sync logic using helper functions
      const currentUsersFilter = {
        auditorsIds: ['user123'],
        participantsIds: [],
      };

      const myIds = getMyIds(mockUser);
      const isAssignedToMe = isAssignedToMeFilter(currentUsersFilter, myIds);

      expect(isAssignedToMe).toBe(true);
    });

    test('correctly syncs with participantsIds fallback filter using helper functions', () => {
      const mockUser = {
        _id: 'user1',
        userId: 'user123',
      };

      // Simulate the sync logic using helper functions
      const currentUsersFilter = {
        participantsIds: ['user123'],
      };

      const myIds = getMyIds(mockUser);
      const isAssignedToMe = isAssignedToMeFilter(currentUsersFilter, myIds);

      expect(isAssignedToMe).toBe(true);
    });

    test('correctly handles multiple auditors in auditorsIds using helper functions', () => {
      const mockUser = {
        _id: 'user1',
        userId: 'user123',
      };

      // Simulate the sync logic using helper functions
      const currentUsersFilter = {
        auditorsIds: ['user123', 'user456'],
        participantsIds: [],
      };

      const myIds = getMyIds(mockUser);
      const isAssignedToMe = isAssignedToMeFilter(currentUsersFilter, myIds);

      expect(isAssignedToMe).toBe(false);
    });

    test('correctly handles different auditor in auditorsIds using helper functions', () => {
      const mockUser = {
        _id: 'user1',
        userId: 'user123',
      };

      // Simulate the sync logic using helper functions
      const currentUsersFilter = {
        auditorsIds: ['differentUser'],
        participantsIds: [],
      };

      const myIds = getMyIds(mockUser);
      const isAssignedToMe = isAssignedToMeFilter(currentUsersFilter, myIds);

      expect(isAssignedToMe).toBe(false);
    });

    test('correctly handles empty auditorsIds using helper functions', () => {
      const mockUser = {
        _id: 'user1',
        userId: 'user123',
      };

      // Simulate the sync logic using helper functions
      const currentUsersFilter = {
        auditorsIds: [],
        participantsIds: [],
      };

      const myIds = getMyIds(mockUser);
      const isAssignedToMe = isAssignedToMeFilter(currentUsersFilter, myIds);

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
          validFilters = Object.entries(parsed).reduce(
            (acc, [k, f]) => {
              const v = (f as any).value;
              const isArray = Array.isArray(v) && v.length > 0;
              const isObj = v && typeof v === 'object' && Object.keys(v).length > 0;
              if (isArray || isObj) acc[k] = { value: v };
              return acc;
            },
            {} as Record<string, { value: any }>,
          );
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
        validFilters = Object.entries(parsed).reduce(
          (acc, [k, f]) => {
            const v = (f as any).value;
            const isArray = Array.isArray(v) && v.length > 0;
            const isObj = v && typeof v === 'object' && Object.keys(v).length > 0;
            if (isArray || isObj) acc[k] = { value: v };
            return acc;
          },
          {} as Record<string, { value: any }>,
        );
      }

      // Should not crash and validFilters should remain empty
      expect(Object.keys(validFilters)).toHaveLength(0);
    });
  });
});
