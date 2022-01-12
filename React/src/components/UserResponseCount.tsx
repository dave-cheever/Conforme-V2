import React from "react";
import { Flex } from "@chakra-ui/react";

const UserResponseCount = ({ responseCount }) => {
  return (
    <Flex
      w="calc(25% - 1px)"
      alignItems="center"
      cursor="pointer"
      justifyContent="center"
      h="calc(100% - 1px)"
      mt="1px"
      mr="1px"
      bg="userItem.responseCountBg"
    >
      {responseCount || 0}
    </Flex>
  );
};

export default UserResponseCount;
