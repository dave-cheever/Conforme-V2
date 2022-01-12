import React from "react";
import { Flex, Box } from "@chakra-ui/react";

const AdminTableHeader = ({children}) => {
  return (
    <Box width="100%" bg="adminTableHeader.bg" pos="sticky" top={0} zIndex={1}>
      <Flex
        p="15px 25px"
        fontWeight="semi_medium"
        borderBottom="1px solid"
        borderColor="adminTableHeader.border"
        borderTopRadius="20px"
        bg="white"
        color="adminTableHeader.font"
        fontSize="11px"
      >
        {children}
      </Flex>
    </Box>
  );
};

export default AdminTableHeader;

export const adminTableHeaderStyles = {
  adminTableHeader: {
    bg: "#E5E5E5",
    font: "#818197",
    border: "#F0F0F0"
  }
};
