import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerOverlay, Flex, useMediaQuery } from '@chakra-ui/react';

import { useConfigContext } from '../../contexts/ConfigProvider';
import useDevice from '../../hooks/useDevice';
import AuditLeftNavigation from '../Audit/AuditLeftNavigation';
import ResponseLeftNavigation from '../Response/ResponseLeftNavigation/index';
import Can from '../can';
import ModuleSwitcher from '../ModuleSwitcher';
import LogoIcon from '../../icons/LogoIcon';
import NavigationLeftItem from './NavigationLeftItem';
import NavigationLeftItemTablet from './NavigationLeftItemTablet';
import NavigationPoweredBy from './NavigationPoweredBy';

function NavigationLeft() {
  const [isTabletWidth] = useMediaQuery('(min-width: 748px) and (max-width: 1279px)');
  const { menuItems } = useConfigContext();
  const [subsectionOpen, setSubsectionOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const device = useDevice();
  const location = useLocation();

  // Determine which content to show in the drawer
  const getDrawerContent = () => {
    const path = location.pathname;

    // Check if we're on an audit detail page
    if (path.includes('/audits/') && path.split('/').length > 3) {
      return <AuditLeftNavigation data-id="002855" />;
    }

    // Check if we're on a tracker item detail page
    if (path.includes('/tracker-item/') && path.split('/').length > 3) {
      return <ResponseLeftNavigation data-id="002856" />;
    }

    // Default: show the desktop navigation left content
    return (
      <Box
        bg="navigationLeft.bg"
        data-id="drawer-navigation-left"
        fontWeight="semibold"
        h="100vh"
        w="280px"
        overflow="visible">
        <Box
          alignItems="center"
          data-id="drawer-module-switcher"
          display="flex"
          h="fit-content"
          justifyContent="center"
          px={'16px'}
          py={'10px'}
          position={'relative'}
          overflow="visible"
        >
          <Box
            data-id="002857"
            w='26px'
            h='26px'
            borderRadius='6px'
            bg='#112C59'
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            position={'absolute'}
            top={0}
            bottom={0}
            my={'auto'}
            right={'-10px'}
            zIndex={1000000000}
            _hover={{ bg: '#16456F' }}
            _active={{ bg: '#1F5A85' }}
            cursor='pointer'
            onClick={() => setDrawerOpen(false)}>
            <Box data-id="002858" transform="scaleX(-1)">
              <LogoIcon data-id="002859" color='white' boxSize='12px' />
            </Box>
          </Box>
          <ModuleSwitcher enforceDesktop={true} data-id="drawer-000546" />
        </Box>
        <Flex
          data-id="drawer-000547"
          direction="column"
          borderTop="1px solid #3E4F6C"
          h="calc(100% - 80px)"
          overflow="hidden"
        >
          <Box
            data-id="002929"
            overflowY={'auto'}
            display={'flex'}
            h={'100%'}
            flexDirection={'column'}
            justifyContent={'space-between'}
            alignItems={'space-between'}
            gap={6}>
            <Box
              data-id="drawer-000548"
              flex="1"
              overflowX={'hidden'}
              pb={"18px"}
              pl={"14px"}
              pr={"14px"}
              pt={"18px"}
            >
              {menuItems.map((menuItem: any) => (
                <Can
                  action={menuItem.permission}
                  data-id="drawer-000549"
                  key={`drawer-menu-${menuItem.url || menuItem.label}`}
                  // eslint-disable-next-line react/no-unstable-nested-components
                  yes={() => {
                    return menuItem.hidden ? <></> : <NavigationLeftItem data-id="drawer-000550" menuItem={menuItem} />;
                  }} />
              ))}
            </Box>
            <NavigationPoweredBy data-id="drawer-002743" enforceDesktop={true} />
          </Box>

        </Flex>
      </Box>
    );
  };

  return (
    <>
      <Box
        bg="navigationLeft.bg"
        data-id="000544"
        display={['none', 'block', 'block']}
        fontWeight="semibold"
        h="100vh"
        w={isTabletWidth ? ['0px', '80px', '80px'] : ['0px', '80px', '280px']}>
        <Box
          alignItems="center"
          cursor="pointer"
          data-id="000545"
          display="flex"
          h="fit-content"
          justifyContent="center"
          px={'16px'}
          py={'8px'}
          position={'relative'}
        >
          <Box
            data-id="002860"
            w='26px'
            h='26px'
            borderRadius='6px'
            bg='#112C59'
            display={['none', 'flex', 'none']}
            alignItems={'center'}
            justifyContent={'center'}
            position={'absolute'}
            top={0}
            bottom={0}
            my={'auto'}
            right={'-10px'}
            zIndex={100}
            _hover={{ bg: '#16456F' }}
            _active={{ bg: '#1F5A85' }}
            cursor='pointer'
            onClick={() => setDrawerOpen(true)}>
            <LogoIcon data-id="002861" color='white' boxSize='12px' />
          </Box>
          <ModuleSwitcher data-id="000546" />
        </Box>
        <Flex
          data-id="000547"
          direction="column"
          borderTop="1px solid #3E4F6C"
          h="calc(100% - 80px)"
          overflow="hidden"
        >
          <Box
            data-id="000548"
            flex="1"
            overflowX={device === 'desktop' ? 'hidden' : 'unset'}
            overflowY="auto"
            pb={['18px', '18px', 0]}
            pl={"14px"}
            pr={"14px"}
            pt={"18px"}
            gap={6}
            display={'flex'} h={'100%'} flexDirection={'column'} justifyContent={'space-between'} alignItems={'space-between'}
          >
            <Box data-id="002930" display={'flex'} h={'100%'} flexDirection={'column'}>
              {menuItems.map((menuItem: any) => (
                <Can
                  action={menuItem.permission}
                  data-id="000549"
                  key={`menu-${menuItem.url || menuItem.label}`}
                  // eslint-disable-next-line react/no-unstable-nested-components
                  yes={() => {
                    if (device === 'tablet') {
                      return (
                        menuItem.hidden ? <></> : <NavigationLeftItemTablet
                          data-id="000551"
                          filtersOpen={filtersOpen}
                          menuItem={menuItem}
                          setFiltersOpen={setFiltersOpen}
                          setSubsectionOpen={setSubsectionOpen}
                          subsectionOpen={subsectionOpen} />
                      );
                    }

                    if (device === 'desktop') {
                      return menuItem.hidden ? <></> : <NavigationLeftItem data-id="000550" menuItem={menuItem} />;
                    }

                    return <Box data-id="000552" />;
                  }} />
              ))}
            </Box>
            <NavigationPoweredBy data-id="002743" />
          </Box>
        </Flex>
      </Box>
      <Drawer
        data-id="drawer-navigation"
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="left">
        <DrawerOverlay data-id="drawer-overlay" />
        <DrawerContent data-id="drawer-content" maxW="280px" overflow="visible">
          <DrawerCloseButton data-id="drawer-close" />
          <DrawerBody data-id="drawer-body" p={0} overflow="visible">
            {getDrawerContent()}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default NavigationLeft;

export const navigationLeftStyles = {
  navigationLeft: {
    bg: '#01173E',
    vigationLeft: {
      bg: '#f5f5f5',
    },
  },
}
