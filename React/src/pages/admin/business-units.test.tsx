import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import BusinessUnits from './business-units';

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

// Mock contexts used by the page
vi.mock('../../contexts/AppProvider', () => ({
  useAppContext: () => ({ module: { _id: 'module-1', type: 'tracker' } }),
  AppProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../contexts/AdminProvider', () => ({
  useAdminContext: () => ({ adminModalState: 'closed', setAdminModalState: vi.fn() }),
  AdminContext: React.createContext({ adminModalState: 'closed', setAdminModalState: vi.fn() }),
}));

vi.mock('../../contexts/FiltersProvider', () => ({
  useFiltersContext: () => ({
    setResponseFiltersValue: vi.fn(),
    setAnswerFiltersValue: vi.fn(),
    setAuditFiltersValue: vi.fn(),
  }),
}));

// Mock navigation
vi.mock('../../hooks/useNavigate', () => ({
  default: () => ({ navigateTo: vi.fn() }),
}));

// Mock ListView to capture passed props
vi.mock('../../components/Table/ListView', () => ({
  default: ({ data, dataType, columns }: { data: any[]; dataType: string; columns: any[] }) => (
    <div data-datatype={dataType} data-id="002044" data-length={data?.length ?? 0} data-testid="listview">
      {columns?.map((c, i) => (
        <div data-id="002045" data-testid={`col-${i}`} key={i}>
          {typeof c.label === 'string' ? c.label : 'node'}
        </div>
      ))}
    </div>
  ),
}));

// Mock heavy child components
vi.mock('../../components/Admin/AdminModal', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-id="001894" data-testid="admin-modal">
      {children}
    </div>
  ),
}));
vi.mock('../../components/Forms/PeoplePicker', () => ({
  default: () => <div data-id="001895" data-testid="people-picker" />,
}));
vi.mock('../../components/Forms/TextInput', () => ({
  default: () => <div data-id="001896" data-testid="text-input" />,
}));
vi.mock('../../components/Header', () => ({
  default: () => <div data-id="001897" data-testid="header" />,
}));
vi.mock('../../components/Table/Cells/AvatarCell', () => ({
  default: () => <div data-id="001898" data-testid="avatar-cell" />,
}));

const createWrapper = () =>
  (function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ChakraProvider data-id="002046">
        <BrowserRouter data-id="002047">{children}</BrowserRouter>
      </ChakraProvider>
    );
  });

const sampleData = [
  {
    _id: 'bu-1',
    name: 'BU 1',
    ownerId: 'u1',
    owner: { displayName: 'Owner 1' },
    totalAnswersCount: 3,
    totalAuditsCount: 2,
    trackerItemsResponsesCount: 1,
  },
  {
    _id: 'bu-2',
    name: 'BU 2',
    ownerId: 'u2',
    owner: { displayName: 'Owner 2' },
    totalAnswersCount: 10,
    totalAuditsCount: 5,
    trackerItemsResponsesCount: 4,
  },
];

describe('BusinessUnits page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders ListView with business units (tracker mode)', () => {
    mockUseQuery.mockReturnValue({ data: { businessUnits: sampleData }, loading: false, refetch: vi.fn() });

    render(<BusinessUnits data-id="001901" />, { wrapper: createWrapper() });

    const list = screen.getByTestId('listview');
    expect(list).toBeInTheDocument();
    expect(list.getAttribute('data-datatype')).toBe('business units');
    expect(list.getAttribute('data-length')).toBe(String(sampleData.length));

    // Column labels should include Name, Owner, and Responses count for tracker
    expect(screen.getByTestId('col-0')).toHaveTextContent(/business unit name/i);
    expect(screen.getByTestId('col-1')).toHaveTextContent('Owner');
    // Last column should be Responses count in tracker mode
    expect(screen.getByTestId('col-2')).toHaveTextContent('Responses count');
  });

  it('renders ListView with audits columns (audits mode)', async () => {
    // Ensure fresh module state, then override app context to audits
    await vi.resetModules();
    vi.doMock('../../contexts/AppProvider', () => ({
      useAppContext: () => ({ module: { _id: 'module-1', type: 'audits' } }),
      AppProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    }));

    mockUseQuery.mockReturnValue({ data: { businessUnits: sampleData }, loading: false, refetch: vi.fn() });

    // Need to re-import component after doMock to apply new mock
    const { default: BusinessUnitsAudits } = await import('./business-units');

    render(<BusinessUnitsAudits data-id="001902" />, { wrapper: createWrapper() });

    // Should render Questions/Responses count and Audit(s) count columns
    expect(screen.getByTestId('col-2')).toHaveTextContent(/(questions?|responses) count/i);
    expect(screen.getByTestId('col-3')).toHaveTextContent(/audits? count/i);
  });

  it('renders AdminModal component', () => {
    mockUseQuery.mockReturnValue({
      data: { businessUnits: [] },
      loading: false,
      refetch: vi.fn(),
    });

    render(<BusinessUnits data-id="001903" />, { wrapper: createWrapper() });
    expect(screen.getByTestId('admin-modal')).toBeInTheDocument();
  });

  it('renders Header component', () => {
    mockUseQuery.mockReturnValue({
      data: { businessUnits: [] },
      loading: false,
      refetch: vi.fn(),
    });

    render(<BusinessUnits data-id="001904" />, { wrapper: createWrapper() });
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('handles null data gracefully', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      refetch: vi.fn(),
    });

    render(<BusinessUnits data-id="001905" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-length')).toBe('0');
  });

  it('handles undefined business units gracefully', () => {
    mockUseQuery.mockReturnValue({
      data: { businessUnits: undefined },
      loading: false,
      refetch: vi.fn(),
    });

    render(<BusinessUnits data-id="001906" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-length')).toBe('0');
  });

  it('handles empty business units array', () => {
    mockUseQuery.mockReturnValue({
      data: { businessUnits: [] },
      loading: false,
      refetch: vi.fn(),
    });

    render(<BusinessUnits data-id="001907" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-length')).toBe('0');
  });

  it('passes correct dataType to ListView', () => {
    mockUseQuery.mockReturnValue({
      data: { businessUnits: sampleData },
      loading: false,
      refetch: vi.fn(),
    });

    render(<BusinessUnits data-id="001908" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-datatype')).toBe('business units');
  });

  it('renders with multiple business units', () => {
    const units = [
      {
        _id: 'bu-1',
        name: 'BU 1',
        ownerId: 'u1',
        owner: { displayName: 'Owner 1' },
        totalAnswersCount: 3,
        totalAuditsCount: 2,
        trackerItemsResponsesCount: 1,
      },
      {
        _id: 'bu-2',
        name: 'BU 2',
        ownerId: 'u2',
        owner: { displayName: 'Owner 2' },
        totalAnswersCount: 10,
        totalAuditsCount: 5,
        trackerItemsResponsesCount: 4,
      },
      {
        _id: 'bu-3',
        name: 'BU 3',
        ownerId: 'u3',
        owner: { displayName: 'Owner 3' },
        totalAnswersCount: 7,
        totalAuditsCount: 3,
        trackerItemsResponsesCount: 2,
      },
    ];

    mockUseQuery.mockReturnValue({
      data: { businessUnits: units },
      loading: false,
      refetch: vi.fn(),
    });

    render(<BusinessUnits data-id="001909" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-length')).toBe('3');
  });
});
