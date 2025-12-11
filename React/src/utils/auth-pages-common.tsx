import { useEffect, useState } from 'react';

import { Avatar, Box, Flex, Image, Text, useToast } from '@chakra-ui/react';

import { toastFailed } from '../bootstrap/config';
import { useAppContext } from '../contexts/AppProvider';
import useDevice from '../hooks/useDevice';
import { BrokenImageIcon } from '../icons';
import layoutImage from '../images/layout.png';
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
      top={isMobile ? '30px' : '40px'}
      left={isMobile ? '50%' : '20px'}
      transform={isMobile ? 'translateX(-50%)' : 'none'}
      zIndex={10}
      h={isMobile ? '38px' : '45px'}
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
      top={isMobile ? '30px' : '40px'}
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

      // For mobile, try logoUrlMobile first, then fallback to logoUrl
      // For desktop/tablet, use logoUrl
      const logoUrlToTry = isMobile && organizationConfig?.logoUrlMobile 
        ? organizationConfig.logoUrlMobile 
        : organizationConfig?.logoUrl;

      // Test primary logo first (if exists)
      if (logoUrlToTry) {
        const primaryLoaded = await testImageLoad(logoUrlToTry);
        if (primaryLoaded) {
          setLogoSrc(logoUrlToTry);
          setIsLoading(false);
          return;
        }
      }

      // If mobile and logoUrlMobile failed, try fallback to logoUrl
      if (isMobile && organizationConfig?.logoUrlMobile && organizationConfig?.logoUrl) {
        const fallbackLoaded = await testImageLoad(organizationConfig.logoUrl);
        if (fallbackLoaded) {
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
  }, [organizationConfig?.logoUrl, organizationConfig?.logoUrlMobile, isMobile]);

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
  pageType = 'login',
}: {
  readonly dataId: string;
  readonly maxW?: string;
  readonly fit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  readonly objectPosition?: ('center' | 'top' | 'bottom' | 'left' | 'right') | ('center' | 'top' | 'bottom' | 'left' | 'right')[];
  readonly pageType?: 'login' | 'logout';
}) {
  const { organizationConfig } = useAppContext();
  const device = useDevice();
  const [backgroundSrc, setBackgroundSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Detect browser zoom level (only for desktop/tablet, not mobile)
  useEffect(() => {
    if (device === 'mobile') {
      setZoomLevel(1);
      return;
    }

    const detectZoom = () => {
      // When zoomed, the ratio of screen.width to window.innerWidth changes
      const zoom = Math.round((globalThis.screen.width / globalThis.innerWidth) * 100) / 100;
      // Clamp zoom to reasonable values (0.5 to 5)
      const normalizedZoom = Math.max(0.5, Math.min(5, zoom));
      setZoomLevel(normalizedZoom);
    };

    detectZoom();
    globalThis.addEventListener('resize', detectZoom);
    globalThis.addEventListener('orientationchange', detectZoom);

    return () => {
      globalThis.removeEventListener('resize', detectZoom);
      globalThis.removeEventListener('orientationchange', detectZoom);
    };
  }, [device]);

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

  // Get background color from theme
  const theme = organizationConfig?.theme as any;
  const themeColors = theme?.colors || {};
  const pageTheme = pageType === 'login' ? themeColors.loginPage : themeColors.logoutPage;
  const backgroundColor = pageTheme?.background || '#E2E8F0'; // Fallback color

  // Get text overlay from organization config
  // For mobile: use loginTextMobile if available, otherwise fallback to loginText
  // For desktop/tablet: use loginText
  // Priority: loginTextMobile (mobile) / loginText (desktop) > theme.loginPageTagline > default fallback
  const getTagline = () => {
    if (device === 'mobile' && organizationConfig?.loginTextMobile) {
      return organizationConfig.loginTextMobile;
    }
    return organizationConfig?.loginText || 'Ensuring Quality, Empowering Care. Your Trusted Audit Companion.';
  };
  const tagline = getTagline();

  // Helper functions to extract nested ternaries
  const getImageMaxHeight = () => {
    if (device === 'mobile') {
      return '70vh';
    }
    if (zoomLevel >= 1.1) {
      if (device === 'desktop') {
        return '65vh';
      }
      return '60vh';
    }
    if (device === 'desktop') {
      return '78vh';
    }
    return '70vh';
  };

  const getTextTop = () => {
    if (device === 'mobile') return '97px';
    if (device === 'tablet') return 3;
    return 0;
  };

  const getTextLeft = () => {
    if (device === 'mobile') return '50%';
    if (device === 'tablet') return '60%';
    return '50%';
  };

  const getTextAlign = () => {
    if (device === 'mobile') return 'center';
    return 'left';
  };

  const getTextMaxWidth = () => {
    if (device === 'mobile') return '90%';
    if (device === 'tablet') return '85%';
    return '90%';
  };

  const getTextJustify = () => {
    if (device === 'mobile') return 'center';
    return 'flex-start';
  };

  const getTextFontSize = () => {
    if (device === 'mobile') return '18px';
    if (device === 'tablet') return '22px';
    return '40px';
  };

  const getTextPaddingTop = () => {
    return device === 'mobile' ? 0 : 8;
  };

  // Show loading state (empty for now, could add spinner)
  if (isLoading) {
    return null;
  }

  // Show text fallback if no background loaded (still show background color and white line)
  if (!backgroundSrc) {
    return (
      <Flex position="relative" h="full" w="full" data-id="background-image-text-fallback-wrapper" overflow="hidden">
        {/* Base layer: Background color */}
        <Box
          data-id="003356"
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={backgroundColor}
          zIndex={1} />
        {/* Middle layer: White line image */}
        <Image
          data-id="003357"
          alt=""
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          h="100%"
          w="100%"
          objectFit="cover"
          src={layoutImage}
          zIndex={2}
          sx={{ mixBlendMode: 'multiply' }} />
        {/* Fallback icon */}
        <Flex
          data-id="003358"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          align="center"
          justify="center"
          zIndex={3}>
          <BrokenImageIcon data-id="003349" w="100px" h="100px" color="#CBD5E0" />
          </Flex>
      </Flex>
    );
  }

  // Show the layered background: color -> white line image -> background image
  return (
    <Flex position="relative" h="100%" w="100%" data-id="002733" overflow="hidden">
      {/* Base layer: Background color */}
      <Box
        data-id="003359"
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg={backgroundColor}
        zIndex={1} />
      {/* Middle layer: White line image */}
      {backgroundSrc && (
        <Image
          data-id="003360"
          alt=""
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          h="100%"
          w="100%"
          objectFit="cover"
          src={layoutImage}
          zIndex={2}
          sx={{ mixBlendMode: 'multiply' }} />
      )}
      {/* Top layer: Background image from database */}
      <Image
        alt=""
        data-id={dataId}
        position="absolute"
        top={'auto'}
        left={0}
        right={0}
        bottom={0}
        h="auto"
        maxH={getImageMaxHeight()}
        marginLeft='auto'
        marginRight='auto'
        w="auto"
        objectFit='contain'
        src={backgroundSrc || undefined}
        objectPosition={objectPosition ?? 'center'}
        zIndex={3}
      />
      {/* Separator line - only on mobile */}
      {device === 'mobile' && (
        <Box
          data-id="013086"
          position="absolute"
          top="78px"
          left="50%"
          transform="translateX(-50%)"
          zIndex={4}
          w="40px"
          h="1px"
          bg="white"
          mt="5px"
          opacity={0.36}
        />
      )}
      {/* Text overlay */}
      <Flex
        data-id="003184"
        position="absolute"
        top={getTextTop()}
        left={getTextLeft()}
        transform="translateX(-50%)"
        zIndex={4}
        px={6}
        pt={getTextPaddingTop()}
        textAlign={getTextAlign()}
        maxW={getTextMaxWidth()}
        w="full"
        justify={getTextJustify()}>
        <Text
          data-id="003185"
          color="white"
          fontSize={getTextFontSize()}
          fontWeight="bold"
          lineHeight="1.2"
          textAlign={getTextAlign()}
          dangerouslySetInnerHTML={{ __html: tagline?.replaceAll('<br>', '<br />') || '' }}
        />
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
