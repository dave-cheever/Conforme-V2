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
    (<Flex
      bg="navigationBottomMobile.bg"
      bottom="0px"
      boxShadow="simple"
      data-id="abd4e9b034d0"
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
          data-id="bf62123ce440"
          key={`menu${i}`}
          // eslint-disable-next-line react/no-unstable-nested-components
          yes={() => (
            <NavigationBottomItem
              data-id="c1a343c9cf2f"
              filtersOpen={filtersOpen}
              menuItem={menuItem}
              setFiltersOpen={setFiltersOpen}
              setSubsectionOpen={setSubsectionOpen}
              subsectionOpen={subsectionOpen} />
          )} />
      ))}
    </Flex>)
  );
}

export default NavigationBottomMobile;

export const navigationBottomMobileStyles = {
  navigationBottomMobile: {
    bg: '#FFFFFF',
  },
};
