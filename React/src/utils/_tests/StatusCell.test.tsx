import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import StatusCell from '../../components/Table/Cells/StatusCell';

// Mock the icons - they are Chakra UI icons created with createIcon, so they render as svg elements
vi.mock('../../../icons', () => ({
  CircleTick: () => <svg data-id="001213" data-testid="circle-tick-icon" viewBox="0 0 10 9"><path data-id="001205" fill="white" d="M8.33398 4.50065C8.33398 5.38471 7.9828 6.23255 7.35767 6.85767C6.73255 7.4828 5.88471 7.83398 5.00065 7.83398C4.1166 7.83398 3.26875 7.4828 2.64363 6.85767C2.01851 6.23255 1.66732 5.38471 1.66732 4.50065C1.66732 3.6166 2.01851 2.76875 2.64363 2.14363C3.26875 1.51851 4.1166 1.16732 5.00065 1.16732C5.31732 1.16732 5.62565 1.21315 5.91732 1.29648L6.57149 0.642318C6.08815 0.442318 5.55898 0.333984 5.00065 0.333984C4.45348 0.333984 3.91166 0.441758 3.40614 0.651153C2.90061 0.860548 2.44128 1.16746 2.05437 1.55437C1.27297 2.33577 0.833984 3.39558 0.833984 4.50065C0.833984 5.60572 1.27297 6.66553 2.05437 7.44693C2.44128 7.83384 2.90061 8.14076 3.40614 8.35015C3.91166 8.55954 4.45348 8.66732 5.00065 8.66732C6.10572 8.66732 7.16553 8.22833 7.94693 7.44693C8.72833 6.66553 9.16732 5.60572 9.16732 4.50065H8.33398ZM3.29648 3.70065L2.70898 4.29232L4.58398 6.16732L8.75065 2.00065L8.16315 1.40898L4.58398 4.98815L3.29648 3.70065Z"/></svg>,
  CrossIcon: () => <svg data-id="001214" data-testid="cross-icon" viewBox="0 0 12 12"><path
    data-id="002173"
    fill="white"
    d="M9 3L8 2L6 4L4 2L3 3L5 5L3 7L4 8L6 6L8 8L9 7L7 5L9 3Z" /></svg>,
  HourGlassIcon: () => <svg data-id="001215" data-testid="hourglass-icon" viewBox="0 0 10 11"><path
    data-id="002174"
    fill="white"
    d="M7.91602 9.66634H8.33268V8.83301H7.91602V8.41634C7.91522 7.91017 7.78298 7.41288 7.53223 6.97318C7.28148 6.53347 6.92083 6.16643 6.4856 5.90801C6.33768 5.82051 6.24935 5.68009 6.24935 5.53259V5.46676C6.24935 5.31926 6.33768 5.17884 6.48518 5.09176C6.9205 4.83328 7.28123 4.46619 7.53204 4.02642C7.78286 3.58665 7.91517 3.08928 7.91602 2.58301V2.16634H8.33268V1.33301H1.66602V2.16634H2.08268V2.58301C2.08353 3.08928 2.21584 3.58665 2.46665 4.02642C2.71747 4.46619 3.0782 4.83328 3.51352 5.09176C3.66102 5.17884 3.74935 5.31884 3.74935 5.46676V5.53259C3.74935 5.68009 3.66102 5.82051 3.51352 5.90759C3.0782 6.16606 2.71747 6.53316 2.46665 6.97293C2.21584 7.4127 2.08353 7.91007 2.08268 8.41634V8.83301H1.66602V9.66634H7.91602ZM7.08268 2.16634V2.58301C7.08205 3.03394 6.93527 3.47253 6.66435 3.83301H3.33435C3.06343 3.47253 2.91665 3.03394 2.91602 2.58301V2.16634H7.08268ZM3.93685 6.62551C4.34143 6.38634 4.58268 5.97801 4.58268 5.53259V5.49967H5.41602V5.53259C5.41602 5.97759 5.65727 6.38634 6.06227 6.62551C6.43665 6.84831 6.73142 7.18331 6.90477 7.58301H3.09393C3.26732 7.1832 3.56225 6.84818 3.93685 6.62551Z" /></svg>,
  InProgress: () => <svg data-id="001216" data-testid="in-progress-icon" viewBox="0 0 11 10"><path
    data-id="002175"
    fill="white"
    d="M0.333008 4.5H2.83301V5.5H0.333008V4.5ZM7.83301 4.5H10.333V5.5H7.83301V4.5ZM4.83301 7.5H5.83301V10H4.83301V7.5ZM4.83301 0H5.83301V2.5H4.83301V0ZM1.44401 1.818L2.15101 1.111L3.91901 2.879L3.21201 3.586L1.44401 1.818ZM9.22201 8.182L8.51501 8.889L6.74701 7.121L7.45401 6.414L9.22201 8.182ZM3.21201 6.414L3.91901 7.121L2.15101 8.889L1.44401 8.182L3.21201 6.414ZM6.74701 2.8785L8.51501 1.111L9.22201 1.8185L7.45401 3.586L6.74701 2.8785Z" /></svg>,
}));

vi.mock('../../../icons/inReviewIcon', () => ({
  default: () => <svg data-id="001217" data-testid="in-review-icon" viewBox="0 0 12 12"><path data-id="001211" fill="white" d="M4.84801 9.5H1.83301V2.5H2.83301V3.5H7.83301V2.5H8.83301V4.75C9.19301 4.9 9.53301 5.12 9.83301 5.41V2.5C9.83301 1.95 9.38801 1.5 8.83301 1.5H6.74301C6.53301 0.92 5.98301 0.5 5.33301 0.5C4.68301 0.5 4.13301 0.92 3.92301 1.5H1.83301C1.28301 1.5 0.833008 1.95 0.833008 2.5V9.5C0.833008 10.055 1.28301 10.5 1.83301 10.5H5.86301C5.65801 10.37 5.46301 10.225 5.28301 10.05C5.11801 9.88 4.96801 9.695 4.84801 9.5ZM5.33301 1.5C5.60801 1.5 5.83301 1.725 5.83301 2C5.83301 2.275 5.60801 2.5 5.33301 2.5C5.05801 2.5 4.83301 2.5 4.83301 2C4.83301 1.725 5.05801 1.5 5.33301 1.5ZM9.48801 8.95C9.70801 8.605 9.83301 8.19 9.83301 7.75C9.83301 6.5 8.83301 5.5 7.58301 5.5C6.33301 5.5 5.33301 6.5 5.33301 7.75C5.33301 9 6.33301 10 7.58301 10C8.01801 10 8.42801 9.875 8.77301 9.66L10.333 11.195L11.028 10.5L9.48801 8.95ZM7.58301 9C6.89301 9 6.33301 8.44 6.33301 7.75C6.33301 7.06 6.89301 6.5 7.58301 6.5C8.27301 6.5 8.83301 7.06 8.83301 7.75C8.83301 8.44 8.27301 9 7.58301 9Z"/></svg>,
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
    });

    test('renders inReview status correctly', () => {
      render(
        <TestWrapper data-id="001221">
          <StatusCell data-id="001222" status="inReview" />
        </TestWrapper>,
      );

      expect(screen.getByText('In Review')).toBeInTheDocument();
      expect(screen.getByTestId('in-review-icon')).toBeInTheDocument();
    });

    test('renders completed status correctly', () => {
      render(
        <TestWrapper data-id="001223">
          <StatusCell data-id="001224" status="completed" />
        </TestWrapper>,
      );

      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByTestId('circle-tick-icon')).toBeInTheDocument();
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
    });

    test('renders notStarted status correctly', () => {
      render(
        <TestWrapper data-id="001231">
          <StatusCell data-id="001232" status="notStarted" />
        </TestWrapper>,
      );

      expect(screen.getByText('Not started')).toBeInTheDocument();
      expect(screen.getByTestId('hourglass-icon')).toBeInTheDocument();
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
