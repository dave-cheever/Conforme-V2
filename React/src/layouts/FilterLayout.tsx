import { Flex, Box } from "@chakra-ui/react";

import FiltersPanel from "../components/Filters/FiltersPanel";
import NavigationBottomMobile from "../components/NavigationBottomMobile";
import NavigationLeft from "../components/NavigationLeft/NavigationLeft";
import NavigationTop from "../components/NavigationTop";
import { useFiltersContext } from "../contexts/FiltersProvider";
import useDevice from "../hooks/useDevice";

const FilterLayout = ({ component: Component }: { component: any }) => {
  const { usedFilters } = useFiltersContext();
  const device = useDevice();

  return (
    <Flex minH='100vh'>
      <NavigationLeft/>
      <Flex
        direction="column"
        flexBasis="auto"
        flexGrow={1}
        overflow="auto"
      >
        <NavigationTop />
        <Box h={["calc(100vh - 140px)", "full"]} mt={["80px", 0]} overflow="none" bg="layout.bg">
          <Component />
        </Box>
        {device === "mobile" && <NavigationBottomMobile />}
      </Flex>
      {usedFilters.length > 0 && <FiltersPanel/>}
    </Flex>
  );
};

export default FilterLayout;
