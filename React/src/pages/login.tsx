import { useEffect, useState } from 'react';

import { Avatar, Box, Button, Flex, Image, Text, useToast, VStack } from '@chakra-ui/react';

import { toastFailed } from '../bootstrap/config';
import { useAppContext } from '../contexts/AppProvider';
import useDevice from '../hooks/useDevice';
import SignInButton from '../icons/SignInButton';
import authClient from '../utils/auth-client';

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
      callbackURL: process.env.REACT_APP_CLIENT_URL,
    }, loginOptions)

  }

  const removeUser = () => {
    window.open(`https://login.microsoftonline.com/common/oauth2/v2.0/logout`, '_blank');
    localStorage.removeItem('logOutUser');
    setRefresh(!refresh);
  };

  return (
    <Flex
        data-id="030925-218b43"
        bg="loginPage.bg"
        flexDir={['column', 'column', 'row']}
        h="100vh"
        w="full">
      {user ? (
        <Flex
          data-id="030925-d6ae92"
          align="center"
          h="full"
          justify={['center', 'center', 'flex-end']}
          order={[2, 2, 1]}
          w={['full', 'full', '45%']}>
          <VStack data-id="030925-d5ce6b" align="center" spacing={5} textAlign="center">
            <Flex
              data-id="030925-092528"
              color="loginPage.organizationNameColor"
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
              data-id="030925-743a1f"
              bg="white"
              borderColor="loginPage.avatarBorderColor"
              borderWidth="10px"
              rounded="full">
              <Avatar
                data-id="030925-3161e0"
                borderColor="white"
                borderWidth="4px"
                h="75px"
                name={user?.displayName?.replace(/\s*\(.*?\)\s*/g, '')} 
                src={user?.imgUrl}
                w="75px" />
            </Flex>
            <Button
              data-id="030925-9d3c97"
              _hover={{ bg: 'loginPage.hoverColor' }}
              bg="loginPage.button.bg"
              borderRadius="10px"
              color="loginPage.button.color"
              fontSize="14px"
              h="40px"
              lineHeight="18px"
              onClick={login}
              w="min-content">
              Login as {user?.firstName || user?.displayName}
            </Button>
            <Flex
              data-id="030925-1d6441"
              align="center"
              color="loginPage.descriptionColor"
              flexDir="column"
              fontSize="11px">
              <Flex data-id="030925-29df01">Not {user?.firstName || user?.displayName}?</Flex>
              <Flex
                data-id="030925-948135"
                _hover={{ color: 'loginPage.hoverColor' }}
                cursor="pointer"
                onClick={removeUser}>
                Login as someone else
              </Flex>
            </Flex>
          </VStack>
        </Flex>
      ) : (
        <Flex
          data-id="030925-1c4ba4"
          align="center"
          h="full"
          justify={['center', 'center', 'flex-end']}
          order={[2, 2, 1]}
          w={['full', 'full', '45%']}>
          <Flex
            data-id="030925-7baac8"
            flexDir="column"
            textAlign="center">
            <Text
              data-id="030925-9ca36d"
              color="loginPage.organizationNameColor"
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
            <Flex data-id="030925-22c0bc" justify="center">
              <SignInButton
                data-id="030925-6cc519"
                cursor="pointer"
                h="41px"
                onClick={login}
                w="215px" />
            </Flex>
          </Flex>
        </Flex>
      )}
      <Flex
        data-id="030925-b30824"
        align="center"
        h="full"
        justify={['center', 'center', 'flex-end']}
        order={[1, 1, 2]}
        w={['full', 'full', '70%']}>
        <Box data-id="030925-da85c1" h={['30vh', '40vh', '95vh']} overflow="hidden">
          <Image
            data-id="030925-f5ddf3"
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
