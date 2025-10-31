import { useEffect, useState } from 'react';

import { Avatar, Flex, Image, Text, useToast } from '@chakra-ui/react';

import { toastFailed } from '../bootstrap/config';
import { useAppContext } from '../contexts/AppProvider';
import useDevice from '../hooks/useDevice';
import authClient from './auth-client';
import { runtimeEnv } from './runtime-env';

// Common constants
export const FALLBACK_BG_DESKTOP_URL = "https://raw.githubusercontent.com/dacheever/images/main/Full%20background%20img%20-%20desktop.png";
export const FALLBACK_BG_MOBILE_URL = "https://raw.githubusercontent.com/dacheever/images/main/Screenshot%20-%20desktop.png";
export const FALLBACK_COMPANY_LOGO_URL = "https://raw.githubusercontent.com/dacheever/images/main/Logo%20Icon%20-%20navigation.svg";

// Common error handling hook
export const useAuthErrorHandling = () => {
  const toast = useToast();
  const params = globalThis.location.search.split('&');
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

  return { errorMessage };
};

// Common login function
export const useAuthLogin = () => {
  const toast = useToast();

  const login = async () => {
    const loginOptions = {
      onRequest: () => {},
      onSuccess: () => {},
      onError: (ctx) => { 
        toast({ 
          status: 'error',
          title: 'Error',
          description: ctx.message,
        }) 
      },
    };

    authClient.signIn.social({
      provider: "microsoft",
      callbackURL: runtimeEnv.clientUrl(),
    }, loginOptions);
  };

  return { login };
};

// Helper function to test if an image loads successfully
const testImageLoad = (url: string): Promise<boolean> => new Promise((resolve) => {
  const img = document.createElement('img');
  img.onload = () => resolve(true);
  img.onerror = () => resolve(false);
  img.src = url;
});

// Separate component for logo positioning/styling
function LogoContainer({ 
  isMobile, 
  children 
}: { 
  readonly isMobile: boolean; 
  readonly children: React.ReactNode;
}) {
  return (
    <Flex
      data-id="002725"
      position="absolute"
      top={isMobile ? "16px" : "40px"}
      left={isMobile ? "50%" : "20px"}
      transform={isMobile ? "translateX(-50%)" : "none"}
      zIndex={10}
      h={isMobile ? "48px" : "50px"}
      maxW={isMobile ? "180px" : "200px"}
      align="center"
      justify="center">
      {children}
    </Flex>
  );
}

// Separate component for text fallback
function CompanyLogoTextFallback({ isMobile }: { readonly isMobile: boolean }) {
  return (
    <LogoContainer data-id="002726" isMobile={isMobile}>
      <Flex
        align="center"
        bg="white"
        borderRadius="md"
        data-id="company-logo-text-fallback"
        h="full"
        justify="center"
        px={4}
      >
        <Text
          data-id="002727"
          color="#462AC4"
          fontWeight="bold"
          fontSize={isMobile ? "16px" : "18px"}
          whiteSpace="nowrap">
          CompanyLogo
        </Text>
      </Flex>
    </LogoContainer>
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
      
      // Test fallback logo
      const fallbackLoaded = await testImageLoad(FALLBACK_COMPANY_LOGO_URL);
      if (fallbackLoaded) {
        setLogoSrc(FALLBACK_COMPANY_LOGO_URL);
      } else {
        setLogoSrc(null); // Show text fallback
      }
      
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
      <Image
        alt=""
        data-id="company-logo"
        h="full"
        maxH="full"
        maxW="full"
        objectFit="contain"
        src={logoSrc}
        w="full"
      />
    </LogoContainer>
  );
}

// Separate component for background image positioning/styling
function BackgroundImageContainer({ 
  maxW,
  children 
}: { 
  readonly maxW: string;
  readonly children: React.ReactNode;
}) {
  return (
    <Flex
      data-id="002730"
      h="full"
      maxW={maxW}
      align="center"
      justify="center"
      zIndex={1}>
      {children}
    </Flex>
  );
}

// Main BackgroundImage component
export function BackgroundImage({ 
  dataId, 
  maxW = "max-content",
  fit = "contain",
}: { 
  readonly dataId: string;
  readonly maxW?: string;
  readonly fit?: "cover" | "contain" | "fill" | "scale-down" | "none";
}) {
  const { organizationConfig } = useAppContext();
  const device = useDevice();
  const [backgroundSrc, setBackgroundSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBackground = async () => {
      setIsLoading(true);
      
      const customBgUrl = device === 'desktop' ? organizationConfig?.bgImageUrl : organizationConfig?.bgImageTabletUrl;
      const fallbackUrl = device === 'desktop' ? FALLBACK_BG_DESKTOP_URL : FALLBACK_BG_MOBILE_URL;
      
      // Test primary background first (if exists)
      if (customBgUrl) {
        const primaryLoaded = await testImageLoad(customBgUrl);
        if (primaryLoaded) {
          setBackgroundSrc(customBgUrl);
          setIsLoading(false);
          return;
        }
      }
      
      // Test fallback background
      const fallbackLoaded = await testImageLoad(fallbackUrl);
      if (fallbackLoaded) {
        setBackgroundSrc(fallbackUrl);
      } else {
        setBackgroundSrc(null); // Show text fallback
      }
      
      setIsLoading(false);
    };

    loadBackground();
  }, [organizationConfig?.bgImageUrl, organizationConfig?.bgImageTabletUrl, device]);

  // Show loading state (empty for now, could add spinner)
  if (isLoading) {
    return null;
  }

  // Show text fallback if no background loaded
  // On desktop: fixed positioning to fill right side (70%)
  // On mobile/tablet: fills parent container (respects column layout)
  if (!backgroundSrc) {
    return (
      <Flex
        position={['relative', 'relative', 'fixed']}
        right={['auto', 'auto', '0']}
        top={['auto', 'auto', '0']}
        bottom={['auto', 'auto', '0']}
        h={['full', 'full', 'auto']}
        w={['full', 'full', '65%']}
        align="center"
        justify="center"
        bg="#f5f5f5"
        data-id="background-image-text-fallback-wrapper"
        zIndex={1}
      >
        <Flex
          data-id="002731"
          align="center"
          bg="white"
          borderRadius="lg"
          boxShadow="md"
          justify="center"
          px={8}
          py={6}>
          <Text
            data-id="002732"
            color="#462AC4"
            fontWeight="bold"
            fontSize="28px"
            textAlign="center">
            Background Image
          </Text>
        </Flex>
      </Flex>
    );
  }

  // Show the background image
  return (
    <BackgroundImageContainer data-id="002733" maxW={maxW}>
      <Image
        alt=""
        data-id={dataId}
        fit={fit}
        h="full"
        w="full"
        maxW="100%"
        maxH="100%"
        objectFit="contain"
        src={backgroundSrc}
      />
    </BackgroundImageContainer>
  );
}

// Common user avatar component
export function UserAvatar({ 
  user, 
  borderColor, 
  dataId, 
}: { 
  readonly user: any; 
  readonly borderColor: string; 
  readonly dataId: string; 
}) {
  return (
    <Flex
      bg="white"
      borderColor={borderColor}
      borderWidth="10px"
      data-id={dataId}
      rounded="full">
      <Avatar
        borderColor="white"
        borderWidth="4px"
        data-id={`${dataId.slice(0, -1)}${(Number.parseInt(dataId.slice(-1), 10) + 1).toString()}`}
        h="75px"
        name={user?.displayName?.replaceAll(/\s*\([^)]*\)\s*/g, '')} 
        src={user?.imgUrl}
        w="75px" />
    </Flex>
  );
}
