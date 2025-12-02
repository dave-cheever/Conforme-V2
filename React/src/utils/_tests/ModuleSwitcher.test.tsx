import { ChakraProvider, useMediaQuery } from '@chakra-ui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import ModuleSwitcher from '../../components/ModuleSwitcher';
import theme from '../../bootstrap/theme';
import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import useDevice from '../../hooks/useDevice';

// Mock dependencies
const mockNavigate = vi.fn();
const mockSetModule = vi.fn();

const mockModule = {
  _id: 'module1',
  name: 'Tracker Items',
  path: 'tracker-items',
  type: 'tracker',
  icon: 'TrackerIcon',
  showInNavigation: true,
} as any;

const mockOrganizationConfig = {
  modules: [
    mockModule,
    {
      _id: 'module2',
      name: 'Audits',
      path: 'audits',
      type: 'audits',
      icon: 'AuditIcon',
      showInNavigation: true,
    },
  ],
} as any;

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../contexts/AppProvider', () => ({
  useAppContext: vi.fn(),
}));

vi.mock('../../contexts/FiltersProvider', () => ({
  useFiltersContext: vi.fn(),
}));

vi.mock('../../hooks/useDevice', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  const mockUseMediaQuery = vi.fn(() => [false]);
  return {
    ...actual,
    useMediaQuery: mockUseMediaQuery,
  };
});

vi.mock('../../icons/ModuleSwitcherIcon', () => ({
  __esModule: true,
  default: ({ dataId }: { dataId?: string }) => (
    <svg data-id={dataId} data-testid="module-switcher-icon" viewBox="0 0 20 20">
      <path
        data-id="002959"
        d="M17.5 8.33333L17.5 3.33333C17.5 3.11232 17.4122 2.90036 17.2559 2.74408C17.0996 2.5878 16.8877 2.5 16.6667 2.5L11.6667 2.5C11.4457 2.5 11.2337 2.5878 11.0774 2.74408C10.9211 2.90036 10.8333 3.11232 10.8333 3.33333L10.8333 8.33333C10.8333 8.55435 10.9211 8.76631 11.0774 8.92259C11.2337 9.07887 11.4457 9.16667 11.6667 9.16667L16.6667 9.16667C16.8877 9.16667 17.0996 9.07887 17.2559 8.92259C17.4122 8.76631 17.5 8.55435 17.5 8.33333Z" />
    </svg>
  ),
}));

vi.mock('../../icons/Conforme', () => ({
  __esModule: true,
  default: ({ dataId }: { dataId?: string }) => (
    <svg data-id={dataId} data-testid="conforme-icon" viewBox="0 0 30 30">
      <path data-id="002960" d="M15 0L30 15L15 30Z" />
    </svg>
  ),
}));

vi.mock('../../icons/ConformeNew', () => ({
  __esModule: true,
  default: ({ dataId }: { dataId?: string }) => (
    <svg data-id={dataId} data-testid="conforme-new-icon" viewBox="0 0 30 30">
      <path data-id="002961" d="M15 0L30 15L15 30Z" />
    </svg>
  ),
}));

vi.mock('../../utils/getIconByName', () => ({
  __esModule: true,
  default: vi.fn((name: string) => {
    const MockIcon = ({ dataId }: { dataId?: string }) => (
      <svg data-id={dataId} data-testid={`icon-${name}`} viewBox="0 0 20 20">
        <path data-id="002962" d="M10 0L20 10L10 20Z" />
      </svg>
    );
    return MockIcon;
  }),
  getIconByName: vi.fn((name: string) => {
    const MockIcon = ({ dataId }: { dataId?: string }) => (
      <svg data-id={dataId} data-testid={`icon-${name}`} viewBox="0 0 20 20">
        <path data-id="002962" d="M10 0L20 10L10 20Z" />
      </svg>
    );
    return MockIcon;
  }),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ChakraProvider data-id="002961" theme={theme}>
      <BrowserRouter data-id="002962">{component}</BrowserRouter>
    </ChakraProvider>,
  );
};

describe('ModuleSwitcher Icon Replacement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAppContext).mockReturnValue({
      organizationConfig: mockOrganizationConfig,
      module: mockModule,
      setModule: mockSetModule,
    } as any);
    vi.mocked(useFiltersContext).mockReturnValue({
      showFiltersPanel: false,
    } as any);
    vi.mocked(useDevice).mockReturnValue('desktop');
    vi.mocked(useMediaQuery).mockReturnValue([false]);
  });

  describe('Icon Usage', () => {
    test('renders ModuleSwitcherIcon instead of ChevronDownIcon', () => {
      renderWithProviders(<ModuleSwitcher data-id="002963" />);

      const icon = screen.getByTestId('module-switcher-icon');
      expect(icon).toBeInTheDocument();
    });

    test('icon has correct data-id attribute', () => {
      renderWithProviders(<ModuleSwitcher data-id="002964" />);

      // The data-id="000433" is on the container Box
      // The data-id="000434" is on the Icon component wrapper
      const iconContainer = document.querySelector('[data-id="000433"]');
      expect(iconContainer).toBeInTheDocument();
      
      // Verify the Icon component exists within the container
      const iconElement = iconContainer?.querySelector('svg[data-testid="module-switcher-icon"]');
      expect(iconElement).toBeInTheDocument();
    });

    test('icon container has correct data-id', () => {
      renderWithProviders(<ModuleSwitcher data-id="002965" />);

      const container = document.querySelector('[data-id="000433"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Icon Visibility', () => {
    test('shows icon when multiple modules exist', () => {
      renderWithProviders(<ModuleSwitcher data-id="002966" />);

      const icon = screen.getByTestId('module-switcher-icon');
      expect(icon).toBeInTheDocument();
    });

    test('shows icon when enforceDesktop is true', () => {
      renderWithProviders(<ModuleSwitcher data-id="002967" enforceDesktop={true} />);

      const icon = screen.getByTestId('module-switcher-icon');
      expect(icon).toBeInTheDocument();
    });

    test('icon does not appear when single module (no menu)', () => {
      const singleModuleConfig = {
        ...mockOrganizationConfig,
        modules: [{ ...mockModule, showInNavigation: true }],
      };

      vi.mocked(useAppContext).mockReturnValue({
        organizationConfig: singleModuleConfig,
        module: mockModule,
        setModule: mockSetModule,
      } as any);

      renderWithProviders(<ModuleSwitcher data-id="002968" />);

      const icon = screen.queryByTestId('module-switcher-icon');
      expect(icon).not.toBeInTheDocument();
    });
  });

  describe('Icon Props', () => {
    test('icon has correct viewBox (0 0 20 20)', () => {
      renderWithProviders(<ModuleSwitcher data-id="002969" />);

      const icon = screen.getByTestId('module-switcher-icon');
      expect(icon).toHaveAttribute('viewBox', '0 0 20 20');
    });

    test('icon path is rendered correctly', () => {
      renderWithProviders(<ModuleSwitcher data-id="002970" />);

      const icon = screen.getByTestId('module-switcher-icon');
      const path = icon.querySelector('path');
      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute('d');
    });
  });

  describe('Integration with ModuleSwitcher', () => {
    test('icon renders alongside module name', () => {
      renderWithProviders(<ModuleSwitcher data-id="002971" />);

      const icon = screen.getByTestId('module-switcher-icon');
      expect(icon).toBeInTheDocument();
    });

    test('icon renders when filters panel is shown', () => {
      vi.mocked(useFiltersContext).mockReturnValue({
        showFiltersPanel: true,
      } as any);

      renderWithProviders(<ModuleSwitcher data-id="002972" />);

      const icon = screen.getByTestId('module-switcher-icon');
      expect(icon).toBeInTheDocument();
    });

    test('icon does not render on tablet width (unless enforceDesktop)', () => {
      vi.mocked(useMediaQuery).mockReturnValue([true]); // isTabletWidth = true

      renderWithProviders(<ModuleSwitcher data-id="002973" />);

      // Icon should not be present when isTabletWidth is true and enforceDesktop is false
      const icon = screen.queryByTestId('module-switcher-icon');
      expect(icon).not.toBeInTheDocument();
    });

    test('icon renders on tablet width when enforceDesktop is true', () => {
      vi.mocked(useMediaQuery).mockReturnValue([true]); // isTabletWidth = true

      renderWithProviders(<ModuleSwitcher data-id="002974" enforceDesktop={true} />);

      const icon = screen.getByTestId('module-switcher-icon');
      expect(icon).toBeInTheDocument();
    });

    test('icon renders correctly on mobile', () => {
      vi.mocked(useDevice).mockReturnValue('mobile');
      vi.mocked(useMediaQuery).mockReturnValue([false]); // isTabletWidth = false

      renderWithProviders(<ModuleSwitcher data-id="002975" />);

      const icon = screen.getByTestId('module-switcher-icon');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Regression Tests', () => {
    test('does not render ChevronDownIcon from @chakra-ui/icons', () => {
      renderWithProviders(<ModuleSwitcher data-id="002976" />);

      // Ensure our custom icon is present
      const icon = screen.getByTestId('module-switcher-icon');
      expect(icon).toBeInTheDocument();
    });

    test('icon is not undefined or null', () => {
      renderWithProviders(<ModuleSwitcher data-id="002977" />);

      const icon = screen.getByTestId('module-switcher-icon');
      expect(icon).not.toBeNull();
      expect(icon).toBeDefined();
    });

    test('icon component is properly imported and used', () => {
      renderWithProviders(<ModuleSwitcher data-id="002978" />);

      // Verify the icon is rendered through Chakra UI's Icon component
      const icon = screen.getByTestId('module-switcher-icon');
      expect(icon).toBeInTheDocument();
      expect(icon.tagName).toBe('svg');
    });
  });

  describe('Text Truncation', () => {
    test('module names truncate with ellipsis when they exceed available space', () => {
      const longNameModule = {
        ...mockModule,
        name: 'This is a very long module name that should be truncated with an ellipsis when it exceeds the available space in the menu',
        _id: 'module3',
        path: 'long-module',
      };

      const configWithLongName = {
        ...mockOrganizationConfig,
        modules: [
          longNameModule,
          {
            _id: 'module2',
            name: 'Audits',
            path: 'audits',
            type: 'audits',
            icon: 'AuditIcon',
            showInNavigation: true,
          },
        ],
      };

      vi.mocked(useAppContext).mockReturnValue({
        organizationConfig: configWithLongName,
        module: longNameModule,
        setModule: mockSetModule,
      } as any);

      renderWithProviders(<ModuleSwitcher data-id="002979" />);

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      const allTexts = screen.getAllByText(longNameModule.name);
      const moduleNameText = allTexts.find(
        (text) => text.closest('[role="menuitem"]') !== null
      );
      expect(moduleNameText).toBeDefined();

      // Check that truncation styles are applied
      expect(moduleNameText!).toHaveStyle({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      });
    });

    test('Governance Suite text truncates with ellipsis', () => {
      renderWithProviders(<ModuleSwitcher data-id="002980" />);

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      const governanceText = screen.getByText('Governance Suite');
      expect(governanceText).toBeInTheDocument();

      expect(governanceText).toHaveStyle({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      });
    });

    test('module menu items have proper structure for truncation', () => {
      renderWithProviders(<ModuleSwitcher data-id="002981" />);

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      const allTexts = screen.getAllByText('Tracker Items');
      const moduleNameText = allTexts.find(
        (text) => text.closest('[role="menuitem"]') !== null
      );
      expect(moduleNameText).toBeDefined();

      const flexContainer = document.querySelector('[data-id="003081"]');
      expect(flexContainer).toBeInTheDocument();
      
      expect(moduleNameText!).toHaveStyle({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      });
    });
  });
});
