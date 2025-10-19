import { useEffect } from 'react';

import { Avatar, Flex, Image, useToast } from '@chakra-ui/react';

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

// Common CompanyLogo component
export function CompanyLogo({ isMobile = false }: { readonly isMobile?: boolean }) {
  const { organizationConfig } = useAppContext();

  return (
    <Image
      alt="Company Logo"
      data-id="company-logo"
      fallbackSrc={FALLBACK_COMPANY_LOGO_URL}
      h={isMobile ? "48px" : "50px"}
      left={isMobile ? "50%" : "-20px"}
      maxH={isMobile ? "48px" : "50px"}
      maxW={isMobile ? "180px" : "200px"}
      objectFit="contain"
      onError={() => {
        console.log('Company logo failed to load, using fallback');
      }}
      position="absolute"
      src={organizationConfig?.logoUrl || FALLBACK_COMPANY_LOGO_URL}
      top={isMobile ? "16px" : "40px"}
      transform={isMobile ? "translateX(-50%)" : "none"}
      w={isMobile ? "180px" : "200px"}
      zIndex="10"
    />
  );
}

// Common background image component
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

  return (
    <Image
      data-id={dataId}
      fallbackSrc={device === 'desktop' ? FALLBACK_BG_DESKTOP_URL : FALLBACK_BG_MOBILE_URL}
      fit={fit}
      h="full"
      maxW={maxW}
      onError={() => {
        console.log('Background image failed to load, using fallback');
      }}
      src={device === 'desktop' ? (organizationConfig?.bgImageUrl || FALLBACK_BG_DESKTOP_URL) : (organizationConfig?.bgImageTabletUrl || FALLBACK_BG_MOBILE_URL)} 
    />
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
