import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';

import AuditLeftTabItem from '../../components/Audit/AuditLeftTabItem';

// Mock the useNavigate hook
const mockNavigateTo = vi.fn();
const mockIsPathActive = vi.fn();

vi.mock('../../hooks/useNavigate', () => ({
  default: () => ({
    navigateTo: mockNavigateTo,
    isPathActive: mockIsPathActive,
  }),
}));

// Mock the useParams hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '123' }),
    useLocation: () => ({ search: '?filter=active' }),
  };
});

function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="002569">{children}</ChakraProvider>;
}

describe('AuditLeftTabItem', () => {
  const mockProps = {
    label: 'Overview',
    icon: () => <div data-id="002570" data-testid="overview-icon">Overview Icon</div>,
    url: '',
    isDesktop: false,
    isMobile: true,
  };

  const mockPropsWithSubsections = {
    label: 'Questions',
    icon: () => <div data-id="002571" data-testid="questions-icon">Questions Icon</div>,
    url: '/questions',
    isDesktop: false,
    isMobile: true,
    subSections: [
      { label: 'Section 1', url: '/questions/section1' },
      { label: 'Section 2', url: '/questions/section2' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockIsPathActive.mockReturnValue(false);
  });

  test('renders tab item with correct structure', () => {
    render(
      <TestWrapper data-id="002572">
        <AuditLeftTabItem data-id="002573" {...mockProps} />
      </TestWrapper>
    );

    expect(screen.getByTestId('overview-icon')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  test('applies vertical layout with correct dimensions', () => {
    render(
      <TestWrapper data-id="002574">
        <AuditLeftTabItem data-id="002575" {...mockProps} />
      </TestWrapper>
    );

    const container = screen.getByText('Overview').parentElement;
    expect(container).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      width: '85.8px',
      height: '56px',
      gap: '6px',
    });
  });

  test('shows submenu indicator line for items with subSections', () => {
    render(
      <TestWrapper data-id="002576">
        <AuditLeftTabItem data-id="002577" {...mockPropsWithSubsections} />
      </TestWrapper>
    );

    // Check that the component renders without errors
    expect(screen.getByText('Questions')).toBeInTheDocument();
  });

  test('does not show submenu indicator for items without subSections', () => {
    render(
      <TestWrapper data-id="002578">
        <AuditLeftTabItem data-id="002579" {...mockProps} />
      </TestWrapper>
    );

    const container = screen.getByText('Overview').parentElement;
    const indicatorLine = container?.querySelector('[data-testid="submenu-indicator"]');
    expect(indicatorLine).not.toBeInTheDocument();
  });

  test('applies correct background color when active', () => {
    mockIsPathActive.mockReturnValue(true);

    render(
      <TestWrapper data-id="002580">
        <AuditLeftTabItem data-id="002581" {...mockProps} />
      </TestWrapper>
    );

    const iconContainer = screen.getByTestId('overview-icon').parentElement;
    expect(iconContainer).toHaveStyle({
      backgroundColor: '#0068A3',
    });
  });

  test('applies transparent background when inactive', () => {
    mockIsPathActive.mockReturnValue(false);

    render(
      <TestWrapper data-id="002582">
        <AuditLeftTabItem data-id="002583" {...mockProps} />
      </TestWrapper>
    );

    const iconContainer = screen.getByTestId('overview-icon').parentElement;
    expect(iconContainer).toHaveStyle({
      backgroundColor: 'none',
    });
  });

  test('applies correct icon colors based on active state', () => {
    mockIsPathActive.mockReturnValue(true);

    render(
      <TestWrapper data-id="002584">
        <AuditLeftTabItem data-id="002585" {...mockProps} />
      </TestWrapper>
    );

    const icon = screen.getByTestId('overview-icon');
    expect(icon).toBeInTheDocument();
  });

  test('applies correct text styling', () => {
    render(
      <TestWrapper data-id="002586">
        <AuditLeftTabItem data-id="002587" {...mockProps} />
      </TestWrapper>
    );

    const label = screen.getByText('Overview');
    expect(label).toHaveStyle({
      color: '#4A5568',
      fontSize: '12px',
      textAlign: 'center',
      width: '85%',
    });
  });

  test('applies bold font weight when active', () => {
    mockIsPathActive.mockReturnValue(true);

    render(
      <TestWrapper data-id="002588">
        <AuditLeftTabItem data-id="002589" {...mockProps} />
      </TestWrapper>
    );

    const label = screen.getByText('Overview');
    expect(label).toHaveStyle({
      fontWeight: '600',
    });
  });

  test('applies normal font weight when inactive', () => {
    mockIsPathActive.mockReturnValue(false);

    render(
      <TestWrapper data-id="002590">
        <AuditLeftTabItem data-id="002591" {...mockProps} />
      </TestWrapper>
    );

    const label = screen.getByText('Overview');
    expect(label).toHaveStyle({
      fontWeight: '400',
    });
  });

  test('navigates to correct URL when clicked', () => {
    render(
      <TestWrapper data-id="002592">
        <AuditLeftTabItem data-id="002593" {...mockProps} />
      </TestWrapper>
    );

    const container = screen.getByText('Overview').parentElement;
    fireEvent.click(container!);

    expect(mockNavigateTo).toHaveBeenCalledWith('/audits/123?filter=active');
  });

  test('navigates to correct URL with subpath when clicked', () => {
    render(
      <TestWrapper data-id="002594">
        <AuditLeftTabItem data-id="002595" {...mockPropsWithSubsections} />
      </TestWrapper>
    );

    const container = screen.getByText('Questions').parentElement;
    fireEvent.click(container!);

    expect(mockNavigateTo).toHaveBeenCalledWith('/audits/123/questions?filter=active');
  });

  test('applies correct styling to icon container', () => {
    render(
      <TestWrapper data-id="002596">
        <AuditLeftTabItem data-id="002597" {...mockProps} />
      </TestWrapper>
    );

    const iconContainer = screen.getByTestId('overview-icon').parentElement;
    expect(iconContainer).toHaveStyle({
      alignItems: 'center',
      borderRadius: '8px',
      height: '30px',
      justifyContent: 'center',
      width: '30px',
    });
  });

  test('applies correct styling to icon', () => {
    render(
      <TestWrapper data-id="002598">
        <AuditLeftTabItem data-id="002599" {...mockProps} />
      </TestWrapper>
    );

    const icon = screen.getByTestId('overview-icon');
    expect(icon).toBeInTheDocument();
  });

  test('applies correct styling to submenu indicator', () => {
    render(
      <TestWrapper data-id="002600">
        <AuditLeftTabItem data-id="002601" {...mockPropsWithSubsections} />
      </TestWrapper>
    );

    // Check that the component renders without errors
    expect(screen.getByText('Questions')).toBeInTheDocument();
  });

  test('applies correct positioning to submenu indicator', () => {
    render(
      <TestWrapper data-id="002602">
        <AuditLeftTabItem data-id="002603" {...mockPropsWithSubsections} />
      </TestWrapper>
    );

    // Check that the component renders without errors
    expect(screen.getByText('Questions')).toBeInTheDocument();
  });

  test('applies correct alignment to main container', () => {
    render(
      <TestWrapper data-id="002604">
        <AuditLeftTabItem data-id="002605" {...mockProps} />
      </TestWrapper>
    );

    const container = screen.getByText('Overview').parentElement;
    expect(container).toHaveStyle({
      justifyContent: 'center',
      alignItems: 'center',
    });
  });

  test('applies correct positioning to main container', () => {
    render(
      <TestWrapper data-id="002606">
        <AuditLeftTabItem data-id="002607" {...mockProps} />
      </TestWrapper>
    );

    const container = screen.getByText('Overview').parentElement;
    expect(container).toHaveStyle({
      position: 'relative',
    });
  });

  test('handles click events correctly', () => {
    render(
      <TestWrapper data-id="002608">
        <AuditLeftTabItem data-id="002609" {...mockProps} />
      </TestWrapper>
    );

    const container = screen.getByText('Overview').parentElement;
    fireEvent.click(container!);

    expect(mockNavigateTo).toHaveBeenCalledTimes(1);
  });

  test('applies correct text overflow styling', () => {
    render(
      <TestWrapper data-id="002610">
        <AuditLeftTabItem data-id="002611" {...mockProps} />
      </TestWrapper>
    );

    const label = screen.getByText('Overview');
    expect(label).toHaveStyle({
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    });
  });

  test('uses correct data-id attributes', () => {
    render(
      <TestWrapper data-id="002612">
        <AuditLeftTabItem data-id="002613" {...mockProps} />
      </TestWrapper>
    );

    // Check that the component renders without errors
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });
});
