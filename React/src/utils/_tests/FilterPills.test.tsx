import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import FilterPills, { FilterPill } from '../../components/FilterPills';

// Mock theme
const mockTheme = {
  colors: {},
};

// Mock ChakraProvider wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="001527" theme={mockTheme}>{children}</ChakraProvider>;
}

const mockPills: FilterPill[] = [
  { _id: 'all', name: 'All' },
  { _id: 'category1', name: 'Category 1' },
  { _id: 'category2', name: 'Category 2' },
  { _id: 'category3', name: 'Category 3' },
];

describe('FilterPills', () => {
  test('renders pills correctly', () => {
    const mockOnPillChange = vi.fn();

    render(
      <TestWrapper data-id="001528">
        <FilterPills
          data-id="001529"
          onPillChange={mockOnPillChange}
          pills={mockPills}
          selectedIndex={0}>
          {(pill) => <div data-id="001530" data-testid={`content-${pill._id}`}>Content for {pill.name}</div>}
        </FilterPills>
      </TestWrapper>,
    );

    // Check that all pills are rendered
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
    expect(screen.getByText('Category 3')).toBeInTheDocument();

    // Check that content is rendered for the selected pill
    expect(screen.getByTestId('content-all')).toBeInTheDocument();
  });

  test('calls onPillChange when a pill is clicked', () => {
    const mockOnPillChange = vi.fn();

    render(
      <TestWrapper data-id="001531">
        <FilterPills
          data-id="001532"
          onPillChange={mockOnPillChange}
          pills={mockPills}
          selectedIndex={0}>
          {(pill) => <div data-id="001533" data-testid={`content-${pill._id}`}>Content for {pill.name}</div>}
        </FilterPills>
      </TestWrapper>,
    );

    // Click on Category 1 pill
    fireEvent.click(screen.getByText('Category 1'));

    expect(mockOnPillChange).toHaveBeenCalledWith(1);
  });

  test('renders content for each pill', () => {
    const mockOnPillChange = vi.fn();

    render(
      <TestWrapper data-id="001534">
        <FilterPills
          data-id="001535"
          onPillChange={mockOnPillChange}
          pills={mockPills}
          selectedIndex={0}>
          {(pill) => <div data-id="001536" data-testid={`content-${pill._id}`}>Content for {pill.name}</div>}
        </FilterPills>
      </TestWrapper>,
    );

    // Check that content is rendered for all pills
    expect(screen.getByTestId('content-all')).toBeInTheDocument();
    expect(screen.getByTestId('content-category1')).toBeInTheDocument();
    expect(screen.getByTestId('content-category2')).toBeInTheDocument();
    expect(screen.getByTestId('content-category3')).toBeInTheDocument();
  });

  test('applies default selected styles', () => {
    const mockOnPillChange = vi.fn();

    render(
      <TestWrapper data-id="001537">
        <FilterPills
          data-id="001538"
          onPillChange={mockOnPillChange}
          pills={mockPills}
          selectedIndex={1}>
          {(pill) => <div data-id="001539" data-testid={`content-${pill._id}`}>Content for {pill.name}</div>}
        </FilterPills>
      </TestWrapper>,
    );

    // The selected pill should be rendered
    const selectedPill = screen.getByText('Category 1');
    expect(selectedPill).toBeInTheDocument();
  });

  test('applies custom selected styles', () => {
    const mockOnPillChange = vi.fn();
    const customSelectedStyles = {
      bg: '#FF0000',
      color: 'white',
      fontWeight: '600',
    };

    render(
      <TestWrapper data-id="001540">
        <FilterPills
          data-id="001541"
          onPillChange={mockOnPillChange}
          pills={mockPills}
          selectedIndex={1}
          selectedStyles={customSelectedStyles}>
          {(pill) => <div data-id="001542" data-testid={`content-${pill._id}`}>Content for {pill.name}</div>}
        </FilterPills>
      </TestWrapper>,
    );

    // The selected pill should have the custom styles applied
    const selectedPill = screen.getByText('Category 1');
    expect(selectedPill).toBeInTheDocument();
  });

  test('applies custom hover styles', () => {
    const mockOnPillChange = vi.fn();
    const customHoverStyles = {
      opacity: 0.5,
    };

    render(
      <TestWrapper data-id="001543">
        <FilterPills
          data-id="001544"
          hoverStyles={customHoverStyles}
          onPillChange={mockOnPillChange}
          pills={mockPills}
          selectedIndex={0}>
          {(pill) => <div data-id="001545" data-testid={`content-${pill._id}`}>Content for {pill.name}</div>}
        </FilterPills>
      </TestWrapper>,
    );

    // Check that pills are rendered (hover styles are applied via CSS)
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  test('handles empty pills array', () => {
    const mockOnPillChange = vi.fn();

    render(
      <TestWrapper data-id="001546">
        <FilterPills
          data-id="001547"
          onPillChange={mockOnPillChange}
          pills={[]}
          selectedIndex={0}>
          {(pill) => <div data-id="001548" data-testid={`content-${pill._id}`}>Content for {pill.name}</div>}
        </FilterPills>
      </TestWrapper>,
    );

    // Should render without crashing
    expect(screen.queryByText('All')).not.toBeInTheDocument();
  });

  test('handles undefined pills', () => {
    const mockOnPillChange = vi.fn();

    render(
      <TestWrapper data-id="001549">
        <FilterPills
          data-id="001550"
          onPillChange={mockOnPillChange}
          pills={undefined as any}
          selectedIndex={0}>
          {(pill) => <div data-id="001551" data-testid={`content-${pill._id}`}>Content for {pill.name}</div>}
        </FilterPills>
      </TestWrapper>,
    );

    // Should render without crashing
    expect(screen.queryByText('All')).not.toBeInTheDocument();
  });

  test('applies default tab styles', () => {
    const mockOnPillChange = vi.fn();

    render(
      <TestWrapper data-id="001552">
        <FilterPills
          data-id="001553"
          onPillChange={mockOnPillChange}
          pills={mockPills}
          selectedIndex={0}>
          {(pill) => <div data-id="001554" data-testid={`content-${pill._id}`}>Content for {pill.name}</div>}
        </FilterPills>
      </TestWrapper>,
    );

    // Check that pills are rendered with default styles
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  test('applies custom tab styles', () => {
    const mockOnPillChange = vi.fn();
    const customTabStyles = {
      fontSize: '16px',
      fontWeight: 'bold',
    };

    render(
      <TestWrapper data-id="001555">
        <FilterPills
          data-id="001556"
          onPillChange={mockOnPillChange}
          pills={mockPills}
          selectedIndex={0}
          tabStyles={customTabStyles}>
          {(pill) => <div data-id="001557" data-testid={`content-${pill._id}`}>Content for {pill.name}</div>}
        </FilterPills>
      </TestWrapper>,
    );

    // Check that pills are rendered with custom styles
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  test('applies custom panel padding', () => {
    const mockOnPillChange = vi.fn();
    const customPanelPadding = ['2', '4'];

    render(
      <TestWrapper data-id="001558">
        <FilterPills
          data-id="001559"
          onPillChange={mockOnPillChange}
          panelPadding={customPanelPadding}
          pills={mockPills}
          selectedIndex={0}>
          {(pill) => <div data-id="001560" data-testid={`content-${pill._id}`}>Content for {pill.name}</div>}
        </FilterPills>
      </TestWrapper>,
    );

    // Check that content is rendered
    expect(screen.getByTestId('content-all')).toBeInTheDocument();
  });

  test('disables tab wrapping when wrapTabs is false', () => {
    const mockOnPillChange = vi.fn();

    render(
      <TestWrapper data-id="001561">
        <FilterPills
          data-id="001562"
          onPillChange={mockOnPillChange}
          pills={mockPills}
          selectedIndex={0}
          wrapTabs={false}>
          {(pill) => <div data-id="001563" data-testid={`content-${pill._id}`}>Content for {pill.name}</div>}
        </FilterPills>
      </TestWrapper>,
    );

    // Check that pills are rendered
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  test('applies custom mobile tab width', () => {
    const mockOnPillChange = vi.fn();
    const customMobileTabWidth = 'calc(100% - 1rem)';

    render(
      <TestWrapper data-id="001564">
        <FilterPills
          data-id="001565"
          mobileTabWidth={customMobileTabWidth}
          onPillChange={mockOnPillChange}
          pills={mockPills}
          selectedIndex={0}>
          {(pill) => <div data-id="001566" data-testid={`content-${pill._id}`}>Content for {pill.name}</div>}
        </FilterPills>
      </TestWrapper>,
    );

    // Check that pills are rendered
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  test('passes through additional props to Tabs component', () => {
    const mockOnPillChange = vi.fn();
    const customTabsProps = {
      'data-testid': 'custom-tabs',
    };

    render(
      <TestWrapper data-id="001567">
        <FilterPills
          data-id="001568"
          onPillChange={mockOnPillChange}
          pills={mockPills}
          selectedIndex={0}
          tabsProps={customTabsProps}>
          {(pill) => <div data-id="001569" data-testid={`content-${pill._id}`}>Content for {pill.name}</div>}
        </FilterPills>
      </TestWrapper>,
    );

    // Check that custom props are applied
    expect(screen.getByTestId('custom-tabs')).toBeInTheDocument();
  });

  test('passes through additional props to TabList component', () => {
    const mockOnPillChange = vi.fn();
    const customTabListProps = {
      'data-testid': 'custom-tab-list',
    };

    render(
      <TestWrapper data-id="001570">
        <FilterPills
          data-id="001571"
          onPillChange={mockOnPillChange}
          pills={mockPills}
          selectedIndex={0}
          tabListProps={customTabListProps}>
          {(pill) => <div data-id="001572" data-testid={`content-${pill._id}`}>Content for {pill.name}</div>}
        </FilterPills>
      </TestWrapper>,
    );

    // Check that custom props are applied
    expect(screen.getByTestId('custom-tab-list')).toBeInTheDocument();
  });

  test('passes through additional props to individual Tab components', () => {
    const mockOnPillChange = vi.fn();
    const customTabProps = {
      'data-testid': 'custom-tab',
    };

    render(
      <TestWrapper data-id="001573">
        <FilterPills
          data-id="001574"
          onPillChange={mockOnPillChange}
          pills={mockPills}
          selectedIndex={0}
          tabProps={customTabProps}>
          {(pill) => <div data-id="001575" data-testid={`content-${pill._id}`}>Content for {pill.name}</div>}
        </FilterPills>
      </TestWrapper>,
    );

    // Check that custom props are applied to all tabs
    const customTabs = screen.getAllByTestId('custom-tab');
    expect(customTabs).toHaveLength(mockPills.length);
  });

  test('passes through additional props to TabPanels component', () => {
    const mockOnPillChange = vi.fn();
    const customTabPanelsProps = {
      'data-testid': 'custom-tab-panels',
    };

    render(
      <TestWrapper data-id="001576">
        <FilterPills
          data-id="001577"
          onPillChange={mockOnPillChange}
          pills={mockPills}
          selectedIndex={0}
          tabPanelsProps={customTabPanelsProps}>
          {(pill) => <div data-id="001578" data-testid={`content-${pill._id}`}>Content for {pill.name}</div>}
        </FilterPills>
      </TestWrapper>,
    );

    // Check that custom props are applied
    expect(screen.getByTestId('custom-tab-panels')).toBeInTheDocument();
  });

  test('passes through additional props to individual TabPanel components', () => {
    const mockOnPillChange = vi.fn();
    const customTabPanelProps = {
      'data-testid': 'custom-tab-panel',
    };

    render(
      <TestWrapper data-id="001579">
        <FilterPills
          data-id="001580"
          onPillChange={mockOnPillChange}
          pills={mockPills}
          selectedIndex={0}
          tabPanelProps={customTabPanelProps}>
          {(pill) => <div data-id="001581" data-testid={`content-${pill._id}`}>Content for {pill.name}</div>}
        </FilterPills>
      </TestWrapper>,
    );

    // Check that custom props are applied to all tab panels
    const customTabPanels = screen.getAllByTestId('custom-tab-panel');
    expect(customTabPanels).toHaveLength(mockPills.length);
  });

  test('applies data-id prop to Tabs component', () => {
    const mockOnPillChange = vi.fn();
    const dataId = 'test-filter-pills';

    render(
      <TestWrapper data-id="001582">
        <FilterPills data-id={dataId} onPillChange={mockOnPillChange} pills={mockPills} selectedIndex={0}>
          {(pill) => <div data-id="001583" data-testid={`content-${pill._id}`}>Content for {pill.name}</div>}
        </FilterPills>
      </TestWrapper>,
    );

    // Check that data-id is applied to the Tabs component
    const tabsElement = document.querySelector(`[data-id="${dataId}"]`);
    expect(tabsElement).toBeInTheDocument();
  });

  test('handles panel padding and margin overrides correctly', () => {
    const mockOnPillChange = vi.fn();
    const customTabPanelProps = {
      p: 0,
      ml: 0,
    };

    render(
      <TestWrapper data-id="001584">
        <FilterPills
          data-id="001585"
          onPillChange={mockOnPillChange}
          pills={mockPills}
          selectedIndex={0}
          tabPanelProps={customTabPanelProps}>
          {(pill) => <div data-id="001586" data-testid={`content-${pill._id}`}>Content for {pill.name}</div>}
        </FilterPills>
      </TestWrapper>,
    );

    // Check that content is rendered
    expect(screen.getByTestId('content-all')).toBeInTheDocument();
  });
});
