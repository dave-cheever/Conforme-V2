import { useState } from 'react';

import { Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerOverlay, Flex, Text } from '@chakra-ui/react';

import useConfig from '../../hooks/useConfig';
import useNavigate from '../../hooks/useNavigate';
import { BackArrowIcon } from '../../icons';
import AuditLeftTabItem from './AuditLeftTabItem';
import AuditLeftNavigation from './AuditLeftNavigation';
import LogoIcon from '../../icons/LogoIcon';
import ModuleSwitcher from '../ModuleSwitcher';
import NavigationPoweredBy from '../NavigationLeft/NavigationPoweredBy';
import useDevice from '../../hooks/useDevice';

function AuditLeftNavigationTablet() {
  const { auditNavigationTabs } = useConfig();
  const { navigateTo } = useNavigate();
  const device = useDevice();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Drawer content - AuditLeftNavigation component
  const getDrawerContent = () => {
    return (
      <Box
        data-id="002851"
        position="relative"
        overflow="visible"
        w="280px"
        h="100vh">
        <Box
          data-id="002852"
          display="flex"
          h="100vh"
          w="280px"
          overflow="visible"
          sx={{
            '& > div[data-id="000172"]': {
              display: 'flex !important'
            }
          }}>
          <AuditLeftNavigation data-id="002853" setDrawerOpen={setDrawerOpen} enforceDesktop={true} />
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Flex
        bg="auditLeftNavigation.bg"
        color="auditLeftNavigation.color"
        data-id="000193"
        direction="column"
        display={['none', 'flex', 'none']}
        flexShrink={0}
        fontWeight="400"
        h="100vh"
        position={'relative'}
        overflow="visible"
        w="80px">
        <Flex data-id="000194" flexDirection="column" flex="1" minH="0">
          <Box
            alignItems="center"
            cursor="pointer"
            data-id="000545"
            display="flex"
            h="fit-content"
            flexShrink={0}
            justifyContent="center"
            px={'16px'}
            py={'10px'}
            position={'relative'}
          >
            <Box
              data-id="002849"
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
              zIndex={100}
              _hover={{ bg: '#16456F' }}
              _active={{ bg: '#1F5A85' }}
              cursor='pointer'
              onClick={() => {
                setDrawerOpen(true);
              }}
            >
              <Box data-id="002850">
                <LogoIcon data-id="002854" color='white' boxSize='12px' />
              </Box>
            </Box>
            <ModuleSwitcher data-id="002832" />
          </Box>

          <Flex data-id="000874" direction="column"
            borderTop="1px solid #3E4F6C"
            gap={"25px"}
            flex="1"
            minH="0"
            justify="space-between"
            overflowX={device === 'desktop' ? 'hidden' : 'unset'}
            overflowY={device === 'desktop' ? 'auto' : 'unset'}
            pb={"18px"}
            pl={"14px"}
            pr={"14px"}
            pt={"18px"}>
            <Flex data-id="000881" flexDirection="column" flex="1" minH="0">
              <Flex
                align="center"
                color="auditLeftNavigation.goBackColor"
                cursor="pointer"
                data-id="000176"
                fontSize="14px"
                h='fit-content'
                mb="25px"
                mt="18px"
                gap="10px"
                onClick={() => navigateTo('/')}
                px="8px"
                py="6px"
                borderRadius="6px"
                display={'flex'}
                flexDir={['row', 'column', 'row']}
              >
                <Box
                  data-id="002738"
                  transition="all 0.2s ease-out"
                  _hover={{
                    bg: 'rgba(255, 255, 255, 0.22)',
                    cursor: 'pointer'
                  }}
                  bg={'#152A4D'}
                  borderRadius={'8px'}
                  width={'34px'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  display={'flex'}
                  height={'34px'}>
                  <BackArrowIcon data-id="000889" />
                </Box>
                <Flex display={['flex', 'none', 'flex']} data-id="002739" flexDirection={'column'}>
                  <Text data-id="002740" fontWeight={'600'} fontSize="12px" color={'#9EA7B8'}>Location</Text>
                  <Text data-id="002741" fontWeight={'600'} fontSize="16px">Audit Detail</Text>
                </Flex>
              </Flex>
              <Flex data-id="000199" flexDirection="column" mb={2}>
                {auditNavigationTabs.map(({ label, icon, url }) => (
                  <AuditLeftTabItem
                    data-id="000200"
                    icon={icon}
                    key={url}
                    label={label}
                    url={url} />
                ))}
              </Flex>
            </Flex>
            <NavigationPoweredBy data-id="002742" />
          </Flex>
        </Flex>
      </Flex>
      <Drawer
        data-id="drawer-audit-navigation"
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="left">
        <DrawerOverlay data-id="drawer-overlay" />
        <DrawerContent data-id="drawer-content" maxW="280px" overflow="visible">
          <DrawerCloseButton data-id="drawer-close" />
          <DrawerBody data-id="drawer-body" p={0} overflow="visible" h="100vh">
            {getDrawerContent()}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default AuditLeftNavigationTablet;
