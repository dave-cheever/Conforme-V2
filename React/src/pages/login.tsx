import { useState } from 'react';

import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import useDevice from '../hooks/useDevice';
import SignInButton from '../icons/SignInButton';
import {
  CompanyLogo,
  BackgroundImage,
  UserAvatar,
  useAuthErrorHandling,
  useAuthLogin
} from '../utils/auth-pages-common';

function Login() {
  const { organizationConfig, user } = useAppContext();
  const device = useDevice();
  const [refresh, setRefresh] = useState(false);

  // Use shared hooks
  useAuthErrorHandling();
  const { login } = useAuthLogin();

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
        w="full"
        position="relative">
      <CompanyLogo isMobile={device === 'mobile'} />
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
            <UserAvatar
              user={user}
              borderColor="loginPage.avatarBorderColor"
              dataId="000211" />
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
           <BackgroundImage 
             dataId="000224"
             maxW="1000px"
             fit="contain"
           />
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
