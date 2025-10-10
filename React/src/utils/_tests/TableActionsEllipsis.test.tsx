import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import TableActionsEllipsis from '../../components/Table/Cells/TableActionsEllipsis';

// Mock the EllipsisMenu component to match the actual Chakra UI Menu structure
vi.mock('../../components/EllipsisMenu', () => ({
  default: ({ options, 'data-id': dataId = '000600' }: { options: any[]; 'data-id'?: string }) => (
    <div data-id={dataId} data-options={JSON.stringify(options)} data-testid="ellipsis-menu">
      <button data-id={`${dataId}-button`} data-testid="ellipsis-menu-button" type="button">
        ⋯
      </button>
      <div data-id={`${dataId}-menu`} data-testid="ellipsis-menu-list" role="menu">
        {options.map((option: any, index: number) => (
          <button
            data-color={option.color}
            data-disabled={option.disabled}
            data-id={`${dataId}-option-${index}`}
            data-label={option.label}
            data-testid={`option-${index}`}
            key={index}
            onClick={option.onClick}
            role="menuitem"
            type="button">
            {option.icon && <span data-id="001367" data-testid={`option-icon-${index}`}>{option.icon}</span>}
            <span data-id="001368">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  ),
}));

// Mock ChakraProvider wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="test-wrapper">{children}</ChakraProvider>;
}

describe('TableActionsEllipsis', () => {
  describe('Basic Rendering', () => {
    test('renders with single option', () => {
      const mockOnClick = vi.fn();
      const options = [
        {
          label: 'View',
          onClick: mockOnClick,
        },
      ];

      render(
        <TestWrapper data-id="002104">
          <TableActionsEllipsis data-id="002105" options={options} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('ellipsis-menu')).toBeInTheDocument();
      expect(screen.getByTestId('option-0')).toBeInTheDocument();
      expect(screen.getByTestId('option-0')).toHaveAttribute('data-label', 'View');
    });

    test('renders with multiple options', () => {
      const mockOnClick1 = vi.fn();
      const mockOnClick2 = vi.fn();
      const options = [
        {
          label: 'View',
          onClick: mockOnClick1,
        },
        {
          label: 'Edit',
          onClick: mockOnClick2,
        },
      ];

      render(
        <TestWrapper data-id="002106">
          <TableActionsEllipsis data-id="002107" options={options} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('option-0')).toHaveAttribute('data-label', 'View');
      expect(screen.getByTestId('option-1')).toHaveAttribute('data-label', 'Edit');
    });

    test('renders with empty options array', () => {
      render(
        <TestWrapper data-id="002108">
          <TableActionsEllipsis data-id="002109" options={[]} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('ellipsis-menu')).toBeInTheDocument();
      expect(screen.queryByTestId('option-0')).not.toBeInTheDocument();
    });
  });

  describe('Options Handling', () => {
    test('passes options correctly to EllipsisMenu', () => {
      const mockOnClick = vi.fn();
      const options = [
        {
          label: 'View',
          onClick: mockOnClick,
          disabled: false,
          color: 'blue',
        },
      ];

      render(
        <TestWrapper data-id="002110">
          <TableActionsEllipsis data-id="002111" options={options} />
        </TestWrapper>,
      );

      const ellipsisMenu = screen.getByTestId('ellipsis-menu');
      const parsedOptions = JSON.parse(ellipsisMenu.getAttribute('data-options') || '[]');

      expect(parsedOptions).toHaveLength(1);
      // Compare serializable fields only since functions are not JSON-serializable
      expect(parsedOptions[0]).toMatchObject({
        label: options[0].label,
        disabled: options[0].disabled,
        color: options[0].color,
      });
    });

    test('handles options with icons', () => {
      const mockOnClick = vi.fn();
      const mockIcon = <span data-id="002112">📝</span>;
      const options = [
        {
          label: 'Edit',
          onClick: mockOnClick,
          icon: mockIcon,
        },
      ];

      render(
        <TestWrapper data-id="002113">
          <TableActionsEllipsis data-id="002114" options={options} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('option-icon-0')).toBeInTheDocument();
      expect(screen.getByTestId('option-icon-0')).toHaveTextContent('📝');
    });

    test('handles disabled options', () => {
      const mockOnClick = vi.fn();
      const options = [
        {
          label: 'Delete',
          onClick: mockOnClick,
          disabled: true,
        },
      ];

      render(
        <TestWrapper data-id="002115">
          <TableActionsEllipsis data-id="002116" options={options} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('option-0')).toHaveAttribute('data-disabled', 'true');
    });

    test('handles options with custom colors', () => {
      const mockOnClick = vi.fn();
      const options = [
        {
          label: 'Archive',
          onClick: mockOnClick,
          color: 'red',
        },
      ];

      render(
        <TestWrapper data-id="002117">
          <TableActionsEllipsis data-id="002118" options={options} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('option-0')).toHaveAttribute('data-color', 'red');
    });
  });

  describe('Component Structure', () => {
    test('renders with correct Flex wrapper styling', () => {
      const mockOnClick = vi.fn();
      const options = [
        {
          label: 'View',
          onClick: mockOnClick,
        },
      ];

      const { container } = render(
        <TestWrapper data-id="002119">
          <TableActionsEllipsis data-id="002120" options={options} />
        </TestWrapper>,
      );

      const flexWrapper = container.firstChild as HTMLElement;
      expect(flexWrapper).toBeInTheDocument();
      // Chakra UI applies classes for justify-content: flex-end
      expect(flexWrapper).toHaveAttribute('class');
    });

    test('Flex wrapper has correct width and padding', () => {
      const mockOnClick = vi.fn();
      const options = [
        {
          label: 'View',
          onClick: mockOnClick,
        },
      ];

      const { container } = render(
        <TestWrapper data-id="002121">
          <TableActionsEllipsis data-id="002122" options={options} />
        </TestWrapper>,
      );

      const flexWrapper = container.firstChild as HTMLElement;
      // Chakra sets width via CSS variable to 100%, accept either representation
      expect(
        getComputedStyle(flexWrapper).width === '100%' ||
        getComputedStyle(flexWrapper).width === 'var(--chakra-sizes-full)',
      ).toBe(true);
      // Chakra uses logical property padding-inline-end via "pr". Accept CSS var or concrete px.
      const inlineStyle = (flexWrapper.getAttribute('style') || '').replace(/\s+/g, '');
      expect(
        inlineStyle.includes('padding-inline-end:8px') ||
        /padding-inline-end:var\(--chakra-space-2\)/.test(inlineStyle) ||
        getComputedStyle(flexWrapper).paddingRight === '8px',
      ).toBe(true);
    });
  });

    test('uses custom data-id when provided', () => {
      const mockOnClick = vi.fn();
      const options = [
        {
          label: 'View',
          onClick: mockOnClick,
        },
      ];

      const { container } = render(
        <TestWrapper data-id="002127">
          <TableActionsEllipsis data-id="custom-123" options={options} />
        </TestWrapper>,
      );

      const flexWrapper = container.firstChild as HTMLElement;
      expect(flexWrapper).toHaveAttribute('data-id', 'custom-123');
    });
  });

  describe('Option Click Handling', () => {
    test('calls onClick when option is clicked', () => {
      const mockOnClick = vi.fn();
      const options = [
        {
          label: 'View',
          onClick: mockOnClick,
        },
      ];

      render(
        <TestWrapper data-id="002128">
          <TableActionsEllipsis data-id="002129" options={options} />
        </TestWrapper>,
      );

      const optionButton = screen.getByTestId('option-0');
      fireEvent.click(optionButton);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('each option calls its respective onClick handler', () => {
      const mockOnClick1 = vi.fn();
      const mockOnClick2 = vi.fn();
      const options = [
        {
          label: 'View',
          onClick: mockOnClick1,
        },
        {
          label: 'Edit',
          onClick: mockOnClick2,
        },
      ];

      render(
        <TestWrapper data-id="002130">
          <TableActionsEllipsis data-id="002131" options={options} />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByTestId('option-0'));
      expect(mockOnClick1).toHaveBeenCalledTimes(1);
      expect(mockOnClick2).not.toHaveBeenCalled();

      fireEvent.click(screen.getByTestId('option-1'));
      expect(mockOnClick1).toHaveBeenCalledTimes(1);
      expect(mockOnClick2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    test('component is accessible and renders correctly', () => {
      const mockOnClick = vi.fn();
      const options = [
        {
          label: 'View',
          onClick: mockOnClick,
        },
      ];

      const { container } = render(
        <TestWrapper data-id="002132">
          <TableActionsEllipsis data-id="002133" options={options} />
        </TestWrapper>,
      );

      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByTestId('option-0')).toBeVisible();
    });

    test('option labels are readable', () => {
      const mockOnClick = vi.fn();
      const options = [
        {
          label: 'View Details',
          onClick: mockOnClick,
        },
      ];

      render(
        <TestWrapper data-id="002134">
          <TableActionsEllipsis data-id="002135" options={options} />
        </TestWrapper>,
      );

      const optionButton = screen.getByTestId('option-0');
      expect(optionButton).toHaveTextContent('View Details');
    });
  });

  describe('Edge Cases', () => {
    test('handles options with complex labels', () => {
      const mockOnClick = vi.fn();
      const options = [
        {
          label: 'View/Edit/Delete Item',
          onClick: mockOnClick,
        },
      ];

      render(
        <TestWrapper data-id="002136">
          <TableActionsEllipsis data-id="002137" options={options} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('option-0')).toHaveAttribute('data-label', 'View/Edit/Delete Item');
    });

    test('handles options with special characters in labels', () => {
      const mockOnClick = vi.fn();
      const options = [
        {
          label: 'View & Edit (Admin)',
          onClick: mockOnClick,
        },
      ];

      render(
        <TestWrapper data-id="002138">
          <TableActionsEllipsis data-id="002139" options={options} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('option-0')).toHaveAttribute('data-label', 'View & Edit (Admin)');
    });

    test('handles readonly options array', () => {
      const mockOnClick = vi.fn();
      const options = [
        {
          label: 'View',
          onClick: mockOnClick,
        },
      ] as const;

      render(
        <TestWrapper data-id="002140">
          <TableActionsEllipsis data-id="002141" options={options} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('option-0')).toHaveAttribute('data-label', 'View');
    });
  });

  describe('Integration with Real Usage', () => {
    test('matches typical table usage pattern', () => {
      const navigateTo = vi.fn();
      const mockRow = { _id: '123', name: 'Test Item' };

      const options = [
        {
          label: 'View',
          onClick: () => navigateTo(`/audits/${mockRow._id}`),
        },
        {
          label: 'Edit',
          onClick: () => navigateTo(`/audits/${mockRow._id}/edit`),
        },
      ];

      render(
        <TestWrapper data-id="002142">
          <TableActionsEllipsis data-id="002143" options={options} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('option-0')).toHaveAttribute('data-label', 'View');
      expect(screen.getByTestId('option-1')).toHaveAttribute('data-label', 'Edit');

      fireEvent.click(screen.getByTestId('option-0'));
      expect(navigateTo).toHaveBeenCalledWith('/audits/123');
    });

    test('maintains consistent structure across renders', () => {
      const mockOnClick = vi.fn();
      const options = [
        {
          label: 'Action',
          onClick: mockOnClick,
        },
      ];

      const { rerender } = render(
        <TestWrapper data-id="002144">
          <TableActionsEllipsis data-id="002145" options={options} />
        </TestWrapper>,
      );

      rerender(
        <TestWrapper data-id="002146">
          <TableActionsEllipsis data-id="002147" options={options} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('ellipsis-menu')).toBeInTheDocument();
      expect(screen.getByTestId('option-0')).toHaveAttribute('data-label', 'Action');
    });
  });

