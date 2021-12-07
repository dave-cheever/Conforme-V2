import { Box, Text } from "@chakra-ui/react";

import { Bar } from "../../icons";
import { INavItem } from "../../interfaces/INavItem";

const NavigationLeftSeperator = ({ label }: INavItem) => {
  return (
    <Box display="flex" flexDirection="row" alignContent="center">
      <Bar
        width="46px"
        left="25px"
        top="10px"
        mb="28px"
        mr="25px"
        ml="-26px"
        mt="11px"
      />
      <Text
        fontSize="11px"
        lineHeight="13px"
        mt="11px"
        color="navigationLeft.menuList.unselectedMenuItem"
      >
        {label}
      </Text>
    </Box>
  );
};

export default NavigationLeftSeperator;
