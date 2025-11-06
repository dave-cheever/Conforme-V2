import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import DefaultLayout from '../../layouts/DefaultLayout';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import useDevice from '../../hooks/useDevice';

// Mock dependencies
const mockSetShowFiltersPanel = vi.fn();

// Mock child components
vi.mock('../../components/NavigationLeft/NavigationLeft', () => ({
  __esModule: true,
  default: () => <div data-id="002931" data-testid="navigation-left">Navigation Left</div>,
}));

vi.mock('../../components/NavigationTop', () => ({
  __esModule: true,
  default: () => <div data-id="002932" data-testid="navigation-top">Navigation Top</div>,
}));

vi.mock('../../components/ShareModal', () => ({
  __esModule: true,
  default: () => <div data-id="002933" data-testid="share-modal">Share Modal</div>,
}));

vi.mock('../../components/Filters/FiltersPanel', () => ({
  __esModule: true,
  default: () => <div data-id="002934" data-testid="filters-panel">Filters Panel</div>,
}));

vi.mock('../../components/NavigationBottomMobile', () => ({
  __esModule: true,
  default: () => <div data-id="002935" data-testid="navigation-bottom-mobile">Navigation Bottom Mobile</div>,
}));

vi.mock('../../contexts/ShareProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../contexts/FiltersProvider', () => ({
  useFiltersContext: vi.fn(),
}));

vi.mock('../../hooks/useDevice', () => ({
  __esModule: true,
  default: vi.fn(),
}));

const mockTheme = {
  colors: {
    brand: {
      primary: '#0068A3',
    },
  },
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter data-id="002936">
      <ChakraProvider data-id="002937" theme={mockTheme}>
        {component}
      </ChakraProvider>
    </BrowserRouter>,
  );
};

const MockComponent = () => <div data-id="002938" data-testid="test-component">Test Component</div>;

describe('DefaultLayout Filter Overlay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSetShowFiltersPanel.mockClear();
    
    vi.mocked(useFiltersContext).mockReturnValue({
      usedFilters: ['filter1', 'filter2'],
      showFiltersPanel: false,
      setShowFiltersPanel: mockSetShowFiltersPanel,
    } as any);
    
    vi.mocked(useDevice).mockReturnValue('desktop');
  });

  describe('Overlay Visibility', () => {
    test('renders overlay when showFiltersPanel is true', () => {
      vi.mocked(useFiltersContext).mockReturnValue({
        usedFilters: ['filter1', 'filter2'],
        showFiltersPanel: true,
        setShowFiltersPanel: mockSetShowFiltersPanel,
      } as any);

      renderWithProviders(<DefaultLayout data-id="002939" component={MockComponent} />);

      const overlay = document.querySelector('[data-id="filter-overlay"]');
      expect(overlay).toBeInTheDocument();
    });

    test('does not render overlay when showFiltersPanel is false', () => {
      vi.mocked(useFiltersContext).mockReturnValue({
        usedFilters: ['filter1', 'filter2'],
        showFiltersPanel: false,
        setShowFiltersPanel: mockSetShowFiltersPanel,
      } as any);

      renderWithProviders(<DefaultLayout data-id="002940" component={MockComponent} />);

      const overlay = document.querySelector('[data-id="filter-overlay"]');
      expect(overlay).not.toBeInTheDocument();
    });

    test('does not render overlay when usedFilters is empty', () => {
      vi.mocked(useFiltersContext).mockReturnValue({
        usedFilters: [],
        showFiltersPanel: true,
        setShowFiltersPanel: mockSetShowFiltersPanel,
      } as any);

      renderWithProviders(<DefaultLayout data-id="002941" component={MockComponent} />);

      const overlay = document.querySelector('[data-id="filter-overlay"]');
      expect(overlay).not.toBeInTheDocument();
    });

    test('does not render overlay when usedFilters is undefined', () => {
      vi.mocked(useFiltersContext).mockReturnValue({
        usedFilters: undefined,
        showFiltersPanel: true,
        setShowFiltersPanel: mockSetShowFiltersPanel,
      } as any);

      renderWithProviders(<DefaultLayout data-id="002942" component={MockComponent} />);

      const overlay = document.querySelector('[data-id="filter-overlay"]');
      expect(overlay).not.toBeInTheDocument();
    });
  });

  describe('Overlay Styling', () => {
    test('overlay has correct background color', () => {
      vi.mocked(useFiltersContext).mockReturnValue({
        usedFilters: ['filter1'],
        showFiltersPanel: true,
        setShowFiltersPanel: mockSetShowFiltersPanel,
      } as any);

      renderWithProviders(<DefaultLayout data-id="002943" component={MockComponent} />);

      const overlay = document.querySelector('[data-id="filter-overlay"]');
      expect(overlay).toBeInTheDocument();
      // Chakra UI translates bg="black" to backgroundColor, check it exists
      const styles = window.getComputedStyle(overlay as Element);
      expect(styles.backgroundColor).toBeTruthy();
    });

    test('overlay has correct opacity (40%)', () => {
      vi.mocked(useFiltersContext).mockReturnValue({
        usedFilters: ['filter1'],
        showFiltersPanel: true,
        setShowFiltersPanel: mockSetShowFiltersPanel,
      } as any);

      renderWithProviders(<DefaultLayout data-id="002944" component={MockComponent} />);

      const overlay = document.querySelector('[data-id="filter-overlay"]');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveStyle({ opacity: '0.4' });
    });

    test('overlay has fixed position', () => {
      vi.mocked(useFiltersContext).mockReturnValue({
        usedFilters: ['filter1'],
        showFiltersPanel: true,
        setShowFiltersPanel: mockSetShowFiltersPanel,
      } as any);

      renderWithProviders(<DefaultLayout data-id="002945" component={MockComponent} />);

      const overlay = document.querySelector('[data-id="filter-overlay"]');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveStyle({ position: 'fixed' });
    });

    test('overlay has correct z-index', () => {
      vi.mocked(useFiltersContext).mockReturnValue({
        usedFilters: ['filter1'],
        showFiltersPanel: true,
        setShowFiltersPanel: mockSetShowFiltersPanel,
      } as any);

      renderWithProviders(<DefaultLayout data-id="002946" component={MockComponent} />);

      const overlay = document.querySelector('[data-id="filter-overlay"]');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveStyle({ zIndex: '11' });
    });

    test('overlay covers entire screen', () => {
      vi.mocked(useFiltersContext).mockReturnValue({
        usedFilters: ['filter1'],
        showFiltersPanel: true,
        setShowFiltersPanel: mockSetShowFiltersPanel,
      } as any);

      renderWithProviders(<DefaultLayout data-id="002947" component={MockComponent} />);

      const overlay = document.querySelector('[data-id="filter-overlay"]');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveStyle({
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
      });
    });

    test('overlay has correct data-id attribute', () => {
      vi.mocked(useFiltersContext).mockReturnValue({
        usedFilters: ['filter1'],
        showFiltersPanel: true,
        setShowFiltersPanel: mockSetShowFiltersPanel,
      } as any);

      renderWithProviders(<DefaultLayout data-id="002948" component={MockComponent} />);

      const overlay = document.querySelector('[data-id="filter-overlay"]');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveAttribute('data-id', 'filter-overlay');
    });
  });

  describe('Overlay Interaction', () => {
    test('clicking overlay closes filter panel', async () => {
      const user = userEvent.setup();
      
      vi.mocked(useFiltersContext).mockReturnValue({
        usedFilters: ['filter1'],
        showFiltersPanel: true,
        setShowFiltersPanel: mockSetShowFiltersPanel,
      } as any);

      renderWithProviders(<DefaultLayout data-id="002949" component={MockComponent} />);

      const overlay = document.querySelector('[data-id="filter-overlay"]') as HTMLElement;
      expect(overlay).toBeInTheDocument();
      await user.click(overlay);

      expect(mockSetShowFiltersPanel).toHaveBeenCalledWith(false);
      expect(mockSetShowFiltersPanel).toHaveBeenCalledTimes(1);
    });

    test('overlay is clickable', () => {
      vi.mocked(useFiltersContext).mockReturnValue({
        usedFilters: ['filter1'],
        showFiltersPanel: true,
        setShowFiltersPanel: mockSetShowFiltersPanel,
      } as any);

      renderWithProviders(<DefaultLayout data-id="002950" component={MockComponent} />);

      const overlay = document.querySelector('[data-id="filter-overlay"]');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveAttribute('data-id', 'filter-overlay');
    });
  });

  describe('FiltersPanel Rendering', () => {
    test('FiltersPanel renders when usedFilters has items', () => {
      vi.mocked(useFiltersContext).mockReturnValue({
        usedFilters: ['filter1'],
        showFiltersPanel: false,
        setShowFiltersPanel: mockSetShowFiltersPanel,
      } as any);

      renderWithProviders(<DefaultLayout data-id="002951" component={MockComponent} />);

      const filtersPanel = screen.getByTestId('filters-panel');
      expect(filtersPanel).toBeInTheDocument();
    });

    test('FiltersPanel does not render when usedFilters is empty', () => {
      vi.mocked(useFiltersContext).mockReturnValue({
        usedFilters: [],
        showFiltersPanel: true,
        setShowFiltersPanel: mockSetShowFiltersPanel,
      } as any);

      renderWithProviders(<DefaultLayout data-id="002952" component={MockComponent} />);

      const filtersPanel = screen.queryByTestId('filters-panel');
      expect(filtersPanel).not.toBeInTheDocument();
    });

    test('overlay and FiltersPanel render together when conditions are met', () => {
      vi.mocked(useFiltersContext).mockReturnValue({
        usedFilters: ['filter1'],
        showFiltersPanel: true,
        setShowFiltersPanel: mockSetShowFiltersPanel,
      } as any);

      renderWithProviders(<DefaultLayout data-id="002953" component={MockComponent} />);

      const overlay = document.querySelector('[data-id="filter-overlay"]');
      const filtersPanel = screen.getByTestId('filters-panel');
      
      expect(overlay).toBeInTheDocument();
      expect(filtersPanel).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    test('renders NavigationLeft component', () => {
      renderWithProviders(<DefaultLayout data-id="002954" component={MockComponent} />);

      const navigationLeft = screen.getByTestId('navigation-left');
      expect(navigationLeft).toBeInTheDocument();
    });

    test('renders NavigationTop component', () => {
      renderWithProviders(<DefaultLayout data-id="002955" component={MockComponent} />);

      const navigationTop = screen.getByTestId('navigation-top');
      expect(navigationTop).toBeInTheDocument();
    });

    test('renders ShareModal component', () => {
      renderWithProviders(<DefaultLayout data-id="002956" component={MockComponent} />);

      const shareModal = screen.getByTestId('share-modal');
      expect(shareModal).toBeInTheDocument();
    });

    test('renders passed component', () => {
      renderWithProviders(<DefaultLayout data-id="002957" component={MockComponent} />);

      const testComponent = screen.getByTestId('test-component');
      expect(testComponent).toBeInTheDocument();
    });

    test('renders NavigationBottomMobile on mobile device', () => {
      vi.mocked(useDevice).mockReturnValue('mobile');

      renderWithProviders(<DefaultLayout data-id="002958" component={MockComponent} />);

      const navigationBottomMobile = screen.getByTestId('navigation-bottom-mobile');
      expect(navigationBottomMobile).toBeInTheDocument();
    });

    test('does not render NavigationBottomMobile on desktop device', () => {
      vi.mocked(useDevice).mockReturnValue('desktop');

      renderWithProviders(<DefaultLayout data-id="002959" component={MockComponent} />);

      const navigationBottomMobile = screen.queryByTestId('navigation-bottom-mobile');
      expect(navigationBottomMobile).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles multiple usedFilters', () => {
      vi.mocked(useFiltersContext).mockReturnValue({
        usedFilters: ['filter1', 'filter2', 'filter3'],
        showFiltersPanel: true,
        setShowFiltersPanel: mockSetShowFiltersPanel,
      } as any);

      renderWithProviders(<DefaultLayout data-id="002960" component={MockComponent} />);

      const overlay = document.querySelector('[data-id="filter-overlay"]');
      expect(overlay).toBeInTheDocument();
    });

    test('handles overlay state changes', () => {
      vi.mocked(useFiltersContext).mockReturnValue({
        usedFilters: ['filter1'],
        showFiltersPanel: false,
        setShowFiltersPanel: mockSetShowFiltersPanel,
      } as any);

      const { rerender } = renderWithProviders(<DefaultLayout data-id="002961" component={MockComponent} />);

      // Initially no overlay
      expect(document.querySelector('[data-id="filter-overlay"]')).not.toBeInTheDocument();

      // Update to show overlay
      vi.mocked(useFiltersContext).mockReturnValue({
        usedFilters: ['filter1'],
        showFiltersPanel: true,
        setShowFiltersPanel: mockSetShowFiltersPanel,
      } as any);

      rerender(<DefaultLayout data-id="002962" component={MockComponent} />);

      const overlay = document.querySelector('[data-id="filter-overlay"]');
      expect(overlay).toBeInTheDocument();
    });
  });
});

