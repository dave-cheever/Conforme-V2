import { ReactNode, useEffect, useRef, useState } from 'react';

import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Icon, Tab, TabList, TabPanel, TabPanels, Tabs, useTheme } from '@chakra-ui/react';

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
  tabMargin = ['1', '2'],
  panelPadding = ['4', '6'],
  'data-id': dataId,
}: Readonly<FilterPillsProps>) {
  const theme = useTheme();
  const tabListRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const scrollRight = () => {
    if (tabListRef.current) {
      const scrollAmount = 200; // Scroll by 200px
      tabListRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const checkScroll = () => {
      if (tabListRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = tabListRef.current;
        const hasOverflow = scrollWidth > clientWidth;
        const atEnd = scrollLeft + clientWidth >= scrollWidth - 10; // 10px tolerance

        setShowScrollIndicator(hasOverflow);
        setIsAtEnd(atEnd);
      }
    };

    checkScroll();

    const tabList = tabListRef.current;
    if (tabList) {
      tabList.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);

      return () => {
        tabList.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [pills]);
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
    <Tabs data-id={dataId} defaultIndex={selectedIndex} mt="4" onChange={onPillChange} variant="unstyled" w="full" {...tabsProps}>
      <Box data-id="002343" position="relative">
        <TabList
          css={{
            '&::-webkit-scrollbar': {
              height: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#CBD5E0',
              borderRadius: '2px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#A0AEC0',
            },
          }}
          data-id="001366"
          flexWrap="nowrap"
          overflowX="auto"
          overflowY="hidden"
          pb={4}
          px={[4, 8]}
          ref={tabListRef}
          w={['98%', '100%']} // 90% width on mobile, 100% on desktop
          {...tabListProps}
          {...tabListStyles}
        >
          {pills?.map((pill, _index) => (
            <Tab
              _hover={{ ...defaultHoverStyles, ...hoverStyles }}
              _selected={{ ...defaultSelectedStyles, ...selectedStyles }}
              borderRadius="50px"
              data-id="001367"
              flexShrink={0}
              fontSize="14px"
              key={pill._id + _index}
              ml={[1, 0]}
              mr={tabMargin}
              my={[1, 0]}
              whiteSpace="nowrap"
              {...tabProps}
              {...defaultTabStyles}
              {...tabStyles}
            >
              {pill.name}
            </Tab>
          ))}
        </TabList>

        {/* Fade effect and scroll indicator */}
        {showScrollIndicator && !isAtEnd && (
          <Box
            background="linear-gradient(to right, #ffffffe0, white)"
            bottom="0"
            data-id="002344"
            display={['block', 'none']} // Only show on mobile
            pointerEvents="none"
            position="absolute"
            right="0"
            top="0"
            width="40px"
            zIndex="1"
          />
        )}

        {showScrollIndicator && !isAtEnd && (
          <Box
            data-id="002347"
            _hover={{
              bg: 'gray.100',
              borderRadius: '50%',
            }}
            alignItems="center"
            cursor="pointer"
            // Only show on mobile
            display={['flex', 'none']}
            height="30px"
            justifyContent="center"
            onClick={scrollRight}
            position="absolute"
            right="0px"
            top="40%"
            transform="translateY(-50%)"
            transition="all 0.2s"
            width="30px"
            zIndex="2">
            <Icon data-id="002348" as={ChevronRightIcon} color="gray.600" h="18px" w="18px" />
          </Box>
        )}
      </Box>
      <TabPanels data-id="001368" {...tabPanelsProps} h="full">
        {pills?.map((pill, _index) => (
          <TabPanel
            data-id="001369"
            key={pill._id}
            py={tabPanelProps?.p === undefined ? panelPadding : tabPanelProps.p}
            {...tabPanelProps}
            h="full"
            px={0}
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
