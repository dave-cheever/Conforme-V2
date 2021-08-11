import { useContext } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import { IStore, store } from "../bootstrap/store";

const NavigationLeft = () => {
  const { state }: IStore = useContext(store);
  const { organizationConfig } = state;
  const history = useHistory();

  return (
    <Flex
      w="240px"
      p="20px 0"
      bg="navigationLeft.bg"
      color="white"
      direction="column"
    >
      <Box
        display="flex"
        alignItems="center"
        h="80px"
        onClick={() => history.push("/")}
        cursor="pointer"
      >
        <Image
          ignoreFallback
          src={organizationConfig?.logoUrl}
          h="44px"
          ml={4}
        />
        <Text
          w="full"
          ml={3}
          fontWeight="700"
          fontSize="14px"
          color="#FFFFFF"
          display={["none", "none", "block"]}
        >
          {organizationConfig?.name}
        </Text>
      </Box>
    </Flex>
  );
};

export default NavigationLeft;
