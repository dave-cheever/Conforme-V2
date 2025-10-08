import { ReactNode } from 'react';

import { Tab, TabList, TabPanel, TabPanels, Tabs, useTheme } from '@chakra-ui/react';

export interface FilterPill {
  _id: string;
  name: string;
  [key: string]: any; // Allow additional properties
}

export interface FilterPillsProps {
  /** Array of filter pill objects with _id and name */
  pills: FilterPill[];
  /** Currently selected pill index */
  selectedIndex: number;
  /** Callback when a pill is selected */
  onPillChange: (index: number) => void;
  /** Content to render for each pill */
  children: (pill: FilterPill, index: number) => ReactNode;
  /** Additional props for the Tabs component */
  tabsProps?: Record<string, any>;
  /** Additional props for the TabList component */
  tabListProps?: Record<string, any>;
  /** Additional props for individual Tab components */
  tabProps?: Record<string, any>;
  /** Additional props for the TabPanels component */
  tabPanelsProps?: Record<string, any>;
  /** Additional props for individual TabPanel components */
  tabPanelProps?: Record<string, any>;
  /** Custom styling for selected pills */
  selectedStyles?: Record<string, any>;
  /** Custom styling for hover state */
  hoverStyles?: Record<string, any>;
  /** Custom styling for the tab list */
  tabListStyles?: Record<string, any>;
  /** Custom styling for individual tabs */
  tabStyles?: Record<string, any>;
  /** Whether to wrap tabs on smaller screens */
  wrapTabs?: boolean;
  /** Custom width for tabs on mobile */
  mobileTabWidth?: string;
  /** Custom margin for tabs */
  tabMargin?: string | string[];
  /** Custom padding for tab panels */
  panelPadding?: string | string[];
  /** Custom margin left for tab panels */
  panelMarginLeft?: string | string[];
  /** Data attribute for testing */
  'data-id'?: string;
}

function FilterPills({
  pills,
  selectedIndex,
  onPillChange,
  children,
  tabsProps = {},
  tabListProps = {},
  tabProps = {},
  tabPanelsProps = {},
  tabPanelProps = {},
  selectedStyles = {},
  hoverStyles = {},
  tabListStyles = {},
  tabStyles = {},
  wrapTabs = true,
  mobileTabWidth = 'calc(50% - .5rem)',
  tabMargin = ['1', '2'],
  panelPadding = ['4', '6'],
  panelMarginLeft = ['0', '10px'],
  'data-id': dataId,
}: Readonly<FilterPillsProps>) {
  const theme = useTheme();
  const defaultSelectedStyles = {
    bg: theme.colors.filterPills?.selected?.bg || '#0068A3',
    color: theme.colors.filterPills?.selected?.color || 'white',
    fontWeight: theme.colors.filterPills?.selected?.fontWeight || '600',
  };
  const defaultHoverStyles = {
    opacity: theme.colors.filterPills?.hover?.opacity || 0.8,
  };
  const defaultTabStyles = {
    color: theme.colors.filterPills?.tab?.color || '#4A5568',
    fontWeight: theme.colors.filterPills?.tab?.fontWeight || '500',
  };
  return (
    <Tabs data-id={dataId} defaultIndex={selectedIndex} onChange={onPillChange} variant="unstyled" w="full" {...tabsProps}>
      <TabList data-id="001366" flexWrap={wrapTabs ? ['wrap', 'initial'] : 'nowrap'} px={[4, 8]} {...tabListProps} {...tabListStyles}>
        {pills?.map((pill, _index) => (
          <Tab
            data-id="001367"
            _hover={{ ...defaultHoverStyles, ...hoverStyles }}
            _selected={{ ...defaultSelectedStyles, ...selectedStyles }}
            borderRadius="50px"
            fontSize="14px"
            key={pill._id + _index}
            ml={[1, 0]}
            mr={tabMargin}
            my={[1, 0]}
            w={[mobileTabWidth, 'auto', 'auto']}
            {...tabProps}
            {...defaultTabStyles}
            {...tabStyles}
          >
            {pill.name}
          </Tab>
        ))}
      </TabList>
      <TabPanels data-id="001368" {...tabPanelsProps}>
        {pills?.map((pill, _index) => (
          <TabPanel
            data-id="001369"
            key={pill._id}
            ml={tabPanelProps?.ml === undefined ? panelMarginLeft : tabPanelProps.ml}
            p={tabPanelProps?.p === undefined ? panelPadding : tabPanelProps.p}
            {...tabPanelProps}
          >
            {children(pill, _index)}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}

export default FilterPills;

export const filterPillsStyles = {
  filterPills: {
    selected: {
      bg: '#0068A3',
      color: 'white',
      fontWeight: '600',
    },
    hover: {
      opacity: 0.8,
    },
    tab: {
      color: '#4A5568',
      fontWeight: '500',
    },
  },
};
