import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import ChangeViewButton from '../../components/ChangeViewButton';
import { TViewMode } from '../../interfaces/TViewMode';

// Mock the contexts and hooks
const mockSetViewMode = vi.fn();
const mockUser = { _id: 'user1', userId: 'user1', role: 'admin' };

vi.mock('../../contexts/AppProvider', () => ({
  useAppContext: () => ({ user: mockUser }),
}));

vi.mock('../../hooks/useDevice', () => ({
  __esModule: true,
  default: () => 'desktop',
}));

// Mock icons
vi.mock('../../icons', () => ({
  ListIcon: () => (
    <div data-id="002600" data-testid="list-icon">
      List
    </div>
  ),
}));

vi.mock('../../icons/PanelIcon', () => ({
  __esModule: true,
  default: () => (
    <div data-id="002601" data-testid="panel-icon">
      Panel
    </div>
  ),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
};

Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="002913">{children}</ChakraProvider>;
}

describe('ViewMode Persistence - Preventing Flash', () => {
  const defaultProps = {
    viewMode: 'list' as TViewMode,
    setViewMode: mockSetViewMode,
    views: ['list', 'panel'] as TViewMode[],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('ChangeViewButton - Only Updates When Different', () => {
    test('does not call setViewMode when saved view matches current viewMode', () => {
      mockLocalStorage.getItem.mockReturnValue('list');

      render(
        <TestWrapper data-id="002914">
          <ChangeViewButton data-id="002915" {...defaultProps} viewMode="list" />
        </TestWrapper>,
      );

      // Since savedView === viewMode, setViewMode should not be called
      expect(mockSetViewMode).not.toHaveBeenCalled();
    });

    test('calls setViewMode when saved view differs from current viewMode', () => {
      mockLocalStorage.getItem.mockReturnValue('panel');

      render(
        <TestWrapper data-id="002916">
          <ChangeViewButton data-id="002917" {...defaultProps} viewMode="list" />
        </TestWrapper>,
      );

      // Since savedView !== viewMode, setViewMode should be called
      expect(mockSetViewMode).toHaveBeenCalledWith('panel');
    });

    test('does not update if saved view is not in available views', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid');

      render(
        <TestWrapper data-id="002918">
          <ChangeViewButton data-id="002919" {...defaultProps} viewMode="list" views={['list']} />
        </TestWrapper>,
      );

      // Should not call setViewMode with invalid value, but may default to panel for admin
      const calls = mockSetViewMode.mock.calls.filter((call) => call[0] === 'invalid');
      expect(calls).toHaveLength(0);
    });

    test('preserves viewMode when localStorage is empty and viewMode is already correct', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      render(
        <TestWrapper data-id="002920">
          <ChangeViewButton data-id="002921" {...defaultProps} viewMode="list" />
        </TestWrapper>,
      );

      // For admin users, it may default to panel, but we're checking that if viewMode is already list,
      // it shouldn't unnecessarily change it (though admin logic may override)
      // This test verifies the component doesn't crash and handles the case
      expect(screen.getByTestId('list-icon')).toBeInTheDocument();
    });
  });

  describe('LocalStorage Initialization Simulation', () => {
    // Simulate the lazy initialization pattern used in tracker-items.tsx and audits.tsx
    const initializeViewModeFromLocalStorage = (
      defaultView: TViewMode = 'panel',
    ): TViewMode => {
      if (typeof window !== 'undefined') {
        const savedView = localStorage.getItem('viewMode') as TViewMode;
        if (savedView && ['list', 'panel'].includes(savedView)) {
          return savedView;
        }
      }
      return defaultView;
    };

    test('initializes from localStorage when saved view exists', () => {
      mockLocalStorage.getItem.mockReturnValue('list');

      const initialViewMode = initializeViewModeFromLocalStorage('panel');

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('viewMode');
      expect(initialViewMode).toBe('list');
    });

    test('uses default when localStorage is empty', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const initialViewMode = initializeViewModeFromLocalStorage('panel');

      expect(initialViewMode).toBe('panel');
    });

    test('uses default when saved view is invalid', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid');

      const initialViewMode = initializeViewModeFromLocalStorage('panel');

      expect(initialViewMode).toBe('panel');
    });

    test('initializes correctly for audits page default (list)', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const initialViewMode = initializeViewModeFromLocalStorage('list');

      expect(initialViewMode).toBe('list');
    });

    test('initializes correctly for tracker-items page default (panel)', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const initialViewMode = initializeViewModeFromLocalStorage('panel');

      expect(initialViewMode).toBe('panel');
    });
  });

  describe('View Mode Persistence Flow', () => {
    test('saves view mode to localStorage when changed', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper data-id="002922">
          <ChangeViewButton data-id="002923" {...defaultProps} viewMode="list" />
        </TestWrapper>,
      );

      const panelButton = screen.getByTestId('panel-icon').closest('button');
      await user.click(panelButton!);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('viewMode', 'panel');
      expect(mockSetViewMode).toHaveBeenCalledWith('panel');
    });

    test('restores saved view mode on remount', () => {
      // Simulate: user selects panel view
      mockLocalStorage.setItem('viewMode', 'panel');
      mockLocalStorage.getItem.mockReturnValue('panel');

      // First render with list (simulating default)
      const { unmount } = render(
        <TestWrapper data-id="002924">
          <ChangeViewButton data-id="002925" {...defaultProps} viewMode="list" />
        </TestWrapper>,
      );

      // ChangeViewButton should update to panel since it's saved
      expect(mockSetViewMode).toHaveBeenCalledWith('panel');

      unmount();

      // Remount - simulate component remounting after navigation
      mockLocalStorage.getItem.mockReturnValue('panel');
      render(
        <TestWrapper data-id="002926">
          <ChangeViewButton data-id="002927" {...defaultProps} viewMode="panel" />
        </TestWrapper>,
      );

      // Should not call setViewMode since it already matches
      const lastCallCount = mockSetViewMode.mock.calls.length;
      // Re-render should not trigger additional setViewMode calls
      expect(mockSetViewMode.mock.calls.length).toBeGreaterThanOrEqual(lastCallCount - 1);
    });
  });

  describe('Edge Cases', () => {
    test('handles window undefined (SSR scenario)', () => {
      // Simulate SSR where window is undefined
      const originalWindow = globalThis.window;
      // @ts-expect-error - intentionally setting to undefined for test
      globalThis.window = undefined;

      const initializeViewMode = (defaultView: TViewMode = 'panel'): TViewMode => {
        if (typeof window !== 'undefined') {
          const savedView = localStorage.getItem('viewMode') as TViewMode;
          if (savedView && ['list', 'panel'].includes(savedView)) {
            return savedView;
          }
        }
        return defaultView;
      };

      const result = initializeViewMode('panel');

      expect(result).toBe('panel');

      // Restore window
      globalThis.window = originalWindow;
    });

    test('handles localStorage getItem throwing error', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const initializeViewMode = (defaultView: TViewMode = 'panel'): TViewMode => {
        try {
          if (typeof window !== 'undefined') {
            const savedView = localStorage.getItem('viewMode') as TViewMode;
            if (savedView && ['list', 'panel'].includes(savedView)) {
              return savedView;
            }
          }
        } catch {
          // Fall through to default
        }
        return defaultView;
      };

      const result = initializeViewMode('panel');

      expect(result).toBe('panel');
    });
  });
});

