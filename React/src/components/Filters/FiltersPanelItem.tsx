import { CloseIcon } from "@chakra-ui/icons";
import { Flex, Box, Wrap, WrapItem } from "@chakra-ui/layout";

import { useFiltersContext } from "../../contexts/FiltersProvider";
import useFiltersUtils, { initialFilters } from "../../hooks/useFiltersUtils";
import { ChevronRight } from "../../icons";
import IFilter from "../../interfaces/IFilter";

const FiltersPanelItem = ({ name, filter }: { name: string, filter: IFilter }) => {
  const {
    setFilters,
    setOpenedFilterPanel,
  } = useFiltersContext();
  const {
    getFirstValue,
  } = useFiltersUtils();
  const filtersLength = Array.isArray(filter.value) ? filter.value.length : filter.value ? 1 : 0;

  return (
    <Flex
      key={name}
      cursor='pointer'
      justify='space-between'
      align='center'
      h='70px' px='4'
      borderBottomWidth='1px'
      borderBottomColor='brand.divider'
      onClick={() => setOpenedFilterPanel(name)}
    >
      <Box color='#2B3236' fontWeight='700'>
        <Box color='#9A9EA1' fontWeight='400' fontSize='14px'>{filter.name}</Box>
        <Wrap>
          {filtersLength > 0 ?
            <WrapItem>{getFirstValue(name)}</WrapItem> :
            <WrapItem>All</WrapItem>
          }
        </Wrap>
      </Box>
      <Flex align='center'>
        {filtersLength > 1 && <Flex alignItems='center' h='22px' px='5px' rounded='md' mr='3' bg='#9A9EA1' color='#FFFFFF' fontSize='11px'>+{filtersLength - 1}</Flex>}
        {filtersLength > 0 &&
          <CloseIcon
            w={5}
            h={5}
            mr='4'
            p={1}
            color='#FC5960'
            _hover={{ opacity: '0.7' }}
            onClick={e => {
              // Reset filter
              setFilters({ [name]: initialFilters[name].value });
              e.stopPropagation();
            }}
          />}
        <ChevronRight color="#2B3236" mr='1' />
      </Flex>
    </Flex>
  );
};

export default FiltersPanelItem;
