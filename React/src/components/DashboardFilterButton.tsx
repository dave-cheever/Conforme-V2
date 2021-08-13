import React, { useContext } from "react";
import { Button } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import { ComponentWithAs, IconProps } from "@chakra-ui/react";
import { HomeContext } from "../pages/home";

interface IDashboardFilterButton {
  label: string;
  isDisable: boolean;
  buttonType: string;
  icon?: ComponentWithAs<"svg", IconProps>;
}

const DashboardFilterButton = ({
  label,
  isDisable,
  buttonType,
  icon,
}: IDashboardFilterButton) => {
  const { filterType, filterHandler } = useContext(HomeContext);

  return (
    <Button
      bg="white"
      fontSize="14px"
      fontWeight="400"
      h="35px"
      isDisabled={isDisable}
      isActive={filterType.includes(buttonType)}
      stroke="dashboardFilters.inActive"
      _hover={{
        color: "white",
        bg: "black",
        stroke: "dashboardFilters.active",
      }}
      _active={{
        color: "white",
        bg: "black",
        stroke: "dashboardFilters.active",
      }}
      leftIcon={icon && <Icon as={icon} w="23px" />}
      onClick={() => filterHandler(buttonType)}
    >
      {label}
    </Button>
  );
};

export default DashboardFilterButton;
