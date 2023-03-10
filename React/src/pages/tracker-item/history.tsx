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
      (<Flex
        bg="historyPage.bg"
        data-id="975dd01acb6d"
        h="full"
        rounded="20px"
        w="full">
        <Loader center data-id="0b2119ced720" />
      </Flex>)
    );
  }

  return (
    (<Box
      bg="historyPage.bg"
      borderRadius="20px"
      data-id="8e9704fcdad7"
      h="fit-content"
      mb={7}
      minH="full"
      pb={7}
      w="full">
      <Flex
        bg="white"
        borderBottom="1px solid"
        borderColor="historyPage.border"
        borderTopRadius="20px"
        color="historyPage.font"
        data-id="9a515238c447"
        fontSize="11px"
        fontWeight="semi_medium"
        p="15px 25px">
        <Flex alignItems="center" data-id="98d1e83d7ee1" w="30%">
          <Text data-id="c36662c77942">Item name</Text>
        </Flex>
        <Flex alignItems="center" data-id="9e932a96eb15" w="20%">
          <Text data-id="c912edf42db7">Renewed</Text>
        </Flex>
        <Flex alignItems="center" data-id="1289202c0f2e" w="25%">
          <Text data-id="c71c907e5ad3">Responsible</Text>
        </Flex>
        <Flex alignItems="center" data-id="60017add14c2" w="25%">
          <Text data-id="2387237aefad">Last updated by</Text>
        </Flex>
      </Flex>
      <Flex
        data-id="a43b2eb54eda"
        flexDir="column"
        h={['full', 'calc(100vh - 280px)', 'calc(100vh - 270px)']}
        overflowY="auto"
        w="full">
        {snapshots.map((response) => (
          <HistoricalListItem
            data-id="936276ff9f91"
            key={getTime(new Date(response.lastCompletionDate!))}
            response={response} />
        ))}
        {snapshots.length === 0 && (
          <Flex
            data-id="7c138995294e"
            fontSize="18px"
            fontStyle="italic"
            h="full"
            justify="center"
            mt={4}
            w="full">
            No historical {pluralize(t('tracker item'))} responses found
          </Flex>
        )}
      </Flex>
    </Box>)
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
