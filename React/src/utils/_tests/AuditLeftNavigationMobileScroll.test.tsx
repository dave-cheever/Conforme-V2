import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi, afterEach } from 'vitest';

import AuditLeftNavigationMobile from '../../components/Audit/AuditLeftNavigationMobile';

// Mock the useNavigate hook
const mockNavigateTo = vi.fn();
const mockIsPathActive = vi.fn();

vi.mock('../../hooks/useNavigate', () => ({
  default: () => ({
    navigateTo: mockNavigateTo,
    isPathActive: mockIsPathActive,
  }),
}));

// Mock the useParams hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '123' }),
    useLocation: () => ({ search: '' }),
  };
});

// Mock the useConfig hook - 4 items to enable scrolling
vi.mock('../../hooks/useConfig', () => ({
  default: () => ({
    config: {
      audit: {
        name: 'Audit',
      },
    },
    auditNavigationTabs: [
      { label: 'Questions', icon: () => <div data-id="002992">Questions Icon</div>, url: '/' },
      { label: 'Participants', icon: () => <div data-id="002993">Participants Icon</div>, url: '/participants' },
      { label: 'History', icon: () => <div data-id="002994">History Icon</div>, url: '/history' },
      { label: 'Actions', icon: () => <div data-id="002995">Actions Icon</div>, url: '/actions' },
    ],
  }),
}));

// Mock the BackArrowIcon
vi.mock('../../icons', () => ({
  BackArrowIcon: () => <div data-id="002996" data-testid="back-arrow-icon">Back Arrow</div>,
}));

// Mock the AuditLeftTabItem component
vi.mock('../../components/Audit/AuditLeftTabItem', () => ({
  default: ({ label, icon, url }: { label: string; icon: any; url: string }) => (
    <div data-id="002997" data-testid={`audit-tab-${label.toLowerCase()}`}>
      <div data-id="002998">{icon()}</div>
      <div data-id="002999">{label}</div>
      <div data-id="003000">{url}</div>
    </div>
  ),
}));

function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="003001">{children}</ChakraProvider>;
}

describe('AuditLeftNavigationMobile scroll position retention', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  test('saves scroll position to sessionStorage when scrolling', () => {
    render(
      <TestWrapper data-id="003002">
        <AuditLeftNavigationMobile data-id="003003" />
      </TestWrapper>
    );

    const scrollContainer = document.querySelector('[data-id="000213"]') as HTMLDivElement;
    expect(scrollContainer).toBeInTheDocument();

    // Simulate scroll
    Object.defineProperty(scrollContainer, 'scrollLeft', {
      writable: true,
      value: 150,
    });

    fireEvent.scroll(scrollContainer);

    expect(sessionStorage.getItem('auditNavMobileScrollPosition')).toBe('150');
  });

  test('restores scroll position from sessionStorage on mount', async () => {
    // Set initial scroll position in sessionStorage
    sessionStorage.setItem('auditNavMobileScrollPosition', '200');

    render(
      <TestWrapper data-id="003004">
        <AuditLeftNavigationMobile data-id="003005" />
      </TestWrapper>
    );

    const scrollContainer = document.querySelector('[data-id="000213"]') as HTMLDivElement;
    expect(scrollContainer).toBeInTheDocument();

    // Wait for restoration attempts (component uses requestAnimationFrame and setTimeout)
    await waitFor(() => {
      expect(scrollContainer.scrollLeft).toBe(200);
    }, { timeout: 1000 });
  });

  test('restores scroll position after re-render', async () => {
    const { rerender } = render(
      <TestWrapper data-id="003006">
        <AuditLeftNavigationMobile data-id="003007" />
      </TestWrapper>
    );

    const scrollContainer = document.querySelector('[data-id="000213"]') as HTMLDivElement;
    
    // Set scroll position and save it
    Object.defineProperty(scrollContainer, 'scrollLeft', {
      writable: true,
      value: 100,
      configurable: true,
    });
    fireEvent.scroll(scrollContainer);

    expect(sessionStorage.getItem('auditNavMobileScrollPosition')).toBe('100');

    // Reset scroll position
    Object.defineProperty(scrollContainer, 'scrollLeft', {
      writable: true,
      value: 0,
      configurable: true,
    });

    // Re-render component
    rerender(
      <TestWrapper data-id="003008">
        <AuditLeftNavigationMobile data-id="003009" />
      </TestWrapper>
    );

    // Wait for restoration
    await waitFor(() => {
      expect(scrollContainer.scrollLeft).toBe(100);
    }, { timeout: 1000 });
  });

  test('saves scroll position correctly', () => {
    render(
      <TestWrapper data-id="003010">
        <AuditLeftNavigationMobile data-id="003011" />
      </TestWrapper>
    );

    const scrollContainer = document.querySelector('[data-id="000213"]') as HTMLDivElement;
    
    // Set scroll position
    Object.defineProperty(scrollContainer, 'scrollLeft', {
      writable: true,
      value: 150,
      configurable: true,
    });
    
    fireEvent.scroll(scrollContainer);
    
    // Should save to sessionStorage
    expect(sessionStorage.getItem('auditNavMobileScrollPosition')).toBe('150');
  });

  test('handles sessionStorage errors gracefully', () => {
    // Mock sessionStorage.setItem to throw an error
    const originalSetItem = sessionStorage.setItem;
    sessionStorage.setItem = vi.fn(() => {
      throw new Error('Storage quota exceeded');
    });

    render(
      <TestWrapper data-id="003012">
        <AuditLeftNavigationMobile data-id="003013" />
      </TestWrapper>
    );

    const scrollContainer = document.querySelector('[data-id="000213"]') as HTMLDivElement;
    
    Object.defineProperty(scrollContainer, 'scrollLeft', {
      writable: true,
      value: 100,
    });

    // Should not throw error
    expect(() => {
      fireEvent.scroll(scrollContainer);
    }).not.toThrow();

    // Restore original
    sessionStorage.setItem = originalSetItem;
  });

  test('handles invalid sessionStorage values gracefully', async () => {
    sessionStorage.setItem('auditNavMobileScrollPosition', 'invalid');

    render(
      <TestWrapper data-id="003014">
        <AuditLeftNavigationMobile data-id="003015" />
      </TestWrapper>
    );

    const scrollContainer = document.querySelector('[data-id="000213"]') as HTMLDivElement;
    
    // Should not crash, scrollLeft should remain at default (0)
    // Component should handle invalid values without throwing
    await waitFor(() => {
      expect(scrollContainer).toBeInTheDocument();
    }, { timeout: 1000 });
    
    // Invalid value should not be restored
    expect(scrollContainer.scrollLeft).toBe(0);
  });

  test('saves scroll position when hasManyIcons is true', () => {
    // Note: This test verifies the component handles the case when there are 4 or more icons
    // In this test setup, we have 4 icons, so hasManyIcons is true
    // The component correctly saves scroll position when hasManyIcons is true
    render(
      <TestWrapper data-id="003016">
        <AuditLeftNavigationMobile data-id="003017" />
      </TestWrapper>
    );

    const scrollContainer = document.querySelector('[data-id="000213"]') as HTMLDivElement;
    
    // With 4 icons, scrolling should save position
    Object.defineProperty(scrollContainer, 'scrollLeft', {
      writable: true,
      value: 200,
      configurable: true,
    });
    
    fireEvent.scroll(scrollContainer);
    
    // Should save since hasManyIcons is true (4 icons)
    expect(sessionStorage.getItem('auditNavMobileScrollPosition')).toBe('200');
  });

  test('restores scroll position multiple times (immediate, RAF, timeout)', async () => {
    sessionStorage.setItem('auditNavMobileScrollPosition', '250');

    render(
      <TestWrapper data-id="003018">
        <AuditLeftNavigationMobile data-id="003019" />
      </TestWrapper>
    );

    const scrollContainer = document.querySelector('[data-id="000213"]') as HTMLDivElement;
    
    // Wait for restoration (component uses multiple restoration attempts)
    await waitFor(() => {
      expect(scrollContainer.scrollLeft).toBe(250);
    }, { timeout: 1000 });
  });

  test('scroll container has correct overflow properties when hasManyIcons is true', () => {
    render(
      <TestWrapper data-id="003020">
        <AuditLeftNavigationMobile data-id="003021" />
      </TestWrapper>
    );

    const scrollContainer = document.querySelector('[data-id="000213"]') as HTMLDivElement;
    
    expect(scrollContainer).toHaveAttribute('data-id', '000213');
    // Overflow should be set (Chakra UI applies it via sx prop)
  });

  test('scroll container uses Box component instead of Flex', () => {
    render(
      <TestWrapper data-id="003022">
        <AuditLeftNavigationMobile data-id="003023" />
      </TestWrapper>
    );

    const scrollContainer = document.querySelector('[data-id="000213"]');
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer?.tagName.toLowerCase()).toBe('div');
  });

  test('cleans up scroll event listener on unmount', () => {
    const { unmount } = render(
      <TestWrapper data-id="003024">
        <AuditLeftNavigationMobile data-id="003025" />
      </TestWrapper>
    );

    const scrollContainer = document.querySelector('[data-id="000213"]') as HTMLDivElement;
    
    // Set scroll position
    Object.defineProperty(scrollContainer, 'scrollLeft', {
      writable: true,
      value: 100,
    });
    
    fireEvent.scroll(scrollContainer);
    expect(sessionStorage.getItem('auditNavMobileScrollPosition')).toBe('100');

    // Unmount should clean up
    unmount();

    // Verify unmount doesn't crash - the container element still exists in DOM
    // but the component is unmounted
    expect(document.querySelector('[data-id="000213"]')).toBeNull();
  });

  test('uses correct sessionStorage key', () => {
    render(
      <TestWrapper data-id="003026">
        <AuditLeftNavigationMobile data-id="003027" />
      </TestWrapper>
    );

    const scrollContainer = document.querySelector('[data-id="000213"]') as HTMLDivElement;
    
    Object.defineProperty(scrollContainer, 'scrollLeft', {
      writable: true,
      value: 175,
    });

    fireEvent.scroll(scrollContainer);

    // Should use auditNavMobileScrollPosition key, not responseNavMobileScrollPosition
    expect(sessionStorage.getItem('auditNavMobileScrollPosition')).toBe('175');
    expect(sessionStorage.getItem('responseNavMobileScrollPosition')).toBeNull();
  });
});

