import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Avatar, Box, Button, Flex, Text, VStack } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import useDevice from '../hooks/useDevice';
import { MicrosoftIcon } from '../icons';
import { BackgroundImage, CompanyLogo, useAuthErrorHandling, useAuthLogin } from '../utils/auth-pages-common';

function Logout() {
  const { organizationConfig, setUser } = useAppContext();
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

  // Ensure the in-memory user is cleared only once we're on the logout page
  useEffect(() => {
    setUser(null);
  }, [setUser]);

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
      position="relative"
      w="full"
      overflow="hidden"
    >
      <CompanyLogo data-id="002527" isMobile={device === 'mobile'} />
      <Flex
        align="center"
        data-id="000227"
        h={['auto', 'auto', 'full']}
        justify="center"
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
        <VStack align="center" data-id="000228" spacing={5} textAlign="center" w="full" px={[4, 4, 8]} maxW={['full', 'full', '420px']}>
          <Flex
            color="logoutPage.organizationNameColor"
            data-id="000229"
            fontSize={["26px", "40px"]}
            fontWeight="bold"
            lineHeight="41px"
            noOfLines={2}
            textAlign="left"
            textOverflow="ellipsis"
            w="full"
          >
            Welcome back!
          </Flex>

          {/* User Card */}
          <Flex
            align="center"
            bg="white"
            borderColor="#CBD5E0"
            borderWidth="1px"
            borderRadius="8px"
            data-id="000230"
            p={3}
            w="full"
            maxW={['full', 'full', '400px']}
            gap={3}
          >
            <Avatar
              borderColor="white"
              borderWidth="0px"
              borderRadius="8px"
              data-id="000231"
              h="48px"
              name={user?.displayName?.replaceAll(/\s*\([^)]*\)\s*/g, '')}
              src={user?.imgUrl}
              w="48px"
            />
            <Box bg="#CBD5E0" data-id="000231a" h="46px" w="1px" flexShrink={0} />
            <Flex align="flex-start" data-id="000232" flexDir="column" flex={1} minWidth={0}>
              <Flex align="center" data-id="000233" justify="space-between" w="full">
                <Text 
                  color="#727581" 
                  data-id="000234" 
                  flex={1}
                  fontSize={["14px", "16px"]} 
                  fontWeight="400"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  textAlign="left"
                  whiteSpace="nowrap"
                  minWidth={0}
                >
                  {user?.email || 'No email available'}
                </Text>
              </Flex>
              <Text color="logoutPage.organizationNameColor" data-id="000236" fontSize={["18px", "20px"]} fontWeight="600">
                {user?.firstName || user?.displayName}
              </Text>
            </Flex>
            <Flex align="center" data-id="000235" h="full" justify="center">
              <svg
                data-id="003177"
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ flexShrink: 0 }}>
                <path
                  data-id="003178"
                  d="M9.16667 0C4.11217 0 0 4.11217 0 9.16667C0 14.2212 4.11217 18.3333 9.16667 18.3333C14.2212 18.3333 18.3333 14.2212 18.3333 9.16667C18.3333 4.11217 14.2212 0 9.16667 0ZM7.33425 13.2119L3.93067 9.81567L5.225 8.51767L7.33242 10.6214L12.1853 5.76858L13.4814 7.06475L7.33425 13.2119V13.2119Z"
                  fill="#38A169" />
              </svg>
            </Flex>
          </Flex>

          <Button
            _hover={{ bg: '#F7FAFC' }}
            bg="white"
            borderColor="#CBD5E0"
            borderWidth="1px"
            borderRadius="10px"
            color="logoutPage.organizationNameColor"
            data-id="000237"
            fontSize="14px"
            fontWeight="500"
            h="60px"
            leftIcon={<MicrosoftIcon data-id="003179" />}
            lineHeight="18px"
            onClick={login}
            w="full"
            maxW={['full', 'full', '400px']}
          >
            <Text color="logoutPage.organizationNameColor" data-id="000299" fontSize="16px" fontWeight="600">
              Continue as {user?.firstName || user?.displayName}
            </Text>
          </Button>

          <Flex
            align="left"
            color="logoutPage.descriptionColor"
            data-id="000238"
            flexDir="row"
            flexWrap="wrap"
            fontSize="14px"
            gap={1}
            justifyContent="flex-start"
            w="full"
            maxW={['full', 'full', '400px']}
          >
            <Text data-id="000239" color="#2D3748">
              Not your account?
            </Text>
            <Text color="#1458EA" cursor="pointer" data-id="000240" onClick={redirectToLogin}>
              Login as someone else
            </Text>
          </Flex>
        </VStack>
      </Flex>
      <Flex
        align="center"
        data-id="000241"
        h="100vh"
        justify={['center', 'center', 'flex-end']}
        order={[1, 1, 2]}
        position="relative"
        w={['full', 'full', '65%']}
      >
        <Box data-id="000242" h="100%" w="100%" position="relative" overflow="hidden">
          <BackgroundImage data-id="002529" dataId="000243" fit="cover" objectPosition={["center", "center", "left"]} />
        </Box>
      </Flex>
    </Flex>
  );
}

export default Logout;

export const logoutPageStyles = {
  logoutPage: {
    bg: '#ffffff',
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
