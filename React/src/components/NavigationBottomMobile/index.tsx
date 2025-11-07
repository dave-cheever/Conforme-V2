import React, { useRef, useState, useEffect } from 'react';

import { Flex, useOutsideClick } from '@chakra-ui/react';

import { useConfigContext } from '../../contexts/ConfigProvider';
import Can from '../can';
import NavigationBottomItem from './NavigationBottomItem';

function NavigationBottomMobile() {
  const { menuItems } = useConfigContext();
  const [subsectionOpen, setSubsectionOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const ref = useRef() as React.MutableRefObject<HTMLInputElement>;

  // Persist horizontal scroll position across navigations
  const SCROLL_KEY = 'navigationBottomMobile.scrollLeft';

  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved && ref.current) {
      // Restore saved horizontal scroll position
      (ref.current as unknown as HTMLDivElement).scrollLeft = Number.parseInt(saved, 10) || 0;
    }
  }, []);

  useOutsideClick({
    ref,
    handler: () => {
      setSubsectionOpen(false);
    },
  });
  const visibleMenuItems = menuItems.filter(() => true);

  const hasMoreThanFiveItems = visibleMenuItems.length > 5;

  return (
    <Flex
        bg="navigationBottomMobile.bg"
        bottom="0px"
        data-id="000553"
        maxH="92px"
        minH="92px"
        borderTop="1px solid"
        borderColor="#CBD5E0"
        overflowX={hasMoreThanFiveItems ? "auto" : "hidden"}
        p="18px 16px"
        ref={ref}
        w="full"
        zIndex={10}
        onScroll={(e) => {
          const target = e.currentTarget as HTMLDivElement;
          sessionStorage.setItem(SCROLL_KEY, String(target.scrollLeft));
        }}
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
      <Flex
        data-id="002500"
        gap="0px"
        justifyContent={hasMoreThanFiveItems ? "flex-start" : "space-between"}
        minW={hasMoreThanFiveItems ? "fit-content" : "100%"}
        width={hasMoreThanFiveItems ? "fit-content" : "100%"}>
        {menuItems.map((menuItem: any, i) => (
          <Can
            action={menuItem.permission}
            data-id="000554"
            key={`menu-${menuItem.url || menuItem.label}`}
            // eslint-disable-next-line react/no-unstable-nested-components
            yes={() => (
              <NavigationBottomItem
                data-id="000555"
                filtersOpen={filtersOpen}
                menuItem={menuItem}
                setFiltersOpen={setFiltersOpen}
                setSubsectionOpen={setSubsectionOpen}
                subsectionOpen={subsectionOpen} />
            )} />
        ))}
      </Flex>
    </Flex>
  );
}

export default NavigationBottomMobile;

export const navigationBottomMobileStyles = {
  navigationBottomMobile: {
    bg: '#F7FAFC',
  },
};
