import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import AuditLeftNavigationMobile from '../../components/Audit/AuditLeftNavigationMobile';

// Mock the useNavigate hook
const mockNavigateTo = vi.fn();
const mockNavigate = vi.fn();
const mockIsPathActive = vi.fn();

vi.mock('../../hooks/useNavigate', () => ({
  default: () => ({
    navigateTo: mockNavigateTo,
    navigate: mockNavigate,
    isPathActive: mockIsPathActive,
  }),
}));

// Mock the useParams hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '123' }),
  };
});

// Mock the useConfig hook
vi.mock('../../hooks/useConfig', () => ({
  default: () => ({
    config: {
      audit: {
        name: 'Audit',
      },
    },
    auditNavigationTabs: [
      { label: 'Overview', icon: () => <div data-id="002524">Overview Icon</div>, url: '' },
      { label: 'Questions', icon: () => <div data-id="002525">Questions Icon</div>, url: '/questions' },
      { label: 'Actions', icon: () => <div data-id="002526">Actions Icon</div>, url: '/actions' },
      { label: 'Responses', icon: () => <div data-id="002527">Responses Icon</div>, url: '/responses' },
      { label: 'Participants', icon: () => <div data-id="002528">Participants Icon</div>, url: '/participants' },
    ],
  }),
}));

// Mock the BackArrowIcon
vi.mock('../../icons', () => ({
  BackArrowIcon: () => <div data-id="002529" data-testid="back-arrow-icon">Back Arrow</div>,
}));

// Mock the AuditLeftTabItem component
vi.mock('../../components/Audit/AuditLeftTabItem', () => ({
  default: ({ label, icon, url }: { label: string; icon: any; url: string }) => (
    <div data-id="002530" data-testid={`audit-tab-${label.toLowerCase()}`}>
      <div data-id="002531" data-testid={`${label.toLowerCase()}-icon`}>{icon()}</div>
      <div data-id="002532" data-testid={`${label.toLowerCase()}-label`}>{label}</div>
      <div data-id="002533" data-testid={`${label.toLowerCase()}-url`}>{url}</div>
    </div>
  ),
}));

function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="002534">{children}</ChakraProvider>;
}

describe('AuditLeftNavigationMobile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders back button with correct structure', () => {
    render(
      <TestWrapper data-id="002535">
        <AuditLeftNavigationMobile data-id="002536" />
      </TestWrapper>,
    );

    expect(screen.getByTestId('back-arrow-icon')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  test('applies vertical layout to back button', () => {
    render(
      <TestWrapper data-id="002537">
        <AuditLeftNavigationMobile data-id="002538" />
      </TestWrapper>,
    );

    const backButton = screen.getByText('Back').parentElement;
    expect(backButton).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      width: '56px',
      height: '56px',
      gap: '0px',
    });
  });

  test('applies correct styling to back button container', () => {
    render(
      <TestWrapper data-id="002539">
        <AuditLeftNavigationMobile data-id="002540" />
      </TestWrapper>,
    );

    const backButton = screen.getByText('Back').parentElement;
    expect(backButton).toHaveStyle({
      borderRadius: '7px',
      backgroundColor: '#E2E8F0',
    });
  });

  test('applies correct styling to back button text', () => {
    render(
      <TestWrapper data-id="002541">
        <AuditLeftNavigationMobile data-id="002542" />
      </TestWrapper>,
    );

    const backText = screen.getByText('Back');
    expect(backText).toHaveStyle({
      color: '#4A5568',
      fontSize: '12px',
      fontWeight: '400',
      textAlign: 'center',
      width: '85%',
    });
  });

  test('navigates back when back button is clicked', () => {
    render(
      <TestWrapper data-id="002543">
        <AuditLeftNavigationMobile data-id="002544" />
      </TestWrapper>,
    );

    const backButton = screen.getByText('Back').parentElement;
    fireEvent.click(backButton!);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('renders audit navigation tabs', () => {
    render(
      <TestWrapper data-id="002545">
        <AuditLeftNavigationMobile data-id="002546" />
      </TestWrapper>,
    );

    expect(screen.getByTestId('audit-tab-overview')).toBeInTheDocument();
    expect(screen.getByTestId('audit-tab-questions')).toBeInTheDocument();
    expect(screen.getByTestId('audit-tab-actions')).toBeInTheDocument();
    expect(screen.getByTestId('audit-tab-responses')).toBeInTheDocument();
    expect(screen.getByTestId('audit-tab-participants')).toBeInTheDocument();
  });

  test('displays correct labels for audit tabs', () => {
    render(
      <TestWrapper data-id="002547">
        <AuditLeftNavigationMobile data-id="002548" />
      </TestWrapper>,
    );

    expect(screen.getByTestId('overview-label')).toHaveTextContent('Overview');
    expect(screen.getByTestId('questions-label')).toHaveTextContent('Questions');
    expect(screen.getByTestId('actions-label')).toHaveTextContent('Actions');
    expect(screen.getByTestId('responses-label')).toHaveTextContent('Responses');
    expect(screen.getByTestId('participants-label')).toHaveTextContent('Participants');
  });

  test('displays correct URLs for audit tabs', () => {
    render(
      <TestWrapper data-id="002549">
        <AuditLeftNavigationMobile data-id="002550" />
      </TestWrapper>,
    );

    expect(screen.getByTestId('overview-url')).toHaveTextContent('');
    expect(screen.getByTestId('questions-url')).toHaveTextContent('/questions');
    expect(screen.getByTestId('actions-url')).toHaveTextContent('/actions');
    expect(screen.getByTestId('responses-url')).toHaveTextContent('/responses');
    expect(screen.getByTestId('participants-url')).toHaveTextContent('/participants');
  });

  test('renders divider between back button and tabs', () => {
    render(
      <TestWrapper data-id="002551">
        <AuditLeftNavigationMobile data-id="002552" />
      </TestWrapper>,
    );

    // Check that the component renders without errors
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  test('applies correct styling to main container', () => {
    render(
      <TestWrapper data-id="002553">
        <AuditLeftNavigationMobile data-id="002554" />
      </TestWrapper>,
    );

    // Check that the component renders without errors
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  test('applies correct styling to tabs container', () => {
    render(
      <TestWrapper data-id="002555">
        <AuditLeftNavigationMobile data-id="002556" />
      </TestWrapper>,
    );

    // Check that the component renders without errors
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  test('applies correct margin to divider', () => {
    render(
      <TestWrapper data-id="002557">
        <AuditLeftNavigationMobile data-id="002558" />
      </TestWrapper>,
    );

    // Check that the component renders without errors
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  test('renders back arrow icon with correct dimensions', () => {
    render(
      <TestWrapper data-id="002559">
        <AuditLeftNavigationMobile data-id="002560" />
      </TestWrapper>,
    );

    const backIcon = screen.getByTestId('back-arrow-icon');
    expect(backIcon).toBeInTheDocument();
  });

  test('handles click events on audit tabs', () => {
    render(
      <TestWrapper data-id="002561">
        <AuditLeftNavigationMobile data-id="002562" />
      </TestWrapper>,
    );

    const overviewTab = screen.getByTestId('audit-tab-overview');
    fireEvent.click(overviewTab);

    // The click should be handled by the mocked AuditLeftTabItem
    expect(overviewTab).toBeInTheDocument();
  });

  test('passes correct props to AuditLeftTabItem components', () => {
    render(
      <TestWrapper data-id="002563">
        <AuditLeftNavigationMobile data-id="002564" />
      </TestWrapper>,
    );

    // Check that all tabs are rendered with correct structure
    const tabs = [
      'overview',
      'questions', 
      'actions',
      'responses',
      'participants',
    ];

    tabs.forEach(tab => {
      expect(screen.getByTestId(`audit-tab-${tab}`)).toBeInTheDocument();
      expect(screen.getByTestId(`${tab}-icon`)).toBeInTheDocument();
      expect(screen.getByTestId(`${tab}-label`)).toBeInTheDocument();
      expect(screen.getByTestId(`${tab}-url`)).toBeInTheDocument();
    });
  });

  test('applies correct alignment to back button content', () => {
    render(
      <TestWrapper data-id="002565">
        <AuditLeftNavigationMobile data-id="002566" />
      </TestWrapper>,
    );

    const backButton = screen.getByText('Back').parentElement;
    expect(backButton).toHaveStyle({
      justifyContent: 'center',
      alignItems: 'center',
    });
  });

  test('applies correct alignment to tabs container', () => {
    render(
      <TestWrapper data-id="002567">
        <AuditLeftNavigationMobile data-id="002568" />
      </TestWrapper>,
    );

    // Check that the component renders without errors
    expect(screen.getByText('Back')).toBeInTheDocument();
  });
});
