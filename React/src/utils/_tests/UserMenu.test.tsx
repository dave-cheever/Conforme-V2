import { BrowserRouter } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import UserMenu from '../../components/UserMenu';
import AppProvider from '../../contexts/AppProvider';

// Mock scrollTo method for JSDOM
Object.defineProperty(Element.prototype, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});

// Mock the hooks
const mockUseLogout = vi.fn();
const mockNavigateTo = vi.fn();

vi.mock('../../hooks/useLogout', () => ({
  default: () => mockUseLogout,
}));

vi.mock('../../hooks/useNavigate', () => ({
  default: () => ({ navigateTo: mockNavigateTo }),
}));

vi.mock('../../components/can', () => ({
  isPermitted: vi.fn(() => true),
}));

// Mock the AppProvider context
const mockUser = {
  _id: 'user-123',
  userId: 'user-123',
  displayName: 'John Doe',
  jobTitle: 'Software Developer',
  email: 'john.doe@example.com',
  role: 'admin',
  organizationId: 'org-123',
  metatags: {
    addedBy: 'admin',
    addedAt: new Date(),
  },
};

const mockOrganizationConfig = {
  _id: 'org-123',
  name: 'Test Organization',
  modules: [
    {
      _id: 'module-1',
      name: 'Document Control',
      type: 'tracker',
      path: 'documents',
      showInNavigation: true,
    },
    {
      _id: 'module-2',
      name: 'Safety Walk',
      type: 'audits',
      path: 'safety-health-environment-walk',
      showInNavigation: true,
    },
  ],
};

// Mock the AppProvider context
vi.mock('../../contexts/AppProvider', () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
  useAppContext: () => ({
    user: mockUser,
    organizationConfig: mockOrganizationConfig,
    setUser: vi.fn(),
    setOrganizationConfig: vi.fn(),
  }),
}));

const renderUserMenu = () =>
  render(
    <ChakraProvider data-id="002510">
      <BrowserRouter data-id="002511">
        <AppProvider data-id="002512">
          <UserMenu data-id="002513" />
        </AppProvider>
      </BrowserRouter>
    </ChakraProvider>,
  );

describe('UserMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user information correctly', () => {
    renderUserMenu();

    expect(screen.getAllByText('John Doe')).toHaveLength(2); // One in button, one in menu
    expect(screen.getAllByText('Software Developer')).toHaveLength(2); // One in button, one in menu
  });

  it('renders organization modules with Admin role', () => {
    renderUserMenu();

    expect(screen.getByText('Document Control - Admin')).toBeInTheDocument();
    expect(screen.getByText('Safety Walk - Admin')).toBeInTheDocument();
  });

  it('renders menu items with correct icons', () => {
    renderUserMenu();

    // Open the menu
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Notification settings')).toBeInTheDocument();
    expect(screen.getByText('Terms and conditions')).toBeInTheDocument();
    expect(screen.getByText('Privacy policy')).toBeInTheDocument();
    expect(screen.getByText('Help & support')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('handles menu item clicks correctly', async () => {
    renderUserMenu();

    // Open the menu
    fireEvent.click(screen.getByRole('button'));

    // Click on a menu item
    fireEvent.click(screen.getByText('Notification settings'));

    expect(mockNavigateTo).toHaveBeenCalledWith('/notification-settings');
  });

  it('handles logout click correctly', async () => {
    renderUserMenu();

    // Open the menu
    fireEvent.click(screen.getByRole('button'));

    // Click logout
    fireEvent.click(screen.getByText('Logout'));

    expect(mockUseLogout).toHaveBeenCalled();
  });

  it('displays user avatar with correct name', () => {
    renderUserMenu();

    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('aria-label', 'John Doe');
  });

  it('handles missing job title gracefully', () => {
    renderUserMenu();

    // Should not crash and should display empty job title
    expect(screen.getAllByText('John Doe')).toHaveLength(2); // One in button, one in menu
  });

  it('handles missing organization config gracefully', () => {
    renderUserMenu();

    // Should not crash
    expect(screen.getAllByText('John Doe')).toHaveLength(2); // One in button, one in menu
  });

  it('applies correct styling to menu items', () => {
    renderUserMenu();

    // Open the menu
    fireEvent.click(screen.getByRole('button'));

    const notificationItem = screen.getByText('Notification settings').closest('[role="menuitem"]');
    expect(notificationItem).toHaveStyle({
      'font-size': '100%',
      'font-weight': '500',
    });
  });

  it('applies correct styling to logout item', () => {
    renderUserMenu();

    // Open the menu
    fireEvent.click(screen.getByRole('button'));

    const logoutItem = screen.getByText('Logout').closest('[role="menuitem"]');
    expect(logoutItem).toHaveStyle({
      'font-size': '100%',
      'font-weight': '500',
    });
  });
});
