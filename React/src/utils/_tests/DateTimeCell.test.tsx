import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';

import DateTimeCell from '../../components/Table/Cells/DateTimeCell';

// Mock date-fns/format to make formatting deterministic and assert on tokens used
vi.mock('date-fns/format', () => ({
  default: vi.fn(() => 'MOCK_FORMATTED'),
}));
import format from 'date-fns/format';

// Wrapper consistent with other table cell tests
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="002151">{children}</ChakraProvider>;
}

describe('DateTimeCell', () => {
  // Reset mock call history before each test
  beforeEach(() => {
    (format as unknown as ReturnType<typeof vi.fn>).mockClear();
  });

  describe('Fallback behaviour', () => {
    test('renders default fallback when no date provided', () => {
      const { container } = render(
        <TestWrapper data-id="002152">
          <DateTimeCell data-id="002153" showTime={false} />
        </TestWrapper>,
      );

      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText('-')).toBeInTheDocument();
      expect(format).not.toHaveBeenCalled();
    });

    test('renders custom fallback text', () => {
      render(
        <TestWrapper data-id="002154">
          <DateTimeCell data-id="002155" showTime={true} fallbackText="N/A" />
        </TestWrapper>,
      );

      expect(screen.getByText('N/A')).toBeInTheDocument();
      expect(format).not.toHaveBeenCalled();
    });

  });

  describe('Formatting logic', () => {
    test('formats date without time when showTime=false', () => {
      const mockedFormat = format as unknown as ReturnType<typeof vi.fn>;
      render(
        <TestWrapper data-id="002158">
          <DateTimeCell data-id="002159" showTime={false} date={'2023-08-15T14:30:00.000Z'} />
        </TestWrapper>,
      );

      expect(mockedFormat).toHaveBeenCalledTimes(1);
      const [firstArg, token] = mockedFormat.mock.calls[0];
      expect(firstArg instanceof Date).toBe(true);
      expect(token).toBe('d MMM yyyy');
      expect(screen.getByText('MOCK_FORMATTED')).toBeInTheDocument();
    });

    test('formats date with time when showTime=true', () => {
      const mockedFormat = format as unknown as ReturnType<typeof vi.fn>;
      render(
        <TestWrapper data-id="002160">
          <DateTimeCell data-id="002161" showTime={true} date={'2023-08-15T14:30:00.000Z'} />
        </TestWrapper>,
      );

      expect(mockedFormat).toHaveBeenCalledTimes(1);
      const [firstArg, token] = mockedFormat.mock.calls[0];
      expect(firstArg instanceof Date).toBe(true);
      expect(token).toBe('d MMM yyyy HH:mm');
      expect(screen.getByText('MOCK_FORMATTED')).toBeInTheDocument();
    });

  });

  describe('Brackets text', () => {
    test('renders bracketed text with expected inline styles', () => {
      render(
        <TestWrapper data-id="002164">
          <DateTimeCell
            data-id="002165"
            showTime={false}
            date={'2023-08-15'}
            bracketsText={'60 days'} />
        </TestWrapper>,
      );

      const bracketNode = screen.getByText('(60 days)');
      expect(bracketNode).toBeInTheDocument();
      expect(bracketNode).toHaveStyle({ color: '#718096' });
      expect(bracketNode).toHaveStyle({ fontSize: '12px' });
      expect(bracketNode).toHaveStyle({ paddingLeft: '6px' });
    });

    test('does not render bracket span when bracketsText is absent', () => {
      const { queryByTestId } = render(
        <TestWrapper data-id="002166">
          <DateTimeCell data-id="002167" showTime={false} date={'2023-08-15'} />
        </TestWrapper>,
      );

      // Should not render the bracket span if no bracketsText is provided
      expect(queryByTestId('date-time-cell-brackets')).toBeNull();
    });
  });
});


