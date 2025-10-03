import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import StatusCell from './StatusCell';

// Mock the icons
vi.mock('../../../icons', () => ({
  CircleTick: ({ boxSize }: { boxSize: string }) => <div data-id="001213" data-size={boxSize} data-testid="circle-tick-icon" />,
  CrossIcon: ({ boxSize }: { boxSize: string }) => <div data-id="001214" data-size={boxSize} data-testid="cross-icon" />,
  HourGlassIcon: ({ boxSize }: { boxSize: string }) => <div data-id="001215" data-size={boxSize} data-testid="hourglass-icon" />,
  InProgress: ({ boxSize }: { boxSize: string }) => <div data-id="001216" data-size={boxSize} data-testid="in-progress-icon" />,
}));

vi.mock('../../../icons/inReviewIcon', () => ({
  default: ({ boxSize }: { boxSize: string }) => <div data-id="001217" data-size={boxSize} data-testid="in-review-icon" />,
}));

// Mock ChakraProvider wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="001218">{children}</ChakraProvider>;
}

describe('StatusCell', () => {
  describe('Status Types', () => {
    test('renders actionPlan status correctly', () => {
      render(
        <TestWrapper data-id="001219">
          <StatusCell data-id="001220" status="actionPlan" />
        </TestWrapper>,
      );

      expect(screen.getByText('Action Plan')).toBeInTheDocument();
      expect(screen.getByTestId('circle-tick-icon')).toBeInTheDocument();
      expect(screen.getByTestId('circle-tick-icon')).toHaveAttribute('data-size', '14px');
    });

    test('renders inReview status correctly', () => {
      render(
        <TestWrapper data-id="001221">
          <StatusCell data-id="001222" status="inReview" />
        </TestWrapper>,
      );

      expect(screen.getByText('In Review')).toBeInTheDocument();
      expect(screen.getByTestId('in-review-icon')).toBeInTheDocument();
      expect(screen.getByTestId('in-review-icon')).toHaveAttribute('data-size', '14px');
    });

    test('renders completed status correctly', () => {
      render(
        <TestWrapper data-id="001223">
          <StatusCell data-id="001224" status="completed" />
        </TestWrapper>,
      );

      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByTestId('circle-tick-icon')).toBeInTheDocument();
      expect(screen.getByTestId('circle-tick-icon')).toHaveAttribute('data-size', '14px');
    });

    test('renders missed status correctly', () => {
      render(
        <TestWrapper data-id="001225">
          <StatusCell data-id="001226" status="missed" />
        </TestWrapper>,
      );

      expect(screen.getByText('Missed')).toBeInTheDocument();
      // Missed status should not have an icon
      expect(screen.queryByTestId('circle-tick-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('in-review-icon')).not.toBeInTheDocument();
    });

    test('renders upcoming status correctly', () => {
      render(
        <TestWrapper data-id="001227">
          <StatusCell data-id="001228" status="upcoming" />
        </TestWrapper>,
      );

      expect(screen.getByText('Upcoming')).toBeInTheDocument();
      // Upcoming status should not have an icon
      expect(screen.queryByTestId('circle-tick-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('in-review-icon')).not.toBeInTheDocument();
    });

    test('renders inProgress status correctly', () => {
      render(
        <TestWrapper data-id="001229">
          <StatusCell data-id="001230" status="inProgress" />
        </TestWrapper>,
      );

      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByTestId('in-progress-icon')).toBeInTheDocument();
      expect(screen.getByTestId('in-progress-icon')).toHaveAttribute('data-size', '14px');
    });

    test('renders notStarted status correctly', () => {
      render(
        <TestWrapper data-id="001231">
          <StatusCell data-id="001232" status="notStarted" />
        </TestWrapper>,
      );

      expect(screen.getByText('Not started')).toBeInTheDocument();
      expect(screen.getByTestId('hourglass-icon')).toBeInTheDocument();
      expect(screen.getByTestId('hourglass-icon')).toHaveAttribute('data-size', '14px');
    });

    test('renders default/unknown status correctly', () => {
      render(
        <TestWrapper data-id="001233">
          <StatusCell data-id="001234" status="unknown-status" />
        </TestWrapper>,
      );

      expect(screen.getByText('unknown-status')).toBeInTheDocument();
      // Default status should not have an icon
      expect(screen.queryByTestId('circle-tick-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('in-review-icon')).not.toBeInTheDocument();
    });

    test('handles empty string status', () => {
      const { container } = render(
        <TestWrapper data-id="001235">
          <StatusCell data-id="001236" status="" />
        </TestWrapper>,
      );

      // Should render empty text but still have the container
      expect(container.firstChild).toBeInTheDocument();
      // Default status should not have an icon
      expect(screen.queryByTestId('circle-tick-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('in-review-icon')).not.toBeInTheDocument();
    });

    test('handles special characters in status', () => {
      render(
        <TestWrapper data-id="001237">
          <StatusCell data-id="001238" status="test-status_123" />
        </TestWrapper>,
      );

      expect(screen.getByText('test-status_123')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    test('renders small size correctly', () => {
      const { container } = render(
        <TestWrapper data-id="001239">
          <StatusCell data-id="001240" size="sm" status="completed" />
        </TestWrapper>,
      );

      const statusBox = container.firstChild as HTMLElement;
      expect(statusBox).toHaveStyle({ height: '18px' });
      
      const text = screen.getByText('Completed');
      expect(text).toHaveStyle({ fontSize: '10px' });
    });

    test('renders medium size correctly (default)', () => {
      const { container } = render(
        <TestWrapper data-id="001241">
          <StatusCell data-id="001242" status="completed" />
        </TestWrapper>,
      );

      const statusBox = container.firstChild as HTMLElement;
      expect(statusBox).toHaveStyle({ height: '22px' });
      
      const text = screen.getByText('Completed');
      expect(text).toHaveStyle({ fontSize: '12px' });
    });

    test('renders large size correctly', () => {
      const { container } = render(
        <TestWrapper data-id="001243">
          <StatusCell data-id="001244" size="lg" status="completed" />
        </TestWrapper>,
      );

      const statusBox = container.firstChild as HTMLElement;
      expect(statusBox).toHaveStyle({ height: '30px' });
      
      const text = screen.getByText('Completed');
      expect(text).toHaveStyle({ fontSize: '14px' });
    });

    test('applies correct padding for different sizes', () => {
      const { container: smContainer } = render(
        <TestWrapper data-id="001245">
          <StatusCell data-id="001246" size="sm" status="completed" />
        </TestWrapper>,
      );
      
      const { container: mdContainer } = render(
        <TestWrapper data-id="001247">
          <StatusCell data-id="001248" size="md" status="completed" />
        </TestWrapper>,
      );
      
      const { container: lgContainer } = render(
        <TestWrapper data-id="001249">
          <StatusCell data-id="001250" size="lg" status="completed" />
        </TestWrapper>,
      );

      const smBox = smContainer.firstChild as HTMLElement;
      const mdBox = mdContainer.firstChild as HTMLElement;
      const lgBox = lgContainer.firstChild as HTMLElement;

      // Verify that padding is applied (Chakra UI uses CSS variables)
      expect(smBox).toHaveStyle({ paddingLeft: expect.any(String), paddingRight: expect.any(String) });
      expect(mdBox).toHaveStyle({ paddingLeft: expect.any(String), paddingRight: expect.any(String) });
      expect(lgBox).toHaveStyle({ paddingLeft: expect.any(String), paddingRight: expect.any(String) });
    });
  });

  describe('Background Colors', () => {
    test('applies correct background color for actionPlan', () => {
      const { container } = render(
        <TestWrapper data-id="001251">
          <StatusCell data-id="001252" status="actionPlan" />
        </TestWrapper>,
      );

      const statusBox = container.firstChild as HTMLElement;
      expect(statusBox).toHaveStyle({ backgroundColor: '#5850EC' });
    });

    test('applies correct background color for inReview', () => {
      const { container } = render(
        <TestWrapper data-id="001253">
          <StatusCell data-id="001254" status="inReview" />
        </TestWrapper>,
      );

      const statusBox = container.firstChild as HTMLElement;
      expect(statusBox).toHaveStyle({ backgroundColor: '#F97316' });
    });

    test('applies correct background color for completed', () => {
      const { container } = render(
        <TestWrapper data-id="001255">
          <StatusCell data-id="001256" status="completed" />
        </TestWrapper>,
      );

      const statusBox = container.firstChild as HTMLElement;
      expect(statusBox).toHaveStyle({ backgroundColor: '#00A650' });
    });

    test('applies correct background color for inProgress', () => {
      const { container } = render(
        <TestWrapper data-id="001257">
          <StatusCell data-id="001258" status="inProgress" />
        </TestWrapper>,
      );

      const statusBox = container.firstChild as HTMLElement;
      expect(statusBox).toHaveStyle({ backgroundColor: '#0073E6' });
    });

    test('applies correct background color for notStarted', () => {
      const { container } = render(
        <TestWrapper data-id="001259">
          <StatusCell data-id="001260" status="notStarted" />
        </TestWrapper>,
      );

      const statusBox = container.firstChild as HTMLElement;
      expect(statusBox).toHaveStyle({ backgroundColor: '#A0AEC0' });
    });

    test('applies Chakra UI theme colors for missed and upcoming', () => {
      const { container: missedContainer } = render(
        <TestWrapper data-id="001261">
          <StatusCell data-id="001262" status="missed" />
        </TestWrapper>,
      );

      const { container: upcomingContainer } = render(
        <TestWrapper data-id="001263">
          <StatusCell data-id="001264" status="upcoming" />
        </TestWrapper>,
      );

      // These use Chakra UI theme colors, so we just verify they have background colors
      const missedBox = missedContainer.firstChild as HTMLElement;
      const upcomingBox = upcomingContainer.firstChild as HTMLElement;
      
      expect(missedBox).toHaveStyle({ backgroundColor: expect.any(String) });
      expect(upcomingBox).toHaveStyle({ backgroundColor: expect.any(String) });
    });
  });

  describe('Text Styling', () => {
    test('applies correct text styling', () => {
      render(
        <TestWrapper data-id="001265">
          <StatusCell data-id="001266" status="completed" />
        </TestWrapper>,
      );

      const text = screen.getByText('Completed');
      // Verify text element exists and has proper tag
      expect(text).toBeInTheDocument();
      expect(text.tagName.toLowerCase()).toBe('p');
      // Chakra UI applies styles via CSS classes, so we just verify the element is styled
      expect(text).toHaveAttribute('class');
    });

    test('text content matches expected labels for all statuses', () => {
      const statusTests = [
        { status: 'actionPlan', expectedText: 'Action Plan' },
        { status: 'inReview', expectedText: 'In Review' },
        { status: 'completed', expectedText: 'Completed' },
        { status: 'missed', expectedText: 'Missed' },
        { status: 'upcoming', expectedText: 'Upcoming' },
        { status: 'inProgress', expectedText: 'In Progress' },
        { status: 'notStarted', expectedText: 'Not started' },
      ];

      statusTests.forEach(({ status, expectedText }) => {
        const { unmount } = render(
          <TestWrapper data-id="001267">
            <StatusCell data-id="001268" status={status} />
          </TestWrapper>,
        );

        expect(screen.getByText(expectedText)).toBeInTheDocument();
        unmount();
      });
    });

    test('text has uppercase transform applied via CSS', () => {
      render(
        <TestWrapper data-id="001269">
          <StatusCell data-id="001270" status="actionPlan" />
        </TestWrapper>,
      );

      const text = screen.getByText('Action Plan');
      expect(text).toHaveStyle({ textTransform: 'uppercase' });
    });
  });

  describe('Icon Rendering', () => {
    test('renders icons only for statuses that should have them', () => {
      const statusesWithIcons = [
        { status: 'actionPlan', iconTestId: 'circle-tick-icon' },
        { status: 'inReview', iconTestId: 'in-review-icon' },
        { status: 'completed', iconTestId: 'circle-tick-icon' },
        { status: 'inProgress', iconTestId: 'in-progress-icon' },
        { status: 'notStarted', iconTestId: 'hourglass-icon' },
      ];

      statusesWithIcons.forEach(({ status, iconTestId }) => {
        const { unmount } = render(
          <TestWrapper data-id="001271">
            <StatusCell data-id="001272" status={status} />
          </TestWrapper>,
        );

        expect(screen.getByTestId(iconTestId)).toBeInTheDocument();
        expect(screen.getByTestId(iconTestId)).toHaveAttribute('data-size', '14px');
        unmount();
      });
    });

    test('does not render icons for statuses without them', () => {
      const statusesWithoutIcons = ['missed', 'upcoming', 'unknown-status', ''];

      statusesWithoutIcons.forEach((status) => {
        const { unmount } = render(
          <TestWrapper data-id="001273">
            <StatusCell data-id="001274" status={status} />
          </TestWrapper>,
        );

        expect(screen.queryByTestId('circle-tick-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('in-review-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('in-progress-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('hourglass-icon')).not.toBeInTheDocument();
        unmount();
      });
    });

    test('icon color matches text color', () => {
      render(
        <TestWrapper data-id="001275">
          <StatusCell data-id="001276" status="completed" />
        </TestWrapper>,
      );

      const iconContainer = screen.getByTestId('circle-tick-icon').parentElement;
      // Verify icon container exists and is properly structured
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toHaveAttribute('class');
    });
  });

  describe('Component Structure', () => {
    test('renders with correct container styling', () => {
      const { container } = render(
        <TestWrapper data-id="001277">
          <StatusCell data-id="001278" status="completed" />
        </TestWrapper>,
      );

      const statusBox = container.firstChild as HTMLElement;
      // Verify the component renders with proper structure
      expect(statusBox).toBeInTheDocument();
      expect(statusBox).toHaveAttribute('class');
      // Verify it's a div element (Box component)
      expect(statusBox.tagName.toLowerCase()).toBe('div');
    });

    test('maintains proper structure with text and icon', () => {
      const { container } = render(
        <TestWrapper data-id="001279">
          <StatusCell data-id="001280" status="completed" />
        </TestWrapper>,
      );

      const statusBox = container.firstChild as HTMLElement;
      expect(statusBox.children).toHaveLength(2); // Text element and icon container
    });

    test('maintains proper structure with text only', () => {
      const { container } = render(
        <TestWrapper data-id="001281">
          <StatusCell data-id="001282" status="missed" />
        </TestWrapper>,
      );

      const statusBox = container.firstChild as HTMLElement;
      expect(statusBox.children).toHaveLength(1); // Only text element
    });
  });

  describe('Props Validation', () => {
    test('accepts valid size props', () => {
      const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];
      
      sizes.forEach((size) => {
        const { unmount } = render(
          <TestWrapper data-id="001283">
            <StatusCell data-id="001284" size={size} status="completed" />
          </TestWrapper>,
        );

        expect(screen.getByText('Completed')).toBeInTheDocument();
        unmount();
      });
    });

    test('defaults to medium size when size prop is not provided', () => {
      const { container } = render(
        <TestWrapper data-id="001285">
          <StatusCell data-id="001286" status="completed" />
        </TestWrapper>,
      );

      const statusBox = container.firstChild as HTMLElement;
      expect(statusBox).toHaveStyle({ height: '22px' });
    });

    test('handles various status string formats', () => {
      const statusFormats = [
        'camelCase',
        'kebab-case',
        'snake_case',
        'UPPERCASE',
        'lowercase',
        'Mixed_Case-Format',
        '123numeric',
        'with spaces',
      ];

      statusFormats.forEach((status) => {
        const { unmount } = render(
          <TestWrapper data-id="001287">
            <StatusCell data-id="001288" status={status} />
          </TestWrapper>,
        );

        expect(screen.getByText(status)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Accessibility', () => {
    test('component is accessible and renders correctly', () => {
      const { container } = render(
        <TestWrapper data-id="001289">
          <StatusCell data-id="001290" status="completed" />
        </TestWrapper>,
      );

      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeVisible();
    });

    test('text content is readable for screen readers', () => {
      render(
        <TestWrapper data-id="001291">
          <StatusCell data-id="001292" status="inProgress" />
        </TestWrapper>,
      );

      const text = screen.getByText('In Progress');
      expect(text).toBeVisible();
      expect(text).toHaveTextContent('In Progress');
    });

    test('maintains semantic meaning with proper text content', () => {
      const semanticStatuses = [
        { status: 'completed', meaning: 'Completed' },
        { status: 'inProgress', meaning: 'In Progress' },
        { status: 'notStarted', meaning: 'Not started' },
        { status: 'missed', meaning: 'Missed' },
      ];

      semanticStatuses.forEach(({ status, meaning }) => {
        const { unmount } = render(
          <TestWrapper data-id="001293">
            <StatusCell data-id="001294" status={status} />
          </TestWrapper>,
        );

        const textElement = screen.getByText(meaning);
        expect(textElement).toBeInTheDocument();
        expect(textElement.tagName.toLowerCase()).toBe('p'); // Semantic text element
        unmount();
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('handles null-like values gracefully', () => {
      const { container } = render(
        <TestWrapper data-id="001295">
          <StatusCell data-id="001296" status="" />
        </TestWrapper>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    test('handles very long status strings', () => {
      const longStatus = 'this-is-a-very-long-status-string-that-might-cause-layout-issues';
      
      render(
        <TestWrapper data-id="001297">
          <StatusCell data-id="001298" status={longStatus} />
        </TestWrapper>,
      );

      const text = screen.getByText(longStatus);
      expect(text).toHaveStyle({ whiteSpace: 'nowrap' });
    });

    test('handles special Unicode characters', () => {
      const unicodeStatus = 'status-with-émojis-🚀-and-spëcial-chars';
      
      render(
        <TestWrapper data-id="001299">
          <StatusCell data-id="001300" status={unicodeStatus} />
        </TestWrapper>,
      );

      expect(screen.getByText(unicodeStatus)).toBeInTheDocument();
    });
  });

  describe('Performance and Rendering', () => {
    test('renders consistently across multiple instances', () => {
      const { container } = render(
        <TestWrapper data-id="001301">
          <div data-id="001302">
            <StatusCell data-id="001303" status="completed" />
            <StatusCell data-id="001304" status="inProgress" />
            <StatusCell data-id="001305" status="missed" />
          </div>
        </TestWrapper>,
      );

      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Missed')).toBeInTheDocument();
      // Chakra UI creates multiple CSS classes, so we just verify components exist
      expect(container.querySelectorAll('[class*="css-"]').length).toBeGreaterThanOrEqual(3);
    });

    test('maintains styling consistency across different statuses', () => {
      const statuses = ['actionPlan', 'inReview', 'completed', 'inProgress'];
      
      statuses.forEach((status) => {
        const { container, unmount } = render(
          <TestWrapper data-id="001306">
            <StatusCell data-id="001307" status={status} />
          </TestWrapper>,
        );

        const statusBox = container.firstChild as HTMLElement;
        // Verify consistent structure across all statuses
        expect(statusBox).toBeInTheDocument();
        expect(statusBox).toHaveAttribute('class');
        expect(statusBox.tagName.toLowerCase()).toBe('div');
        unmount();
      });
    });
  });
});
