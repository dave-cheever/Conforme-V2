import { useEffect, useState } from 'react';

import { Flex, Stack } from '@chakra-ui/react';

import useResponseUtils from '../../hooks/useResponseUtils';
import { IResponse } from '../../interfaces/IResponse';
import TrackerItemSquare from './TrackerItemSquare';

const TrackerGridItems = ({ responses }: { responses: IResponse[] }) => {
  const [filteredResults, setFilteredResults] = useState<any>({});
  const { responseStatusesGroup } = useResponseUtils();

  useEffect(() => {
    const filteredResponses: any = {};
    filteredResponses.compliant = responses.filter((response) => response.calculatedStatus === 'compliant');
    filteredResponses.comingUp = responses.filter((response) => response.calculatedStatus === 'comingUp');
    filteredResponses.nonCompliant = responses.filter((response) => response.calculatedStatus === 'nonCompliant');
    setFilteredResults(filteredResponses);
  }, [responses]);

  const renderGroup = (group: string) => (
    <Flex direction="column" key={group} minW="calc(347px + 1rem)" pl={8} pr={3} pt={2}>
      <Flex
        align="center"
        bg={`trackerGroup.${group}`}
        color="#FFFFFF"
        fontWeight="700"
        justify="space-between"
        mb={4}
        minH="40px"
        pl={5}
        pr={4}
        rounded="full"
        w="full"
      >
        {responseStatusesGroup[group]}
      </Flex>
      <Stack align="center" direction="column" pb={5} spacing={6} w="full">
        {filteredResults[group]
          ?.sort((a, b) => {
            if (a.dueDate === null) return 1;

            if (b.dueDate === null) return -1;

            return a.dueDate && b.dueDate ? a.dueDate.toString().localeCompare(b.dueDate.toString()) : 0;
          })
          ?.map((response: IResponse) => (
            <TrackerItemSquare key={response._id} response={response} />
          ))}
      </Stack>
    </Flex>
  );

  return (
    <Flex h="full" overflow="auto" pt="3" w="full">
      {Object.keys(responseStatusesGroup).map((status) => renderGroup(status))}
    </Flex>
  );
};

export default TrackerGridItems;

export const trackerGroupItemsStyles = {
  trackerGroup: {
    compliant: '#62c240',
    nonCompliant: '#FC5960',
    comingUp: '#FFA012',
  },
};
