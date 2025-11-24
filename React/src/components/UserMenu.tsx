import { useEffect, useRef, useState } from 'react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar, Box, Divider, Flex, Icon, Menu, MenuButton, MenuItem, MenuList, Text, Tooltip, useDisclosure } from '@chakra-ui/react';

import { userMenus } from '../bootstrap/config';
import { useAppContext } from '../contexts/AppProvider';
import useLogout from '../hooks/useLogout';
import useNavigate from '../hooks/useNavigate';
import { DocumentIcon, HelpSupportIcon, LogoutIcon, NotificationIcon, ShieldIcon } from '../icons';
import { isPermitted } from './can';

// Component that shows tooltip only when text is truncated
function TruncatedTextWithTooltip({ 
  children, 
  label, 
  placement = 'top',
  ...textProps 
}: Readonly<{ 
  readonly children: string;
  readonly label: string;
  readonly placement?: 'top' | 'bottom';
  readonly [key: string]: any;
}>) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        // For single-line text, check scrollWidth vs clientWidth
        const isOverflowing = textRef.current.scrollWidth > textRef.current.clientWidth;
        setIsTruncated(isOverflowing);
      }
    };

    checkTruncation();
    // Recheck on window resize
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [children]);

  const textElement = (
    <Text data-id="003169" ref={textRef} {...textProps}>
      {children}
    </Text>
  );

  if (isTruncated) {
    return (
      <Tooltip data-id="003170" label={label} placement={placement} hasArrow>
        {textElement}
      </Tooltip>
    );
  }

  return textElement;
}

function UserMenu() {
  const { user, organizationConfig } = useAppContext();
  const { navigateTo } = useNavigate();
  const logout = useLogout();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const menuListRef = useRef<HTMLDivElement>(null);

  const pageRedirect = (page: string) => {
    navigateTo(page);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'NotificationIcon':
        return NotificationIcon;
      case 'DocumentIcon':
        return DocumentIcon;
      case 'ShieldIcon':
        return ShieldIcon;
      case 'HelpSupportIcon':
        return HelpSupportIcon;
      case 'LogoutIcon':
        return LogoutIcon;
      default:
        return null;
    }
  };

  // Get all menu items (excluding dividers and non-interactive elements)
  const filteredMenus = userMenus.filter(
    (userMenu) => !(userMenu as any).permission || isPermitted({ user, action: (userMenu as any).permission }),
  );
  const totalMenuItems = filteredMenus.length + 1; // +1 for logout item

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen || !menuListRef.current) return;

    const menuList = menuListRef.current;
    const menuItems = menuList.querySelectorAll<HTMLElement>('[role="menuitem"]');
    
    if (menuItems.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const menuItemsArray = Array.from(menuItems);
      const activeElement = document.activeElement as HTMLElement | null;
      const currentIndex = activeElement ? menuItemsArray.indexOf(activeElement) : -1;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
        menuItems[nextIndex]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
        menuItems[prevIndex]?.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        menuItems[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        menuItems[menuItems.length - 1]?.focus();
      }
    };

    menuList.addEventListener('keydown', handleKeyDown);

    // Focus first menu item when menu opens
    if (menuItems.length > 0) {
      setTimeout(() => {
        menuItems[0]?.focus();
      }, 0);
    }

    return () => {
      menuList.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, totalMenuItems]);

  return (
    <Menu data-id="000518" isOpen={isOpen} onClose={onClose} onOpen={onOpen} closeOnSelect={true}>
      <MenuButton color="white" data-id="000519">
        <Flex align="center" data-id="000520" justify="space-between" w="100%">
          {/* Avatar and text */}
          <Flex align="center" data-id="000521" m={3}>
            <Avatar
              bg="userMenu.avatar.bg"
              borderColor={isOpen ? 'userMenu.avatar.borderColorOpened' : 'userMenu.avatar.borderColor'}
              borderRadius={'8px'}
              borderWidth="5px"
              color="userMenu.avatar.color"
              data-id="000522"
              h="40px"
              mr={1}
              name={user?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
              size="sm"
              src={user?.imgUrl}
              w="40px"
            />
            <Box data-id="000523" display={['none', 'block']} minW="0" maxW="150px" textAlign={'start'} pt={"2px"}>
              <TruncatedTextWithTooltip
                label={user?.displayName || ''}
                placement="bottom"
                color={'black'}
                data-id="000524"
                fontSize={['12px', '14px']}
                fontWeight="600"
                isTruncated
                lineHeight="16px"
                noOfLines={1}>
                {user?.displayName || ''}
              </TruncatedTextWithTooltip>
              {user?.jobTitle && (
                <TruncatedTextWithTooltip
                  label={user.jobTitle.charAt(0).toUpperCase() + user.jobTitle.slice(1)}
                  placement="bottom"
                  color="#718096"
                  data-id="000525"
                  fontSize="13px"
                  isTruncated
                  lineHeight="15px"
                  noOfLines={1}>
                  {user.jobTitle.charAt(0).toUpperCase() + user.jobTitle.slice(1)}
                </TruncatedTextWithTooltip>
              )}
            </Box>
            <Icon as={ChevronDownIcon} boxSize={5} color="gray.500" data-id="000526" m={[0, 4]} />
          </Flex>
        </Flex>
      </MenuButton>
      <MenuList
        ref={menuListRef}
        bg="white"
        border="none"
        borderRadius="12px"
        boxShadow="0px 4px 20px rgba(0, 0, 0, 0.15)"
        data-id="000527"
        maxW="280px"
        minW="280px"
        mr={3}
        mt="-10px"
        p="16px"
        textAlign="left"
        role="menu"
        w="280px"
      >
        {/* User Information Section */}
        <Box data-id="002486" mb="12px" w="100%" overflow="hidden">
          <Flex data-id="002487" display={['flex', 'none']} flexDirection="column" w="100%">
            <TruncatedTextWithTooltip
              label={user?.displayName || ''}
              placement="top"
              color="gray.800"
              data-id="002488"
              fontSize="16px"
              fontWeight="600"
              mb="4px"
              isTruncated
              noOfLines={1}>
              {user?.displayName || ''}
            </TruncatedTextWithTooltip>
            {user?.jobTitle && (
              <TruncatedTextWithTooltip
                label={user.jobTitle}
                placement="top"
                color="#718096"
                data-id="002489"
                fontSize="14px"
                mb="8px"
                isTruncated
                noOfLines={1}>
                {user.jobTitle}
              </TruncatedTextWithTooltip>
            )}
          </Flex>

          {/* Module Roles Box */}
          <Box bg="#EDF2F7" borderRadius="8px" data-id="002490" mb="8px" p="12px" w="100%" overflow="hidden">
            {organizationConfig?.modules?.map((module, index) => {
              const roleText = `${module.name} - Admin`;
              return (
                <Box
                  data-id="003171"
                  key={module._id}
                  mb={index < (organizationConfig?.modules?.length || 0) - 1 ? '4px' : '0'}
                  w="100%"
                  overflow="hidden">
                  <TruncatedTextWithTooltip
                    label={roleText}
                    placement="top"
                    color="#1458EA"
                    data-id="002491"
                    display="block"
                    fontSize="12px"
                    fontWeight="500"
                    isTruncated
                    noOfLines={1}
                    w="100%">
                    {roleText}
                  </TruncatedTextWithTooltip>
                </Box>
              );
            })}
          </Box>
        </Box>

        {filteredMenus.map(({ label, url, icon }, index) => {
          const IconComponent = getIconComponent(icon);
          const isFirstItem = index === 0;

          return (
            <Box data-id="002492" key={label}>
              {isFirstItem && <Divider borderColor="#CBD5E0" data-id="002493" mb="2px" mx="4px" />}
              <MenuItem
                _focus={{ bg: 'gray.50', outline: 'none' }}
                _hover={{ bg: 'gray.50' }}
                bg="transparent"
                borderRadius="8px"
                cursor="pointer"
                data-id="000530"
                fontSize="16px"
                fontWeight="500"
                h="40px"
                onClick={() => pageRedirect(url)}
                px="4px"
                py="8px"
                tabIndex={0}
              >
                <Flex align="center" data-id="002494" w="full">
                  {IconComponent && <Icon as={IconComponent} boxSize="16px" color="#4A5568" data-id="002495" mr="12px" />}
                  <Text color="#2D3748" data-id="002496" fontSize="16px" fontWeight="500">
                    {label}
                  </Text>
                </Flex>
              </MenuItem>
              {isFirstItem && <Divider borderColor="#CBD5E0" data-id="002497" mb="4px" mx="4px" />}
            </Box>
          );
        })}

        <Divider borderColor="#CBD5E0" data-id="002498" mx="2px" my="4px" />

        <MenuItem
          _focus={{ bg: 'red.50', outline: 'none' }}
          _hover={{ bg: 'red.50' }}
          bg="transparent"
          borderRadius="8px"
          cursor="pointer"
          data-id="000531"
          fontSize="14px"
          fontWeight="500"
          h="40px"
          onClick={logout}
          px="4px"
          py="8px"
          tabIndex={0}
        >
          <Flex align="center" data-id="002499" w="full">
            <Icon as={LogoutIcon} boxSize="16px" color="#D0021B" data-id="002500" mr="12px" />
            <Text color="#D0021B" data-id="002501" fontSize="16px" fontWeight="500">
              Logout
            </Text>
          </Flex>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default UserMenu;

export const userMenuStyles = {
  userMenu: {
    text: '#818197',
    borderColor: '#F0F0F0',
    hoverColor: '#462AC4',
    avatar: {
      color: 'white',
      bg: '#462AC4',
      borderColor: 'white',
      // borderColorOpened: '#E93C44',
    },
  },
};
