import { useEffect } from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';

function Overview() {
  const { setUsedFilters, setShowFiltersPanel } = useFiltersContext();

  // Clear filters when Overview page loads
  useEffect(() => {
    setUsedFilters([]);
    setShowFiltersPanel(false);
    return () => {
      // Cleanup if needed
    };
  }, [setUsedFilters, setShowFiltersPanel]);

  return (
    <Flex
      data-id="overview-page"
      direction="column"
      h="100%"
      w="100%">
      <Box
        data-id="overview-content"
        flex="1"
        overflowY="auto"
        p={6}>
        <Text
          data-id="overview-title"
          fontSize="2xl"
          fontWeight="bold"
          mb={4}>
          Overview
        </Text>
        <Text
          data-id="overview-description"
          color="gray.600">
          Welcome to the Overview page. This page provides a high-level view of the Conforme platform.
        </Text>
      </Box>
    </Flex>
  );
}

export default Overview;

