import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import NavigationBottomItem from '../../components/NavigationBottomMobile/NavigationBottomItem';

// Mock Filters context (minimal)
vi.mock('../../contexts/FiltersProvider', () => ({
  useFiltersContext: () => ({ responsesStatusesCounts: {} }),
}));

// Mock useNavigate to control isPathActive
const mockIsPathActive = vi.fn();
const mockNavigateTo = vi.fn();
vi.mock('../../hooks/useNavigate', () => ({
  __esModule: true,
  default: () => ({ isPathActive: mockIsPathActive, navigateTo: mockNavigateTo }),
}));

function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="002913">{children}</ChakraProvider>;
}

describe('NavigationBottomItem icon color', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const componentsMenuItem = {
    label: 'Components',
    url: '/components',
    // Use a simple SVG icon to allow style assertions
    icon: (props: any) => (
      <svg
        data-id="002914"
        data-testid="components-svg"
        viewBox="0 0 10 10"
        {...props}>
        <circle data-id="002915" cx="5" cy="5" r="4" />
      </svg>
    ),
    permission: 'home.view',
  };

  test('renders icon in white when active (selected)', () => {
    mockIsPathActive.mockReturnValue(true);

    render(
      <TestWrapper data-id="002916">
        <NavigationBottomItem
          data-id="002917"
          menuItem={componentsMenuItem as any}
          filtersOpen={false}
          setFiltersOpen={vi.fn()}
          setSubsectionOpen={vi.fn()}
          subsectionOpen={false} />
      </TestWrapper>
    );

    // Check the icon style - Chakra applies color via style
    const icon = screen.getByTestId('components-svg');
    expect(icon).toHaveStyle({ color: '#ffffff' });
  });

  test('renders icon in gray when inactive (not selected)', () => {
    mockIsPathActive.mockReturnValue(false);

    render(
      <TestWrapper data-id="002918">
        <NavigationBottomItem
          data-id="002919"
          menuItem={componentsMenuItem as any}
          filtersOpen={false}
          setFiltersOpen={vi.fn()}
          setSubsectionOpen={vi.fn()}
          subsectionOpen={false} />
      </TestWrapper>
    );

    const icon = screen.getByTestId('components-svg');
    expect(icon).toHaveStyle({ color: '#4A5568' });
  });
});
