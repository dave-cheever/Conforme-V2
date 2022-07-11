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
  editAction,
}: {
  actions: IAction[];
  sortOrder: 'asc' | 'desc';
  sortType: string;
  setSortType: (key: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  editAction: (action: IAction) => void;
}) => (
  <Box h="full" ml="10px" overflow="none" p={[3, 6]} w="full">
    <Box bg="actionsList.bg" borderRadius="20px" h="fit-content" mb={7} minH="full" pb={7} w="full">
      <AdminTableHeader>
        <AdminTableHeaderElement
          label="Title"
          onClick={() => {
            setSortType('title');
            setSortOrder(sortOrder === 'asc' && sortType === 'title' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'title'}
          sortOrder={sortType === 'title' ? sortOrder : undefined}
          w="25%"
        />
        <AdminTableHeaderElement
          label="Due date"
          onClick={() => {
            setSortType('dueDate');
            setSortOrder(sortOrder === 'asc' && sortType === 'dueDate' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'dueDate'}
          sortOrder={sortType === 'dueDate' ? sortOrder : undefined}
          w="10%"
        />
        <AdminTableHeaderElement
          label="Completed date"
          onClick={() => {
            setSortType('completedDate');
            setSortOrder(sortOrder === 'asc' && sortType === 'completedDate' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'completedDate'}
          sortOrder={sortType === 'completedDate' ? sortOrder : undefined}
          w="10%"
        />
        <AdminTableHeaderElement
          label="Status"
          onClick={() => {
            setSortType('status');
            setSortOrder(sortOrder === 'asc' && sortType === 'status' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'status'}
          sortOrder={sortType === 'status' ? sortOrder : undefined}
          w="10%"
        />
        <AdminTableHeaderElement
          label="Assignee"
          onClick={() => {
            setSortType('assignee.displayName');
            setSortOrder(sortOrder === 'asc' && sortType === 'assignee.displayName' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'assignee.displayName'}
          sortOrder={sortType === 'assignee.displayName' ? sortOrder : undefined}
          w="10%"
        />
        <AdminTableHeaderElement
          label="Assigned by"
          onClick={() => {
            setSortType('assignor.displayName');
            setSortOrder(sortOrder === 'asc' && sortType === 'assignor.displayName' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'assignor.displayName'}
          sortOrder={sortType === 'assignor.displayName' ? sortOrder : undefined}
          w="10%"
        />
        <AdminTableHeaderElement
          label="Site"
          onClick={() => {
            setSortType('answer.audit.site.name');
            setSortOrder(sortOrder === 'asc' && sortType === 'answer.audit.site.name' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'answer.audit.site.name'}
          sortOrder={sortType === 'answer.audit.site.name' ? sortOrder : undefined}
          w="12.5%"
        />
        <AdminTableHeaderElement
          label="Area"
          onClick={() => {
            setSortType('answer.audit.area.name');
            setSortOrder(sortOrder === 'asc' && sortType === 'answer.audit.area.name' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'answer.audit.area.name'}
          sortOrder={sortType === 'answer.audit.area.name' ? sortOrder : undefined}
          w="12.5%"
        />
      </AdminTableHeader>
      <Flex flexDir="column" h={['full', 'calc(100vh - 340px)', 'calc(100vh - 325px)']} overflowY="auto" w="full">
        {actions?.map((action) => (
          <ActionsListItem action={action} editAction={editAction} key={action._id} />
        ))}
      </Flex>
    </Box>
  </Box>
);

export default ActionsList;

export const actionsListStyles = {
  actionsList: {
    bg: 'white',
    open: '#282F36',
    closed: '#282F36',
    overdue: '#FC5960',
    fontColor: '#282F36',
    buildingIcon: '#2B3236',
    crossIcon: '#FC5960',
    tickIcon: '#41BA17',
    imageBg: '#ffffff',
    evidenceFontColor: '#818197',
    headerBorderColor: '#F0F0F0',
  },
};
