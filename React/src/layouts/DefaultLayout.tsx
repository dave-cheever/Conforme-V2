import { Flex } from '@chakra-ui/react';

import FiltersPanel from '../components/Filters/FiltersPanel';
import ModuleSwitcher from '../components/ModuleSwitcher';
import NavigationBottomMobile from '../components/NavigationBottomMobile';
import NavigationLeft from '../components/NavigationLeft/NavigationLeft';
import NavigationTop from '../components/NavigationTop';
import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';

const DefaultLayout = ({ component: Component }: { component: any }) => {
  const { usedFilters } = useFiltersContext();
  const device = useDevice();

  return (
    <Flex minH="100vh">
      <ModuleSwitcher />
      <NavigationLeft />
      <Flex direction="column" flexBasis="auto" flexGrow={1} position="relative">
        <NavigationTop />
        <Flex
          bg="layout.bg"
          flexDirection="column"
          h={['calc(100vh - 140px)', 'calc(100vh - 80px)']}
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

export default DefaultLayout;
