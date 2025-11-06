import { Box, Divider, Flex, Text } from '@chakra-ui/react';

import useConfig from '../../hooks/useConfig';
import useNavigate from '../../hooks/useNavigate';
import ModuleSwitcher from '../ModuleSwitcher';
import NavigationPoweredBy from '../NavigationLeft/NavigationPoweredBy';
import AuditLeftTabItem from './AuditLeftTabItem';
import BackArrowIcon from '../../icons/BackArrowIcon';
import LogoIcon from '../../icons/LogoIcon';

interface AuditLeftNavigationProps {
  readonly enforceDesktop?: boolean;
  readonly setDrawerOpen?: (open: boolean) => void;
}

function AuditLeftNavigation({ enforceDesktop, setDrawerOpen }: AuditLeftNavigationProps) {
  const { auditNavigationTabs } = useConfig();
  const { navigateTo } = useNavigate();

  return (
    <Flex
      bg="auditLeftNavigation.bg"
      color="auditLeftNavigation.color"
      data-id="000172"
      direction="column"
      display={['none', 'none', 'flex']}
      fontWeight="400"
      justifyContent="space-between"
      overflow={enforceDesktop ? "visible" : "auto"}
      w="280px">
      <Flex data-id="000173" flexDirection="column" overflow="visible" h={'100%'}>

        <Box
          alignItems="center"
          cursor="pointer"
          data-id="000545"
          display="flex"
          h="fit-content"
          justifyContent="center"
          px={'16px'}
          py={'10px'}
          overflow="visible"
          position={'relative'}
        >
          {enforceDesktop === true && <Box
            data-id="002845"
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
            onClick={() => {
              if (setDrawerOpen) {
                setDrawerOpen(false);
              }
            }}
          >
            <Box data-id="002846" transform="scaleX(-1)">
              <LogoIcon data-id="002847" color='white' boxSize='12px' />
            </Box>
          </Box>}
          <ModuleSwitcher enforceDesktop={enforceDesktop} data-id="002735" />
        </Box>
        <Divider data-id="002736" color={'#3E4F6C'} />
        <Box
          data-id="002928"
          display={'flex'}
          h={'100%'}
          flexDirection={'column'}
          justifyContent={'space-between'}
          alignItems={'space-between'}
          gap={6}>

          <Flex data-id="002737" flexDirection="column" px="14px">

            <Flex
              align="center"
              color="auditLeftNavigation.goBackColor"
              cursor="pointer"
              data-id="000176"
              fontSize="14px"
              h="30px"
              mb="25px"
              mt="18px"
              gap="10px"
              py="6px"
              borderRadius="6px"
              onClick={() => navigateTo('/')}>
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
              <Flex data-id="002739" display={'flex'} flexDirection={'column'}>
                <Text data-id="002740" fontWeight={'600'} fontSize="12px" color={'#9EA7B8'}>Location</Text>
                <Text data-id="002741" fontWeight={'600'} fontSize="16px">Audit Detail</Text>
              </Flex>
            </Flex>
            <Flex data-id="000178" flexDirection="column" mb={2}>
              {auditNavigationTabs.map(({ label, icon, url }) => (
                <AuditLeftTabItem enforceDesktop={enforceDesktop} data-id="000179" icon={icon} key={url} label={label} url={url} />
              ))}
            </Flex>

          </Flex>

          <NavigationPoweredBy enforceDesktop={enforceDesktop} data-id="002742" />
        </Box>
      </Flex>
    </Flex>
  );
}

export default AuditLeftNavigation;

export const auditLeftNavigationStyles = {
  auditLeftNavigation: {
    bg: '#01173E',
    goBackColor: '#fff',
    color: '#ffffff',
    building: '#2B3236',
    copy: '#FF9A00',
    avatar: '#462AC4',
    auditDetailActiveColor: '#F0F0F0',
    organizationNameFontColor: '#282F36',
  },
};
