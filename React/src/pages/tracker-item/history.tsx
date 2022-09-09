import { Box, Flex, Text } from '@chakra-ui/react';
import { getTime } from 'date-fns';
import { t } from 'i18next';
import pluralize from 'pluralize';

import Loader from '../../components/Loader';
import HistoricalListItem from '../../components/Response/HistoricalListItem';
import { useResponseContext } from '../../contexts/ResponseProvider';

const Team = () => {
  const { snapshotsLoading, snapshots } = useResponseContext();

  if (snapshotsLoading) {
    return (
      <Flex bg="historyPage.bg" h="full" rounded="20px" w="full">
        <Loader center />
      </Flex>
    );
  }

  return (
    <Box bg="historyPage.bg" borderRadius="20px" h="fit-content" mb={7} minH="full" pb={7} w="full">
      <Flex
        bg="white"
        borderBottom="1px solid"
        borderColor="historyPage.border"
        borderTopRadius="20px"
        color="historyPage.font"
        fontSize="11px"
        fontWeight="semi_medium"
        p="15px 25px"
      >
        <Flex alignItems="center" w="30%">
          <Text>Item name</Text>
        </Flex>
        <Flex alignItems="center" w="20%">
          <Text>Renewed</Text>
        </Flex>
        <Flex alignItems="center" w="25%">
          <Text>Responsible</Text>
        </Flex>
        <Flex alignItems="center" w="25%">
          <Text>Last updated by</Text>
        </Flex>
      </Flex>
      <Flex flexDir="column" h={['full', 'calc(100vh - 280px)', 'calc(100vh - 270px)']} overflowY="auto" w="full">
        {snapshots.map((response) => (
          <HistoricalListItem key={getTime(new Date(response.lastCompletionDate!))} response={response} />
        ))}
        {snapshots.length === 0 && (
          <Flex fontSize="18px" fontStyle="italic" h="full" justify="center" mt={4} w="full">
            No historical {pluralize(t('tracker item'))} responses found
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export const historyPageStyles = {
  historyPage: {
    bg: '#FFFFFF',
    border: '#F0F0F0',
    font: '#818197',
  },
};

export default Team;
