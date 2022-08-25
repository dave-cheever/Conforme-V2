import { Box, Flex } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import { IResponse } from '../../interfaces/IResponse';
import AdminTableHeader from '../Admin/AdminTableHeader';
import AdminTableHeaderElement from '../Admin/AdminTableHeaderElement';
import TrackerListItem from './TrackerListItem';

const TrackerListItems = ({
  responses,
  sortOrder,
  sortType,
  setSortOrder,
  setSortType,
}: {
  responses: IResponse[];
  sortOrder: 'asc' | 'desc';
  sortType: string;
  setSortType: (key: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
}) => (
  <Box h="full" ml="10px" overflow="none" p={[3, 6]} w="full">
    <Box bg="trackerList.bg" borderRadius="20px" h="fit-content" mb={7} minH="full" pb={7} w="full">
      <AdminTableHeader>
        <AdminTableHeaderElement
          label="Item name"
          onClick={() => {
            setSortType('trackerItem.name');
            setSortOrder(sortOrder === 'asc' && sortType === 'trackerItem.name' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'trackerItem.name'}
          sortOrder={sortType === 'trackerItem.name' ? sortOrder : undefined}
          w="20%"
        />
        <AdminTableHeaderElement
          label="Due for renewal"
          onClick={() => {
            setSortType('dueDate');
            setSortOrder(sortOrder === 'asc' && sortType === 'dueDate' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'dueDate'}
          sortOrder={sortType === 'dueDate' ? sortOrder : undefined}
          w="12%"
        />
        <AdminTableHeaderElement
          label={capitalize(t('compliant'))}
          onClick={() => {
            setSortType('status');
            setSortOrder(sortOrder === 'asc' && sortType === 'status' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'status'}
          sortOrder={sortType === 'status' ? sortOrder : undefined}
          w="10%"
        />
        <AdminTableHeaderElement
          label="Regulatory body"
          onClick={() => {
            setSortType('regulatoryBody.name');
            setSortOrder(sortOrder === 'asc' && sortType === 'regulatoryBody.name' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'regulatoryBody.name'}
          sortOrder={sortType === 'regulatoryBody.name' ? sortOrder : undefined}
          w="18%"
        />
        <AdminTableHeaderElement
          label="Responsible"
          onClick={() => {
            setSortType('responsible.displayName');
            setSortOrder(sortOrder === 'asc' && sortType === 'responsible.displayName' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'responsible.displayName'}
          sortOrder={sortType === 'responsible.displayName' ? sortOrder : undefined}
          w="20%"
        />
        <AdminTableHeaderElement
          label={capitalize(t('business unit'))}
          onClick={() => {
            setSortType('businessUnit.name');
            setSortOrder(sortOrder === 'asc' && sortType === 'businessUnit.name' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'businessUnit.name'}
          sortOrder={sortType === 'businessUnit.name' ? sortOrder : undefined}
          w="20%"
        />
      </AdminTableHeader>
      <Flex flexDir="column" h={['full', 'calc(100vh - 280px)', 'calc(100vh - 270px)']} overflowY="auto" w="full">
        {responses?.map((response) => (
          <TrackerListItem key={response._id} response={response} />
        ))}
      </Flex>
    </Box>
  </Box>
);

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
