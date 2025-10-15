import { useEffect, useRef } from 'react';

import { Box, Button, Flex, HStack, Spacer, useOutsideClick } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import useDevice from '../../hooks/useDevice';
import { CrossIcon, FilterWhite, ResetIcon } from '../../icons';
import { isPermitted } from '../can';
import FilterPreset from '../FilterPreset';
import FiltersPanelItem from './FiltersPanelItem';

function FiltersPanel() {
  const { user } = useAppContext();
  const { filtersValues, usedFilters, showFiltersPanel, setShowFiltersPanel, cleanFilters, applyFilters } = useFiltersContext();
  const panelRef = useRef(null);
  const device = useDevice();
  useOutsideClick({
    ref: panelRef,
    handler: () => setShowFiltersPanel(false),
  });
  useEffect(() => {
    if (showFiltersPanel && device === 'mobile') document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [device, showFiltersPanel]);

  if (!showFiltersPanel) return null;

  return (
    <Flex
      bg="filterPanel.bg"
      boxShadow="md"
      data-id="000121"
      direction="column"
      h="100vh"
      position={['relative', 'absolute']}
      ref={panelRef}
      right="0"
      shrink={0}
      w={['full', '523px']}
      zIndex="10"
    >
      <Flex
        align="center"
        basis={['55px', '58px']}
        borderBottom="1px solid #CBD5E0"
        data-id="000122"
        justify="space-between"
        px="4"
        shrink={0}
      >
        <Box color="brand.darkGrey" data-id="000123" fontSize="16px" fontWeight="700">
          Filters
        </Box>
        <CrossIcon cursor="pointer" data-id="000124" onClick={() => setShowFiltersPanel(false)} stroke="filterPanel.closeIconColor" />
      </Flex>
      <Flex data-id="000125" direction="column" grow={1} overflowY="auto" px="4">
        {Object.entries(filtersValues).map(([name, value]) => {
          if (usedFilters.includes(name) && !value?.hideFromPanel && isPermitted({ user, action: value?.permission }))
            return <FiltersPanelItem data-id="000126" filter={value} key={name} name={name} />;
          return null;
        })}
      </Flex>
      <Flex
        align="center"
        bg="filterPanel.bg"
        borderBottomStartRadius={['0px', '20px']}
        borderColor="#E2E8F0"
        borderTop="1px solid #CBD5E0"
        bottom={0}
        boxShadow={['0px 0px 80px rgba(49, 50, 51, 0.15)', 'none']}
        data-id="000127"
        gap="2"
        position={['sticky', 'relative']}
        px="4"
        py="3"
        w="full"
      >
        {/* Left group */}
        <HStack data-id="001519" spacing="3">
          <FilterPreset data-id="filter-preset" />

          <Button
            _hover={{ opacity: 0.9 }}
            bg="white"
            border="1px solid #CBD5E0"
            color="filterPanel.resetButtonColor"
            data-id="000129"
            fontSize="14px"
            fontWeight="500"
            h="35px"
            leftIcon={<ResetIcon data-id="001521" h="16px" transform="rotate(50deg)" w="16px" />}
            onClick={cleanFilters}
            variant="outline"
            w={['130px', '133px']}
          >
            Reset filters
          </Button>
        </HStack>

        {/* Push right */}
        <Spacer data-id="001522" />

        {/* Right CTA */}
        <Button
          _hover={{
            bg: 'filterPanel.doneButtonBg',
            color: 'filterPanel.doneButtonColor',
            opacity: 0.9,
          }}
          bg="filterPanel.doneButtonBg"
          color="filterPanel.doneButtonColor"
          data-id="000130"
          fontSize="14px"
          fontWeight="500"
          h="35px"
          leftIcon={<FilterWhite data-id="001523" h="18px" mt="5px" w="18px" />}
          onClick={() => {
            applyFilters();
            setShowFiltersPanel(false);
          }}
          variant="solid"
          w={['130px', '133px']}
        >
          Apply filters
        </Button>
      </Flex>
    </Flex>
  );
}

export default FiltersPanel;

export const filtersPanelStyles = {
  filterPanel: {
    bg: 'white',
    closeIconColor: '#1F1F1F',
    doneButtonBg: '#0068A3',
    doneButtonColor: '#ffffff',
    resetButtonBg: '#F5F5F5',
    resetButtonColor: '#2D3748',
    searchBoxBordercolor: '#81819750',
  },
};
