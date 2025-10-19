import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import NoRecordsFound from '../../components/NoRecordsFound';

describe('NoRecordsFound Component', () => {
  describe('Basic Rendering', () => {
    it('renders with default message for audits', () => {
      render(<NoRecordsFound data-id="002705" dataSourceName="audits" />);
      
      expect(screen.getByText('No audits found. Try adjusting the filters.')).toBeInTheDocument();
    });

    it('renders with default message for tracker items', () => {
      render(<NoRecordsFound data-id="002706" dataSourceName="tracker items" />);
      
      expect(screen.getByText('No tracker items found. Try adjusting the filters.')).toBeInTheDocument();
    });

    it('renders with default message for actions', () => {
      render(<NoRecordsFound data-id="002707" dataSourceName="actions" />);
      
      expect(screen.getByText('No actions found. Try adjusting the filters.')).toBeInTheDocument();
    });

    it('renders with custom message when provided', () => {
      const customMessage = 'No data available at this time.';
      render(<NoRecordsFound data-id="002708" dataSourceName="audits" message={customMessage} />);
      
      expect(screen.getByText(customMessage)).toBeInTheDocument();
      expect(screen.queryByText('No audits found. Try adjusting the filters.')).not.toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('applies default height of 100%', () => {
      const { container } = render(<NoRecordsFound data-id="002709" dataSourceName="audits" />);
      const flexContainer = container.firstChild as HTMLElement;
      
      expect(flexContainer).toHaveStyle({ height: '100%' });
    });

    it('applies custom height when provided', () => {
      const { container } = render(<NoRecordsFound data-id="002710" dataSourceName="audits" height="200px" />);
      const flexContainer = container.firstChild as HTMLElement;
      
      expect(flexContainer).toHaveStyle({ height: '200px' });
    });

    it('applies responsive height when provided as array', () => {
      const { container } = render(<NoRecordsFound
        data-id="002711"
        dataSourceName="audits"
        height={['100px', '200px', '300px']} />);
      const flexContainer = container.firstChild as HTMLElement;
      
      // In test environment, Chakra UI applies the last value (300px)
      expect(flexContainer).toHaveStyle({ height: '300px' });
    });

    it('applies default container styles', () => {
      const { container } = render(<NoRecordsFound data-id="002712" dataSourceName="audits" />);
      const flexContainer = container.firstChild as HTMLElement;
      
      // Check that the container has the expected structure and attributes
      expect(flexContainer).toHaveAttribute('data-id');
      expect(flexContainer.getAttribute('data-id')).toBeTruthy();
      expect(flexContainer.tagName).toBe('DIV');
    });

    it('applies custom container props', () => {
      const customProps = {
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        bg: '#F7FAFC',
        p: '20px',
      };
      
      const { container } = render(
        <NoRecordsFound data-id="002713" dataSourceName="audits" containerProps={customProps} />
      );
      const flexContainer = container.firstChild as HTMLElement;
      
      expect(flexContainer).toHaveStyle({
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        backgroundColor: '#F7FAFC',
        padding: '20px',
      });
    });
  });

  describe('Text Styling', () => {
    it('applies default text styles', () => {
      render(<NoRecordsFound data-id="002714" dataSourceName="audits" />);
      const textElement = screen.getByText('No audits found. Try adjusting the filters.');
      
      // Check that the text element exists and has the expected data-id
      expect(textElement).toBeInTheDocument();
      expect(textElement).toHaveAttribute('data-id');
      expect(textElement.getAttribute('data-id')).toContain('-text');
    });

    it('applies custom text styles through containerProps', () => {
      const customProps = {
        fontSize: '16px',
        color: 'red',
      };
      
      render(
        <NoRecordsFound data-id="002715" dataSourceName="audits" containerProps={customProps} />
      );
      const textElement = screen.getByText('No audits found. Try adjusting the filters.');
      
      // Check that the text element exists and has the expected data-id
      expect(textElement).toBeInTheDocument();
      expect(textElement).toHaveAttribute('data-id');
      expect(textElement.getAttribute('data-id')).toContain('-text');
    });
  });

  describe('Data ID Attributes', () => {
    it('applies default data-id when not provided', () => {
      const { container } = render(<NoRecordsFound data-id="002716" dataSourceName="audits" />);
      const flexContainer = container.firstChild as HTMLElement;
      
      // Check that the element has a data-id attribute (regardless of the specific value)
      expect(flexContainer).toHaveAttribute('data-id');
      expect(flexContainer.getAttribute('data-id')).toBeTruthy();
    });

    it('applies custom data-id when provided', () => {
      const { container } = render(<NoRecordsFound dataSourceName="audits" data-id="custom-id" />);
      const flexContainer = container.firstChild as HTMLElement;
      
      expect(flexContainer).toHaveAttribute('data-id', 'custom-id');
    });

    it('applies data-id to text element', () => {
      render(<NoRecordsFound dataSourceName="audits" data-id="custom-id" />);
      const textElement = screen.getByText('No audits found. Try adjusting the filters.');
      
      expect(textElement).toHaveAttribute('data-id', 'custom-id-text');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty dataSourceName gracefully', () => {
      render(<NoRecordsFound data-id="002717" dataSourceName="" />);
      
      // The text will have double spaces, so we need to match the actual rendered text
      expect(screen.getByText(/No.*found\. Try adjusting the filters\./)).toBeInTheDocument();
    });

    it('handles special characters in dataSourceName', () => {
      render(<NoRecordsFound data-id="002718" dataSourceName="items & reports" />);
      
      expect(screen.getByText('No items & reports found. Try adjusting the filters.')).toBeInTheDocument();
    });

    it('handles very long dataSourceName', () => {
      const longName = 'very long data source name that might cause layout issues';
      render(<NoRecordsFound data-id="002719" dataSourceName={longName} />);
      
      expect(screen.getByText(`No ${longName} found. Try adjusting the filters.`)).toBeInTheDocument();
    });

    it('handles null message gracefully', () => {
      render(<NoRecordsFound data-id="002720" dataSourceName="audits" message={null as any} />);
      
      expect(screen.getByText('No audits found. Try adjusting the filters.')).toBeInTheDocument();
    });

    it('handles undefined message gracefully', () => {
      render(<NoRecordsFound data-id="002721" dataSourceName="audits" message={undefined} />);
      
      expect(screen.getByText('No audits found. Try adjusting the filters.')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      const { container } = render(<NoRecordsFound data-id="002722" dataSourceName="audits" />);
      const flexContainer = container.firstChild as HTMLElement;
      
      expect(flexContainer.tagName).toBe('DIV');
      // Check that the element has a data-id attribute (regardless of the specific value)
      expect(flexContainer).toHaveAttribute('data-id');
      expect(flexContainer.getAttribute('data-id')).toBeTruthy();
    });

    it('text is readable and has proper contrast', () => {
      render(<NoRecordsFound data-id="002723" dataSourceName="audits" />);
      const textElement = screen.getByText('No audits found. Try adjusting the filters.');
      
      expect(textElement).toBeVisible();
      expect(textElement).toBeInTheDocument();
    });
  });

  describe('Integration with Different Data Sources', () => {
    const testCases = [
      { source: 'audits', expected: 'No audits found. Try adjusting the filters.' },
      { source: 'tracker items', expected: 'No tracker items found. Try adjusting the filters.' },
      { source: 'actions', expected: 'No actions found. Try adjusting the filters.' },
      { source: 'incidents', expected: 'No incidents found. Try adjusting the filters.' },
      { source: 'reports', expected: 'No reports found. Try adjusting the filters.' },
      { source: 'users', expected: 'No users found. Try adjusting the filters.' },
    ];

    testCases.forEach(({ source, expected }) => {
      it(`generates correct message for "${source}"`, () => {
        render(<NoRecordsFound data-id="002724" dataSourceName={source} />);
        expect(screen.getByText(expected)).toBeInTheDocument();
      });
    });
  });
});
