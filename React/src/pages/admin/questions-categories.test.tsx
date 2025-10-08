import { BrowserRouter } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminContext } from '../../contexts/AdminProvider';
import QuestionsCategories from './questions-categories';

// Mock i18next
vi.mock('i18next', () => ({
  t: (s: string) => s,
}));

// Mock Apollo hooks
const mockUseQuery = vi.fn((...args: any[]) => ({}));
const mockUseMutation = vi.fn((...args: any[]) => [vi.fn()]);
vi.mock('@apollo/client', () => ({
  useQuery: () => mockUseQuery({}),
  useMutation: () => mockUseMutation([vi.fn()]),
  ApolloProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  gql: (strings: TemplateStringsArray) => strings.join(''),
}));

// Mock heavy child components
vi.mock('../../components/Admin/AdminModal', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-id="001930" data-testid="admin-modal">{children}</div>,
}));
vi.mock('../../components/Forms/NumberInput', () => ({
  default: () => <div data-id="001931" data-testid="number-input" />,
}));
vi.mock('../../components/Forms/TextInput', () => ({
  default: () => <div data-id="001932" data-testid="text-input" />,
}));
vi.mock('../../components/Forms/Toggle', () => ({
  default: () => <div data-id="001933" data-testid="toggle" />,
}));
vi.mock('../../components/Filters/FilterCheckBox', () => ({
  default: (props: any) => <div data-id="001934" data-testid={`checkbox-${props.value}`} />,
}));
vi.mock('../../components/Header', () => ({
  default: () => <div data-id="001935" data-testid="header" />,
}));

// Mock ListView to capture passed props
vi.mock('../../components/Table/ListView', () => ({
  default: ({ data, dataType, columns }: { data: any[]; dataType: string; columns: any[] }) => (
    <div
      data-id="002052"
      data-datatype={dataType}
      data-length={data?.length ?? 0}
      data-testid="listview">
      {columns?.map((c, i) => (
        <div data-id="002053" data-testid={`col-${i}`} key={i}>{typeof c.label === 'string' ? c.label : 'node'}</div>
      ))}
    </div>
  ),
}));

const createWrapper = (adminValue?: any) => (function({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider data-id="002054">
      <BrowserRouter data-id="002055">
        <AdminContext.Provider value={adminValue || { adminModalState: 'closed', setAdminModalState: vi.fn() }}>
          {children}
        </AdminContext.Provider>
      </BrowserRouter>
    </ChakraProvider>
  );
});

describe('Questions Categories page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders ListView with categories and correct column', () => {
    const sample = [
      { _id: 'c1', name: 'Cat 1' },
      { _id: 'c2', name: 'Cat 2' },
    ];

    mockUseQuery.mockReturnValue({
      data: { questionsCategories: sample },
      loading: false,
      refetch: vi.fn(),
    });

    render(<QuestionsCategories data-id="001940" />, { wrapper: createWrapper() });

    const list = screen.getByTestId('listview');
    expect(list).toBeInTheDocument();
    expect(list.getAttribute('data-datatype')).toBe('questions categories');
    expect(list.getAttribute('data-length')).toBe(String(sample.length));
    expect(screen.getByTestId('col-0')).toHaveTextContent('Question Categories');
  });

  it('shows empty ListView when no data', () => {
    mockUseQuery.mockReturnValue({
      data: { questionsCategories: [] },
      loading: false,
      refetch: vi.fn(),
    });

    render(<QuestionsCategories data-id="001941" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-length')).toBe('0');
  });

  it('renders AdminModal component', () => {
    mockUseQuery.mockReturnValue({
      data: { questionsCategories: [] },
      loading: false,
      refetch: vi.fn(),
    });

    render(<QuestionsCategories data-id="001942" />, { wrapper: createWrapper() });
    expect(screen.getByTestId('admin-modal')).toBeInTheDocument();
  });

  it('renders Header component', () => {
    mockUseQuery.mockReturnValue({
      data: { questionsCategories: [] },
      loading: false,
      refetch: vi.fn(),
    });

    render(<QuestionsCategories data-id="001943" />, { wrapper: createWrapper() });
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('handles null data gracefully', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      refetch: vi.fn(),
    });

    render(<QuestionsCategories data-id="001944" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-length')).toBe('0');
  });

  it('handles undefined questionsCategories gracefully', () => {
    mockUseQuery.mockReturnValue({
      data: { questionsCategories: undefined },
      loading: false,
      refetch: vi.fn(),
    });

    render(<QuestionsCategories data-id="001945" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-length')).toBe('0');
  });

  it('passes correct dataType to ListView', () => {
    mockUseQuery.mockReturnValue({
      data: { questionsCategories: [{ _id: 'c1', name: 'Test' }] },
      loading: false,
      refetch: vi.fn(),
    });

    render(<QuestionsCategories data-id="001946" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-datatype')).toBe('questions categories');
  });

  it('renders with multiple categories', () => {
    const categories = [
      { _id: 'c1', name: 'Category 1' },
      { _id: 'c2', name: 'Category 2' },
      { _id: 'c3', name: 'Category 3' },
    ];

    mockUseQuery.mockReturnValue({
      data: { questionsCategories: categories },
      loading: false,
      refetch: vi.fn(),
    });

    render(<QuestionsCategories data-id="001947" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-length')).toBe('3');
  });
});

