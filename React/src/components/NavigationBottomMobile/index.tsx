import React, { useRef, useState } from 'react';

import { Flex, useOutsideClick } from '@chakra-ui/react';

import { useConfigContext } from '../../contexts/ConfigProvider';
import Can from '../can';
import NavigationBottomItem from './NavigationBottomItem';

function NavigationBottomMobile() {
  const { menuItems } = useConfigContext();
  const [subsectionOpen, setSubsectionOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const ref = useRef() as React.MutableRefObject<HTMLInputElement>;

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
        boxShadow="simple"
        data-id="000553"
        h="fit-content"
        overflowX={hasMoreThanFiveItems ? "auto" : "hidden"}
        p="18px 16px"
        position="fixed"
        ref={ref}
        w="full"
        zIndex={10}
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
        minW={hasMoreThanFiveItems ? "fit-content" : "100%"}
        justifyContent={hasMoreThanFiveItems ? "flex-start" : "space-between"}
        width={hasMoreThanFiveItems ? "fit-content" : "100%"}>
        {menuItems.map((menuItem: any, i) => (
          <Can
            action={menuItem.permission}
            data-id="000554"
            key={`menu${i}`}
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
