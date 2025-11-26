import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import usePagination from '../../hooks/usePagination';
import { PAGINATION_DEFAULT_PAGE_SIZE, PAGINATION_PAGE_SIZE_OPTIONS } from '../../bootstrap/config';

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

describe('usePagination', () => {
  beforeEach(() => {
    localStorageMock.clear();
    if (typeof window !== 'undefined') {
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
        configurable: true,
      });
    }
  });

  describe('Initial State', () => {
    test('initializes with default values when localStorage is empty', () => {
      const { result } = renderHook(() => usePagination());

      expect(result.current.currentPage).toBe(1);
      expect(result.current.pageSize).toBe(PAGINATION_DEFAULT_PAGE_SIZE);
      expect(result.current.total).toBe(0);
    });

    test('initializes with stored page size from localStorage', () => {
      localStorageMock.setItem('pagination_page_size', '50');

      const { result } = renderHook(() => usePagination());

      expect(result.current.pageSize).toBe(50);
      expect(result.current.currentPage).toBe(1);
      expect(result.current.total).toBe(0);
    });

    test('falls back to default when stored value is invalid', () => {
      localStorageMock.setItem('pagination_page_size', '999'); // Invalid option

      const { result } = renderHook(() => usePagination());

      expect(result.current.pageSize).toBe(PAGINATION_DEFAULT_PAGE_SIZE);
    });

    test('falls back to default when stored value is not a number', () => {
      localStorageMock.setItem('pagination_page_size', 'invalid');

      const { result } = renderHook(() => usePagination());

      expect(result.current.pageSize).toBe(PAGINATION_DEFAULT_PAGE_SIZE);
    });
  });

  describe('Page Size Management', () => {
    test('updates page size and persists to localStorage', () => {
      const { result } = renderHook(() => usePagination());

      act(() => {
        result.current.setPageSize(PAGINATION_PAGE_SIZE_OPTIONS[1]);
      });

      expect(result.current.pageSize).toBe(PAGINATION_PAGE_SIZE_OPTIONS[1]);
      expect(localStorageMock.getItem('pagination_page_size')).toBe(String(PAGINATION_PAGE_SIZE_OPTIONS[1]));
    });

    test('updates page size to all valid options', () => {
      const { result } = renderHook(() => usePagination());

      PAGINATION_PAGE_SIZE_OPTIONS.forEach((option) => {
        act(() => {
          result.current.setPageSize(option);
        });

        expect(result.current.pageSize).toBe(option);
        expect(localStorageMock.getItem('pagination_page_size')).toBe(String(option));
      });
    });

    test('persists page size across multiple changes', () => {
      const { result } = renderHook(() => usePagination());

      act(() => {
        result.current.setPageSize(PAGINATION_PAGE_SIZE_OPTIONS[0]);
      });
      expect(localStorageMock.getItem('pagination_page_size')).toBe(String(PAGINATION_PAGE_SIZE_OPTIONS[0]));

      act(() => {
        result.current.setPageSize(PAGINATION_PAGE_SIZE_OPTIONS[2]);
      });
      expect(localStorageMock.getItem('pagination_page_size')).toBe(String(PAGINATION_PAGE_SIZE_OPTIONS[2]));

      act(() => {
        result.current.setPageSize(PAGINATION_PAGE_SIZE_OPTIONS[3]);
      });
      expect(localStorageMock.getItem('pagination_page_size')).toBe(String(PAGINATION_PAGE_SIZE_OPTIONS[3]));
    });
  });

  describe('Current Page Management', () => {
    test('updates current page', () => {
      const { result } = renderHook(() => usePagination());

      act(() => {
        result.current.setCurrentPage(2);
      });

      expect(result.current.currentPage).toBe(2);
    });

    test('updates current page multiple times', () => {
      const { result } = renderHook(() => usePagination());

      act(() => {
        result.current.setCurrentPage(3);
      });
      expect(result.current.currentPage).toBe(3);

      act(() => {
        result.current.setCurrentPage(5);
      });
      expect(result.current.currentPage).toBe(5);

      act(() => {
        result.current.setCurrentPage(1);
      });
      expect(result.current.currentPage).toBe(1);
    });

    test('current page does not affect page size persistence', () => {
      const { result } = renderHook(() => usePagination());

      act(() => {
        result.current.setPageSize(50);
        result.current.setCurrentPage(3);
      });

      expect(result.current.pageSize).toBe(50);
      expect(result.current.currentPage).toBe(3);
      expect(localStorageMock.getItem('pagination_page_size')).toBe('50');
    });
  });

  describe('Total Management', () => {
    test('updates total', () => {
      const { result } = renderHook(() => usePagination());

      act(() => {
        result.current.setTotal(100);
      });

      expect(result.current.total).toBe(100);
    });

    test('updates total multiple times', () => {
      const { result } = renderHook(() => usePagination());

      act(() => {
        result.current.setTotal(50);
      });
      expect(result.current.total).toBe(50);

      act(() => {
        result.current.setTotal(200);
      });
      expect(result.current.total).toBe(200);

      act(() => {
        result.current.setTotal(0);
      });
      expect(result.current.total).toBe(0);
    });
  });

  describe('Integration', () => {
    test('all state updates work independently', () => {
      const { result } = renderHook(() => usePagination());

      act(() => {
        result.current.setCurrentPage(2);
        result.current.setPageSize(50);
        result.current.setTotal(150);
      });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.pageSize).toBe(50);
      expect(result.current.total).toBe(150);
      expect(localStorageMock.getItem('pagination_page_size')).toBe('50');
    });

    test('page size persists when other state changes', () => {
      localStorageMock.setItem('pagination_page_size', '100');
      const { result } = renderHook(() => usePagination());

      act(() => {
        result.current.setCurrentPage(5);
        result.current.setTotal(500);
      });

      // Page size should remain from localStorage
      expect(result.current.pageSize).toBe(100);
      expect(localStorageMock.getItem('pagination_page_size')).toBe('100');
    });
  });

  describe('localStorage Error Handling', () => {
    test('handles localStorage errors gracefully when reading', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Mock localStorage.getItem to throw an error
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: () => {
            throw new Error('localStorage error');
          },
          setItem: () => {},
        },
        writable: true,
      });

      const { result } = renderHook(() => usePagination());

      // Should fall back to default
      expect(result.current.pageSize).toBe(PAGINATION_DEFAULT_PAGE_SIZE);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    test('handles localStorage errors gracefully when writing', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Mock localStorage.setItem to throw an error
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: () => null,
          setItem: () => {
            throw new Error('localStorage error');
          },
        },
        writable: true,
      });

      const { result } = renderHook(() => usePagination());

      act(() => {
        result.current.setPageSize(PAGINATION_DEFAULT_PAGE_SIZE);
      });

      // Should still update state even if localStorage fails
      expect(result.current.pageSize).toBe(PAGINATION_DEFAULT_PAGE_SIZE);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('SSR Compatibility', () => {
    test('handles missing localStorage gracefully (simulates SSR)', () => {
      // Mock localStorage.getItem to return null (simulating SSR where localStorage might not be available)
      const originalGetItem = localStorageMock.getItem;
      localStorageMock.getItem = () => null;

      const { result } = renderHook(() => usePagination());

      expect(result.current.pageSize).toBe(PAGINATION_DEFAULT_PAGE_SIZE);
      expect(result.current.currentPage).toBe(1);
      expect(result.current.total).toBe(0);

      // Restore original getItem
      localStorageMock.getItem = originalGetItem;
    });
  });

  describe('Multiple Hook Instances', () => {
    test('multiple instances share the same localStorage value', () => {
      if (typeof window === 'undefined') {
        // Skip this test if window is not available
        return;
      }

      localStorageMock.setItem('pagination_page_size', '50');

      const { result: result1 } = renderHook(() => usePagination());
      const { result: result2 } = renderHook(() => usePagination());

      expect(result1.current.pageSize).toBe(50);
      expect(result2.current.pageSize).toBe(50);
    });

    test('updating page size in one instance affects localStorage for all', () => {
      if (typeof window === 'undefined') {
        // Skip this test if window is not available
        return;
      }

      const { result: result1 } = renderHook(() => usePagination());

      act(() => {
        result1.current.setPageSize(100);
      });

      // Both should reflect the change on next render
      expect(result1.current.pageSize).toBe(100);
      expect(localStorageMock.getItem('pagination_page_size')).toBe('100');

      // Re-render second instance to pick up the change
      const { result: result3 } = renderHook(() => usePagination());
      expect(result3.current.pageSize).toBe(100);
    });
  });
});

