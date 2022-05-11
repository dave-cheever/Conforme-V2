import { Box, Flex } from '@chakra-ui/react';

import { IAction } from '../../interfaces/IAction';
import AdminTableHeader from '../Admin/AdminTableHeader';
import AdminTableHeaderElement from '../Admin/AdminTableHeaderElement';
import ActionsListItem from './ActionsListItem';

const ActionsList = ({
  actions,
  sortOrder,
  sortType,
  setSortType,
  setSortOrder,
}: {
  actions: IAction[];
  sortOrder: boolean;
  sortType: string;
  setSortType: (key: string) => void;
  setSortOrder: (order: boolean) => void;
}) => (
  <Box h="full" ml="10px" overflow="none" p={[3, 6]} w="full">
    <Box
      bg="actionsList.bg"
      borderRadius="20px"
      h="fit-content"
      mb={7}
      minH="full"
      pb={7}
      w="full"
    >
      <AdminTableHeader>
        <AdminTableHeaderElement
          label="Title"
          onClick={() => {
            setSortType('title');
            setSortOrder(!sortOrder);
          }}
          showSortingIcon={sortType === 'title'}
          sortOrder={sortType === 'title' && !sortOrder}
          w="25%"
        />
        <AdminTableHeaderElement
          label="Due date"
          onClick={() => {
            setSortType('dueDate');
            setSortOrder(!sortOrder);
          }}
          showSortingIcon={sortType === 'dueDate'}
          sortOrder={sortType === 'dueDate' && !sortOrder}
          w="10%"
        />
        <AdminTableHeaderElement
          label="Completed date"
          onClick={() => {
            setSortType('completedDate');
            setSortOrder(!sortOrder);
          }}
          showSortingIcon={sortType === 'completedDate'}
          sortOrder={sortType === 'completedDate' && !sortOrder}
          w="10%"
        />
        <AdminTableHeaderElement
          label="Status"
          onClick={() => {
            setSortType('status');
            setSortOrder(!sortOrder);
          }}
          showSortingIcon={sortType === 'status'}
          sortOrder={sortType === 'status' && !sortOrder}
          w="10%"
        />
        <AdminTableHeaderElement
          label="Assignee"
          onClick={() => {
            setSortType('assignee');
            setSortOrder(!sortOrder);
          }}
          showSortingIcon={sortType === 'assignee.displayName'}
          sortOrder={sortType === 'assignee.displayName' && !sortOrder}
          w="20%"
        />
        <AdminTableHeaderElement
          label="Site"
          onClick={() => {
            setSortType('site');
            setSortOrder(!sortOrder);
          }}
          showSortingIcon={sortType === 'site.name'}
          sortOrder={sortType === 'site.name' && !sortOrder}
          w="12.5%"
        />
        <AdminTableHeaderElement
          label="Area"
          onClick={() => {
            setSortType('area');
            setSortOrder(!sortOrder);
          }}
          showSortingIcon={sortType === 'area.name'}
          sortOrder={sortType === 'area.name' && !sortOrder}
          w="12.5%"
        />
      </AdminTableHeader>
      <Flex
        flexDir="column"
        h={['full', 'calc(100vh - 340px)', 'calc(100vh - 325px)']}
        overflowY="auto"
        w="full"
      >
        {actions?.map((action) => (
          <ActionsListItem action={action} key={action._id} />
        ))}
      </Flex>
    </Box>
  </Box>
);

export default ActionsList;

export const actionsListStyles = {
  actionsList: {
    bg: 'white',
    open: '#62c240',
    closed: '#FC5960',
    inProgress: '#282F36',
    fontColor: '#282F36',
    buildingIcon: '#2B3236',
    crossIcon: '#FC5960',
    tickIcon: '#41BA17',
    imageBg: '#ffffff',
    evidenceFontColor: '#818197',
    headerBorderColor: '#F0F0F0',
  },
};
