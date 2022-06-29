import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Avatar, Box, Button, Flex, Image, Text, useToast, VStack } from '@chakra-ui/react';

import { toastFailed } from '../bootstrap/config';
import { useAppContext } from '../contexts/AppProvider';
import useDevice from '../hooks/useDevice';
import { ArrowRight } from '../icons';

type StateProps = {
  redirectUrl: string;
};

const Login = () => {
  const toast = useToast();
  const params = window.location.search.split('&');
  const { organizationConfig } = useAppContext();
  const device = useDevice();
  const [refresh, setRefresh] = useState(false);
  const { state } = useLocation<StateProps>();

  useEffect(() => {
    if (state && state.redirectUrl !== '/' && state.redirectUrl) {
      localStorage.setItem('redirectUrl', state.redirectUrl);
      state.redirectUrl = '/';
    }
  }, [state]);

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
  }, [refresh]);

  const redirectUrl = params.find((str) => str.includes('redirectUrl'))?.split('=')[1];
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

  const loginWithAzureAD = async () => {
    window.open(`${process.env.REACT_APP_API_URL}/auth/aad${redirectUrl ? `?redirect=${redirectUrl}` : ''}`, '_self');
  };

  const removeUser = () => {
    localStorage.removeItem('logOutUser');
    setRefresh(!refresh);
  };

  return (
    <Flex bg="loginPage.bg" flexDir={['column', 'column', 'row']} h="100vh" w="full">
      {user ? (
        <Flex align="center" h="full" justify={['center', 'center', 'flex-end']} order={[2, 2, 1]} w={['full', 'full', '30%']}>
          <VStack align="center" spacing={5} textAlign="center">
            <Flex
              color="loginPage.organizationNameColor"
              fontSize="24px"
              fontWeight="bold"
              lineHeight="41px"
              mb={3}
              noOfLines={2}
              textOverflow="ellipsis"
              w="240px"
            >
              {organizationConfig?.name}
            </Flex>
            <Flex bg="white" borderColor="loginPage.avatarBorderColor" borderWidth="10px" rounded="full">
              <Avatar borderColor="white" borderWidth="4px" h="75px" name={user?.displayName} src={user?.imgUrl} w="75px" />
            </Flex>
            <Button
              _hover={{ bg: 'loginPage.hoverColor' }}
              bg="loginPage.button.bg"
              borderRadius="10px"
              color="loginPage.button.color"
              fontSize="14px"
              h="40px"
              lineHeight="18px"
              onClick={loginWithAzureAD}
              w="204px"
            >
              Login as {user?.firstName}
            </Button>
            <Flex align="center" color="loginPage.descriptionColor" flexDir="column" fontSize="11px">
              <Flex>Not {user?.firstName}?</Flex>
              <Flex _hover={{ color: 'loginPage.hoverColor' }} cursor="pointer" onClick={removeUser}>
                Login as someone else
              </Flex>
            </Flex>
          </VStack>
        </Flex>
      ) : (
        <Flex align="center" h="full" justify={['center', 'center', 'flex-end']} order={[2, 2, 1]} w={['full', 'full', '30%']}>
          <Flex flexDir="column" textAlign={['center', 'center', 'start']}>
            <Text
              color="loginPage.organizationNameColor"
              fontSize="36px"
              fontWeight="bold"
              lineHeight="41px"
              mb="50px"
              noOfLines={2}
              textOverflow="ellipsis"
              w="240px"
            >
              {organizationConfig?.name}
            </Text>
            <Button
              _hover={{ bg: 'loginPage.hoverColor' }}
              bg="loginPage.button.bg"
              borderRadius="10px"
              color="loginPage.button.color"
              fontSize="14px"
              h="40px"
              lineHeight="18px"
              onClick={loginWithAzureAD}
              rightIcon={<ArrowRight mt={1} />}
              w="240px"
            >
              Login with Azure AD
            </Button>
          </Flex>
        </Flex>
      )}
      <Flex align="center" h="full" justify={['center', 'center', 'flex-end']} order={[1, 1, 2]} w={['full', 'full', '70%']}>
        <Box h={['30vh', '40vh', '95vh']} overflow="hidden">
          <Image
            h="full"
            maxW="max-content"
            src={device === 'desktop' ? organizationConfig?.bgImageUrl : organizationConfig?.bgImageTabletUrl}
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Login;

export const loginPageStyles = {
  loginPage: {
    bg: '#E5E5E5',
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
