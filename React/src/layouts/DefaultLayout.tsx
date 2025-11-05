import { Flex } from '@chakra-ui/react';

import FiltersPanel from '../components/Filters/FiltersPanel';
import NavigationBottomMobile from '../components/NavigationBottomMobile';
import NavigationLeft from '../components/NavigationLeft/NavigationLeft';
import NavigationTop from '../components/NavigationTop';
import ShareModal from '../components/ShareModal';
import { useFiltersContext } from '../contexts/FiltersProvider';
import ShareProvider from '../contexts/ShareProvider';
import useDevice from '../hooks/useDevice';

function DefaultLayout({ component: Component }: { component: any }) {
  const { usedFilters } = useFiltersContext();
  const device = useDevice();
  return (
    <ShareProvider data-id="000211">
      <Flex data-id="000212" minH="100vh" h="full" maxH="100vh" overflow="hidden">
        <NavigationLeft data-id="000213" />
        <Flex
          data-id="000214"
          direction="column"
          flexBasis="auto"
          flexGrow={1}
          h="100vh"
          w="full"
          overflow="hidden"
        >
          <NavigationTop data-id="000215" />
          <ShareModal data-id="000216" />
          <Component data-id="000218" />

          {device === 'mobile' && <NavigationBottomMobile data-id="000219" />}
        </Flex>
        {usedFilters?.length > 0 && <FiltersPanel data-id="000220" />}
      </Flex>
    </ShareProvider>
  );
}

export default DefaultLayout;
