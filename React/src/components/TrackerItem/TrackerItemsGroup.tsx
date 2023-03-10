import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { Flex, Stack } from '@chakra-ui/react';

import useResponseUtils from '../../hooks/useResponseUtils';
import { IResponse } from '../../interfaces/IResponse';
import TrackerItemSquare from './TrackerItemSquare';

const TrackerGridItems = ({
  responses,
  loading,
  total,
  scrollerRef,
  loadResponses,
}: {
  responses: IResponse[];
  loading: boolean;
  total: number;
  scrollerRef: any; // Using 'any' as there is no exported interface to use
  loadResponses: (page: number) => Promise<void>;
}) => {
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
    <Flex
      data-id="38ff559a9b1e"
      direction="column"
      key={group}
      minW="calc(347px + 1rem)"
      pl={8}
      pr={3}
      pt={2}>
      <Flex
        align="center"
        bg={`trackerGroup.${group}`}
        color="#FFFFFF"
        data-id="a8547be36b6b"
        fontWeight="700"
        justify="space-between"
        mb={4}
        minH="40px"
        pl={5}
        pr={4}
        rounded="full"
        w="full">
        {responseStatusesGroup[group]}
      </Flex>
      <Stack
        align="center"
        data-id="7eea0b4006b9"
        direction="column"
        pb={5}
        spacing={6}
        w="full">
        {filteredResults[group]
          ?.sort((a, b) => {
            if (a.dueDate === null) return 1;

            if (b.dueDate === null) return -1;

            return a.dueDate && b.dueDate ? a.dueDate.toString().localeCompare(b.dueDate.toString()) : 0;
          })
          ?.map((response: IResponse) => (
            <TrackerItemSquare data-id="77e2a3bdac5d" key={response._id} response={response} />
          ))}
      </Stack>
    </Flex>
  );

  return (
    (<InfiniteScroll
      data-id="1a81faae9299"
      hasMore={!loading && responses.length < total}
      initialLoad={false}
      loadMore={loadResponses}
      ref={scrollerRef}
      useWindow={false}>
      <Flex data-id="efa7eba0e047" h="full" overflow="auto" pt="3" w="full">
        {Object.keys(responseStatusesGroup).map((status) => renderGroup(status))}
      </Flex>
    </InfiniteScroll>)
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
