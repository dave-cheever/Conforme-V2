import { Flex, Box } from "@chakra-ui/layout";
import { useMemo } from "react";

import { useFiltersContext } from "../../contexts/FiltersProvider";
import { responseStatuses } from "../../hooks/useResponseUtils";

const NavigationLeftFilters = ({ filter, menuOpen, setFiltersOpen }: { filter: any, menuOpen?: boolean, setFiltersOpen?: (value: boolean) => void }) => {
  const {
    filtersValues,
    setFilters
  } = useFiltersContext();
  const itemStatusFilterValue = useMemo(() => filtersValues.itemStatus?.value, [filtersValues]) as string[];

  const updateFilters = (name: any) => {
    let newValue: any = [];
    const value = filtersValues.itemStatus?.value || [];
    if (name === 'all') {
      newValue = [];
    } else if (!value.includes(name)) {
      newValue = [...value, name];
    } else {
      newValue = value.filter(item => item !== name);
    }
    setFilters({ itemStatus: newValue });
  };

  return (
    <Flex direction="column" key={filter[0]}>
      {(filter[0] === "comingUp") && <Flex py={2}>
        <Flex ml="25px" w="30px" opacity="0.3" h="1px" rounded="lg" bg="navigationLeftFilters.seperator" />
      </Flex>}
      <Flex
        w={["170px", "175px"]}
        position="relative"
        right={[0, "37px"]}
        key={filter[0]}
        ml={["25px", "60px", "70px"]}
        fontSize="14px"
        fontWeight="400"
        lineHeight="40px"
        onClick={() => {
          updateFilters(filter[0]);
          setFiltersOpen && setFiltersOpen(false);
        }}
        color={(filter[0] === 'all')
          ? (itemStatusFilterValue?.length === 0
            ? "navigationLeftFilters.selectedFontColor" : "navigationLeftFilters.unselectedFontColor")
          : itemStatusFilterValue?.includes(filter[0])
            ? "navigationLeftFilters.selectedFontColor" : "navigationLeftFilters.unselectedFontColor"
        }
        cursor="pointer"
        justify="space-between"
        align="center"
      >
        <Flex align="center">
          <Box h="8px" w="8px" mr={8} rounded="full" bg={`navigationLeftFilters.${filter[0]}`}></Box>
          {responseStatuses[filter[0]]}
        </Flex>
        <Flex
          position="relative"
          left="10px"
          w="34px"
          h="20px"
          rounded="10px"
          color={(filter[0] === "all" && itemStatusFilterValue?.length === 0)
            ? "navigationLeftFilters.selectedLabelFontColor"
            : (itemStatusFilterValue?.includes(filter[0])
              ? "navigationLeftFilters.selectedLabelFontColor"
              : "navigationLeftFilters.unselectedLabelFontColor"
            )}
          fontSize="11px"
          fontWeight="700"
          align="center"
          justify="center"
          bg={(filter[0] === "all" && itemStatusFilterValue?.length === 0)
            ? "navigationLeftFilters.selectedLabelBg"
            : (itemStatusFilterValue?.includes(filter[0])
              ? "navigationLeftFilters.selectedLabelBg"
              : "navigationLeftFilters.unselectedLabelBg"
            )}
        >{filter[1]}</Flex>
      </Flex>
    </Flex>
  )
};

export default NavigationLeftFilters;

export const navigationLeftFiltersStyles = {
  navigationLeftFilters: {
    all: "#818197",
    compliant: "#41B916",
    nonCompliant: "#E93C44",
    comingUp: "#FF9A00",
    selectedLabelBg: "#282F36",
    unselectedLabelBg: "#ffffff",
    selectedLabelFontColor: "#ffffff",
    unselectedLabelFontColor: "#818197",
    selectedFontColor: "#282F36",
    unselectedFontColor: "#818197",
    seperator: "#818197",
  }
}