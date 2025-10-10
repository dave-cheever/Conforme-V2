import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Categories from './categories';

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
}));

vi.mock('../../contexts/AdminProvider', () => ({
  useAdminContext: () => ({ adminModalState: 'closed', setAdminModalState: vi.fn() }),
  AdminContext: React.createContext({ adminModalState: 'closed', setAdminModalState: vi.fn() }),
}));

// Mock navigation
vi.mock('../../hooks/useNavigate', () => ({
  default: () => ({ navigateTo: vi.fn() }),
}));

// Mock ListView to capture passed props
vi.mock('../../components/Table/ListView', () => ({
  default: ({ data, dataType, columns }: { data: any[]; dataType: string; columns: any[] }) => (
    <div data-datatype={dataType} data-id="002048" data-length={data?.length ?? 0} data-testid="listview">
      {columns?.map((c, i) => (
        <div data-id="002049" data-testid={`col-${i}`} key={i}>
          {typeof c.label === 'string' ? c.label : 'node'}
        </div>
      ))}
    </div>
  ),
}));

// Mock heavy child components
vi.mock('../../components/Admin/AdminModal', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-id="001917" data-testid="admin-modal">
      {children}
    </div>
  ),
}));
vi.mock('../../components/Forms/TextInput', () => ({
  default: () => <div data-id="001918" data-testid="text-input" />,
}));
vi.mock('../../components/Header', () => ({
  default: () => <div data-id="001919" data-testid="header" />,
}));
vi.mock('../../components/BarChart', () => ({
  default: () => <div data-id="001920" data-testid="bar-chart" />,
}));

const createWrapper = () =>
  (function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ChakraProvider data-id="002050">
        <BrowserRouter data-id="002051">{children}</BrowserRouter>
      </ChakraProvider>
    );
  });

const sampleData = [
  { _id: 'cat-1', name: 'Category 1', trackerItemsResponsesCount: 5 },
  { _id: 'cat-2', name: 'Category 2', trackerItemsResponsesCount: 10 },
];

describe('Categories page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders ListView with categories (tracker mode)', () => {
    mockUseQuery.mockReturnValue({ data: { categories: sampleData }, loading: false, refetch: vi.fn() });

    render(<Categories data-id="001923" />, { wrapper: createWrapper() });

    const list = screen.getByTestId('listview');
    expect(list).toBeInTheDocument();
    expect(list.getAttribute('data-datatype')).toBe('categories');
    expect(list.getAttribute('data-length')).toBe(String(sampleData.length));

    // Should have Category and Responses count columns for tracker
    expect(screen.getByTestId('col-0')).toHaveTextContent('Category');
    expect(screen.getByTestId('col-1')).toHaveTextContent('Responses count');
  });

  it('shows empty ListView when no data', () => {
    mockUseQuery.mockReturnValue({
      data: { categories: [] },
      loading: false,
      refetch: vi.fn(),
    });

    render(<Categories data-id="001925" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-length')).toBe('0');
  });

  it('renders bar chart for tracker mode', () => {
    mockUseQuery.mockReturnValue({ data: { categories: sampleData }, loading: false, refetch: vi.fn() });

    render(<Categories data-id="001926" />, { wrapper: createWrapper() });

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('renders AdminModal component', () => {
    mockUseQuery.mockReturnValue({
      data: { categories: [] },
      loading: false,
      refetch: vi.fn(),
    });

    render(<Categories data-id="001927" />, { wrapper: createWrapper() });
    expect(screen.getByTestId('admin-modal')).toBeInTheDocument();
  });

  it('renders Header component', () => {
    mockUseQuery.mockReturnValue({
      data: { categories: [] },
      loading: false,
      refetch: vi.fn(),
    });

    render(<Categories data-id="001928" />, { wrapper: createWrapper() });
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('handles null data gracefully', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      refetch: vi.fn(),
    });

    render(<Categories data-id="001929" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-length')).toBe('0');
  });

  it('handles undefined categories gracefully', () => {
    mockUseQuery.mockReturnValue({
      data: { categories: undefined },
      loading: false,
      refetch: vi.fn(),
    });

    render(<Categories data-id="001930" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-length')).toBe('0');
  });

  it('passes correct dataType to ListView', () => {
    mockUseQuery.mockReturnValue({
      data: { categories: [{ _id: 'c1', name: 'Test', trackerItemsResponsesCount: 1 }] },
      loading: false,
      refetch: vi.fn(),
    });

    render(<Categories data-id="001931" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-datatype')).toBe('categories');
  });

  it('renders with multiple categories', () => {
    const categories = [
      { _id: 'c1', name: 'Category 1', trackerItemsResponsesCount: 5 },
      { _id: 'c2', name: 'Category 2', trackerItemsResponsesCount: 10 },
      { _id: 'c3', name: 'Category 3', trackerItemsResponsesCount: 15 },
    ];

    mockUseQuery.mockReturnValue({
      data: { categories },
      loading: false,
      refetch: vi.fn(),
    });

    render(<Categories data-id="001932" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-length')).toBe('3');
  });

  it('displays both columns for tracker mode', () => {
    mockUseQuery.mockReturnValue({
      data: { categories: sampleData },
      loading: false,
      refetch: vi.fn(),
    });

    render(<Categories data-id="001933" />, { wrapper: createWrapper() });

    // Verify both column headers are present
    expect(screen.getByTestId('col-0')).toHaveTextContent('Category');
    expect(screen.getByTestId('col-1')).toHaveTextContent('Responses count');
  });
});
