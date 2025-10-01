import { BrowserRouter } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import TrackerItemsGroup from '../../components/TrackerItem/TrackerItemsGroup';
import TrackerItemsList from '../../components/TrackerItem/TrackerItemsList';

const mockIsEvidenceUploaded = vi.fn(() => false);

vi.mock('../../hooks/useResponseUtils', () => ({
  __esModule: true,
  default: () => ({
    responseStatusesGroup: {
      compliant: 'Compliant',
      comingUp: 'Coming Up',
      nonCompliant: 'Non-Compliant',
    },
    isEvidenceUploaded: mockIsEvidenceUploaded,
  }),
}));

vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual<typeof import('@apollo/client')>('@apollo/client');
  return {
    ...actual,
    useQuery: () => ({ data: undefined, loading: false }),
  };
});

const renderWithProviders = (component: React.ReactNode) =>
  render(
    <BrowserRouter data-id="001188">
      <ChakraProvider data-id="001189">{component}</ChakraProvider>
    </BrowserRouter>,
  );

const baseResponses = [
  {
    _id: 'response-1',
    calculatedStatus: 'compliant',
    dueDate: new Date('2024-01-10').toISOString(),
    trackerItem: {
      name: 'Compliance Item',
      regulatoryBody: { name: 'Body A' },
      category: { name: 'Cat A' },
      locations: [],
      frequency: 'monthly',
    },
    businessUnit: { name: 'Unit A', imgUrl: '' },
    responsible: { _id: 'user', displayName: 'Responsible User', role: 'manager' },
    metatags: { addedBy: 'user' },
    evidence: [],
    questions: [],
  },
  {
    _id: 'response-2',
    calculatedStatus: 'comingUp',
    dueDate: new Date('2024-01-12').toISOString(),
    trackerItem: {
      name: 'Upcoming Item',
      regulatoryBody: { name: 'Body B' },
      category: { name: 'Cat B' },
      locations: [],
      frequency: 'monthly',
    },
    businessUnit: { name: 'Unit B', imgUrl: '' },
    responsible: { _id: 'user', displayName: 'Responsible User', role: 'manager' },
    metatags: { addedBy: 'user' },
    evidence: [],
    questions: [],
  },
  {
    _id: 'response-3',
    calculatedStatus: 'nonCompliant',
    dueDate: null,
    trackerItem: {
      name: 'Non Compliance Item',
      regulatoryBody: { name: 'Body C' },
      category: { name: 'Cat C' },
      locations: [],
      frequency: 'monthly',
    },
    businessUnit: { name: 'Unit C', imgUrl: '' },
    responsible: { _id: 'user', displayName: 'Responsible User', role: 'manager' },
    metatags: { addedBy: 'user' },
    evidence: [],
    questions: [],
  },
];

describe('TrackerItems components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('TrackerItemsList renders rows and respects sorting callbacks', () => {
    const sortOrderSpy = vi.fn();
    const sortTypeSpy = vi.fn();
    const loadResponses = vi.fn();

    renderWithProviders(
      <TrackerItemsList
        data-id="001190"
        loading={false}
        loadResponses={loadResponses}
        responses={baseResponses as any}
        setSortOrder={sortOrderSpy}
        setSortType={sortTypeSpy}
        sortOrder="asc"
        sortType="trackerItem.name"
        total={baseResponses.length} />,
    );

    expect(screen.getByText('Compliance Item')).toBeInTheDocument();
    expect(loadResponses).not.toHaveBeenCalled();

    screen.getByText('Due for renewal').click();
    expect(sortTypeSpy).toHaveBeenCalledWith('dueDate');
    expect(sortOrderSpy).toHaveBeenCalledWith('asc');
  });

  test('TrackerItemsGroup groups responses by status', () => {
    const loadResponses = vi.fn();

    renderWithProviders(
      <TrackerItemsGroup
        data-id="001191"
        loading={false}
        loadResponses={loadResponses}
        responses={baseResponses as any}
        total={baseResponses.length} />,
    );

    expect(screen.getAllByText('Compliant')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Coming Up')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Non-Compliant')[0]).toBeInTheDocument();
  });
});

