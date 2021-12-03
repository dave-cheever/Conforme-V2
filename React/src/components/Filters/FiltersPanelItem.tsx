import { useMemo } from "react";
import { Flex, Text, useDisclosure, Box } from "@chakra-ui/react";

import { useFiltersContext } from "../../contexts/FiltersProvider";
import {ArrowUpIcon,ArrowDownIcon,ResetIcon} from '../../icons';
import IFilter from "../../interfaces/IFilter";
import BusinessUnitFilter from "./BusinessUnitFilter";
import CategoryFilter from "./CategoryFilter";
import ComplianceItemFilter from "./ComplianceItemFilter";
import DueDateFilter from "./DueDateFilter";
import ItemStatusFilter from "./ItemStatusFilter";
import RegulatoryBodyFilter from "./RegulatoryBodyFilter";
import UserFilter from "./UserFilter";

const FiltersPanelItem = ({ name, filter }: { name: string, filter: IFilter }) => {
  const {isOpen,onToggle} = useDisclosure();
  const {
    setFilters,
    filtersValues
  } = useFiltersContext();

  const filtersLength = useMemo(() => {
    return filtersValues[name]?.value?.length || 0;
  },[filtersValues, name]);

  const renderPanel = () => {
    switch (name) {
      case "itemStatus":
        return <ItemStatusFilter/>;
    
      case "businessUnitsIds":
        return <BusinessUnitFilter/>;

      case "categoriesIds":
        return <CategoryFilter/>;

      case "complianceItemsIds":
        return <ComplianceItemFilter/>;

      case "dueDate":
        return <DueDateFilter/>;

      case "regulatoryBodiesIds":
        return <RegulatoryBodyFilter/>;

      case "usersIds":
        return <UserFilter/>;

      default:
        break;
    }
  }

  const resetFilter = () => {
    let updatedFiltersValue = {...filtersValues};
    updatedFiltersValue[name].value = [];

    setFilters({filters: updatedFiltersValue});
  }

  return (
    <Flex
      key={name}
      justify="center"
      p='3'
      w="full"
      bg="filtersPanelItem.bg"
      borderRadius="10px"
      my={2}
      flexDir="column"
    >
      <Flex w="full" mb={isOpen ? "4" : "0"} align="center" justify="space-between" cursor="pointer">
        <Text w="full" fontSize="14px" color="filtersPanelItem.fontColor" onClick={onToggle}>{filter.name}</Text>
        <Flex>
        {(filtersLength > 0) &&  <Box fontSize="12px" bg="white" color="filtersPanel.countColor" px="3" borderRadius="10px" fontWeight="bold" mr="2">{filtersLength}</Box>}
        {(isOpen && filtersLength > 0) && <ResetIcon mr={3} onClick={resetFilter}/>}
        {isOpen ?<ArrowUpIcon  onClick={onToggle}/> : <ArrowDownIcon  onClick={onToggle}/>}
        </Flex>
      </Flex>
      {isOpen && renderPanel()}
    </Flex>
  );
};

export default FiltersPanelItem;

export const filtersPanelItemStyles = {
  filtersPanelItem:{
    bg: "#F0F2F595",
    fontColor:"#282F36",
    countColor: "#818197"
  }
}
