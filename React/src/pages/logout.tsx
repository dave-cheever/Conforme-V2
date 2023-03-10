import { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { Avatar, Box, Button, Flex, Image, useToast, VStack } from '@chakra-ui/react';

import { toastFailed } from '../bootstrap/config';
import { useAppContext } from '../contexts/AppProvider';
import useDevice from '../hooks/useDevice';

const Logout = () => {
  const toast = useToast();
  const params = window.location.search.split('&');
  const { organizationConfig } = useAppContext();
  const device = useDevice();
  const history = useHistory();

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

  const redirectToLogin = () => {
    localStorage.removeItem('logOutUser');
    history.push('/login');
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

  const loginWithAzureAD = async () => {
    localStorage.removeItem('logOutUser');
    window.open(`${process.env.REACT_APP_API_URL}/auth/aad${redirectUrl ? `?redirect=${redirectUrl}` : ''}`, '_self');
  };

  return (
    (<Flex
      bg="logoutPage.bg"
      data-id="8cf5035b1e6f"
      flexDir={['column', 'column', 'row']}
      h="100vh"
      w="full">
      <Flex
        align="center"
        data-id="c185b1154d3f"
        h="full"
        justify={['center', 'center', 'flex-end']}
        order={[2, 2, 1]}
        w={['full', 'full', '30%']}>
        <VStack align="center" data-id="0ca724a19757" spacing={5} textAlign="center">
          <Flex
            color="logoutPage.organizationNameColor"
            data-id="da9607079078"
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
            bg="white"
            borderColor="logoutPage.avatarBorderColor"
            borderWidth="10px"
            data-id="2d478dbc599c"
            rounded="full">
            <Avatar
              borderColor="white"
              borderWidth="4px"
              data-id="a6ccca234009"
              h="75px"
              name={user?.displayName}
              src={user?.imgUrl}
              w="75px" />
          </Flex>
          <Flex align="center" data-id="b07478a130ed" flexDir="column">
            <Flex data-id="433c2d92c8c0" fontSize="16px" fontWeight="700">
              You have logged out.
            </Flex>
            <Flex
              color="logoutPage.descriptionColor"
              data-id="9f3198f94140"
              fontSize="11px"
              mt="2">
              It's a good idea to close all browser windows.
            </Flex>
          </Flex>
          <Button
            bg="loginPage.button.bg"
            borderRadius="10px"
            color="loginPage.button.color"
            data-id="a53e069021d6"
            fontSize="14px"
            h="40px"
            lineHeight="18px"
            onClick={loginWithAzureAD}
            w="204px">
            Log back in
          </Button>
          <Flex
            align="center"
            color="logoutPage.descriptionColor"
            data-id="b86e8c5b33f9"
            flexDir="column"
            fontSize="11px">
            <Flex data-id="06d861f1e5c2">Not {user?.firstName || user?.displayName}?</Flex>
            <Flex
              _hover={{ bg: 'logoutPage.hoverColor' }}
              cursor="pointer"
              data-id="a16af33aa8b0"
              onClick={redirectToLogin}>
              Login as someone else
            </Flex>
          </Flex>
        </VStack>
      </Flex>
      <Flex
        align="center"
        data-id="f4c08ddcc3c5"
        h="full"
        justify={['center', 'center', 'flex-end']}
        order={[1, 1, 2]}
        w={['full', 'full', '70%']}>
        <Box data-id="ba7c8d775918" h={['30vh', '40vh', '95vh']} overflow="hidden">
          <Image
            data-id="395cfa90c69f"
            h="full"
            maxW="max-content"
            src={device === 'desktop' ? organizationConfig?.bgImageUrl : organizationConfig?.bgImageTabletUrl} />
        </Box>
      </Flex>
    </Flex>)
  );
};

export default Logout;

export const logoutPageStyles = {
  logoutPage: {
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
