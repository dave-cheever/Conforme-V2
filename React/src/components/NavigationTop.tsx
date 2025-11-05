import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { Box, Flex, IconButton, Stack, useDisclosure } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import { useAuditContext } from '../contexts/AuditProvider';
import NavigationTopProvider, { useNavigationTopContext } from '../contexts/NavigationTopProvider';
import { useResponseContext } from '../contexts/ResponseProvider';
import useConfig from '../hooks/useConfig';
import useDevice from '../hooks/useDevice';
import useNavigate from '../hooks/useNavigate';
import { AddIcon, CrossIcon, SearchIcon } from '../icons';
import Can from './can';
import ModuleSwitcher from './ModuleSwitcher';
import SubSection from './NavigationLeft/SubSection';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

function NavigationTop() {
  const device = useDevice();
  const location = useLocation();
  const { trackerAddItems, auditAddItems } = useConfig();
  const { isPathActive } = useNavigate();
  const { module } = useAppContext();
  const { isSearchBarOpen, setIsSearchBarOpen } = useNavigationTopContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Check if TopNavgation is rendered inside ResponseLayout
  const { response } = useResponseContext();
  const isTrackerItemPage = isPathActive(`/tracker-item/${response?._id}`);

  // Check if TopNavgation is rendered in audit page
  const { audit } = useAuditContext();
  const isAuditPage = isPathActive(`/audits/${audit?._id}`);

  const boxRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (boxRef.current && !boxRef.current.contains(event.target as Node)) 
      onClose();
    
  }

  if (isOpen) 
    document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
  }, [isOpen, onClose]);

  return (
    <Flex
        align="center"
        bg={['navigationTop.bgMobile']}
        borderBottom="1px solid"
        borderColor="navigationTop.navBorder"
        data-id="000449"
        h={['72px', '80px']}
        justify="space-between"
        w={['100vw', 'full']}
        zIndex={10}>
      {isOpen && (
        <Box
          bg="white"
          bottom={['140px', 'auto']}
          boxShadow="0px 0px 15px rgba(49, 50, 51, 0.25)"
          data-id="000450"
          left={['auto', '30rem']}
          position={['fixed', 'absolute']}
          py={4}
          ref={boxRef}
          right={['15px', 'auto']}
          rounded="10px"
          top={['auto', '80px']}
          w="250px"
          zIndex="5">
          {module?.type === 'audits'
            ? auditAddItems.map((item) => {
              if (item.permission) {
                return (
                  <Can
                      action={item.permission}
                      data-id="000451"
                      key={item.url}
                      // eslint-disable-next-line react/no-unstable-nested-components
                      yes={() => <SubSection data-id="000452" isPopover key={item.label} onClick={onClose} showIcon subsection={item}/>} />
                );
              }
              return <SubSection data-id="000453" isPopover key={item.label} onClick={onClose} showIcon subsection={item} />;
            })
            : trackerAddItems.map((item) => <SubSection data-id="000454" isPopover key={item.label} onClick={onClose} showIcon subsection={item} />)}
        </Box>
      )}
      <Stack
        align="center"
        data-id="000455"
        direction="row"
        display="flex"
        fontSize="md"
        fontWeight="semi_medium"
        justifyContent={["space-between", "flex-start"]}
        mr={['0', '20px']}
        pl={isSearchBarOpen ? [3, 6] : [0, 6]}
        spacing={0}
        w="full">
        <Flex
          alignItems="center"
          cursor="pointer"
          data-id="000456"
          display={device !== 'mobile' || isSearchBarOpen ? 'none' : 'flex'}
          h="80px">
         <ModuleSwitcher data-id="000457" />
        </Flex>
        <Flex
          data-id="000458"
          display={device !== 'mobile' || (device === 'mobile' && isSearchBarOpen) ? 'block' : 'none'}>
          <SearchBar data-id="000459" />
        </Flex>
        {!isTrackerItemPage && module?.type === 'tracker' && (
          <Can
            data-id="000460"
            action="adminPanel"
            // eslint-disable-next-line react/no-unstable-nested-components
            yes={() => (
              <IconButton
                data-id="000461"
                _hover={{ opacity: 0.7 }}
                aria-label="Add"
                bg="white"
                border={"1px solid #CBD5E0"}
                bottom={['108px', '0']}
                boxShadow={['0px 0px 80px rgba(49, 50, 51, 0.25)', 'none']}
                color="white"
                display={
                  ['/', '/admin/users', '/admin/settings', '/admin/audit-log'].includes(location.pathname) ? 'none' : 'block'
                }
                flexShrink={0}
                h={['52px', '40px']}
                icon={
                  isOpen ? (
                    <CrossIcon
                      data-id="000462"
                      h="20px"
                      ml="1"
                      stroke="black"
                      w="20px"
                    />
                  ) : (
                    <AddIcon data-id="000463" h="21px" stroke="black" w="21px" />
                  )
                }
                ml={3}
                onClick={isOpen ? onClose : onOpen}
                position={['fixed', 'relative']}
                right={['15px', '0']}
                rounded={['20px', '8px']}
                w={['52px', '40px']}
                zIndex={5} />
            )} />
        )}
        {module?.type === 'audits' && !(device === 'mobile' && isAuditPage) && (
          <Can
            data-id="000464"
            action="audits.add"
            // eslint-disable-next-line react/no-unstable-nested-components
            yes={() => (
              <IconButton
                data-id="000465"
                _hover={{ opacity: 0.7 }}
                 aria-label="Add"
                bg="white"
                border={"1px solid #CBD5E0"}
                bottom={['107px', '0']}
                boxShadow={['0px 0px 80px rgba(49, 50, 51, 0.25)', 'none']}
                color="white"
                display={['/admin/users', '/admin/settings', '/admin/audit-log'].includes(location.pathname) ? 'none' : 'block'}
                flexShrink={0}
                h={['52px', '40px']}
                icon={
                  isOpen ? (
                    <CrossIcon
                      data-id="000466"
                      h="20px"
                      ml="1"
                     stroke="black"
                      w="20px" />
                  ) : (
                    <AddIcon data-id="000467" h="21px" stroke="black" w="21px" />
                  )
                }
                ml={['0', '4']}
                mr={['4', '0']}
                onClick={isOpen ? onClose : onOpen}
                position={['fixed', 'relative']}
                right={['0', '0']}
                rounded={['20px', '8px']}
                w={['52px', '40px']}  
                zIndex={5} />
            )} />
        )}
      </Stack>
      <Flex
        align="center"
        data-id="000468"
        display={device === 'mobile' && isSearchBarOpen ? 'none' : 'flex'}>
        <IconButton
          aria-label="Search responses"
          bg="navigationTop.searchIconBackground"
          borderRadius="20px"
          data-id="000469"
          display={['block', 'none']}
          icon={<SearchIcon
            data-id="000470"
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
        <UserMenu data-id="000471" />
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
}

function NavigationTopWithContext(props) {
  return (
    <NavigationTopProvider data-id="000472" {...props}>
      <NavigationTop data-id="000473" />
    </NavigationTopProvider>
  );
}

export default NavigationTopWithContext;

export const navigationTopStyles = {
  navigationTop: {
    bg: '#FFFFFF',
    bgMobile: '#FFFFFF',
    inputBg: '#FFFFFF',
    inputIconColor: '#282F36',
    organizationName: '#282F36',
    addButton: '#462AC4',
    searchIconBackground: '#F0F0F0',
    avatarBg: '#A2171E',
    navBorder: "#CBD5E0",
    searchBarIconFill: '#282F36',
    notificationIconHover: '#FFFFFF',
    notificationBadgeBorder: '#FFFFFF',
    notificationColorScheme: '#E93C44',
    searchCrossIconStroke: '#282F36',
    addIcon: '#FFFFFF',
  },
};
