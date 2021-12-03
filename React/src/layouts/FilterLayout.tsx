import { Flex, Box } from "@chakra-ui/react";

import FiltersPanel from "../components/Filters/FiltersPanel";
import NavigationLeft from "../components/NavigationLeft/NavigationLeft";
import NavigationTop from "../components/NavigationTop";
import { useFiltersContext } from "../contexts/FiltersProvider";

const FilterLayout = ({ component: Component }: { component: any }) => {

 const {
    usedFilters,
    } = useFiltersContext();

  return (
    <Flex minH='100vh'>
      <NavigationLeft/>
      <Flex
        w="calc(100% - 70px)"
        direction="column"
        flexBasis="auto"
        flexGrow={1}
        overflow="auto"
      >
        <NavigationTop />
        <Box h="full" overflow="none" bg="layout.bg">
          <Component />
        </Box>
      </Flex>
      {usedFilters.length > 0 && <FiltersPanel/>}
    </Flex>
  );
};

export default FilterLayout;
