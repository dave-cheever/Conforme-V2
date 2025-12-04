import { useState } from 'react';

import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import useDevice from '../hooks/useDevice';
import { MicrosoftIcon } from '../icons';
import { BackgroundImage, CompanyLogo, useAuthErrorHandling, useAuthLogin, UserAvatar } from '../utils/auth-pages-common';

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
    <Flex bg="loginPage.bg" data-id="000207" flexDir={['column', 'column', 'row']} h="100vh" position="relative" w="full" overflow="hidden">
      <CompanyLogo data-id="002524" isMobile={device === 'mobile'} />
      {user ? (
        <Flex
          align="center"
          data-id="000208"
          h={['auto', 'auto', 'full']}
          justify={['center', 'center', 'flex-end']}
          order={[2, 2, 1]}
          w={['full', 'full', '45%']}
          position={['absolute', 'absolute', 'relative']}
          bottom={[0, 0, 'auto']}
          left={0}
          right={0}
          zIndex={[10, 10, 'auto']}
          bg={['white', 'white', 'transparent']}
          borderTopRadius={['20px', '20px', 0]}
          boxShadow={['0 -6px 30px 0 rgba(0, 0, 0, 0.11)', '0 -6px 30px 0 rgba(0, 0, 0, 0.11)', 'none']}
          pt={[6, 6, 0]}
          pb={[6, 6, 0]}
          px={[4, 4, 0]}
        >
          <VStack align="center" data-id="000209" spacing={5} textAlign="center" w="full" maxW={['full', 'full', '400px']}>
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
            <UserAvatar borderColor="loginPage.avatarBorderColor" data-id="002525" dataId="000211" user={user} />
            <Button
              _hover={{ bg: '#F7FAFC' }}
              bg="white"
              borderColor="#CBD5E0"
              borderWidth="1px"
              borderRadius="10px"
              color="loginPage.organizationNameColor"
              data-id="000213"
              fontSize="14px"
              fontWeight="500"
              h="60px"
              leftIcon={<MicrosoftIcon data-id="003167" />}
              lineHeight="18px"
              onClick={login}
              w="full"
              maxW={['full', 'full', '400px']}
            >
              <Text color="loginPage.organizationNameColor" data-id="000213a" fontSize="16px" fontWeight="600">
                Login as {user?.firstName || user?.displayName}
              </Text>
            </Button>
            <Flex align="center" color="loginPage.descriptionColor" data-id="000214" flexDir="column" fontSize="11px">
              <Flex data-id="000215">Not {user?.firstName || user?.displayName}?</Flex>
              <Flex _hover={{ color: 'loginPage.hoverColor' }} cursor="pointer" data-id="000216" onClick={removeUser}>
                Login as someone else
              </Flex>
            </Flex>
          </VStack>
        </Flex>
      ) : (
        <Flex
          align="center"
          data-id="000217"
          h={['auto', 'auto', 'full']}
          justify={['center', 'center', 'center']}
          order={[2, 2, 1]}
          w={['full', 'full', '35%']}
          position={['absolute', 'absolute', 'relative']}
          bottom={[0, 0, 'auto']}
          left={0}
          right={0}
          zIndex={[10, 10, 'auto']}
          bg={['white', 'white', 'transparent']}
          borderTopRadius={['20px', '20px', 0]}
          boxShadow={['0 -6px 30px 0 rgba(0, 0, 0, 0.11)', '0 -6px 30px 0 rgba(0, 0, 0, 0.11)', 'none']}
          pt={[6, 6, 0]}
          pb={[6, 6, 0]}
          px={[4, 4, 0]}
        >
          <Flex data-id="000218" flexDir="column" textAlign="center">
            <Text
              color="loginPage.organizationNameColor"
              data-id="000219"
              fontSize="26px"
              fontWeight="bold"
              lineHeight="41px"
              mb="18px"
              noOfLines={2}
              px="8"
              textAlign="left"
              textOverflow="ellipsis"
              w="full"
            >
              {organizationConfig?.name}
            </Text>
            <Flex data-id="000220" justify="center" w="full" px="8">
              <Button
                _hover={{ bg: '#F7FAFC' }}
                bg="white"
                borderColor="#CBD5E0"
                borderWidth="1px"
                borderRadius="10px"
                color="loginPage.organizationNameColor"
                cursor="pointer"
                data-id="000221"
                fontSize="14px"
                fontWeight="500"
                h="60px"
                leftIcon={<MicrosoftIcon data-id="003172" />}
                lineHeight="18px"
                onClick={login}
                w="full"
                maxW={['full', 'full', '400px']}
              >
                <Text color="loginPage.organizationNameColor" data-id="000221a" fontSize="16px" fontWeight="600">
                  Login with Microsoft
                </Text>
              </Button>
            </Flex>
          </Flex>
        </Flex>
      )}
      <Flex
        align="stretch"
        data-id="000222"
        h={['100vh', '100vh', '100vh']}
        justify={['center', 'center', 'flex-end']}
        order={[1, 1, 2]}
        w={['full', 'full', '70%']}
        position="relative"
      >
        <Box data-id="000223" h="100%" w="100%" position="relative" overflow="hidden">
          <BackgroundImage data-id="002526" dataId="000224" fit="cover" objectPosition={["center", "center", "left"]} pageType="login" />
        </Box>
      </Flex>
    </Flex>
  );
}

export default Login;

export const loginPageStyles = {
  loginPage: {
    bg: '#ffffff',
    organizationNameColor: '##2D3748',
    avatarBorderColor: '#6d649845',
    descriptionColor: '#818197',
    hoverColor: '#462AC4',
    button: {
      bg: '#462AC4',
      color: 'white',
    },
  },
};
