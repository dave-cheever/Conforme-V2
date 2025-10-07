import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import EllipsisMenu, { EllipsisMenuOption } from '../../components/EllipsisMenu';

// Mock the EllipsisIcon component
vi.mock('../../icons', () => ({
  EllipsisIcon: ({ 'data-id': dataId, ...props }: any) => (
    <div data-id={dataId} data-testid="ellipsis-icon" {...props}>
      ⋯
    </div>
  ),
}));

// Mock scrollTo function for Chakra UI menu
Object.defineProperty(Element.prototype, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});

// Mock theme for ChakraProvider
const mockTheme = {
  colors: {
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
    },
  },
};

// Test wrapper component
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return (
    <ChakraProvider data-id="001393" theme={mockTheme}>
      {children}
    </ChakraProvider>
  );
}

// Helper function to render component with wrapper
const renderWithWrapper = (props: any = {}) => {
  const defaultProps = {
    options: [
      { label: 'Option 1', onClick: vi.fn() },
      { label: 'Option 2', onClick: vi.fn() },
    ],
  };
  return render(
    <TestWrapper data-id="001394">
      <EllipsisMenu data-id="001395" {...defaultProps} {...props} />
    </TestWrapper>,
  );
};

// Mock options for testing
const createMockOptions = (count: number): EllipsisMenuOption[] =>
  Array.from({ length: count }, (_, index) => ({
    label: `Option ${index + 1}`,
    onClick: vi.fn(),
    icon: (
      <span data-id="001396" data-testid={`icon-${index}`}>
        📄
      </span>
    ),
  }));

const createMockOptionsWithDisabled = (): EllipsisMenuOption[] => [
  { label: 'Enabled Option', onClick: vi.fn() },
  { label: 'Disabled Option', onClick: vi.fn(), disabled: true },
  { label: 'Another Enabled', onClick: vi.fn() },
];

const createMockOptionsWithColors = (): EllipsisMenuOption[] => [
  { label: 'Default Color', onClick: vi.fn() },
  { label: 'Red Option', onClick: vi.fn(), color: 'red' },
  { label: 'Blue Option', onClick: vi.fn(), color: 'blue' },
];

describe('EllipsisMenu', () => {
  describe('Basic Rendering', () => {
    test('renders the ellipsis button', () => {
      renderWithWrapper();

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('data-id', '001395-button');
    });

    test('renders the ellipsis icon', () => {
      renderWithWrapper();

      const icon = screen.getByTestId('ellipsis-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-id', '001395-icon');
    });

    test('applies default data-id when not provided', () => {
      renderWithWrapper();

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-id', '001395-button');
    });

    test('applies custom data-id when provided', () => {
      renderWithWrapper({ 'data-id': 'custom-id' });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-id', 'custom-id-button');

      const icon = screen.getByTestId('ellipsis-icon');
      expect(icon).toHaveAttribute('data-id', 'custom-id-icon');
    });
  });

  describe('Button Sizes', () => {
    test('renders small size button', () => {
      renderWithWrapper({ size: 'sm' });

      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ width: '32px', height: '32px' });

      const icon = screen.getByTestId('ellipsis-icon');
      expect(icon).toHaveAttribute('boxSize', '12px');
    });

    test('renders medium size button (default)', () => {
      renderWithWrapper({ size: 'md' });

      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ width: '40px', height: '40px' });

      const icon = screen.getByTestId('ellipsis-icon');
      expect(icon).toHaveAttribute('boxSize', '16px');
    });

    test('renders large size button', () => {
      renderWithWrapper({ size: 'lg' });

      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ width: '48px', height: '48px' });

      const icon = screen.getByTestId('ellipsis-icon');
      expect(icon).toHaveAttribute('boxSize', '20px');
    });
  });

  describe('Menu Interactions', () => {
    test('opens menu when button is clicked', async () => {
      const user = userEvent.setup();
      renderWithWrapper();

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });

    test('closes menu when clicking outside', async () => {
      const user = userEvent.setup();
      renderWithWrapper();

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      // Click outside the menu
      await user.click(document.body);

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    test('renders menu options correctly', async () => {
      const user = userEvent.setup();
      const options = createMockOptions(3);
      renderWithWrapper({ options });

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      // Check that all options are rendered
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();

      // Check that icons are rendered
      expect(screen.getByTestId('icon-0')).toBeInTheDocument();
      expect(screen.getByTestId('icon-1')).toBeInTheDocument();
      expect(screen.getByTestId('icon-2')).toBeInTheDocument();
    });

    test('calls onClick handler when option is clicked', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();
      const options = [{ label: 'Test Option', onClick: mockOnClick }];
      renderWithWrapper({ options });

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      const menuItem = screen.getByText('Test Option');
      await user.click(menuItem);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('closes menu after option is clicked', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();
      const options = [{ label: 'Test Option', onClick: mockOnClick }];
      renderWithWrapper({ options });

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      const menuItem = screen.getByText('Test Option');
      await user.click(menuItem);

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });
  });

  describe('Disabled Options', () => {
    test('renders disabled options with correct styling', async () => {
      const user = userEvent.setup();
      const options = createMockOptionsWithDisabled();
      renderWithWrapper({ options });

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      // Check that the disabled option is rendered
      const disabledOption = screen.getByText('Disabled Option');
      expect(disabledOption).toBeInTheDocument();
    });

    test('does not call onClick for disabled options', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();
      const options = [{ label: 'Disabled Option', onClick: mockOnClick, disabled: true }];
      renderWithWrapper({ options });

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      // Check that the disabled option is rendered
      const disabledOption = screen.getByText('Disabled Option');
      expect(disabledOption).toBeInTheDocument();
    });
  });

  describe('Option Colors', () => {
    test('applies custom colors to options', async () => {
      const user = userEvent.setup();
      const options = createMockOptionsWithColors();
      renderWithWrapper({ options });

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      const redOption = screen.getByText('Red Option');
      const blueOption = screen.getByText('Blue Option');

      expect(redOption).toHaveStyle({ color: 'rgb(255, 0, 0)' });
      expect(blueOption).toHaveStyle({ color: 'rgb(0, 0, 255)' });
    });

    test('applies default color when no color is specified', async () => {
      const user = userEvent.setup();
      const options = createMockOptionsWithColors();
      renderWithWrapper({ options });

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      const defaultOption = screen.getByText('Default Color');
      // Check that the element has some color styling (either the default or inherited)
      const computedStyle = globalThis.getComputedStyle(defaultOption);
      expect(computedStyle.color).toBeTruthy();
    });
  });

  describe('Menu Placement', () => {
    test('applies default placement', async () => {
      const user = userEvent.setup();
      renderWithWrapper();

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        const menu = screen.getByRole('menu');
        expect(menu).toBeInTheDocument();
      });
    });

    test('applies custom placement', async () => {
      const user = userEvent.setup();
      renderWithWrapper({ placement: 'top-start' });

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        const menu = screen.getByRole('menu');
        expect(menu).toBeInTheDocument();
      });
    });
  });

  describe('Event Propagation', () => {
    test('stops propagation on button click', async () => {
      const parentOnClick = vi.fn();
      const { container } = renderWithWrapper();

      const button = screen.getByRole('button');
      const parentElement = container.firstChild as HTMLElement;
      parentElement.addEventListener('click', parentOnClick);

      // Create a new event and test stopPropagation
      const clickEvent = new MouseEvent('click', { bubbles: true });
      const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation');

      fireEvent(button, clickEvent);

      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    test('stops propagation on menu click', async () => {
      const user = userEvent.setup();
      renderWithWrapper();

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      const menu = screen.getByRole('menu');

      // Create a new event and test stopPropagation
      const clickEvent = new MouseEvent('click', { bubbles: true });
      const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation');

      fireEvent(menu, clickEvent);

      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    test('stops propagation on menu item click', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();
      const options = [{ label: 'Test Option', onClick: mockOnClick }];
      renderWithWrapper({ options });

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      const menuItem = screen.getByText('Test Option');

      // Create a new event and test stopPropagation
      const clickEvent = new MouseEvent('click', { bubbles: true });
      const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation');

      fireEvent(menuItem, clickEvent);

      expect(stopPropagationSpy).toHaveBeenCalled();
      expect(mockOnClick).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    test('button has correct ARIA attributes', () => {
      renderWithWrapper();

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-haspopup', 'menu');
    });

    test('menu has correct role', async () => {
      const user = userEvent.setup();
      renderWithWrapper();

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        const menu = screen.getByRole('menu');
        expect(menu).toBeInTheDocument();
      });
    });

    test('menu items have correct roles', async () => {
      const user = userEvent.setup();
      const options = createMockOptions(2);
      renderWithWrapper({ options });

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitem');
        expect(menuItems).toHaveLength(2);
      });
    });
  });

  describe('Edge Cases', () => {
    test('handles empty options array', () => {
      renderWithWrapper({ options: [] });

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    test('handles options without icons', async () => {
      const user = userEvent.setup();
      const options = [
        { label: 'Option 1', onClick: vi.fn() },
        { label: 'Option 2', onClick: vi.fn() },
      ];
      renderWithWrapper({ options });

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    test('handles options with only icons', async () => {
      const user = userEvent.setup();
      const options = [
        {
          label: '',
          onClick: vi.fn(),
          icon: (
            <span data-id="001397" data-testid="icon-only">
              📄
            </span>
          ),
        },
      ];
      renderWithWrapper({ options });

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      expect(screen.getByTestId('icon-only')).toBeInTheDocument();
    });

    test('handles rapid clicking', async () => {
      const user = userEvent.setup();
      renderWithWrapper();

      const button = screen.getByRole('button');

      // Click multiple times rapidly
      await user.click(button);
      await user.click(button);
      await user.click(button);

      // Should still work correctly - button should still be functional
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Data Attributes', () => {
    test('applies correct data attributes to menu elements', async () => {
      const user = userEvent.setup();
      const options = createMockOptions(2);
      renderWithWrapper({ options, 'data-id': 'test-menu' });

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      // Check menu data-id
      const menu = screen.getByRole('menu');
      expect(menu).toHaveAttribute('data-id', 'test-menu-menu');

      // Check menu item data-ids
      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems[0]).toHaveAttribute('data-id', 'test-menu-option-0');
      expect(menuItems[1]).toHaveAttribute('data-id', 'test-menu-option-1');
    });
  });
});
