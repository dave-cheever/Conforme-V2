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
  return (
    <Flex
        bg="navigationBottomMobile.bg"
        bottom="0px"
        boxShadow="simple"
        data-id="000553"
        h="60px"
        justify="space-between"
        p="15px 25px"
        position="fixed"
        ref={ref}
        w="full"
        zIndex={10}>
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
  );
}

export default NavigationBottomMobile;

export const navigationBottomMobileStyles = {
  navigationBottomMobile: {
    bg: '#110b30',
  },
};
