import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Box, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Flex, IconButton, Stack, useDisclosure } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import { useAuditContext } from '../contexts/AuditProvider';
import NavigationTopProvider, { useNavigationTopContext } from '../contexts/NavigationTopProvider';
import { useResponseContext } from '../contexts/ResponseProvider';
import useConfig from '../hooks/useConfig';
import useDevice from '../hooks/useDevice';
import useNavigate from '../hooks/useNavigate';
import { AddIcon, CloseDrawerIcon, CrossIcon, SearchIcon } from '../icons';
import Can from './can';
import ModuleSwitcher from './ModuleSwitcher';
import SubSection from './NavigationLeft/SubSection';
import MobileSearchResults from './MobileSearchResults';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

function NavigationTop() {
  const device = useDevice();
  const location = useLocation();
  const { trackerAddItems, auditAddItems } = useConfig();
  const { isPathActive } = useNavigate();
  const { module } = useAppContext();
  const { searchText, searchResults, searchLoading, searchError, hasSearched, setIsSearchBarOpen, setSearchText, recentSearches, recentSearchesLoading } = useNavigationTopContext();
  const { auditSearchItems, trackerSearchItems } = useConfig();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isSearchDrawerOpen, onOpen: onSearchDrawerOpen, onClose: onSearchDrawerClose } = useDisclosure();
  const [drawerHeight, setDrawerHeight] = useState<string>('70vh');

  // Lock drawer height when it opens to prevent iOS keyboard from affecting it
  useEffect(() => {
    if (isSearchDrawerOpen && device === 'mobile') {
      // Calculate and lock the height based on viewport height when drawer opens
      // This prevents iOS keyboard from affecting the drawer height
      const viewportHeight = window.innerHeight;
      const calculatedHeight = viewportHeight * 0.7; // 70vh
      setDrawerHeight(`${calculatedHeight}px`);
    } else if (!isSearchDrawerOpen) {
      // Reset to vh when drawer closes
      setDrawerHeight('70vh');
    }
  }, [isSearchDrawerOpen, device]);

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
        pl={[0, 6]}
        spacing={0}
        w="full">
        <Flex
          alignItems="center"
          cursor="pointer"
          data-id="000456"
          display={device === 'mobile' ? 'flex' : 'none'}
          h="80px">
         <ModuleSwitcher data-id="000457" />
        </Flex>
        <Flex
          data-id="000458"
          display={device === 'mobile' ? 'none' : 'block'}>
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
      </Stack>
      <Flex
        align="center"
        data-id="000468"
        display="flex">
        <Flex
          aria-label="Search responses"
          data-id="000469"
          display={['block', 'none']}
          onClick={() => {
            if (device === 'mobile') {
              setIsSearchBarOpen(true);
              onSearchDrawerOpen();
            } else {
              setIsSearchBarOpen(true);
            }
          }}>
          <SearchIcon
            data-id="000469"
            h="19px"
            w="19px" />
        </Flex>
        {/* <NotificationIcon
          _hover={{ color: "navigationTop.notificationIconHover", opacity: 0.7, cursor: "pointer" }}
          _active={{}}
          h="20px"
          w="22px"
        />
        <Badge variant="solid" bg="navigationTop.notificationColorScheme" border="2px solid" borderColor="navigationTop.notificationBadgeBorder" borderRadius="5px" cursor="pointer">3</Badge> */}
        <UserMenu data-id="000471" />
      </Flex>
      {/* Mobile Search Drawer */}
      {device === 'mobile' && (
        <Drawer
          data-id="003191"
          isOpen={isSearchDrawerOpen}
          onClose={onSearchDrawerClose}
          placement="bottom">
          <DrawerOverlay data-id="003192" />
          <DrawerContent 
            data-id="003193" 
            borderTopRadius="14px" 
            height={drawerHeight}
            maxHeight={drawerHeight}
            sx={{
              height: `${drawerHeight} !important`,
              maxHeight: `${drawerHeight} !important`,
            }}>
            <DrawerHeader
              data-id="003194"
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              borderBottomWidth="1px"
              borderBottomColor="#E2E8F0"
              minH="64px"
              px={4}
              pb={4}>
              <Box
                data-id="003195"
                position="absolute"
                top="10px"
                left={0}
                right={0}
                backgroundColor="#CBD5E0"
                h="4px"
                w="42px"
                borderRadius="32px"
                margin="0 auto" />
              <Box data-id="003196" flex={1} mr={2}>
                <SearchBar data-id="003197" isInMobileDrawer={true} />
              </Box>
              <Box
                data-id="003198"
                alignItems="center"
                justifyContent="center"
                onClick={() => {
                  setIsSearchBarOpen(false);
                  setSearchText('');
                  onSearchDrawerClose();
                }}
                cursor="pointer"
                ml={2}>
                <CloseDrawerIcon data-id="003199"  />
              </Box>
            </DrawerHeader>
            <DrawerBody
              data-id="003200"
              p={4}
              h="100%"
              display="flex"
              flexDirection="column"
              overflow="hidden">
              <Box data-id="003201" flex={1} overflowY="auto" overflowX="hidden" w="100%">
                <MobileSearchResults
                  data-id="003202"
                  searchResults={searchResults}
                  searchText={searchText}
                  searchLoading={searchLoading}
                  searchError={searchError}
                  hasSearched={hasSearched}
                  module={module}
                  auditSearchItems={auditSearchItems}
                  trackerSearchItems={trackerSearchItems}
                  recentSearches={recentSearches}
                  recentSearchesLoading={recentSearchesLoading}
                  onResultClick={(result) => {
                    // Navigation will be handled by SearchBar's handleSearchResultClick
                    setIsSearchBarOpen(false);
                    onSearchDrawerClose();
                  }}
                  onRecentSearchClick={(recentSearch) => {
                    // Update search text immediately for instant UI feedback
                    setSearchText(recentSearch.text);
                  }} />
              </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </Flex>
  );
}

function NavigationTopWithContext(props) {
  // NavigationTopProvider is now at the layout level, so we don't need to wrap here
  return <NavigationTop data-id="000473" {...props} />;
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
