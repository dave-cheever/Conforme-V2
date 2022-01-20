import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import Header from "../components/Header";

const PrivacyPolicy = () => {
  return (
    <Flex w='full' h='full' direction='column'>
      <Header breadcrumbs={["Home", "Privacy policy"]} mobileBreadcrumbs={["Privacy policy"]}/>
      <Flex
        flexDirection="column"
        bg="white"
        maxWidth={"full"}
        borderRadius="20px"
        ml="7"
        p="25px 30px 25px 30px"
        mr="25px"
        mb={["25px","25px"]}
        h="full"
      >
        <Text fontSize="24px" fontWeight="bold" mb="30px">
          Privacy Policy
        </Text>
        <Text>
          Lorem ipsum
        </Text>
      </Flex>
    </Flex>
  )
};

export default PrivacyPolicy;
