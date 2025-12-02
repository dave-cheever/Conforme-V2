import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import Pagination from '../../components/UI/Pagination/Pagination';
import { PAGINATION_PAGE_SIZE_OPTIONS } from '../../bootstrap/config';

function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="pagination-test-wrapper">{children}</ChakraProvider>;
}

describe('Pagination', () => {
  const mockOnPageChange = vi.fn();
  const mockOnPageSizeChange = vi.fn();

  const defaultProps = {
    currentPage: 1,
    pageSize: 10,
    total: 142,
    onPageChange: mockOnPageChange,
    onPageSizeChange: mockOnPageSizeChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders pagination component with all elements', () => {
      render(
        <TestWrapper data-id="003094">
          <Pagination data-id="003095" {...defaultProps} />
        </TestWrapper>,
      );

      expect(screen.getByText('Show rows per page')).toBeInTheDocument();
      expect(screen.getByText('1 - 10 of 142')).toBeInTheDocument();
      expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    });

    test('renders page size selector with default options', () => {
      render(
        <TestWrapper data-id="003096">
          <Pagination data-id="003097" {...defaultProps} />
        </TestWrapper>,
      );

      const select = screen.getByDisplayValue('10');
      expect(select).toBeInTheDocument();
      expect(select).toHaveAttribute('data-id', 'pagination-page-size-select');
    });

    test('renders page size selector with valid page size option', () => {
      render(
        <TestWrapper data-id="003098">
          <Pagination data-id="003099" {...defaultProps} pageSize={20} />
        </TestWrapper>,
      );

      const select = screen.getByDisplayValue('20');
      expect(select).toBeInTheDocument();
      expect(select).toHaveAttribute('data-id', 'pagination-page-size-select');
    });

    test('displays correct page range information', () => {
      render(
        <TestWrapper data-id="003100">
          <Pagination data-id="003101" {...defaultProps} currentPage={2} pageSize={20} />
        </TestWrapper>,
      );

      expect(screen.getByText('21 - 40 of 142')).toBeInTheDocument();
    });

    test('displays correct page range for last page', () => {
      render(
        <TestWrapper data-id="003102">
          <Pagination
            data-id="003103"
            {...defaultProps}
            currentPage={8}
            pageSize={20}
            total={142} />
        </TestWrapper>,
      );

      expect(screen.getByText('141 - 142 of 142')).toBeInTheDocument();
    });

    test('displays zero range when total is zero', () => {
      render(
        <TestWrapper data-id="003104">
          <Pagination data-id="003105" {...defaultProps} total={0} />
        </TestWrapper>,
      );

      expect(screen.getByText('0 - 0 of 0')).toBeInTheDocument();
    });
  });

  describe('Page Size Change', () => {
    test('calls onPageSizeChange when page size is changed', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper data-id="003106">
          <Pagination data-id="003107" {...defaultProps} />
        </TestWrapper>,
      );

      const select = screen.getByDisplayValue('10');
      await user.selectOptions(select, '10');

      expect(mockOnPageSizeChange).toHaveBeenCalledWith(10);
    });

    test('calls onPageSizeChange with correct value for different option', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper data-id="003108">
          <Pagination data-id="003109" {...defaultProps} />
        </TestWrapper>,
      );

      const select = screen.getByDisplayValue('10');
      await user.selectOptions(select, '50');

      expect(mockOnPageSizeChange).toHaveBeenCalledWith(50);
    });

    test('updates displayed page size when pageSize prop changes', () => {
      const { rerender } = render(
        <TestWrapper data-id="003110">
          <Pagination
            data-id="003111"
            {...defaultProps}
            pageSize={20} />
        </TestWrapper>,
      );

      expect(screen.getByDisplayValue('20')).toBeInTheDocument();

      rerender(
        <TestWrapper data-id="003112">
          <Pagination
            data-id="003113"
            {...defaultProps}
            pageSize={20} />
        </TestWrapper>,
      );

      expect(screen.getByDisplayValue('20')).toBeInTheDocument();
    });
  });

  describe('Page Navigation', () => {
    test('calls onPageChange with next page when next button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper data-id="003114">
          <Pagination data-id="003115" {...defaultProps} currentPage={1} />
        </TestWrapper>,
      );

      const nextButton = screen.getByLabelText('Next page');
      await user.click(nextButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    test('calls onPageChange with previous page when previous button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper data-id="003116">
          <Pagination data-id="003117" {...defaultProps} currentPage={2} />
        </TestWrapper>,
      );

      const previousButton = screen.getByLabelText('Previous page');
      await user.click(previousButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(1);
    });

    test('does not call onPageChange when previous button is clicked on first page', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper data-id="003118">
          <Pagination data-id="003119" {...defaultProps} currentPage={1} />
        </TestWrapper>,
      );

      const previousButton = screen.getByLabelText('Previous page');
      await user.click(previousButton);

      expect(mockOnPageChange).not.toHaveBeenCalled();
    });

    test('does not call onPageChange when next button is clicked on last page', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper data-id="003120">
          <Pagination
            data-id="003121"
            {...defaultProps}
            currentPage={8}
            total={142}
            pageSize={20} />
        </TestWrapper>,
      );

      const nextButton = screen.getByLabelText('Next page');
      await user.click(nextButton);

      expect(mockOnPageChange).not.toHaveBeenCalled();
    });
  });

  describe('Button States', () => {
    test('disables previous button on first page', () => {
      render(
        <TestWrapper data-id="003122">
          <Pagination data-id="003123" {...defaultProps} currentPage={1} />
        </TestWrapper>,
      );

      const previousButton = screen.getByLabelText('Previous page');
      expect(previousButton).toBeDisabled();
    });

    test('enables previous button when not on first page', () => {
      render(
        <TestWrapper data-id="003124">
          <Pagination data-id="003125" {...defaultProps} currentPage={2} />
        </TestWrapper>,
      );

      const previousButton = screen.getByLabelText('Previous page');
      expect(previousButton).not.toBeDisabled();
    });

    test('disables next button on last page', () => {
      render(
        <TestWrapper data-id="003126">
          <Pagination
            data-id="003127"
            {...defaultProps}
            currentPage={8}
            total={142}
            pageSize={20} />
        </TestWrapper>,
      );

      const nextButton = screen.getByLabelText('Next page');
      expect(nextButton).toBeDisabled();
    });

    test('enables next button when not on last page', () => {
      render(
        <TestWrapper data-id="003128">
          <Pagination data-id="003129" {...defaultProps} currentPage={1} />
        </TestWrapper>,
      );

      const nextButton = screen.getByLabelText('Next page');
      expect(nextButton).not.toBeDisabled();
    });

    test('disables both buttons when total is zero', () => {
      render(
        <TestWrapper data-id="003130">
          <Pagination data-id="003131" {...defaultProps} total={0} />
        </TestWrapper>,
      );

      const previousButton = screen.getByLabelText('Previous page');
      const nextButton = screen.getByLabelText('Next page');
      expect(previousButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });
  });

  describe('Page Range Calculations', () => {
    test('calculates correct start item for first page', () => {
      render(
        <TestWrapper data-id="003132">
          <Pagination data-id="003133" {...defaultProps} currentPage={1} pageSize={20} />
        </TestWrapper>,
      );

      expect(screen.getByText('1 - 20 of 142')).toBeInTheDocument();
    });

    test('calculates correct start item for second page', () => {
      render(
        <TestWrapper data-id="003134">
          <Pagination data-id="003135" {...defaultProps} currentPage={2} pageSize={20} />
        </TestWrapper>,
      );

      expect(screen.getByText('21 - 40 of 142')).toBeInTheDocument();
    });

    test('calculates correct end item for last page', () => {
      render(
        <TestWrapper data-id="003136">
          <Pagination
            data-id="003137"
            {...defaultProps}
            currentPage={8}
            pageSize={20}
            total={142} />
        </TestWrapper>,
      );

      expect(screen.getByText('141 - 142 of 142')).toBeInTheDocument();
    });

    test('handles single page correctly', () => {
      render(
        <TestWrapper data-id="003138">
          <Pagination
            data-id="003139"
            {...defaultProps}
            currentPage={1}
            pageSize={20}
            total={10} />
        </TestWrapper>,
      );

      expect(screen.getByText('1 - 10 of 10')).toBeInTheDocument();
    });

    test('handles page size larger than total', () => {
      render(
        <TestWrapper data-id="003140">
          <Pagination
            data-id="003141"
            {...defaultProps}
            currentPage={1}
            pageSize={200}
            total={50} />
        </TestWrapper>,
      );

      expect(screen.getByText('1 - 50 of 50')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper data-id attributes', () => {
      const { container } = render(
        <TestWrapper data-id="003142">
          <Pagination data-id="003143" {...defaultProps} />
        </TestWrapper>,
      );

      expect(container.querySelector('[data-id="pagination"]')).toBeInTheDocument();
      expect(screen.getByText('Show rows per page')).toHaveAttribute('data-id', 'pagination-page-size-label');
      expect(screen.getByDisplayValue('10')).toHaveAttribute('data-id', 'pagination-page-size-select');
      expect(screen.getByText('1 - 10 of 142')).toHaveAttribute('data-id', 'pagination-page-info');
    });

    test('has proper aria-labels for navigation buttons', () => {
      render(
        <TestWrapper data-id="003144">
          <Pagination data-id="003145" {...defaultProps} />
        </TestWrapper>,
      );

      expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    });

    test('navigation buttons have data-id attributes', () => {
      render(
        <TestWrapper data-id="003146">
          <Pagination data-id="003147" {...defaultProps} />
        </TestWrapper>,
      );

      const previousButton = screen.getByLabelText('Previous page');
      const nextButton = screen.getByLabelText('Next page');

      expect(previousButton).toHaveAttribute('data-id', 'pagination-previous-button');
      expect(nextButton).toHaveAttribute('data-id', 'pagination-next-button');
    });
  });

  describe('Edge Cases', () => {
    test('handles very large total numbers', () => {
      render(
        <TestWrapper data-id="003148">
          <Pagination
            data-id="003149"
            {...defaultProps}
            currentPage={100}
            pageSize={50}
            total={10000} />
        </TestWrapper>,
      );

      expect(screen.getByText('4951 - 5000 of 10000')).toBeInTheDocument();
    });

    test('handles single item total', () => {
      render(
        <TestWrapper data-id="003150">
          <Pagination
            data-id="003151"
            {...defaultProps}
            currentPage={1}
            pageSize={20}
            total={1} />
        </TestWrapper>,
      );

      expect(screen.getByText('1 - 1 of 1')).toBeInTheDocument();
    });

    test('handles page size of 1', () => {
      render(
        <TestWrapper data-id="003152">
          <Pagination
            data-id="003153"
            {...defaultProps}
            currentPage={5}
            pageSize={1}
            total={10} />
        </TestWrapper>,
      );

      expect(screen.getByText('5 - 5 of 10')).toBeInTheDocument();
    });

    test('handles all available page size options from constants', () => {
      render(
        <TestWrapper data-id="003154">
          <Pagination data-id="003155" {...defaultProps} pageSize={50} />
        </TestWrapper>,
      );

      const select = screen.getByDisplayValue('50');
      expect(select).toBeInTheDocument();

      PAGINATION_PAGE_SIZE_OPTIONS.forEach((option) => {
        expect(screen.getByRole('option', { name: String(option) })).toBeInTheDocument();
      });
    });

    test('updates page info when props change', () => {
      const { rerender } = render(
        <TestWrapper data-id="003156">
          <Pagination data-id="003157" {...defaultProps} currentPage={1} total={100} />
        </TestWrapper>,
      );

      expect(screen.getByText('1 - 10 of 100')).toBeInTheDocument();

      rerender(
        <TestWrapper data-id="003158">
          <Pagination
            data-id="003159"
            {...defaultProps}
            currentPage={3}
            total={200}
            pageSize={20} />
        </TestWrapper>,
      );

      expect(screen.getByText('41 - 60 of 200')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('renders all page size options from constants', () => {
      render(
        <TestWrapper data-id="003160">
          <Pagination data-id="003161" {...defaultProps} />
        </TestWrapper>,
      );

      PAGINATION_PAGE_SIZE_OPTIONS.forEach((option) => {
        expect(screen.getByRole('option', { name: String(option) })).toBeInTheDocument();
      });
    });

    test('maintains correct layout structure', () => {
      const { container } = render(
        <TestWrapper data-id="003162">
          <Pagination data-id="003163" {...defaultProps} />
        </TestWrapper>,
      );

      const mainContainer = container.querySelector('[data-id="pagination"]');
      expect(mainContainer).toBeInTheDocument();

      const pageSizeContainer = container.querySelector('[data-id="pagination-page-size"]');
      expect(pageSizeContainer).toBeInTheDocument();

      const navigationContainer = container.querySelector('[data-id="pagination-navigation"]');
      expect(navigationContainer).toBeInTheDocument();
    });
  });

  describe('Page Size Options Selection', () => {
    test('all page size options can be selected', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper data-id="003170">
          <Pagination data-id="003171" {...defaultProps} />
        </TestWrapper>,
      );

      const select = screen.getByDisplayValue('10');

      for (const option of PAGINATION_PAGE_SIZE_OPTIONS) {
        await user.selectOptions(select, String(option));
        expect(mockOnPageSizeChange).toHaveBeenCalledWith(option);
        mockOnPageSizeChange.mockClear();
      }
    });

    test('page size option elements have correct data-id attributes', () => {
      render(
        <TestWrapper data-id="003172">
          <Pagination data-id="003173" {...defaultProps} />
        </TestWrapper>,
      );

      PAGINATION_PAGE_SIZE_OPTIONS.forEach((option) => {
        const optionElement = screen.getByRole('option', { name: String(option) });
        expect(optionElement).toHaveAttribute('data-id', `pagination-page-size-option-${option}`);
      });
    });
  });

  describe('Icon Rendering', () => {
    test('renders page size select icon', () => {
      const { container } = render(
        <TestWrapper data-id="003174">
          <Pagination data-id="003175" {...defaultProps} />
        </TestWrapper>,
      );

      const icon = container.querySelector('[data-id="pagination-page-size-icon"]');
      expect(icon).toBeInTheDocument();
    });

    test('renders navigation button icons', () => {
      render(
        <TestWrapper data-id="003176">
          <Pagination data-id="003177" {...defaultProps} />
        </TestWrapper>,
      );

      const previousButton = screen.getByLabelText('Previous page');
      const nextButton = screen.getByLabelText('Next page');

      expect(previousButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });
  });
});

