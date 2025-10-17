import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Flex, VStack } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import useDevice from '../hooks/useDevice';
import {
  CompanyLogo,
  BackgroundImage,
  UserAvatar,
  useAuthErrorHandling,
  useAuthLogin
} from '../utils/auth-pages-common';

function Logout() {
  const { organizationConfig } = useAppContext();
  const device = useDevice();
  const navigate = useNavigate();

  // Use shared hooks
  useAuthErrorHandling();

  const redirectToLogin = () => {
    localStorage.removeItem('logOutUser');
    navigate('/login');
  };

  const user = useMemo(() => {
    const logOutUser = localStorage.getItem('logOutUser');

    if (!logOutUser) return null;

    try {
      const expiresAt = new Date(JSON.parse(logOutUser)?.expiresAt).getTime();
      if (expiresAt < new Date().getTime()) {
        localStorage.removeItem('logOutUser');
        return null;
      }
      return JSON.parse(logOutUser);
    } catch (error) {
      return null;
    }
  }, []);

  useEffect(() => {
    if (user === null && user !== undefined) return redirectToLogin();
  }, [user]);

  const { login } = useAuthLogin();


  return (
    <Flex
        bg="logoutPage.bg"
        data-id="000226"
        flexDir={['column', 'column', 'row']}
        h="100vh"
        w="full"
        position="relative">
      <CompanyLogo isMobile={device === 'mobile'} />
      <Flex
        align="center"
        data-id="000227"
        h="full"
        justify="center"
        order={[2, 2, 1]}
        w={['full', 'full', '45%']}>
        <VStack align="center" data-id="000228" spacing={5} textAlign="center">
          <Flex
            color="logoutPage.organizationNameColor"
            data-id="000229"
            fontSize="24px"
            fontWeight="bold"
            lineHeight="41px"
            mb={3}
            noOfLines={2}
            textOverflow="ellipsis"
            w="240px">
            {organizationConfig?.name}
          </Flex>
          <UserAvatar
            user={user}
            borderColor="logoutPage.avatarBorderColor"
            dataId="000230" />
          <Flex align="center" data-id="000232" flexDir="column">
            <Flex data-id="000233" fontSize="16px" fontWeight="700">
              You have logged out.
            </Flex>
            <Flex
              color="logoutPage.descriptionColor"
              data-id="000234"
              fontSize="11px"
              mt="2">
              It's a good idea to close all browser windows.
            </Flex>
          </Flex>
          <Button
            _hover={{ opacity: 0.8 }}
            bg="loginPage.button.bg"
            borderRadius="10px"
            color="loginPage.button.color"
            data-id="000235"
            fontSize="14px"
            h="40px"
            lineHeight="18px"
            onClick={login}
            w="204px">
            Log back in
          </Button>
          <Flex
            align="center"
            color="logoutPage.descriptionColor"
            data-id="000236"
            flexDir="column"
            fontSize="11px">
            <Flex data-id="000237">Not {user?.firstName || user?.displayName}?</Flex>
            <Flex
              _hover={{ bg: 'logoutPage.hoverColor' }}
              cursor="pointer"
              data-id="000238"
              onClick={redirectToLogin}>
              Login as someone else
            </Flex>
          </Flex>
        </VStack>
      </Flex>
      <Flex
        align="center"
        data-id="000239"
        h="full"
        justify={['center', 'center', 'flex-end']}
        order={[1, 1, 2]}
        w={['full', 'full', '70%']}>
         <Box data-id="000240" h={['30vh', '40vh', '95vh']} overflow="hidden">
           <BackgroundImage 
             dataId="000241"
             maxW="max-content"
           />
         </Box>
      </Flex>
    </Flex>
  );
}

export default Logout;

export const logoutPageStyles = {
  logoutPage: {
    bg: '#f5f5f5',
    organizationNameColor: '#282F36',
    avatarBorderColor: '#6d649845',
    descriptionColor: '#818197',
    hoverColor: '#462AC4',
    button: {
      bg: 'purpleHeart',
      color: 'white',
    },
  },
};
