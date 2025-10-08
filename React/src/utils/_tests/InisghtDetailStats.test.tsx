import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

/**
 * TEST STRATEGY
 * - Mock i18n to keep labels deterministic: t('audit') -> 'audit', t('location') -> 'location', t('business unit') -> 'business unit'
 * - Mock useDevice to switch between 'desktop' and 'mobile'
 * - Mock Apollo useQuery to feed totals
 * - Mock FilterPills so we can:
 *   * see the computed pills (labels),
 *   * verify props (panelPadding, panelMarginLeft, tabProps),
 *   * click pills (call onPillChange) and render the selected child
 * - Mock InsightsDetailedTable to expose which tab is mounted via data attributes:
 *   * data-id (e.g., 000506, 000507...)
 *   * insightsModel, insightsType, totals, questionsCategoriesId
 */

let DEVICE: 'desktop' | 'tablet' | 'mobile' = 'desktop';
let TOTALS = { users: 5, locations: 7, businessUnits: 9 };
let MOCK_QUERY_DATA: any = { totals: TOTALS };

vi.mock('i18next', () => ({
  t: (key: string) => key, // return keys literally ("audit", "location", "business unit")
}));

vi.mock('../../hooks/useDevice', () => ({
  __esModule: true,
  default: () => DEVICE,
}));

vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual<typeof import('@apollo/client')>('@apollo/client');
  return {
    ...actual,
    gql: (x: any) => x,
    useQuery: () => ({
      data: MOCK_QUERY_DATA,
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    }),
  };
});

// Capture the last FilterPills props so we can assert pass-through props
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let lastFilterPillsProps: any;

vi.mock('../../components/FilterPills', () => ({
  __esModule: true,
  default: (props: any) => {
    lastFilterPillsProps = props;
    const { pills = [], selectedIndex = 0, onPillChange, children } = props;

    return (
      <div data-id="001474" data-testid="filterpills-mock">
        <div
          data-id="001475"
          data-panelmarginleft={JSON.stringify(props.panelMarginLeft)}
          data-panelpadding={JSON.stringify(props.panelPadding)}
          data-tabprops={JSON.stringify(props.tabProps)}
          data-testid="fp-props"
        />
        <div data-id="001476" data-testid="pills">
          {pills.map((p: any, i: number) => (
            <button data-id="001477" data-testid={`pill-${i}`} key={p._id} onClick={() => onPillChange(i)} type="button">
              {p.name}
            </button>
          ))}
        </div>
        <div data-id="001478" data-testid="selected-panel">
          {typeof children === 'function' ? children(pills[selectedIndex], selectedIndex) : null}
        </div>
      </div>
    );
  },
}));

vi.mock('../../components/Insights/InsightsDetailedTable', () => ({
  __esModule: true,
  default: (props: any) => (
    <div
      data-id={props['data-id']}
      data-model={props.insightsModel}
      data-qid={String(props.questionsCategoriesId ?? '')}
      data-testid="insights-table"
      data-totals={String(props.totals ?? '')}
      data-type={props.insightsType}
    />
  ),
}));

/* eslint-disable import/first */
import InsightsDetailedStats from '../../components/Insights/InsightsDetailedStats';
/* eslint-enable import/first */

beforeEach(() => {
  vi.clearAllMocks();
  DEVICE = 'desktop';
  TOTALS = { users: 5, locations: 7, businessUnits: 9 };
  lastFilterPillsProps = undefined;
});

const baseProps = {
  businessUnits: [{ _id: 'bu1', name: 'BU 1', identifier: 'bu1', organizationId: 'org1' }] as any,
  locations: [{ _id: 'l1', name: 'Loc 1', identifier: 'l1', organizationId: 'org1', ownerId: 'owner1', notes: 'Test location' }] as any,
  users: [{ _id: 'u1', displayName: 'User 1', identifier: 'u1', organizationId: 'org1' }] as any,
  loadMoreLocations: vi.fn() as any,
  loadMoreBusinessUnits: vi.fn() as any,
  loadMoreUsers: vi.fn() as any,
};

describe('InsightsDetailedStats – FilterPills integration', () => {
  test('returns null on mobile', () => {
    DEVICE = 'mobile';
    const { container } = render(<InsightsDetailedStats data-id="001479" {...baseProps} insightsType="audits" />);
    expect(container.firstChild).toBeNull();
  });

  test('audits: builds correct pill labels, passes props to FilterPills, and switches panels', async () => {
    const user = userEvent.setup();

    render(<InsightsDetailedStats data-id="001480" {...baseProps} insightsType="audits" />);

    // Labels (capitalize(pluralize("audit")) => "Audits")
    const pills = within(screen.getByTestId('pills'));
    expect(pills.getByText('Audits per person')).toBeInTheDocument();
    expect(pills.getByText('Audits per location')).toBeInTheDocument();
    expect(pills.getByText('Audits per business unit')).toBeInTheDocument();

    // Props pass-through to FilterPills
    const fpProps = screen.getByTestId('fp-props');
    expect(fpProps.dataset.panelpadding).toBe(JSON.stringify(['0', '0']));
    expect(fpProps.dataset.panelmarginleft).toBe(JSON.stringify(['0', '0']));
    expect(fpProps.dataset.tabprops).toBe(JSON.stringify({ fontSize: 'smm', fontWeight: 'bold' }));

    // Default selectedIndex = 0 -> users table: data-id 000506, totals users
    let table = screen.getByTestId('insights-table');
    expect(table.dataset.id).toBe('000506');
    expect(table.dataset.model).toBe('users');
    expect(table.dataset.type).toBe('audits');
    expect(table.dataset.totals).toBe(String(TOTALS.users));

    // Click pill 1 (locations)
    await user.click(screen.getByTestId('pill-1'));
    table = screen.getByTestId('insights-table');
    expect(table.dataset.id).toBe('000507');
    expect(table.dataset.model).toBe('locations');
    expect(table.dataset.type).toBe('audits');
    expect(table.dataset.totals).toBe(String(TOTALS.locations));

    // Click pill 2 (businessUnits)
    await user.click(screen.getByTestId('pill-2'));
    table = screen.getByTestId('insights-table');
    expect(table.dataset.id).toBe('000508');
    expect(table.dataset.model).toBe('businessUnits');
    expect(table.dataset.type).toBe('audits');
    expect(table.dataset.totals).toBe(String(TOTALS.businessUnits));
  });

  test('actions: labels + panel IDs 000509/000510/000511 and totals per tab', async () => {
    const user = userEvent.setup();

    render(<InsightsDetailedStats data-id="001481" {...baseProps} insightsType="actions" />);

    // Labels
    const pills = within(screen.getByTestId('pills'));
    expect(pills.getByText('Actions per person')).toBeInTheDocument();
    expect(pills.getByText('Actions per location')).toBeInTheDocument();
    expect(pills.getByText('Actions per business unit')).toBeInTheDocument();

    // Default tab -> users (000509)
    let table = screen.getByTestId('insights-table');
    expect(table.dataset.id).toBe('000509');
    expect(table.dataset.model).toBe('users');
    expect(table.dataset.type).toBe('actions');
    expect(table.dataset.totals).toBe(String(TOTALS.users));

    // Next -> locations (000510)
    await user.click(screen.getByTestId('pill-1'));
    table = screen.getByTestId('insights-table');
    expect(table.dataset.id).toBe('000510');
    expect(table.dataset.model).toBe('locations');
    expect(table.dataset.totals).toBe(String(TOTALS.locations));

    // Next -> businessUnits (000511)
    await user.click(screen.getByTestId('pill-2'));
    table = screen.getByTestId('insights-table');
    expect(table.dataset.id).toBe('000511');
    expect(table.dataset.model).toBe('businessUnits');
    expect(table.dataset.totals).toBe(String(TOTALS.businessUnits));
  });

  test('answers: labels derived from questionsCategoryName, data-ids 000512/000513/000514, and questionsCategoriesId passed', async () => {
    const user = userEvent.setup();

    render(
      <InsightsDetailedStats
        data-id="001482"
        {...baseProps}
        insightsType="answers"
        questionsCategoriesId="q123"
        questionsCategoryName="Safety Question"
      />,
    );

    // Labels (capitalize(pluralize("Safety Question")) -> "Safety questions")
    const pills = within(screen.getByTestId('pills'));
    expect(pills.getByText('Safety questions per person')).toBeInTheDocument();
    expect(pills.getByText('Safety questions per location')).toBeInTheDocument();
    expect(pills.getByText('Safety questions per business unit')).toBeInTheDocument();

    // Default -> users (000512)
    let table = screen.getByTestId('insights-table');
    expect(table.dataset.id).toBe('000512');
    expect(table.dataset.model).toBe('users');
    expect(table.dataset.type).toBe('answers');
    expect(table.dataset.qid).toBe('q123');
    expect(table.dataset.totals).toBe(String(TOTALS.users));

    // Next -> locations (000513)
    await user.click(screen.getByTestId('pill-1'));
    table = screen.getByTestId('insights-table');
    expect(table.dataset.id).toBe('000513');
    expect(table.dataset.model).toBe('locations');
    expect(table.dataset.qid).toBe('q123');
    expect(table.dataset.totals).toBe(String(TOTALS.locations));

    // Next -> businessUnits (000514)
    await user.click(screen.getByTestId('pill-2'));
    table = screen.getByTestId('insights-table');
    expect(table.dataset.id).toBe('000514');
    expect(table.dataset.model).toBe('businessUnits');
    expect(table.dataset.qid).toBe('q123');
    expect(table.dataset.totals).toBe(String(TOTALS.businessUnits));
  });

  test('children(pill, index) receives the correct index (smoke via switching)', async () => {
    // This is implicitly covered by all switching tests above, but we can assert again:
    const user = userEvent.setup();
    render(<InsightsDetailedStats data-id="001483" {...baseProps} insightsType="audits" />);

    // switch to index 2 and see businessUnits content (proves index mapping)
    await user.click(screen.getByTestId('pill-2'));
    const table = screen.getByTestId('insights-table');
    expect(table.dataset.model).toBe('businessUnits');
  });

  test('handles null totals data gracefully with fallback to 0', async () => {
    // Set mock data to null
    const originalMockData = MOCK_QUERY_DATA;
    MOCK_QUERY_DATA = null;

    render(<InsightsDetailedStats data-id="001483" {...baseProps} insightsType="audits" />);

    // Check that the first table (users) has totals=0 when data is null
    const table = screen.getByTestId('insights-table');
    expect(table.dataset.totals).toBe('0');

    // Restore original mock data
    MOCK_QUERY_DATA = originalMockData;
  });

  test('handles undefined totals.totals gracefully with fallback to 0', async () => {
    // Set mock data to have undefined totals
    const originalMockData = MOCK_QUERY_DATA;
    MOCK_QUERY_DATA = { totals: undefined };

    render(<InsightsDetailedStats data-id="001483" {...baseProps} insightsType="audits" />);

    // Check that the first table (users) has totals=0 when totals.totals is undefined
    const table = screen.getByTestId('insights-table');
    expect(table.dataset.totals).toBe('0');

    // Restore original mock data
    MOCK_QUERY_DATA = originalMockData;
  });

  test('handles undefined totals.totals.users gracefully with fallback to 0', async () => {
    // Set mock data to have undefined users
    const originalMockData = MOCK_QUERY_DATA;
    MOCK_QUERY_DATA = { totals: { users: undefined, locations: 7, businessUnits: 9 } };

    render(<InsightsDetailedStats data-id="001483" {...baseProps} insightsType="audits" />);

    // Check that the first table (users) has totals=0 when totals.totals.users is undefined
    const table = screen.getByTestId('insights-table');
    expect(table.dataset.totals).toBe('0');

    // Restore original mock data
    MOCK_QUERY_DATA = originalMockData;
  });

  test('handles null totals.totals.users gracefully with fallback to 0', async () => {
    // Set mock data to have null users
    const originalMockData = MOCK_QUERY_DATA;
    MOCK_QUERY_DATA = { totals: { users: null, locations: 7, businessUnits: 9 } };

    render(<InsightsDetailedStats data-id="001483" {...baseProps} insightsType="audits" />);

    // Check that the first table (users) has totals=0 when totals.totals.users is null
    const table = screen.getByTestId('insights-table');
    expect(table.dataset.totals).toBe('0');

    // Restore original mock data
    MOCK_QUERY_DATA = originalMockData;
  });

  test('handles fallback logic for all insights types (audits, actions, answers)', async () => {
    // Set mock data to have null users for all types
    const originalMockData = MOCK_QUERY_DATA;
    MOCK_QUERY_DATA = { totals: { users: null, locations: null, businessUnits: null } };

    // Test audits type
    const { unmount: unmountAudits } = render(<InsightsDetailedStats data-id="001483" {...baseProps} insightsType="audits" />);
    let table = screen.getByTestId('insights-table');
    expect(table.dataset.totals).toBe('0');
    unmountAudits();

    // Test actions type
    const { unmount: unmountActions } = render(<InsightsDetailedStats data-id="001483" {...baseProps} insightsType="actions" />);
    table = screen.getByTestId('insights-table');
    expect(table.dataset.totals).toBe('0');
    unmountActions();

    // Test answers type
    render(<InsightsDetailedStats data-id="001483" {...baseProps} insightsType="answers" questionsCategoriesId="q123" />);
    table = screen.getByTestId('insights-table');
    expect(table.dataset.totals).toBe('0');

    // Restore original mock data
    MOCK_QUERY_DATA = originalMockData;
  });
});
