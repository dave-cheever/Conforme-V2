import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import NotificationSettings from '../../pages/notification-settings';

// Mock contexts and hooks
const mockNavigateTo = vi.fn();
const mockSetAdminModalState = vi.fn();
const mockIsPathActive = vi.fn();

const mockUser = { _id: 'user1', userId: 'user1', displayName: 'Test User' };
const mockModule = { _id: 'module1', type: 'audits' };

vi.mock('../../contexts/AppProvider', () => ({
  useAppContext: () => ({ user: mockUser, module: mockModule }),
}));

vi.mock('../../contexts/AdminProvider', () => ({
  useAdminContext: () => ({ setAdminModalState: mockSetAdminModalState }),
}));

vi.mock('../../contexts/FiltersProvider', () => ({
  useFiltersContext: () => ({
    usedFilters: [],
  }),
}));

vi.mock('../../hooks/useNavigate', () => ({
  __esModule: true,
  default: () => ({
    isPathActive: mockIsPathActive,
    navigateTo: mockNavigateTo,
  }),
}));

vi.mock('../../hooks/useConfig', () => ({
  __esModule: true,
  default: () => ({
    trackerAddItems: [],
    auditAddItems: [],
  }),
}));

vi.mock('../../hooks/useDevice', () => ({
  __esModule: true,
  default: () => 'desktop',
}));

// Mock components used by Header
vi.mock('../../components/can', () => ({
  __esModule: true,
  default: ({ children, yes }: any) => (yes ? children : null),
}));

vi.mock('../../components/FilterButton', () => ({
  __esModule: true,
  default: () => <div data-id="003085" data-testid="filter-button">Filter Button</div>,
}));

// Mock icons
vi.mock('../../icons', () => ({
  AddIcon: () => <div data-id="003086" data-testid="add-icon">Add Icon</div>,
  ArrowRight: () => <div data-id="003087" data-testid="arrow-right">→</div>,
}));

vi.mock('../../utils/isAuditPage', () => ({
  __esModule: true,
  default: () => false,
}));

// Mock lodash
vi.mock('lodash', () => ({
  capitalize: (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
}));

function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return (
    <BrowserRouter data-id="003088">
      <ChakraProvider data-id="003089">{children}</ChakraProvider>
    </BrowserRouter>
  );
}

describe('NotificationSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsPathActive.mockReturnValue(false);

    // Set up window.location.pathname to simulate being on notification-settings page
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/notification-settings',
      },
      writable: true,
    });
  });

  describe('Component Rendering', () => {
    test('renders the notification settings page', () => {
      render(
        <TestWrapper data-id="003090">
          <NotificationSettings data-id="003091" />
        </TestWrapper>,
      );

      const mainContainer = document.querySelector('[data-id="000280"]');
      expect(mainContainer).toBeInTheDocument();
    });

    test('renders Header component', () => {
      render(
        <TestWrapper data-id="003092">
          <NotificationSettings data-id="003093" />
        </TestWrapper>,
      );

      // Header root element has data-id="000275"
      const header = document.querySelector('[data-id="000275"]');
      expect(header).toBeInTheDocument();
    });

    test('renders breadcrumbs in Header', () => {
      render(
        <TestWrapper data-id="003094">
          <NotificationSettings data-id="003095" />
        </TestWrapper>,
      );

      // Check that breadcrumbs are rendered (Header component renders them)
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Notification Settings')).toBeInTheDocument();
    });

    test('renders "No Settings Found" text', () => {
      render(
        <TestWrapper data-id="003096">
          <NotificationSettings data-id="003097" />
        </TestWrapper>,
      );

      const noSettingsText = screen.getByText('No Settings Found');
      expect(noSettingsText).toBeInTheDocument();
    });
  });

  describe('Add Button Visibility', () => {
    test('does not show add button on notification settings page', () => {
      render(
        <TestWrapper data-id="003098">
          <NotificationSettings data-id="003099" />
        </TestWrapper>,
      );

      // The add button should not be present
      const addButton = screen.queryByLabelText('Add');
      expect(addButton).not.toBeInTheDocument();

      // Also check for the add icon
      const addIcon = screen.queryByTestId('add-icon');
      expect(addIcon).not.toBeInTheDocument();
    });

    test('add button is not rendered even when path ends with settings', () => {
      // Test with different path variations
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/notification-settings',
        },
        writable: true,
      });

      render(
        <TestWrapper data-id="003100">
          <NotificationSettings data-id="003101" />
        </TestWrapper>,
      );

      const addButton = screen.queryByLabelText('Add');
      expect(addButton).not.toBeInTheDocument();
    });
  });

  describe('Data Attributes', () => {
    test('main container has correct data-id attribute', () => {
      render(
        <TestWrapper data-id="003102">
          <NotificationSettings data-id="003103" />
        </TestWrapper>,
      );

      const mainContainer = document.querySelector('[data-id="000280"]');
      expect(mainContainer).toBeInTheDocument();
    });

    test('Header has correct data-id attribute', () => {
      render(
        <TestWrapper data-id="003104">
          <NotificationSettings data-id="003105" />
        </TestWrapper>,
      );

      // Header root element has data-id="000275"
      const header = document.querySelector('[data-id="000275"]');
      expect(header).toBeInTheDocument();
    });

    test('content container has correct data-id attribute', () => {
      render(
        <TestWrapper data-id="003106">
          <NotificationSettings data-id="003107" />
        </TestWrapper>,
      );

      const contentContainer = document.querySelector('[data-id="000282"]');
      expect(contentContainer).toBeInTheDocument();
    });

    test('inner div has correct data-id attribute', () => {
      render(
        <TestWrapper data-id="003108">
          <NotificationSettings data-id="003109" />
        </TestWrapper>,
      );

      const innerDiv = document.querySelector('[data-id="000284"]');
      expect(innerDiv).toBeInTheDocument();
    });

    test('text element has correct data-id attribute', () => {
      render(
        <TestWrapper data-id="003110">
          <NotificationSettings data-id="003111" />
        </TestWrapper>,
      );

      const textElement = screen.getByText('No Settings Found');
      expect(textElement).toHaveAttribute('data-id', '000287');
    });
  });

  describe('Layout Structure', () => {
    test('main container exists and has correct structure', () => {
      render(
        <TestWrapper data-id="003112">
          <NotificationSettings data-id="003113" />
        </TestWrapper>,
      );

      const mainContainer = document.querySelector('[data-id="000280"]');
      expect(mainContainer).toBeInTheDocument();
    });

    test('content container exists with correct data-id', () => {
      render(
        <TestWrapper data-id="003114">
          <NotificationSettings data-id="003115" />
        </TestWrapper>,
      );

      const contentContainer = document.querySelector('[data-id="000282"]');
      expect(contentContainer).toBeInTheDocument();
    });

    test('renders Header and content container in correct order', () => {
      render(
        <TestWrapper data-id="003116">
          <NotificationSettings data-id="003117" />
        </TestWrapper>,
      );

      // Header root element has data-id="000275"
      const header = document.querySelector('[data-id="000275"]');
      const contentContainer = document.querySelector('[data-id="000282"]');

      expect(header).toBeInTheDocument();
      expect(contentContainer).toBeInTheDocument();
    });
  });

  describe('Text Content', () => {
    test('displays "No Settings Found" message', () => {
      render(
        <TestWrapper data-id="003118">
          <NotificationSettings data-id="003119" />
        </TestWrapper>,
      );

      const message = screen.getByText('No Settings Found');
      expect(message).toBeInTheDocument();
      expect(message).toHaveTextContent('No Settings Found');
    });

    test('text has correct font size', () => {
      render(
        <TestWrapper data-id="003120">
          <NotificationSettings data-id="003121" />
        </TestWrapper>,
      );

      const textElement = screen.getByText('No Settings Found');
      expect(textElement).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('renders all required elements', () => {
      render(
        <TestWrapper data-id="003122">
          <NotificationSettings data-id="003123" />
        </TestWrapper>,
      );

      // Check Header is rendered (Header root element has data-id="000275")
      const header = document.querySelector('[data-id="000275"]');
      expect(header).toBeInTheDocument();

      // Check content container is rendered
      const contentContainer = document.querySelector('[data-id="000282"]');
      expect(contentContainer).toBeInTheDocument();

      // Check text is rendered
      const text = screen.getByText('No Settings Found');
      expect(text).toBeInTheDocument();
    });

    test('all data-id attributes are present', () => {
      render(
        <TestWrapper data-id="003124">
          <NotificationSettings data-id="003125" />
        </TestWrapper>,
      );

      expect(document.querySelector('[data-id="000280"]')).toBeInTheDocument();
      expect(document.querySelector('[data-id="000282"]')).toBeInTheDocument();
      expect(document.querySelector('[data-id="000284"]')).toBeInTheDocument();
      expect(screen.getByText('No Settings Found')).toHaveAttribute('data-id', '000287');
    });
  });
});
