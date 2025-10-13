import React, { useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminContext } from '../../contexts/AdminProvider';
import Questions from '../../pages/admin/questions';

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

// Mock heavy child components
vi.mock('../../components/Admin/AdminModal', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-id="001948" data-testid="admin-modal">
      {children}
    </div>
  ),
}));
vi.mock('../../components/Forms/Dropdown', () => ({
  default: () => <div data-id="001949" data-testid="dropdown" />,
}));
vi.mock('../../components/Forms/TextInput', () => ({
  default: () => <div data-id="001950" data-testid="text-input" />,
}));
vi.mock('../../components/Forms/TextInputMultiline', () => ({
  default: () => <div data-id="001951" data-testid="text-input-multiline" />,
}));
vi.mock('../../components/Header', () => ({
  default: () => <div data-id="001952" data-testid="header" />,
}));

// Mock ListView to capture passed props
vi.mock('../../components/Table/ListView', () => ({
  default: ({ data, dataType, columns }: { data: any[]; dataType: string; columns: any[] }) => (
    <div data-datatype={dataType} data-id="002056" data-length={data?.length ?? 0} data-testid="listview">
      {columns?.map((c, i) => (
        <div data-id="002057" data-testid={`col-${i}`} key={i}>
          {typeof c.label === 'string' ? c.label : 'node'}
        </div>
      ))}
    </div>
  ),
}));

const createWrapper = (adminValue?: any) =>
  (function TestWrapper({ children }: { children: React.ReactNode }) {
    const contextValue = useMemo(() => adminValue || { adminModalState: 'closed', setAdminModalState: vi.fn() }, [adminValue]);

    return (
      <ChakraProvider data-id="002058">
        <BrowserRouter data-id="002059">
          <AdminContext.Provider value={contextValue}>{children}</AdminContext.Provider>
        </BrowserRouter>
      </ChakraProvider>
    );
  });

describe('Questions page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders ListView with questions and correct column', () => {
    const sampleQuestions = [
      {
        _id: 'q1',
        type: 'text',
        question: 'First question',
        description: '',
        questionsCategoryId: 'c1',
        positiveValue: '',
        negativeValue: '',
        scope: { module: 'audits' },
      },
      {
        _id: 'q2',
        type: 'text',
        question: 'Second question',
        description: '',
        questionsCategoryId: 'c1',
        positiveValue: '',
        negativeValue: '',
        scope: { module: 'audits' },
      },
    ];

    mockUseQuery.mockReturnValue({
      data: { questions: sampleQuestions, questionsCategories: [{ _id: 'c1', name: 'Cat 1', maxQuestionsNumber: 10 }] },
      loading: false,
      refetch: vi.fn(),
    });

    render(<Questions data-id="001957" />, { wrapper: createWrapper() });

    const list = screen.getByTestId('listview');
    expect(list).toBeInTheDocument();
    expect(list.getAttribute('data-datatype')).toBe('questions');
    expect(list.getAttribute('data-length')).toBe(String(sampleQuestions.length));

    // First (and only) column should be labeled "Question"
    expect(screen.getByTestId('col-0')).toHaveTextContent('Question');
  });

  it('passes empty data to ListView when no questions', () => {
    mockUseQuery.mockReturnValue({
      data: { questions: [], questionsCategories: [] },
      loading: false,
      refetch: vi.fn(),
    });

    render(<Questions data-id="001958" />, { wrapper: createWrapper() });

    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-length')).toBe('0');
    expect(list.getAttribute('data-datatype')).toBe('questions');
  });

  it('renders AdminModal component', () => {
    mockUseQuery.mockReturnValue({
      data: { questions: [], questionsCategories: [] },
      loading: false,
      refetch: vi.fn(),
    });

    render(<Questions data-id="001959" />, { wrapper: createWrapper() });
    expect(screen.getByTestId('admin-modal')).toBeInTheDocument();
  });

  it('renders Header component', () => {
    mockUseQuery.mockReturnValue({
      data: { questions: [], questionsCategories: [] },
      loading: false,
      refetch: vi.fn(),
    });

    render(<Questions data-id="001960" />, { wrapper: createWrapper() });
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('handles null data gracefully', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      refetch: vi.fn(),
    });

    render(<Questions data-id="001961" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-length')).toBe('0');
  });

  it('handles undefined questions gracefully', () => {
    mockUseQuery.mockReturnValue({
      data: { questions: undefined, questionsCategories: [] },
      loading: false,
      refetch: vi.fn(),
    });

    render(<Questions data-id="001962" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-length')).toBe('0');
  });

  it('renders with multiple questions', () => {
    const questions = [
      {
        _id: 'q1',
        type: 'text',
        question: 'Q1',
        description: '',
        questionsCategoryId: 'c1',
        positiveValue: '',
        negativeValue: '',
        scope: { module: 'audits' },
      },
      {
        _id: 'q2',
        type: 'text',
        question: 'Q2',
        description: '',
        questionsCategoryId: 'c1',
        positiveValue: '',
        negativeValue: '',
        scope: { module: 'audits' },
      },
      {
        _id: 'q3',
        type: 'text',
        question: 'Q3',
        description: '',
        questionsCategoryId: 'c1',
        positiveValue: '',
        negativeValue: '',
        scope: { module: 'audits' },
      },
    ];

    mockUseQuery.mockReturnValue({
      data: { questions, questionsCategories: [{ _id: 'c1', name: 'Cat 1', maxQuestionsNumber: 10 }] },
      loading: false,
      refetch: vi.fn(),
    });

    render(<Questions data-id="001963" />, { wrapper: createWrapper() });
    const list = screen.getByTestId('listview');
    expect(list.getAttribute('data-length')).toBe('3');
  });
});
