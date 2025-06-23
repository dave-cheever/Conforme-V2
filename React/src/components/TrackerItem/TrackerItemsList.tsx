import InfiniteScroll from 'react-infinite-scroller';

import { Box, Flex } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import { IResponse } from '../../interfaces/IResponse';
import AdminTableHeader from '../Admin/AdminTableHeader';
import AdminTableHeaderElement from '../Admin/AdminTableHeaderElement';
import Loader from '../Loader';
import TrackerListItem from './TrackerListItem';

function TrackerListItems({
  responses,
  loading,
  total,
  sortOrder,
  sortType,
  scrollerRef,
  loadResponses,
  setSortOrder,
  setSortType,
}: {
  responses: IResponse[];
  loading: boolean;
  total: number;
  sortOrder: 'asc' | 'desc';
  sortType: string;
  scrollerRef: any; // Using 'any' as there is no exported interface to use
  loadResponses: (page: number) => Promise<void>;
  setSortType: (key: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
}) {

  return <Box bg="#ffffff" data-id="c629b7df65d2" h="full" overflow="none" p={[3, 6]} w="full">
    <Box
      bg="trackerList.bg"
      border="1px solid #E2E8F0"
      borderRadius="10px"
      data-id="4619f99c26b4"
      h="fit-content"
      mb={7}
      minH="full"
      pb={7}
      w="full">
      <AdminTableHeader data-id="c9ff3d9f5e18">
        <AdminTableHeaderElement
          data-id="2c1b1a674169"
          label="Item name"
          onClick={() => {
            setSortType('trackerItem.name');
            setSortOrder(sortOrder === 'asc' && sortType === 'trackerItem.name' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'trackerItem.name'}
          sortOrder={sortType === 'trackerItem.name' ? sortOrder : undefined}
          w="13%" />
        <AdminTableHeaderElement
          data-id="fa257b7cb259"
          label="Due for renewal"
          onClick={() => {
            setSortType('dueDate');
            setSortOrder(sortOrder === 'asc' && sortType === 'dueDate' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'dueDate'}
          sortOrder={sortType === 'dueDate' ? sortOrder : undefined}
          w="11%" />
        <AdminTableHeaderElement
          data-id="dd6f521e1d31"
          label={capitalize(t('compliant'))}
          onClick={() => {
            setSortType('calculatedStatus');
            setSortOrder(sortOrder === 'asc' && sortType === 'calculatedStatus' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'calculatedStatus'}
          sortOrder={sortType === 'calculatedStatus' ? sortOrder : undefined}
          w="8%" />
          <AdminTableHeaderElement
          data-id="dd6f521e1d31"
          label={capitalize(t('evidence'))}

          w="12%" />
           <AdminTableHeaderElement
          data-id="dd6f521e1d31"
          label={capitalize(t('category'))}
          w="12%" />
        <AdminTableHeaderElement
          data-id="b403f441bee2"
          label="Regulatory body"
          onClick={() => {
            setSortType('trackerItem.regulatoryBody.name');
            setSortOrder(sortOrder === 'asc' && sortType === 'trackerItem.regulatoryBody.name' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'trackerItem.regulatoryBody.name'}
          sortOrder={sortType === 'trackerItem.regulatoryBody.name' ? sortOrder : undefined}
          w="12%"/>
        <AdminTableHeaderElement
          data-id="c7ff17c8d353"
          label="Responsible"
          onClick={() => {
            setSortType('responsible.displayName');
            setSortOrder(sortOrder === 'asc' && sortType === 'responsible.displayName' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'responsible.displayName'}
          sortOrder={sortType === 'responsible.displayName' ? sortOrder : undefined}
          w="13%" />
        <AdminTableHeaderElement
          data-id="3c0328581ec0"
          label={capitalize(t('business unit'))}
          onClick={() => {
            setSortType('businessUnit.name');
            setSortOrder(sortOrder === 'asc' && sortType === 'businessUnit.name' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'businessUnit.name'}
          sortOrder={sortType === 'businessUnit.name' ? sortOrder : undefined}
          w="12%" />
        {/* {(module?.customQuestionsInDashboard || []).length > 0 && (
          <AdminTableHeaderElement
            label={module!.customQuestionsInDashboard[0]}
            w="10%" />
        )}
        {(module?.customQuestionsInDashboard || []).length > 1 && (
          <AdminTableHeaderElement
            label={module!.customQuestionsInDashboard[1]}
            w="10%" />
        )} */}
         <AdminTableHeaderElement
          data-id="dd6f521e1d31"
          label={capitalize(t('location'))}
          w="8%" />
      </AdminTableHeader>

      <Flex
        data-id="199e6641ce84"
        flexDir="column"
        h={['full', 'calc(100vh - 280px)', 'calc(100vh - 270px)']}
        overflowY="auto"
        w="full">
        <InfiniteScroll
          data-id="bdc800eaf22d"
          hasMore={!loading && responses.length < total}
          initialLoad={false}
          loadMore={loadResponses}
          ref={scrollerRef}
          useWindow={false}>
          {responses?.map((response) => (
            <TrackerListItem data-id="024c9586ed68" key={response._id} response={response} />
          ))}
          {loading && <Loader center data-id="2965be834216" h="60px" key="infinite-loader" />}
        </InfiniteScroll>
      </Flex>
    </Box>
  </Box>
}

export default TrackerListItems;

export const trackerListItemsStyles = {
  trackerList: {
    bg: 'white',
    compliant: '#62c240',
    nonCompliant: '#FC5960',
    comingUp: '#FFA012',
    fontColor: '#282F36',
    buildingIcon: '#2B3236',
    crossIcon: '#FC5960',
    tickIcon: '#41BA17',
    imageBg: '#ffffff',
    evidenceFontColor: '#818197',
    headerBorderColor: '#F0F0F0',
  },
};
