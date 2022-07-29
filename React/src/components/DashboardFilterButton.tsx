import React, { useContext } from 'react';

import { Button, ComponentWithAs, Icon, IconProps } from '@chakra-ui/react';

import { HomeContext } from '../pages/home';

interface IDashboardFilterButton {
  label: string;
  isDisable: boolean;
  buttonType: string;
  icon?: ComponentWithAs<'svg', IconProps>;
}

const DashboardFilterButton = ({ label, isDisable, buttonType, icon }: IDashboardFilterButton) => {
  const { filterType, filterHandler } = useContext(HomeContext);

  return (
    <Button
      _active={{
        color: 'white',
        bg: 'black',
        stroke: 'dashboardFilters.active',
      }}
      _hover={{
        color: 'white',
        bg: 'black',
        stroke: 'dashboardFilters.active',
      }}
      bg="white"
      fontSize="14px"
      fontWeight="400"
      h="35px"
      isActive={filterType.includes(buttonType)}
      isDisabled={isDisable}
      leftIcon={icon && <Icon as={icon} w="23px" />}
      onClick={() => filterHandler(buttonType)}
      stroke="dashboardFilters.inActive"
    >
      {label}
    </Button>
  );
};

export default DashboardFilterButton;
