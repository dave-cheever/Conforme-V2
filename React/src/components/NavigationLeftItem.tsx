import { Text, Box, Spacer, Icon, Flex } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { INavItem } from "../interfaces/INavItem";

const NavigationLeftItem = ({ icon, title, url, isActive }: INavItem) => {
  const history = useHistory();

  const setCurrentPage = () => {
    history.push(url);
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignContent="center"
      ml="-26px"
      onClick={() => setCurrentPage()}
      _hover={{
        cursor: "pointer",
      }}
    >
      {isActive === true && (
        <Flex
          w="10px"
          h="38px"
          mt="-10px"
          bg="navigationLeft.menuList.activeIndicator"
          borderRightRadius="4px"
          position="fixed"
        />
      )}

      <Icon
        as={icon}
        width="22px"
        height="22px"
        left="25px"
        top="10px"
        mb="28px"
        mr="22px"
        ml="26px"
        stroke={
          isActive
            ? "navigationLeft.menuList.selectedMenuItem"
            : "navigationLeft.menuList.unselectedMenuItem"
        }
      />

      <Text
        fontSize="16px"
        lineHeight="19px"
        mt="2px"
        color={
          isActive
            ? "navigationLeft.menuList.selectedMenuItem"
            : "navigationLeft.menuList.unselectedMenuItem"
        }
      >
        {title}
      </Text>
      <Spacer />
    </Box>
  );
};

export default NavigationLeftItem;
