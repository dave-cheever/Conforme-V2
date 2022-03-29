import { Flex } from '@chakra-ui/react';

import FiltersPanel from '../components/Filters/FiltersPanel';
import NavigationBottomMobile from '../components/NavigationBottomMobile';
import NavigationLeft from '../components/NavigationLeft/NavigationLeft';
import NavigationTop from '../components/NavigationTop';
import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';

const FilterLayout = ({ component: Component }: { component: any }) => {
  const { usedFilters } = useFiltersContext();
  const device = useDevice();

  return (
    <Flex bg="layout.bg" minH="100vh">
      <NavigationLeft />
      <Flex direction="column" overflow="auto" position="relative" w="full">
        <NavigationTop />
        <Flex
          flexDirection="column"
          h="calc(100vh - 80px)"
          overflow="auto"
          position="absolute"
          top="80px"
          w="full"
        >
          <Component />
        </Flex>
        {device === 'mobile' && <NavigationBottomMobile />}
      </Flex>
      {usedFilters.length > 0 && <FiltersPanel />}
    </Flex>
  );
};

export default FilterLayout;
