import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Avatar, Box, Button, Flex, Image, useToast, VStack } from '@chakra-ui/react';

import { toastFailed } from '../bootstrap/config';
import { useAppContext } from '../contexts/AppProvider';
import useDevice from '../hooks/useDevice';
import authClient from '../utils/auth-client';
import { runtimeEnv } from '../utils/runtime-env';

function Logout() {
  const toast = useToast();
  const params = window.location.search.split('&');
  const { organizationConfig } = useAppContext();
  const device = useDevice();
  const navigate = useNavigate();

  // const redirectUrl = params.find((str) => str.includes('redirectUrl'))?.split('=')[1];
  const errorMessage = params.find((str) => str.includes('errorMessage'))?.split('=')[1];

  useEffect(() => {
    if (errorMessage) {
      toast({
        ...toastFailed,
        title: "Couldn't sign in",
        description: decodeURI(errorMessage),
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const login = async () => {
    const loginOptions = {
      onRequest: () => {},
      onSuccess: () => {},
      onError: (ctx) => { toast({ 
        status: 'error',
        title: 'Error',
        description: ctx.message,
      }) },
    }

    authClient.signIn.social({
      provider: "microsoft",
      callbackURL: runtimeEnv.clientUrl(),
    }, loginOptions)

  }

  return (
    <Flex
        data-id="000226"
        bg="logoutPage.bg"
        flexDir={['column', 'column', 'row']}
        h="100vh"
        w="full">
      <Flex
        data-id="000227"
        align="center"
        h="full"
        justify={['center', 'center', 'flex-end']}
        order={[2, 2, 1]}
        w={['full', 'full', '30%']}>
        <VStack data-id="000228" align="center" spacing={5} textAlign="center">
          <Flex
            data-id="000229"
            color="logoutPage.organizationNameColor"
            fontSize="24px"
            fontWeight="bold"
            lineHeight="41px"
            mb={3}
            noOfLines={2}
            textOverflow="ellipsis"
            w="240px">
            {organizationConfig?.name}
          </Flex>
          <Flex
            data-id="000230"
            bg="white"
            borderColor="logoutPage.avatarBorderColor"
            borderWidth="10px"
            rounded="full">
            <Avatar
              data-id="000231"
              borderColor="white"
              borderWidth="4px"
              h="75px"
              name={user?.displayName?.replace(/\s*\(.*?\)\s*/g, '')} 
              src={user?.imgUrl}
              w="75px" />
          </Flex>
          <Flex data-id="000232" align="center" flexDir="column">
            <Flex data-id="000233" fontSize="16px" fontWeight="700">
              You have logged out.
            </Flex>
            <Flex
              data-id="000234"
              color="logoutPage.descriptionColor"
              fontSize="11px"
              mt="2">
              It's a good idea to close all browser windows.
            </Flex>
          </Flex>
          <Button
            data-id="000235"
            _hover={{ opacity: 0.8 }}
            bg="loginPage.button.bg"
            borderRadius="10px"
            color="loginPage.button.color"
            fontSize="14px"
            h="40px"
            lineHeight="18px"
            onClick={login}
            w="204px">
            Log back in
          </Button>
          <Flex
            data-id="000236"
            align="center"
            color="logoutPage.descriptionColor"
            flexDir="column"
            fontSize="11px">
            <Flex data-id="000237">Not {user?.firstName || user?.displayName}?</Flex>
            <Flex
              data-id="000238"
              _hover={{ bg: 'logoutPage.hoverColor' }}
              cursor="pointer"
              onClick={redirectToLogin}>
              Login as someone else
            </Flex>
          </Flex>
        </VStack>
      </Flex>
      <Flex
        data-id="000239"
        align="center"
        h="full"
        justify={['center', 'center', 'flex-end']}
        order={[1, 1, 2]}
        w={['full', 'full', '70%']}>
        <Box data-id="000240" h={['30vh', '40vh', '95vh']} overflow="hidden">
          <Image
            data-id="000241"
            h="full"
            maxW="max-content"
            src={device === 'desktop' ? organizationConfig?.bgImageUrl : organizationConfig?.bgImageTabletUrl} />
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
