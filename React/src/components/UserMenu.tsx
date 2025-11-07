import { ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar, Box, Divider, Flex, Icon, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure } from '@chakra-ui/react';

import { userMenus } from '../bootstrap/config';
import { useAppContext } from '../contexts/AppProvider';
import useLogout from '../hooks/useLogout';
import useNavigate from '../hooks/useNavigate';
import { DocumentIcon, HelpSupportIcon, LogoutIcon, NotificationIcon, ShieldIcon } from '../icons';
import { isPermitted } from './can';

function UserMenu() {
  const { user, organizationConfig } = useAppContext();
  const { navigateTo } = useNavigate();
  const logout = useLogout();
  const { onOpen, onClose, isOpen } = useDisclosure();

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

  return (
    <Menu data-id="000518" isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
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
            <Box data-id="000523" display={['none', 'block']} minW="0" textAlign={'start'} pt={"2px"}>
              <Text color={'black'} data-id="000524" fontSize={['12px', '14px']} fontWeight="600" isTruncated lineHeight="16px">
                {user?.displayName}
              </Text>
              <Text color="#718096" data-id="000525" fontSize="13px" isTruncated lineHeight="15px" >
                {user?.jobTitle ? user.jobTitle.charAt(0).toUpperCase() + user.jobTitle.slice(1) : ''}
              </Text>
            </Box>
            <Icon as={ChevronDownIcon} boxSize={5} color="gray.500" data-id="000526" m={[0, 4]} />
          </Flex>
        </Flex>
      </MenuButton>
      <MenuList
        bg="white"
        border="none"
        borderRadius="12px"
        boxShadow="0px 4px 20px rgba(0, 0, 0, 0.15)"
        data-id="000527"
        minW="280px"
        mr={3}
        mt="-10px"
        p="16px"
        textAlign="left"
      >
        {/* User Information Section */}
        <Box data-id="002486" mb="12px">
          <Flex data-id="002487" display={['flex', 'none']} flexDirection="column">
            <Text color="gray.800" data-id="002488" fontSize="16px" fontWeight="600" mb="4px">
              {user?.displayName}
            </Text>
            <Text color="#718096" data-id="002489" fontSize="14px" mb="8px">
              {user?.jobTitle}
            </Text>
          </Flex>

          {/* Module Roles Box */}
          <Box bg="#EDF2F7" borderRadius="8px" data-id="002490" mb="8px" p="12px">
            {organizationConfig?.modules?.map((module, index) => (
              <Text
                color="#1458EA"
                data-id="002491"
                fontSize="12px"
                fontWeight="500"
                key={module._id}
                mb={index < (organizationConfig?.modules?.length || 0) - 1 ? '4px' : '0'}
              >
                {module.name} - Admin
              </Text>
            ))}
          </Box>
        </Box>

        {userMenus
          .filter((userMenu) => !(userMenu as any).permission || isPermitted({ user, action: (userMenu as any).permission }))
          .map(({ label, url, icon }, index) => {
            const IconComponent = getIconComponent(icon);
            const isFirstItem = index === 0;

            return (
              <Box data-id="002492" key={label}>
                {isFirstItem && <Divider borderColor="#CBD5E0" data-id="002493" mb="2px" mx="4px" />}
                <MenuItem
                  _hover={{ bg: 'gray.50' }}
                  bg="transparent"
                  borderRadius="8px"
                  cursor="pointer"
                  data-id="000530"
                  fontSize="14px"
                  fontWeight="500"
                  h="40px"
                  onClick={() => pageRedirect(url)}
                  px="4px"
                  py="8px"
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
        >
          <Flex align="center" data-id="002499" w="full">
            <Icon as={LogoutIcon} boxSize="16px" color="red.500" data-id="002500" mr="12px" />
            <Text color="red.500" data-id="002501" fontSize="14px" fontWeight="500">
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
