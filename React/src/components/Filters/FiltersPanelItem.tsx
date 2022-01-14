import { useMemo } from "react";
import { Flex, Text, useDisclosure, Box } from "@chakra-ui/react";

import { useFiltersContext } from "../../contexts/FiltersProvider";
import { ArrowUpIcon, ArrowDownIcon, ResetIcon } from '../../icons';
import IFilter from "../../interfaces/IFilter";
import BusinessUnitFilter from "./BusinessUnitFilter";
import CategoryFilter from "./CategoryFilter";
import ComplianceItemFilter from "./ComplianceItemFilter";
import DueDateFilter from "./DueDateFilter";
import ItemStatusFilter from "./ItemStatusFilter";
import LocationFilter from "./LocationFilter";
import RegulatoryBodyFilter from "./RegulatoryBodyFilter";
import UserFilter from "./UserFilter";

const FiltersPanelItem = ({ name, filter }: { name: string, filter: IFilter }) => {
  const { isOpen, onToggle } = useDisclosure();
  const {
    setFilters,
    filtersValues
  } = useFiltersContext();

  const filtersLength = useMemo(() => {
    return filtersValues[name]?.value?.length || 0;
  }, [filtersValues, name]);

  const renderPanel = () => {
    switch (name) {
      case "itemStatus":
        return <ItemStatusFilter />;

      case "businessUnitsIds":
        return <BusinessUnitFilter />;

      case "categoriesIds":
        return <CategoryFilter />;

      case "complianceItemsIds":
        return <ComplianceItemFilter />;

      case "dueDate":
        return <DueDateFilter />;

      case "locationsIds":
        return <LocationFilter />;

      case "regulatoryBodiesIds":
        return <RegulatoryBodyFilter />;

      case "usersIds":
        return <UserFilter />;

      default:
        break;
    }
  }

  const resetFilter = () => {
    let updatedFiltersValue = { ...filtersValues };
    updatedFiltersValue[name].value = [];

    setFilters({ filters: updatedFiltersValue });
  }

  return (
    <Flex
      key={name}
      justify="center"
      p='3'
      w="full"
      bg={isOpen ? "filtersPanelItem.openBg" : "filtersPanelItem.closeBg"}
      borderRadius="10px"
      my={2}
      flexDir="column"
    >
      <Flex w="full" mb={isOpen ? "4" : "0"} align="center" justify="space-between" cursor="pointer">
        <Text w="full" fontSize="14px" color="filtersPanelItem.fontColor" onClick={onToggle}>{filter.name}</Text>
        <Flex>
          {(filtersLength > 0) && <Box fontSize="12px" bg="filtersPanelItem.countBg" color="filtersPanelItem.countColor" px="10px" borderRadius="10px" fontWeight="400" mr="3">{filtersLength}</Box>}
          {(isOpen && filtersLength > 0) && <ResetIcon mr={3} onClick={resetFilter} />}
          {isOpen ? <ArrowUpIcon onClick={onToggle} /> : <ArrowDownIcon onClick={onToggle} />}
        </Flex>
      </Flex>
      {isOpen && renderPanel()}
    </Flex>
  );
};

export default FiltersPanelItem;

export const filtersPanelItemStyles = {
  filtersPanelItem: {
    openBg: "#F0F2F5",
    closeBg: "#F0F2F595",
    fontColor: "#282F36",
    countColor: "#818197",
    countBg: "white"
  }
}
