import { Flex } from '@chakra-ui/react';

import FiltersPanel from '../components/Filters/FiltersPanel';
import ModuleSwitcher from '../components/ModuleSwitcher';
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
    (<ShareProvider data-id="c26ee54e23a7">
      <Flex data-id="82e11df66280" minH="100vh">
        <ModuleSwitcher data-id="e97e8f7ff427" />
        <NavigationLeft data-id="236b6594671a" />
        <Flex
          data-id="0faa875e8f2e"
          direction="column"
          flexBasis="auto"
          flexGrow={1}
          position="relative">
          <NavigationTop data-id="b699dce0996d" />
          <ShareModal data-id="45ffc2ebe27c" />
          <Flex
            bg="layout.bg"
            data-id="e5a4d37afdd0"
            flexDirection="column"
            h="calc(100vh - 80px)"
            position="absolute"
            top="80px"
            w="full">
            <Component data-id="a027466632ef" />
          </Flex>
          {device === 'mobile' && <NavigationBottomMobile data-id="6aac4f54493f" />}
        </Flex>
        {usedFilters?.length > 0 && <FiltersPanel data-id="ae5bbb725843" />}
      </Flex>
    </ShareProvider>)
  );
}

export default DefaultLayout;
