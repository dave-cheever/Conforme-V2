import { useLocation } from 'react-router-dom';

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

function NavigationTop() {
  const device = useDevice();
  const location = useLocation();
  const { trackerAddItems, auditAddItems } = useConfig();
  const { isPathActive, navigateTo } = useNavigate();
  const { module } = useAppContext();
  const { showFiltersPanel } = useFiltersContext();
  const { isSearchBarOpen, setIsSearchBarOpen } = useNavigationTopContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Check if TopNavgation is rendered inside ResponseLayout
  const { response } = useResponseContext();
  const isTrackerItemPage = isPathActive(`/tracker-item/${response?._id}`);

  // Check if TopNavgation is rendered in audit page
  const { audit } = useAuditContext();
  const isAuditPage = isPathActive(`/audits/${audit?._id}`);

  return (
    (<Flex
      align="center"
      bg={['navigationTop.bgMobile', 'navigationTop.bg']}
      data-id="1a2fd16652ef"
      h={['72px', '80px']}
      justify="space-between"
      position={['fixed', 'relative']}
      w={['100vw', 'full']}
      zIndex={10}>
      {isOpen && (
        <Box
          bg="white"
          bottom={['140px', 'auto']}
          boxShadow="0px 0px 15px rgba(49, 50, 51, 0.25)"
          data-id="a80532bb0f3c"
          left={['auto', '25px']}
          position={['fixed', 'absolute']}
          py={4}
          right={['15px', 'auto']}
          rounded="10px"
          top={['auto', '80px']}
          w="235px"
          zIndex="5">
          {module?.type === 'audits'
            ? auditAddItems.map((item) => {
              if (item.permission) {
                return (
                  (<Can
                    action={item.permission}
                    data-id="bb02aa0c8d5e"
                    key={item.url}
                    // eslint-disable-next-line react/no-unstable-nested-components
                    yes={() => <SubSection data-id="3b7ff7eacbb0" key={item.label} showIcon subsection={item} />} />)
                );
              }
              return <SubSection data-id="e2de2224871c" key={item.label} showIcon subsection={item} />;
            })
            : trackerAddItems.map((item) => <SubSection data-id="69f80f124301" key={item.label} showIcon subsection={item} />)}
        </Box>
      )}
      <Stack
        align="center"
        data-id="e7aaea006583"
        direction="row"
        display="flex"
        fontSize="md"
        fontWeight="semi_medium"
        mr={['0', '20px']}
        pl={[0, 2]}
        spacing={4}
        w="full">
        <Flex
          alignItems="center"
          cursor="pointer"
          data-id="902872a3c37e"
          display={device !== 'mobile' || isSearchBarOpen ? 'none' : 'flex'}
          h="80px"
          onClick={() => navigateTo('/')}>
          <Text
            color="navigationTop.organizationName"
            data-id="5618ec17b212"
            fontSize="md"
            fontWeight="bold"
            lineHeight="19px"
            ml={[6, 0]}
            w="100%">
            {showFiltersPanel ? getInitials(module?.name) : module?.name}
          </Text>
        </Flex>
        {!isTrackerItemPage && module?.type === 'tracker' && (
          <Can
            action="adminPanel"
            data-id="da8f9cfb2b0c"
            // eslint-disable-next-line react/no-unstable-nested-components
            yes={() => (
              <IconButton
                _hover={{ opacity: 0.7 }}
                aria-label="Add"
                bg="navigationTop.addButton"
                bottom={['75px', '0']}
                boxShadow={['0px 0px 80px rgba(49, 50, 51, 0.25)', 'none']}
                color="white"
                data-id="d00903fe3874"
                display={
                  ['/', '/admin/users', '/admin/settings', '/admin/audit-log'].includes(location.pathname) ? 'none' : 'block'
                }
                flexShrink={0}
                h={['52px', '40px']}
                icon={
                  isOpen ? (
                    <CrossIcon
                      data-id="c63268f552d1"
                      h="20px"
                      ml="1"
                      stroke="navigationTop.addIcon"
                      w="20px" 
                    />
                  ) : (
                    <AddIcon data-id="5b1e2b8025ce" h="21px" stroke="navigationTop.addIcon" w="21px" />
                  )
                }
                onClick={isOpen ? onClose : onOpen}
                position={['fixed', 'relative']}
                right={['15px', '0']}
                rounded={['20px', '8px']}
                w={['52px', '40px']}
                ml={3}
                zIndex={5} />
            )} />
        )}
        {module?.type === 'audits' && !(device === 'mobile' && isAuditPage) && (
          <Can
            action="audits.add"
            data-id="a3a476596997"
            // eslint-disable-next-line react/no-unstable-nested-components
            yes={() => (
              <IconButton
                _hover={{ opacity: 0.7 }}
                aria-label="Add"
                bg="navigationTop.addButton"
                bottom={['75px', '0']}
                boxShadow={['0px 0px 80px rgba(49, 50, 51, 0.25)', 'none']}
                color="white"
                data-id="b5bf85567bbe"
                display={['/admin/users', '/admin/settings', '/admin/audit-log'].includes(location.pathname) ? 'none' : 'block'}
                flexShrink={0}
                h={['52px', '40px']}
                icon={
                  isOpen ? (
                    <CrossIcon
                      data-id="91cf3a59fe73"
                      h="20px"
                      ml="1"
                      stroke="navigationTop.addIcon"
                      w="20px" />
                  ) : (
                    <AddIcon data-id="6cff50759b96" h="21px" stroke="navigationTop.addIcon" w="21px" />
                  )
                }
                onClick={isOpen ? onClose : onOpen}
                position={['fixed', 'relative']}
                right={['15px', '0']}
                ml={4}
                rounded={['20px', '8px']}
                w={['52px', '40px']}
                zIndex={5} />
            )} />
        )}
        <Flex
          data-id="bf65bf2f1b3d"
          display={device !== 'mobile' || (device === 'mobile' && isSearchBarOpen) ? 'block' : 'none'}>
          <SearchBar data-id="37fc8873fa31" />
        </Flex>
      </Stack>
      <Flex
        align="center"
        data-id="4a1d6aae106b"
        display={device === 'mobile' && isSearchBarOpen ? 'none' : 'flex'}>
        <IconButton
          aria-label="Search responses"
          bg="navigationTop.searchIconBackground"
          borderRadius="20px"
          data-id="695fc122c82e"
          display={['block', 'none']}
          icon={<SearchIcon
            data-id="c14e421ed62d"
            fill="navigationTop.searchBarIcon"
            h="22px"
            opacity="1"
            stroke="brand.outerSpace"
            w="18px" />}
          mr={1}
          onClick={() => setIsSearchBarOpen(true)} />
        {/* <NotificationIcon
          _hover={{ color: "navigationTop.notificationIconHover", opacity: 0.7, cursor: "pointer" }}
          _active={{}}
          h="20px"
          w="22px"
        />
        <Badge variant="solid" bg="navigationTop.notificationColorScheme" border="2px solid" borderColor="navigationTop.notificationBadgeBorder" borderRadius="5px" cursor="pointer">3</Badge> */}
        <UserMenu data-id="cea3a4656c7f" />
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
    </Flex>)
  );
}

function NavigationTopWithContext(props) {
  return <NavigationTopProvider data-id="3ed99d2f26ac" {...props}>
    <NavigationTop data-id="fc54358b3b5d" />
  </NavigationTopProvider>
}

export default NavigationTopWithContext;

export const navigationTopStyles = {
  navigationTop: {
    bg: '#f5f5f5',
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
