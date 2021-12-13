import { useEffect } from "react";
import {
  Button,
  Flex,
  Box,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";

import { toastFailed } from "../bootstrap/config";
import { useAppContext } from "../contexts/AppProvider";
import { ArrowRight } from "../icons";
import useDevice from "../hooks/useDevice";

const Login = () => {
  const toast = useToast();
  const params = window.location.search.split("&");
  const { organizationConfig } = useAppContext();
  const device = useDevice();
  
  const redirectUrl = params
    .find((str) => str.includes("redirectUrl"))
    ?.split("=")[1];
  const errorMessage = params
    .find((str) => str.includes("errorMessage"))
    ?.split("=")[1];

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
    window.open(
      `${process.env.REACT_APP_API_URL}/auth/aad${
        redirectUrl ? `?redirect=${redirectUrl}` : ""
      }`,
      "_self"
    );
  };

  return (
    <Flex w="full" h="100vh" flexDir={["column","column","row"]}>
      <Flex w={["full","full","30%"]} align="center" order={[2, 2, 1]} justify={["center","center","flex-end"]} h="full">
        <Flex flexDir="column" textAlign={["center","center","start"]}>
          <Text color="loginPage.organizationNameColor" noOfLines={2} textOverflow="ellipsis" w="240px" fontSize="36px" lineHeight="41px" fontWeight="bold" mb="50px">
          {organizationConfig?.name}
          </Text>
          <Button
            w="240px"
            colorScheme="purpleHeart"
            onClick={loginWithAzureAD}
            borderRadius="10px"
            fontSize="14px"
            lineHeight="18px"
            h="40px"
            rightIcon={<ArrowRight mt={1}/>}
          >
            Login with Azure AD
          </Button>
        </Flex>
      </Flex>
      <Flex w={["full","full","70%"]} h="full" align="center" order={[1, 1, 2]} justify={["center","center","flex-end"]}>
        <Box h={["30vh", "40vh", "95vh"]}  overflow="hidden" >
        <Image h='full' maxW='max-content' src={device === "desktop" ? organizationConfig?.bgImageUrl: organizationConfig?.bgImageTabletUrl} />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Login;

export const loginPageStyles = {
  loginPage:{
    bg:"#E5E5E5",
    organizationNameColor:"#282F36"
  }
}
