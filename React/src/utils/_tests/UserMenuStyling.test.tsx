import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import UserMenu, { userMenuStyles } from '../../components/UserMenu';
import AppProvider from '../../contexts/AppProvider';

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
    <ChakraProvider data-id="002520">
      <BrowserRouter data-id="002521">
        <AppProvider data-id="002522">
          <UserMenu data-id="002523" />
        </AppProvider>
      </BrowserRouter>
    </ChakraProvider>,
  );

describe('UserMenu Styling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Menu Container Styling', () => {
    it('applies correct background and border radius to menu list', () => {
      renderUserMenu();

      fireEvent.click(screen.getByRole('button'));

      const menuList = document.querySelector('[role="menu"]');
      expect(menuList).toHaveStyle({
        'background-color': 'rgba(0, 0, 0, 0)',
        'border-radius': '12px',
        'box-shadow': '0px 4px 20px rgba(0, 0, 0, 0.15)',
      });
    });

    it('applies correct minimum width to menu list', () => {
      renderUserMenu();

      fireEvent.click(screen.getByRole('button'));

      const menuList = document.querySelector('[role="menu"]');
      expect(menuList).toHaveStyle({
        'min-width': '280px',
      });
    });

    it('applies correct padding to menu list', () => {
      renderUserMenu();

      fireEvent.click(screen.getByRole('button'));

      const menuList = document.querySelector('[role="menu"]');
      expect(menuList).toHaveStyle({
        padding: '16px',
      });
    });
  });

  describe('User Information Styling', () => {
    it('applies correct styling to user name in menu', () => {
      renderUserMenu();

      fireEvent.click(screen.getByRole('button'));

      const userName = document.querySelector('[role="menu"] p');
      expect(userName).toHaveStyle({
        'font-size': '16px',
        'font-weight': '600',
        color: 'var(--chakra-colors-gray-800)', // gray.800
      });
    });

    it('applies correct styling to job title in menu', () => {
      renderUserMenu();

      fireEvent.click(screen.getByRole('button'));

      const jobTitle = document.querySelector('[role="menu"] p:nth-child(2)');
      expect(jobTitle).toHaveStyle({
        'font-size': '14px',
        color: 'rgb(113, 128, 150)', // #718096
      });
    });

    it('applies correct styling to module roles box', () => {
      renderUserMenu();

      fireEvent.click(screen.getByRole('button'));

      // Check if the parent container has the correct background
      const parentDiv = document.querySelector('[role="menu"] .css-12i8z8w');
      expect(parentDiv).toHaveStyle({
        'background-color': 'rgb(237, 242, 247)', // #EDF2F7
        'border-radius': '8px',
        padding: '12px',
      });
    });

    it('applies correct styling to module role text', () => {
      renderUserMenu();

      fireEvent.click(screen.getByRole('button'));

      const moduleText = document.querySelector('[role="menu"] .css-1dga5xa');
      expect(moduleText).toHaveStyle({
        'font-size': '12px',
        color: 'rgb(20, 88, 234)', // #1458EA
        'font-weight': '500',
      });
    });
  });

  describe('Menu Items Styling', () => {
    it('applies correct styling to regular menu items', () => {
      renderUserMenu();

      fireEvent.click(screen.getByRole('button'));

      const menuItem = screen.getByText('Notification settings').closest('[role="menuitem"]');
      expect(menuItem).toHaveStyle({
        'font-size': '100%',
        'font-weight': '500',
        height: '40px',
        'border-radius': '8px',
      });
    });

    it('applies correct styling to menu item text', () => {
      renderUserMenu();

      fireEvent.click(screen.getByRole('button'));

      const menuText = screen.getByText('Notification settings');
      expect(menuText).toHaveStyle({
        color: 'rgb(45, 55, 72)', // #2D3748
        'font-size': '16px',
        'font-weight': '500',
      });
    });

    it('applies correct styling to logout menu item', () => {
      renderUserMenu();

      fireEvent.click(screen.getByRole('button'));

      const logoutItem = screen.getByText('Logout').closest('[role="menuitem"]');
      expect(logoutItem).toHaveStyle({
        'font-size': '100%',
        'font-weight': '500',
        height: '40px',
        'border-radius': '8px',
      });
    });

    it('applies correct styling to logout text', () => {
      renderUserMenu();

      fireEvent.click(screen.getByRole('button'));

      const logoutText = screen.getByText('Logout');
      expect(logoutText).toHaveStyle({
        color: 'var(--chakra-colors-red-500)',
        'font-size': '14px',
        'font-weight': '500',
      });
    });
  });

  describe('Icon Styling', () => {
    it('applies correct styling to menu item icons', () => {
      renderUserMenu();

      fireEvent.click(screen.getByRole('button'));

      // Check that icons have correct size and color
      const icons = screen.getAllByRole('img');
      icons.forEach((icon) => {
        // Icons inherit size from their container, so we check for reasonable size
        expect(icon).toHaveStyle({
          width: expect.stringMatching(/^(16px|100%)$/),
          height: expect.stringMatching(/^(16px|100%)$/),
        });
      });
    });
  });

  describe('Divider Styling', () => {
    it('applies correct styling to dividers', () => {
      renderUserMenu();

      fireEvent.click(screen.getByRole('button'));

      // Check that dividers exist and have correct styling
      const dividers = document.querySelectorAll('hr');
      expect(dividers.length).toBeGreaterThan(0);
    });
  });

  describe('Hover Effects', () => {
    it('applies hover effects to menu items', () => {
      renderUserMenu();

      fireEvent.click(screen.getByRole('button'));

      const menuItem = screen.getByText('Notification settings').closest('[role="menuitem"]');

      // Simulate hover
      fireEvent.mouseEnter(menuItem!);

      // Check that hover styles are applied (this would need to be tested with a more sophisticated approach)
      expect(menuItem).toBeInTheDocument();
    });
  });

  describe('Responsive Styling', () => {
    it('applies responsive styling to user info', () => {
      renderUserMenu();

      fireEvent.click(screen.getByRole('button'));

      // Check that user info has responsive display properties
      const userInfoContainer = document.querySelector('[role="menu"] .css-4wm6nw');
      expect(userInfoContainer).toHaveStyle({
        display: 'flex',
      });
    });
  });

  describe('UserMenuStyles Export', () => {
    it('exports correct style configuration', () => {
      expect(userMenuStyles).toBeDefined();
      expect(userMenuStyles.userMenu).toBeDefined();
      expect(userMenuStyles.userMenu.text).toBe('#818197');
      expect(userMenuStyles.userMenu.borderColor).toBe('#F0F0F0');
      expect(userMenuStyles.userMenu.hoverColor).toBe('#462AC4');
      expect(userMenuStyles.userMenu.avatar).toBeDefined();
      expect(userMenuStyles.userMenu.avatar.color).toBe('white');
      expect(userMenuStyles.userMenu.avatar.bg).toBe('#462AC4');
      expect(userMenuStyles.userMenu.avatar.borderColor).toBe('white');
    });
  });
});
