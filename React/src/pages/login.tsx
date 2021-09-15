import { useContext, useEffect } from "react";
import {
  Button,
  Flex,
  Box,
  Image,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";

// import backgroundImage from '../images/login-bg.png';
import windowsWhite from "../images/windows-white.svg";
import { toastFailed } from "../bootstrap/config";
import { store } from "../bootstrap/store";

const Login = () => {
  const toast = useToast();
  const params = window.location.search.split("&");
  const { state } = useContext(store);
  const { organizationConfig } = state;
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
    <Flex
      align="center"
      direction={["column", "column", "row"]}
      h="100vh"
      backgroundColor="loginPage.bg"
      width="100%"
      overflow="hidden"
    >
      <Box mx={2} order={[2, 2, 1]} w={["100%", "100%", "700px"]}>
        <Stack spacing={7} align="center" mt={["10vh", "10vh", 0]}>
          <Image src={organizationConfig?.logoUrl} h="80px" alt="Logo" />
          <Text color="white" fontSize="2xl" fontFamily="Lato">
            {organizationConfig?.name}
          </Text>
          <Button
            justifyContent="center"
            w="auto"
            colorScheme="#3167F9"
            borderRadius="none"
            backgroundColor="#3167F9"
            onClick={loginWithAzureAD}
          >
            <Image src={windowsWhite} h="20px" alt="Windows Logo" mr="1em" />
            <Text fontSize="md" fontWeight="400" fontFamily="Lato">
              Login with Azure AD
            </Text>
          </Button>
        </Stack>
      </Box>
      <Box h={["50vh", "50vh", "85vh"]} order={[1, 1, 2]} overflow="hidden">
        {/* <Image h='full' maxW='max-content' borderRadius={30} src={backgroundImage} /> */}
      </Box>
    </Flex>
  );
};

export default Login;
