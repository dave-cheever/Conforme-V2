import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Box, Flex, Icon, Text } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useConfigContext } from '../../contexts/ConfigProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import useDevice from '../../hooks/useDevice';
import { Conforme, ConformeSmall } from '../../icons';
import Can from '../can';
import NavigationLeftItem from './NavigationLeftItem';
import NavigationLeftItemTablet from './NavigationLeftItemTablet';

const NavigationLeft = () => {
  const history = useHistory();
  const { cleanFilters, showFiltersPanel } = useFiltersContext();
  const { organizationConfig } = useAppContext();
  const { menuItems } = useConfigContext();
  const [subsectionOpen, setSubsectionOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const device = useDevice();

  useEffect(() => {
    if (
      !(
        history.location.pathname === '/' ||
        history.location.pathname.includes('/items')
      )
    )
      cleanFilters();
  }, [history.location.pathname]);

  return (
    <>
      <Box
        bg="navigationLeft.bg"
        display={['none', 'block', 'block']}
        fontWeight="semibold"
        h="100vh"
        w={
          showFiltersPanel ? ['0px', '80px', '80px'] : ['0px', '80px', '240px']
        }
      >
        <Box
          alignItems="center"
          cursor="pointer"
          display="flex"
          h="80px"
          onClick={() => history.push('/')}
        >
          <Text
            color="navigationLeft.organizationNameFontColor"
            fontSize="16px"
            fontWeight="bold"
            ml="25px"
            w="80px"
          >
            {showFiltersPanel || device === 'tablet'
              ? organizationConfig?.name.charAt(0)
              : organizationConfig?.name}
          </Text>
        </Box>
        <Flex
          direction="column"
          h="calc(100% - 80px)"
          justify="space-between"
          pt={['0px', '10px']}
        >
          <Box>
            {menuItems.map((menuItem: any, i) => (
              <Can
                action={menuItem.permission}
                key={`menu${i}`}
                yes={() => {
                  if (device === 'desktop')
                    return <NavigationLeftItem menuItem={menuItem} />;

                  if (device === 'tablet') {
                    return (
                      <NavigationLeftItemTablet
                        filtersOpen={filtersOpen}
                        menuItem={menuItem}
                        setFiltersOpen={setFiltersOpen}
                        setSubsectionOpen={setSubsectionOpen}
                        subsectionOpen={subsectionOpen}
                      />
                    );
                  }
                  return <></>;
                }}
              />
            ))}
          </Box>
          {device === 'desktop' && (
            <Icon
              as={showFiltersPanel ? ConformeSmall : Conforme}
              h="30px"
              mb="20px"
              ml="20px"
              w={showFiltersPanel ? '27px' : '103px'}
            />
          )}
          {device === 'tablet' && (
            <Icon as={ConformeSmall} h="30px" mb="20px" ml="20px" w="27px" />
          )}
        </Flex>
      </Box>
    </>
  );
};

export default NavigationLeft;

export const navigationLeftStyles = {
  navigationLeft: {
    bg: '#E5E5E5',
    organizationNameFontColor: '#282F36',
  },
};
