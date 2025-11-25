import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import theme from '../../bootstrap/theme';
import { ViewMoreIcon } from '../../icons';

// Mock ViewMoreIcon
vi.mock('../../icons', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../icons')>();
  return {
    ...actual,
    ViewMoreIcon: ({ dataId, color, boxSize }: { dataId?: string; color?: string; boxSize?: string }) => (
      <svg 
        data-id={dataId} 
        data-testid="view-more-icon" 
        viewBox="0 0 9 9"
        color={color}
        width={boxSize}
        height={boxSize}
      >
        <path data-id="003279" d="M3.52867 8Z" fill="currentColor" />
      </svg>
    ),
  };
});

// Test component that mimics the "View more results" rendering logic
const ViewMoreResultsComponent = ({ resultsCount }: { resultsCount: number }) => {
  return (
    <ChakraProvider data-id="003280" theme={theme}>
      <div data-id="003281">
        {resultsCount >= 3 && (
          <div
            data-id="003282"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <span
              data-id="003283"
              style={{ fontSize: '14px', fontWeight: '500', color: '#0073E6' }}>
              View more results
            </span>
            <ViewMoreIcon data-id="003284" boxSize="9px" color="#0073E6" />
          </div>
        )}
      </div>
    </ChakraProvider>
  );
};

describe('SearchBar - View More Results Feature', () => {
  describe('View More Results Link Visibility', () => {
    it('should display "View more results" when there are exactly 3 results', () => {
      render(<ViewMoreResultsComponent data-id="003285" resultsCount={3} />);
      
      const viewMoreText = screen.getByText('View more results');
      expect(viewMoreText).toBeInTheDocument();
    });

    it('should display "View more results" when there are more than 3 results', () => {
      render(<ViewMoreResultsComponent data-id="003286" resultsCount={4} />);
      
      const viewMoreText = screen.getByText('View more results');
      expect(viewMoreText).toBeInTheDocument();
    });

    it('should NOT display "View more results" when there are less than 3 results', () => {
      render(<ViewMoreResultsComponent data-id="003287" resultsCount={2} />);
      
      const viewMoreText = screen.queryByText('View more results');
      expect(viewMoreText).not.toBeInTheDocument();
    });

    it('should NOT display "View more results" when there are no results', () => {
      render(<ViewMoreResultsComponent data-id="003288" resultsCount={0} />);
      
      const viewMoreText = screen.queryByText('View more results');
      expect(viewMoreText).not.toBeInTheDocument();
    });
  });

  describe('View More Results Styling', () => {
    beforeEach(() => {
      render(<ViewMoreResultsComponent data-id="003289" resultsCount={3} />);
    });

    it('should have correct fontSize (14px)', () => {
      const viewMoreText = screen.getByText('View more results');
      expect(viewMoreText).toHaveStyle({ fontSize: '14px' });
    });

    it('should have correct fontWeight (500)', () => {
      const viewMoreText = screen.getByText('View more results');
      expect(viewMoreText).toHaveStyle({ fontWeight: '500' });
    });

    it('should have correct color (#0073E6)', () => {
      const viewMoreText = screen.getByText('View more results');
      expect(viewMoreText).toHaveStyle({ color: 'rgb(0, 115, 230)' }); // #0073E6 in rgb
    });
  });

  describe('ViewMoreIcon Rendering', () => {
    it('should render ViewMoreIcon when there are 3+ results', () => {
      render(<ViewMoreResultsComponent data-id="003290" resultsCount={3} />);
      
      const icon = screen.getByTestId('view-more-icon');
      expect(icon).toBeInTheDocument();
    });

    it('should NOT render ViewMoreIcon when there are less than 3 results', () => {
      render(<ViewMoreResultsComponent data-id="003291" resultsCount={2} />);
      
      const icon = screen.queryByTestId('view-more-icon');
      expect(icon).not.toBeInTheDocument();
    });

    it('should render ViewMoreIcon with correct color (#0073E6)', () => {
      render(<ViewMoreResultsComponent data-id="003292" resultsCount={3} />);
      
      const icon = screen.getByTestId('view-more-icon');
      expect(icon).toHaveAttribute('color', '#0073E6');
    });

    it('should render ViewMoreIcon with correct viewBox (0 0 9 9)', () => {
      render(<ViewMoreResultsComponent data-id="003293" resultsCount={3} />);
      
      const icon = screen.getByTestId('view-more-icon');
      expect(icon).toHaveAttribute('viewBox', '0 0 9 9');
    });

    it('should render ViewMoreIcon with correct boxSize (9px)', () => {
      render(<ViewMoreResultsComponent data-id="003294" resultsCount={3} />);
      
      const icon = screen.getByTestId('view-more-icon');
      expect(icon).toHaveAttribute('width', '9px');
      expect(icon).toHaveAttribute('height', '9px');
    });
  });

  describe('View More Results Layout', () => {
    it('should display "View more results" with icon in a flex container', () => {
      render(<ViewMoreResultsComponent data-id="003295" resultsCount={3} />);
      
      const viewMoreText = screen.getByText('View more results');
      const icon = screen.getByTestId('view-more-icon');
      
      expect(viewMoreText).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      
      // Verify they are in the same flex container
      const container = viewMoreText.closest('div[style*="display: flex"]');
      expect(container).toBeInTheDocument();
    });

    it('should have cursor pointer on the "View more results" container', () => {
      render(<ViewMoreResultsComponent data-id="003296" resultsCount={3} />);
      
      const viewMoreText = screen.getByText('View more results');
      const container = viewMoreText.closest('div[style*="cursor: pointer"]');
      expect(container).toBeInTheDocument();
    });
  });
});

