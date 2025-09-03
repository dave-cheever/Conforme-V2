import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { Flex, Stack } from '@chakra-ui/react';

import useResponseUtils from '../../hooks/useResponseUtils';
import { IResponse } from '../../interfaces/IResponse';
import TrackerItemSquare from './TrackerItemSquare';

const InfiniteScrollComponent = InfiniteScroll as unknown as React.FC<any>;

function TrackerGridItems({
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
}) {
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
      data-id="030925-f0f3df"
      direction="column"
      key={group}
      minW="380px"
      pl={8}
      pr={3}
      pt={2}
      w="380px">
      <Flex
        data-id="030925-f58750"
        align="center"
        bg={`trackerGroup.${group}`}
        borderRadius={"md"}
        color="#FFFFFF"
        fontWeight="700"
        justify="space-between"
        justifyContent={"center"}
        mb={4}
        minH="40px"
        pl={5}
        pr={4}
        textColor={`trackerTextGroup.${group}`}
        w="full"
        >
        {responseStatusesGroup[group]}
      </Flex>
      <Stack
        data-id="030925-a0d9d9"
        align="center"
        bg={"#F7FAFC"}
        borderRadius={"md"}
        boxShadow={"sm"}
        direction="column"
        p={4}
        spacing={6}
        w="full">
        {filteredResults[group]
          ?.sort((a, b) => {
            if (a.dueDate === null) return 1;

            if (b.dueDate === null) return -1;

            return a.dueDate && b.dueDate ? a.dueDate.toString().localeCompare(b.dueDate.toString()) : 0;
          })
          ?.map((response: IResponse) => (
            <TrackerItemSquare data-id="030925-4aecde" isGroupView key={response._id} response={response} />
          ))}??
      </Stack>
    </Flex>
  );

  return (
    <InfiniteScrollComponent
        data-id="030925-334506"
        hasMore={!loading && responses.length < total}
        initialLoad={false}
        loadMore={loadResponses}
        ref={scrollerRef}
        useWindow={false}>
      <Flex data-id="030925-bfda06" bg="#ffffff" h="full" overflow="auto" pt="3" w="full">
        {Object.keys(responseStatusesGroup).map((status) => renderGroup(status))}
      </Flex>
    </InfiniteScrollComponent>
  );
}

export default TrackerGridItems;

export const trackerGroupItemsStyles = {
  trackerGroup: {
    compliant: '#C6F6D5',
    nonCompliant: '#FED7D7',
    comingUp: '#FEEBCB',
  },
  trackerTextGroup: {
    compliant: '#62c240',
    nonCompliant: '#FC5960',
    comingUp: '#FFA012',
  },
};
