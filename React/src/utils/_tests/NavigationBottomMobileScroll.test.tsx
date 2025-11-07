import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import NavigationBottomMobile from '../../components/NavigationBottomMobile';

// Mock the useConfigContext
const mockMenuItems = Array.from({ length: 8 }).map((_, idx) => ({
  label: `Item${idx + 1}`,
  url: `/item-${idx + 1}`,
  icon: () => <div data-id="002920" data-testid={`icon-${idx + 1}`}>Icon {idx + 1}</div>,
  permission: 'home.view',
}));

vi.mock('../../contexts/ConfigProvider', () => ({
  useConfigContext: () => ({
    menuItems: mockMenuItems,
  }),
}));

// Mock the Can component to always render children
vi.mock('../../components/can', () => ({
  default: ({ children, yes }: { children: any; yes: () => any }) => yes(),
}));

// Mock useNavigate hook used by NavigationBottomItem to avoid Router dependency
vi.mock('../../hooks/useNavigate', () => ({
  __esModule: true,
  default: () => ({
    isPathActive: () => false,
    navigateTo: vi.fn(),
    getPath: () => '',
  }),
}));

function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="002921">{children}</ChakraProvider>;
}

describe('NavigationBottomMobile scroll persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    cleanup();
  });

  test('saves scrollLeft on scroll and restores on remount', () => {
    const { unmount } = render(
      <TestWrapper data-id="002922">
        <NavigationBottomMobile data-id="002923" />
      </TestWrapper>
    );

    // Outer scroll container has data-id="000553"
    const container = document.querySelector('[data-id="000553"]') as HTMLDivElement;

    // Simulate horizontal scroll and fire scroll event
    container.scrollLeft = 120;
    fireEvent.scroll(container);

    // Ensure sessionStorage was updated
    expect(sessionStorage.getItem('navigationBottomMobile.scrollLeft')).toBe('120');

    // Unmount and remount component to verify restoration
    unmount();

    render(
      <TestWrapper data-id="002924">
        <NavigationBottomMobile data-id="002925" />
      </TestWrapper>
    );

    const containerAfter = document.querySelector('[data-id="000553"]') as HTMLDivElement;
    expect(containerAfter.scrollLeft).toBe(120);
  });
});
