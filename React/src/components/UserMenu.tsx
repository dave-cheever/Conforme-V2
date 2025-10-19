import { ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar, Box, Flex, Icon, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure, Divider } from '@chakra-ui/react';

import { userMenus } from '../bootstrap/config';
import { useAppContext } from '../contexts/AppProvider';
import useLogout from '../hooks/useLogout';
import useNavigate from '../hooks/useNavigate';
import { isPermitted } from './can';
import { DocumentIcon, HelpSupportIcon, LogoutIcon, NotificationIcon, ShieldIcon,  } from '../icons';

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
            <Box data-id="000523" display={['none', 'block']} minW="0" textAlign={'start'}>
              <Text color={'black'} data-id="000524" fontSize={['12px', '14px']} fontWeight="600" isTruncated>
                {user?.displayName}
              </Text>
              <Text color="#718096" data-id="000525" fontSize="13px" isTruncated lineHeight={0.8}>
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
            <Text data-id="002488" fontSize="16px" fontWeight="600" color="gray.800" mb="4px">
              {user?.displayName}
            </Text>
            <Text data-id="002489" fontSize="14px" color="#718096" mb="8px">
              {user?.jobTitle}
            </Text>
          </Flex>

          {/* Module Roles Box */}
          <Box data-id="002490" bg="#EDF2F7" borderRadius="8px" p="12px" mb="8px">
            {organizationConfig?.modules?.map((module, index) => (
              <Text
                data-id="002491"
                key={module._id}
                fontSize="12px"
                color="#1458EA"
                fontWeight="500"
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
                {isFirstItem && <Divider data-id="002493" borderColor="#CBD5E0" mx="4px" mb="2px" />}
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
                  <Flex data-id="002494" align="center" w="full">
                    {IconComponent && <Icon data-id="002495" as={IconComponent} boxSize="16px" color="#4A5568" mr="12px" />}
                    <Text data-id="002496" color="#2D3748" fontSize="16px" fontWeight="500">
                      {label}
                    </Text>
                  </Flex>
                </MenuItem>
                {isFirstItem && <Divider data-id="002497" borderColor="#CBD5E0" mx="4px" mb="4px" />}
              </Box>
            );
          })}

        <Divider data-id="002498" borderColor="#CBD5E0" mx="2px" my="4px" />

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
          <Flex data-id="002499" align="center" w="full">
            <Icon data-id="002500" as={LogoutIcon} boxSize="16px" color="red.500" mr="12px" />
            <Text data-id="002501" color="red.500" fontSize="14px" fontWeight="500">
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
