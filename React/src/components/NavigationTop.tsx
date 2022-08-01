import { useHistory } from 'react-router-dom';

import { Box, Flex, IconButton, Stack, Text, useDisclosure } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import { useAuditContext } from '../contexts/AuditProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import NavigationTopProvider, { useNavigationTopContext } from '../contexts/NavigationTopProvider';
import { useResponseContext } from '../contexts/ResponseProvider';
import useConfig from '../hooks/useConfig';
import useDevice from '../hooks/useDevice';
import useNavigate from '../hooks/useNavigate';
import { AddIcon, CrossIcon, SearchIcon } from '../icons';
import { getInitials } from '../utils/helpers';
import Can from './can';
import SubSection from './NavigationLeft/SubSection';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

const NavigationTop = () => {
  const device = useDevice();
  const history = useHistory();
  const { trackerAddItems, auditAddItems } = useConfig();
  const { isPathActive, navigateTo } = useNavigate();
  const { module } = useAppContext();
  const { showFiltersPanel } = useFiltersContext();
  const { isSearchBarOpen, setIsSearchBarOpen } = useNavigationTopContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Check if TopNavgation is rendered inside ResponseLayout
  const { response } = useResponseContext();
  const isComplianceItemPage = isPathActive(`/compliance-item/${response?._id}`);

  // Check if TopNavgation is rendered in audit page
  const { audit } = useAuditContext();
  const isAuditPage = isPathActive(`/audits/${audit?._id}`);

  return (
    <Flex
      align="center"
      bg={['navigationTop.bgMobile', 'navigationTop.bg']}
      h={['72px', '80px']}
      justify="space-between"
      position={['fixed', 'relative']}
      w={['100vw', 'full']}
      zIndex={10}
    >
      {isOpen && (
        <Box
          bg="white"
          bottom={['140px', 'auto']}
          boxShadow="0px 0px 15px rgba(49, 50, 51, 0.25)"
          left={['auto', '25px']}
          position={['fixed', 'absolute']}
          py={4}
          right={['15px', 'auto']}
          rounded="10px"
          top={['auto', '80px']}
          w="235px"
          zIndex="5"
        >
          {module?.type === 'audits'
            ? auditAddItems.map((item) => {
                if (item.permission) {
                  return (
                    <Can action={item.permission} key={item.url} yes={() => <SubSection key={item.label} showIcon subsection={item} />} />
                  );
                }
                return <SubSection key={item.label} showIcon subsection={item} />;
              })
            : trackerAddItems.map((item) => <SubSection key={item.label} showIcon subsection={item} />)}
        </Box>
      )}

      <Stack
        align="center"
        direction="row"
        display="flex"
        fontSize="md"
        fontWeight="semi_medium"
        mr={['0', '20px']}
        pl={2}
        spacing={4}
        w="full"
      >
        <Flex
          alignItems="center"
          cursor="pointer"
          display={device !== 'mobile' || isSearchBarOpen ? 'none' : 'flex'}
          h="80px"
          onClick={() => navigateTo('/')}
        >
          <Text color="navigationTop.organizationName" fontSize="md" fontWeight="bold" lineHeight="19px" ml={['26px', 0]} w="full">
            {showFiltersPanel ? getInitials(module?.name) : module?.name}
          </Text>
        </Flex>
        {!isComplianceItemPage && module?.type === 'tracker' && (
          <Can
            action="adminPanel"
            yes={() => (
              <IconButton
                _hover={{ opacity: 0.7 }}
                aria-label="Add"
                bg="navigationTop.addButton"
                bottom={['75px', '0']}
                boxShadow={['0px 0px 80px rgba(49, 50, 51, 0.25)', 'none']}
                color="white"
                display={
                  ['/', '/admin/users', '/admin/settings', '/admin/audit-log'].includes(history.location.pathname) ? 'none' : 'block'
                }
                flexShrink={0}
                h={['52px', '45px']}
                icon={
                  isOpen ? (
                    <CrossIcon h="20px" ml="1" stroke="navigationTop.addIcon" w="20px" />
                  ) : (
                    <AddIcon h="20px" stroke="navigationTop.addIcon" w="20px" />
                  )
                }
                mr="30px"
                onClick={isOpen ? onClose : onOpen}
                position={['fixed', 'relative']}
                right={['15px', '0']}
                rounded={['20px', '8px']}
                w={['52px', '45px']}
                zIndex={5}
              />
            )}
          />
        )}
        {module?.type === 'audits' && !(device === 'mobile' && isAuditPage) && (
          <Can
            action="audits.add"
            yes={() => (
              <IconButton
                _hover={{ opacity: 0.7 }}
                aria-label="Add"
                bg="navigationTop.addButton"
                bottom={['75px', '0']}
                boxShadow={['0px 0px 80px rgba(49, 50, 51, 0.25)', 'none']}
                color="white"
                display={['/admin/users', '/admin/settings', '/admin/audit-log'].includes(history.location.pathname) ? 'none' : 'block'}
                flexShrink={0}
                h={['52px', '45px']}
                icon={
                  isOpen ? (
                    <CrossIcon h="20px" ml="1" stroke="navigationTop.addIcon" w="20px" />
                  ) : (
                    <AddIcon h="20px" stroke="navigationTop.addIcon" w="20px" />
                  )
                }
                mr="30px"
                onClick={isOpen ? onClose : onOpen}
                position={['fixed', 'relative']}
                right={['15px', '0']}
                rounded={['20px', '8px']}
                w={['52px', '45px']}
                zIndex={5}
              />
            )}
          />
        )}
        <Flex display={device !== 'mobile' || (device === 'mobile' && isSearchBarOpen) ? 'block' : 'none'}>
          <SearchBar />
        </Flex>
      </Stack>

      <Flex align="center" display={device === 'mobile' && isSearchBarOpen ? 'none' : 'flex'}>
        <IconButton
          aria-label="Search responses"
          bg="navigationTop.searchIconBackground"
          borderRadius="20px"
          display={['block', 'none']}
          icon={<SearchIcon fill="navigationTop.searchBarIcon" h="22px" opacity="1" stroke="brand.outerSpace" w="18px" />}
          mr="27.5px"
          onClick={() => setIsSearchBarOpen(true)}
        />
        {/* <NotificationIcon
          _hover={{ color: "navigationTop.notificationIconHover", opacity: 0.7, cursor: "pointer" }}
          _active={{}}
          h="20px"
          w="22px"
        />
        <Badge variant="solid" bg="navigationTop.notificationColorScheme" border="2px solid" borderColor="navigationTop.notificationBadgeBorder" borderRadius="5px" cursor="pointer">3</Badge> */}
        <UserMenu />
      </Flex>

      {/* <Stack
        spacing={4}
        direction="row"
        align="center"
        fontWeight="semi_medium"
        fontSize="md"
        w="full"
        ml={5}
        display={device === "mobile" && isSearchBarOpen ? "block" : "none"}
      >
        <SearchBar />
      </Stack> */}
    </Flex>
  );
};

const NavigationTopWithContext = (props) => (
  <NavigationTopProvider {...props}>
    <NavigationTop />
  </NavigationTopProvider>
);

export default NavigationTopWithContext;

export const navigationTopStyles = {
  navigationTop: {
    bg: '#E5E5E5',
    bgMobile: '#FFFFFF',
    inputBg: '#FFFFFF',
    inputIconColor: '#282F36',
    organizationName: '#282F36',
    addButton: '#462AC4',
    searchIconBackground: '#F0F0F0',
    avatarBg: '#A2171E',
    searchBarIconFill: '#282F36',
    notificationIconHover: '#FFFFFF',
    notificationBadgeBorder: '#FFFFFF',
    notificationColorScheme: '#E93C44',
    searchCrossIconStroke: '#282F36',
    addIcon: '#FFFFFF',
  },
};
