import { useEffect, useMemo } from "react";
import {
  Button,
  Flex,
  Box,
  Image,
  useToast,
  Avatar,
  VStack,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import { toastFailed } from "../bootstrap/config";
import { useAppContext } from "../contexts/AppProvider";
import useDevice from "../hooks/useDevice";

const Logout = () => {
  const toast = useToast();
  const params = window.location.search.split("&");
  const { organizationConfig } = useAppContext();
  const device = useDevice();
  const history = useHistory();

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

  const redirectToLogin = () => {
    localStorage.removeItem("logOutUser");
    history.push("/login");
  };

  const user = useMemo(() => {
    const logOutUser = localStorage.getItem("logOutUser");

    if (!logOutUser) {
      return null;
    }
    try {
      const expiresAt = new Date(JSON.parse(logOutUser)?.expiresAt).getTime();
      if (expiresAt < new Date().getTime()) {
        localStorage.removeItem("logOutUser");
        return null;
      }
      return JSON.parse(logOutUser);
    } catch (error) {
      return null;
    }
  }, []);

  useEffect(() => {
    if (user === null && user !== undefined) {
      return redirectToLogin();
    }
  // eslint-disable-next-line
  }, [user]);

  const loginWithAzureAD = async () => {
    localStorage.removeItem("logOutUser");
    window.open(
      `${process.env.REACT_APP_API_URL}/auth/aad${
        redirectUrl ? `?redirect=${redirectUrl}` : ""
      }`,
      "_self"
    );
  };

  return (
    <Flex w="full" h="100vh" flexDir={["column", "column", "row"]} bg="logoutPage.bg">
      <Flex
        w={["full", "full", "30%"]}
        align="center"
        order={[2, 2, 1]}
        justify={["center", "center", "flex-end"]}
        h="full"
      >
        <VStack spacing={5} align="center" textAlign="center">
          <Flex
            color="logoutPage.organizationNameColor"
            noOfLines={2}
            textOverflow="ellipsis"
            w="240px"
            fontSize="24px"
            lineHeight="41px"
            fontWeight="bold"
            mb={3}
          >
            {organizationConfig?.name}
          </Flex>
          <Flex
            bg="white"
            rounded="full"
            borderWidth="10px"
            borderColor="logoutPage.avatarBorderColor"
          >
            <Avatar
              h="75px"
              w="75px"
              borderWidth="4px"
              borderColor="white"
              src={user?.imgUrl}
              name={user?.displayName}
            />
          </Flex>
          <Flex flexDir="column" align="center">
            <Flex fontWeight="700" fontSize="16px">
              You have logged out.
            </Flex>
            <Flex color="logoutPage.descriptionColor" fontSize="11px" mt="2">
              It's a good idea to close all browser windows.
            </Flex>
          </Flex>
          <Button
            w="204px"
            colorScheme="purpleHeart"
            onClick={loginWithAzureAD}
            borderRadius="10px"
            fontSize="14px"
            lineHeight="18px"
            h="40px"
          >
            Log back in
          </Button>
          <Flex flexDir="column" color="logoutPage.descriptionColor" align="center" fontSize="11px">
            <Flex>Not {user?.firstName}?</Flex>
            <Flex
              _hover={{ color: "logoutPage.hoverColor" }}
              cursor="pointer"
              onClick={redirectToLogin}
            >
              Login as someone else
            </Flex>
          </Flex>
        </VStack>
      </Flex>
      <Flex
        w={["full", "full", "70%"]}
        h="full"
        align="center"
        order={[1, 1, 2]}
        justify={["center", "center", "flex-end"]}
      >
        <Box h={["30vh", "40vh", "95vh"]} overflow="hidden">
          <Image
            h="full"
            maxW="max-content"
            src={
              device === "desktop"
                ? organizationConfig?.bgImageUrl
                : organizationConfig?.bgImageTabletUrl
            }
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Logout;

export const logoutPageStyles = {
  logoutPage: {
    bg: "#E5E5E5",
    organizationNameColor: "#282F36",
    avatarBorderColor: "#6d649845",
    descriptionColor: "#818197",
    hoverColor: "#462AC4"
  },
};
