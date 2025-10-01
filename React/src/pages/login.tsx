import { useEffect, useState } from 'react';

import { Avatar, Box, Button, Flex, Image, Text, useToast, VStack } from '@chakra-ui/react';

import { toastFailed } from '../bootstrap/config';
import { useAppContext } from '../contexts/AppProvider';
import useDevice from '../hooks/useDevice';
import SignInButton from '../icons/SignInButton';
import authClient from '../utils/auth-client';
import { runtimeEnv } from '../utils/runtime-env';

function Login() {
  const toast = useToast();
  const params = window.location.search.split('&');
  const { organizationConfig, user } = useAppContext();
  const device = useDevice();
  const [refresh, setRefresh] = useState(false);

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

  const removeUser = () => {
    window.open(`https://login.microsoftonline.com/common/oauth2/v2.0/logout`, '_blank');
    localStorage.removeItem('logOutUser');
    setRefresh(!refresh);
  };

  return (
    <Flex
        bg="loginPage.bg"
        data-id="000207"
        flexDir={['column', 'column', 'row']}
        h="100vh"
        w="full">
      {user ? (
        <Flex
          align="center"
          data-id="000208"
          h="full"
          justify={['center', 'center', 'flex-end']}
          order={[2, 2, 1]}
          w={['full', 'full', '45%']}>
          <VStack align="center" data-id="000209" spacing={5} textAlign="center">
            <Flex
              color="loginPage.organizationNameColor"
              data-id="000210"
              fontSize="40px"
              fontWeight="bold"
              mb={3}
              noOfLines={2}
              textOverflow="ellipsis"
              w="full"
            >
              {organizationConfig?.name}
            </Flex>
            <Flex
              bg="white"
              borderColor="loginPage.avatarBorderColor"
              borderWidth="10px"
              data-id="000211"
              rounded="full">
              <Avatar
                borderColor="white"
                borderWidth="4px"
                data-id="000212"
                h="75px"
                name={user?.displayName?.replace(/\s*\(.*?\)\s*/g, '')} 
                src={user?.imgUrl}
                w="75px" />
            </Flex>
            <Button
              _hover={{ bg: 'loginPage.hoverColor' }}
              bg="loginPage.button.bg"
              borderRadius="10px"
              color="loginPage.button.color"
              data-id="000213"
              fontSize="14px"
              h="40px"
              lineHeight="18px"
              onClick={login}
              w="min-content">
              Login as {user?.firstName || user?.displayName}
            </Button>
            <Flex
              align="center"
              color="loginPage.descriptionColor"
              data-id="000214"
              flexDir="column"
              fontSize="11px">
              <Flex data-id="000215">Not {user?.firstName || user?.displayName}?</Flex>
              <Flex
                _hover={{ color: 'loginPage.hoverColor' }}
                cursor="pointer"
                data-id="000216"
                onClick={removeUser}>
                Login as someone else
              </Flex>
            </Flex>
          </VStack>
        </Flex>
      ) : (
        <Flex
          align="center"
          data-id="000217"
          h="full"
          justify={['center', 'center', 'flex-end']}
          order={[2, 2, 1]}
          w={['full', 'full', '45%']}>
          <Flex
            data-id="000218"
            flexDir="column"
            textAlign="center">
            <Text
              color="loginPage.organizationNameColor"
              data-id="000219"
              fontSize="40px"
              fontWeight="bold"
              lineHeight="41px"
              mb="40px"
              noOfLines={2}
              px="8"
              textOverflow="ellipsis"
              w="full"
            >
              {organizationConfig?.name}
            </Text>
            <Flex data-id="000220" justify="center">
              <SignInButton
                cursor="pointer"
                data-id="000221"
                h="41px"
                onClick={login}
                w="215px" />
            </Flex>
          </Flex>
        </Flex>
      )}
      <Flex
        align="center"
        data-id="000222"
        h="full"
        justify={['center', 'center', 'flex-end']}
        order={[1, 1, 2]}
        w={['full', 'full', '70%']}>
        <Box data-id="000223" h={['30vh', '40vh', '95vh']} overflow="hidden">
          <Image
            data-id="000224"
            fit="contain"
            h="full"
            maxW="1000px"
            src={device === 'desktop' ? organizationConfig?.bgImageUrl : organizationConfig?.bgImageTabletUrl} />
        </Box>
      </Flex>
    </Flex>
  );
}

export default Login;

export const loginPageStyles = {
  loginPage: {
    bg: '#f5f5f5',
    organizationNameColor: '#282F36',
    avatarBorderColor: '#6d649845',
    descriptionColor: '#818197',
    hoverColor: '#462AC4',
    button: {
      bg: '#462AC4',
      color: 'white',
    },
  },
};
