import { BrowserRouter } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Users from './users';

// Mock i18next
vi.mock('i18next', () => ({
  t: (s: string) => s,
}));

// Mock Apollo hooks
const mockUseQuery = vi.fn(() => ({}));
const mockUseMutation = vi.fn(() => [vi.fn()]);
vi.mock('@apollo/client', () => ({
  useQuery: () => mockUseQuery(),
  useMutation: () => mockUseMutation(),
  ApolloProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  gql: (strings: TemplateStringsArray) => strings.join(''),
}));

// Mock contexts and hooks
vi.mock('../../contexts/AppProvider', () => ({
  useAppContext: () => ({ module: { name: 'Home', path: '', type: 'tracker' } }),
}));
vi.mock('../../hooks/useNavigate', () => ({
  default: () => ({ navigateTo: vi.fn() }),
}));
vi.mock('../../hooks/useDevice', () => ({
  default: () => 'desktop',
}));

// Mock heavy child components
vi.mock('../../components/Header', () => ({
  default: () => <div data-id="001959" data-testid="header" />,
}));
vi.mock('../../components/Table/Cells/AvatarCell', () => ({
  default: () => <div data-id="001960" data-testid="avatar-cell" />,
}));
vi.mock('../../components/UserAuditsCount', () => ({
  default: () => <div data-id="001961" data-testid="user-audits-count" />,
}));
vi.mock('../../components/UserResponseCount', () => ({
  default: () => <div data-id="001962" data-testid="user-response-count" />,
}));

// Mock ListView to capture props
vi.mock('../../components/Table/ListView', () => ({
  default: ({ data, dataType, columns }: { data: any[]; dataType: string; columns: any[] }) => (
    <div data-datatype={dataType} data-id="002060" data-length={data?.length ?? 0} data-testid="listview">
      {columns?.map((c, i) => (
        <div data-id="002061" data-testid={`col-${i}`} key={i}>
          {typeof c.label === 'string' ? c.label : 'node'}
        </div>
      ))}
    </div>
  ),
}));

const createWrapper = () =>
  (function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ChakraProvider data-id="002062">
        <BrowserRouter data-id="002063">{children}</BrowserRouter>
      </ChakraProvider>
    );
  });

describe('Users page (ListView)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders ListView with users and expected columns (tracker)', () => {
    const users = [
      {
        _id: 'u1',
        displayName: 'Alice',
        role: 'admin',
        jobTitle: 'Manager',
        defaultPage: [{ name: 'Home', path: '/' }],
        lastLogin: new Date().toISOString(),
      },
      { _id: 'u2', displayName: 'Bob', role: 'user', jobTitle: '', defaultPage: [{ name: 'Home', path: '/' }], lastLogin: null },
    ];

    mockUseQuery.mockReturnValue({ data: { users }, loading: false, refetch: vi.fn() });

    render(<Users data-id="001967" />, { wrapper: createWrapper() });

    const list = screen.getByTestId('listview');
    expect(list).toBeInTheDocument();
    expect(list.getAttribute('data-datatype')).toBe('users');
    expect(list.getAttribute('data-length')).toBe(String(users.length));

    // Expect column labels present (Name, Job title, Role, Default page, R/A/C/F, Last login)
    expect(screen.getByTestId('col-0')).toHaveTextContent('Name');
    expect(screen.getByTestId('col-1')).toHaveTextContent('Job title');
    expect(screen.getByTestId('col-2')).toHaveTextContent('Role');
    expect(screen.getByTestId('col-3')).toHaveTextContent('Default page');
    // Tracker metrics columns are nodes due to tooltip/complex labels
    expect(screen.getByTestId('col-4')).toHaveTextContent('node');
    expect(screen.getByTestId('col-5')).toHaveTextContent('node');
    expect(screen.getByTestId('col-6')).toHaveTextContent('node');
    expect(screen.getByTestId('col-7')).toHaveTextContent('node');
    expect(screen.getByTestId('col-8')).toHaveTextContent('Last login');
  });

  it('renders audits metric columns when module type is audits', async () => {
    vi.doMock('../../contexts/AppProvider', () => ({
      useAppContext: () => ({ module: { name: 'Home', path: '', type: 'audits' } }),
    }));

    const users = [
      {
        _id: 'u1',
        displayName: 'Alice',
        role: 'admin',
        jobTitle: 'Manager',
        defaultPage: [{ name: 'Home', path: '/' }],
        lastLogin: new Date().toISOString(),
      },
    ];
    mockUseQuery.mockReturnValue({ data: { users }, loading: false, refetch: vi.fn() });

    const { default: UsersAudits } = await import('./users');

    render(<UsersAudits data-id="001968" />, { wrapper: createWrapper() });

    // After the first 4 columns, the next 4 are metrics (nodes), then Last login text column
    expect(screen.getByTestId('col-4')).toHaveTextContent('node');
    expect(screen.getByTestId('col-5')).toHaveTextContent('node');
    expect(screen.getByTestId('col-6')).toHaveTextContent('node');
    expect(screen.getByTestId('col-7')).toHaveTextContent('node');
    expect(screen.getByTestId('col-8')).toHaveTextContent('Last login');
  });

  it('renders Header component', () => {
    mockUseQuery.mockReturnValue({
      data: { users: [] },
      loading: false,
      refetch: vi.fn(),
    });

    render(<Users data-id="001969" />, { wrapper: createWrapper() });
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('handles null data gracefully', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      refetch: vi.fn(),
    });

    render(<Users data-id="001970" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-length')).toBe('0');
  });

  it('handles undefined users gracefully', () => {
    mockUseQuery.mockReturnValue({
      data: { users: undefined },
      loading: false,
      refetch: vi.fn(),
    });

    render(<Users data-id="001971" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-length')).toBe('0');
  });

  it('handles empty users array', () => {
    mockUseQuery.mockReturnValue({
      data: { users: [] },
      loading: false,
      refetch: vi.fn(),
    });

    render(<Users data-id="001972" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-length')).toBe('0');
  });

  it('passes correct dataType to ListView', () => {
    const users = [
      {
        _id: 'u1',
        displayName: 'Alice',
        role: 'admin',
        jobTitle: 'Manager',
        defaultPage: [{ name: 'Home', path: '/' }],
        lastLogin: new Date().toISOString(),
      },
    ];

    mockUseQuery.mockReturnValue({
      data: { users },
      loading: false,
      refetch: vi.fn(),
    });

    render(<Users data-id="001973" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-datatype')).toBe('users');
  });

  it('renders with multiple users', () => {
    const users = [
      {
        _id: 'u1',
        displayName: 'Alice',
        role: 'admin',
        jobTitle: 'Manager',
        defaultPage: [{ name: 'Home', path: '/' }],
        lastLogin: new Date().toISOString(),
      },
      { _id: 'u2', displayName: 'Bob', role: 'user', jobTitle: 'Developer', defaultPage: [{ name: 'Home', path: '/' }], lastLogin: null },
      {
        _id: 'u3',
        displayName: 'Charlie',
        role: 'user',
        jobTitle: 'Analyst',
        defaultPage: [{ name: 'Home', path: '/' }],
        lastLogin: new Date().toISOString(),
      },
    ];

    mockUseQuery.mockReturnValue({
      data: { users },
      loading: false,
      refetch: vi.fn(),
    });

    render(<Users data-id="001974" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-length')).toBe('3');
  });
});
