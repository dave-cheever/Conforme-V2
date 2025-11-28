import { useEffect, useState } from 'react';

import { Avatar, Box, Flex, Image, Text, useToast } from '@chakra-ui/react';

import { toastFailed } from '../bootstrap/config';
import { useAppContext } from '../contexts/AppProvider';
import useDevice from '../hooks/useDevice';
import { BrokenImageIcon } from '../icons';
import authClient from './auth-client';
import { runtimeEnv } from './runtime-env';

// Common constants removed - UI fallbacks are now used directly when images fail to load

// Helper function to convert Better Auth error code to readable message
// Format: "User_doesn't_exist_in_Conforme_AAD_group" -> "User doesn't exist in Conforme AAD group"
const formatErrorCode = (error: string): string => {
  return error
    .replaceAll('_', ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Common error handling hook
export const useAuthErrorHandling = () => {
  const toast = useToast();
  const params = new URLSearchParams(globalThis.location.search);
  const errorMessage = params.get('errorMessage');
  const error = params.get('error'); // Better Auth error format

  useEffect(() => {
    let message = errorMessage;

    // Handle Better Auth error format if errorMessage is not present
    if (!message && error) {
      message = formatErrorCode(error);
    }

    if (message) {
      toast({
        ...toastFailed,
        title: "Couldn't sign in",
        description: decodeURIComponent(message),
      });

      // Clean up URL by removing error parameters
      const url = new URL(globalThis.location.href);
      url.searchParams.delete('errorMessage');
      url.searchParams.delete('error');
      globalThis.history.replaceState({}, '', url.toString());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { errorMessage: errorMessage || (error ? formatErrorCode(error) : null) };
};

// Common login function
export const useAuthLogin = () => {
  const toast = useToast();

  const login = async (event?: React.MouseEvent) => {
    // Prevent default button behavior and stop propagation to avoid React re-renders
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Set a flag to indicate we're initiating a login redirect
    // This prevents the user state from being cleared during redirect
    // AND prevents access to protected routes until authentication is complete
    sessionStorage.setItem('isRedirectingToLogin', 'true');
    sessionStorage.setItem('isRedirectingToLoginTimestamp', Date.now().toString());

    const loginOptions = {
      onRequest: () => {
        // Redirect is being initiated - Better Auth will handle the redirect
        // The flag is already set, so routes will be restricted
      },
      onSuccess: () => {
        // Clear the flag on success
        sessionStorage.removeItem('isRedirectingToLogin');
        sessionStorage.removeItem('isRedirectingToLoginTimestamp');
      },
      onError: (ctx) => {
        // Clear the flag on error
        sessionStorage.removeItem('isRedirectingToLogin');
        sessionStorage.removeItem('isRedirectingToLoginTimestamp');
        toast({
          status: 'error',
          title: 'Error',
          description: ctx.message,
        });
      },
    };

    // Immediately initiate the redirect
    // Better Auth's signIn.social should redirect immediately without waiting
    // The isRedirectingToLogin flag ensures no protected routes are accessible during this redirect
    authClient.signIn.social(
      {
        provider: 'microsoft',
        callbackURL: runtimeEnv.clientUrl(),
      },
      loginOptions,
    );
  };

  return { login };
};

// Helper function to test if an image loads successfully
const testImageLoad = (url: string): Promise<boolean> =>
  new Promise((resolve) => {
    const img = document.createElement('img');
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });

// Separate component for logo positioning/styling
function LogoContainer({ isMobile, children }: { readonly isMobile: boolean; readonly children: React.ReactNode }) {
  return (
    <Flex
      data-id="002725"
      position="absolute"
      top={isMobile ? '16px' : '40px'}
      left={isMobile ? '50%' : '20px'}
      transform={isMobile ? 'translateX(-50%)' : 'none'}
      zIndex={10}
      h={isMobile ? '48px' : '50px'}
      maxW={isMobile ? '180px' : '200px'}
      align="center"
      justify="center"
    >
      {children}
    </Flex>
  );
}

// Separate component for text fallback
function CompanyLogoTextFallback({ isMobile }: { readonly isMobile: boolean }) {
  return (
    <Flex
      data-id="002726"
      position="absolute"
      top={isMobile ? '16px' : '40px'}
      left={isMobile ? '50%' : '20px'}
      transform={isMobile ? 'translateX(-50%)' : 'none'}
      zIndex={10}
      maxW={isMobile ? '90%' : '600px'}
      align="center"
      justify="flex-start"
    >
      <Flex align="center" borderRadius="md" data-id="company-logo-text-fallback" h="auto" justify="center" px={4} py={2} gap={2} minH={isMobile ? '48px' : '50px'}>
        <Box data-id="003346" flexShrink={0}>
          <BrokenImageIcon data-id="003347" w="40px" h="40px" color="#718096" />
        </Box>
       <Flex data-id="003348" direction="column">
          <Text data-id="002727" color="#1A202C" fontSize={isMobile ? '14px' : '16px'} fontWeight="500">
            Company logo couldn't be loaded.
          </Text>
          <Text data-id="002727" color="#A0AEC0" fontSize={isMobile ? '12px' : '14px'} fontWeight="500"> 
          Please check your logo link in Settings.
          </Text>
      </Flex>
      </Flex>
    </Flex>
  );
}

// Main CompanyLogo component
export function CompanyLogo({ isMobile = false }: { readonly isMobile?: boolean }) {
  const { organizationConfig } = useAppContext();
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLogo = async () => {
      setIsLoading(true);

      // Test primary logo first (if exists)
      if (organizationConfig?.logoUrl) {
        const primaryLoaded = await testImageLoad(organizationConfig.logoUrl);
        if (primaryLoaded) {
          setLogoSrc(organizationConfig.logoUrl);
          setIsLoading(false);
          return;
        }
      }

      // If primary logo fails, show UI fallback
      setLogoSrc(null);
      setIsLoading(false);
    };

    loadLogo();
  }, [organizationConfig?.logoUrl]);

  // Show loading state (empty for now, could add spinner)
  if (isLoading) {
    return null;
  }

  // Show text fallback if no logo loaded
  if (!logoSrc) {
    return <CompanyLogoTextFallback data-id="002728" isMobile={isMobile} />;
  }

  // Show the logo image
  return (
    <LogoContainer data-id="002729" isMobile={isMobile}>
      <Image alt="" data-id="company-logo" h="full" maxH="full" maxW="full" objectFit="contain" src={logoSrc || undefined} w="full" />
    </LogoContainer>
  );
}

// Separate component for background image positioning/styling
function BackgroundImageContainer({ maxW, children }: { readonly maxW: string; readonly children: React.ReactNode }) {
  return (
    <Flex data-id="002730" h="full" maxW={maxW} align="center" justify="center" zIndex={1}>
      {children}
    </Flex>
  );
}

// Main BackgroundImage component
export function BackgroundImage({
  dataId,
  maxW = 'max-content',
  fit = 'cover',
  objectPosition = 'center',
}: {
  readonly dataId: string;
  readonly maxW?: string;
  readonly fit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  readonly objectPosition?: ('center' | 'top' | 'bottom' | 'left' | 'right') | ('center' | 'top' | 'bottom' | 'left' | 'right')[];
}) {
  const { organizationConfig } = useAppContext();
  const device = useDevice();
  const [backgroundSrc, setBackgroundSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBackground = async () => {
      setIsLoading(true);

      const customBgUrl = device === 'desktop' ? organizationConfig?.bgImageUrl : organizationConfig?.bgImageTabletUrl;

      // Test primary background first (if exists)
      if (customBgUrl) {
        const primaryLoaded = await testImageLoad(customBgUrl);
        if (primaryLoaded) {
          setBackgroundSrc(customBgUrl);
          setIsLoading(false);
          return;
        }
      }

      // If primary background fails, show UI fallback
      setBackgroundSrc(null);
      setIsLoading(false);
    };

    loadBackground();
  }, [organizationConfig?.bgImageUrl, organizationConfig?.bgImageTabletUrl, device]);

  // Get text overlay from organization config
  // Priority: loginText > theme.loginPageTagline > direct loginPageTagline > default fallback
  const tagline = organizationConfig?.loginText || 'Ensuring Quality, Empowering Care. Your Trusted Audit Companion.';

  // Show loading state (empty for now, could add spinner)
  if (isLoading) {
    return null;
  }

  // Show text fallback if no background loaded
  if (!backgroundSrc) {
    return (
      <Flex
        position="relative"
        h="full"
        w="full"
        align="center"
        justify="center"
        bg="#E2E8F0"
        data-id="background-image-text-fallback-wrapper"
        zIndex={1}
      >
        <BrokenImageIcon data-id="003349" w="100px" h="100px" color="#CBD5E0" />
      </Flex>
    );
  }

  // Show the background image with text overlay
  return (
    <Flex position="relative" h="100%" w="100%" data-id="002733" overflow="hidden">
      <Image alt="" data-id={dataId} h="100%"  w="100%" objectFit={fit} src={backgroundSrc || undefined} objectPosition={objectPosition ?? 'center'} />
      <Flex
        data-id="003184"
        position="absolute"
        top={[10, -2, 0]}
        left={['50%', '60%', '50%']}
        transform="translateX(-50%)"
        zIndex={2}
        px={8}
        pt={8}
        textAlign={['center', 'left']}
        maxW="90%"
        w="full">
        <Text
          data-id="003185"
          color="white"
          fontSize={['24px', '22px', '40px']}
          fontWeight="bold"
          lineHeight="1.2">
          {tagline}
        </Text>
      </Flex>
    </Flex>
  );
}

// Common user avatar component
export function UserAvatar({ user, borderColor, dataId }: { readonly user: any; readonly borderColor: string; readonly dataId: string }) {
  return (
    <Flex bg="white" borderColor={borderColor} borderWidth="10px" data-id={dataId} rounded="full">
      <Avatar
        borderColor="white"
        borderWidth="4px"
        data-id={`${dataId.slice(0, -1)}${(Number.parseInt(dataId.slice(-1), 10) + 1).toString()}`}
        h="75px"
        name={user?.displayName?.replaceAll(/\s*\([^)]*\)\s*/g, '')}
        src={user?.imgUrl}
        w="75px"
      />
    </Flex>
  );
}
