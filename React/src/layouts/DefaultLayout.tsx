import { Box, Flex } from '@chakra-ui/react';

import FiltersPanel from '../components/Filters/FiltersPanel';
import NavigationBottomMobile from '../components/NavigationBottomMobile';
import NavigationLeft from '../components/NavigationLeft/NavigationLeft';
import NavigationTop from '../components/NavigationTop';
import ShareModal from '../components/ShareModal';
import { useFiltersContext } from '../contexts/FiltersProvider';
import NavigationTopProvider from '../contexts/NavigationTopProvider';
import ShareProvider from '../contexts/ShareProvider';
import useDevice from '../hooks/useDevice';

function DefaultLayout({ component: Component }: { component: any }) {
  const { usedFilters, showFiltersPanel, setShowFiltersPanel } = useFiltersContext();
  const device = useDevice();
  return (
    <NavigationTopProvider data-id="003375">
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
          {usedFilters?.length > 0 && (
            <>
              {showFiltersPanel && (
                <Box
                  bg="black"
                  bottom="0"
                  data-id="filter-overlay"
                  left="0"
                  opacity={0.4}
                  position="fixed"
                  right="0"
                  top="0"
                  zIndex="11"
                  onClick={() => setShowFiltersPanel(false)}
                />
              )}
              <FiltersPanel data-id="000220" />
            </>
          )}
        </Flex>
      </ShareProvider>
    </NavigationTopProvider>
  );
}

export default DefaultLayout;
