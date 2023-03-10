import { Box, Flex } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

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
  <Box
    data-id="b7d84f3800a4"
    h="full"
    ml="10px"
    overflow="none"
    p={[3, 6]}
    w="full">
    <Box
      bg="actionsList.bg"
      borderRadius="20px"
      data-id="990abd4a03ea"
      h="fit-content"
      minH="full"
      pb={7}
      w="full">
      <AdminTableHeader data-id="9bb2aff270ed">
        <AdminTableHeaderElement
          data-id="1ac37e957da1"
          label="Title"
          onClick={() => {
            setSortType('title');
            setSortOrder(sortOrder === 'asc' && sortType === 'title' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'title'}
          sortOrder={sortType === 'title' ? sortOrder : undefined}
          w="17%" />
        <AdminTableHeaderElement
          data-id="491ffb916d90"
          label="Priority"
          onClick={() => {
            setSortType('priority');
            setSortOrder(sortOrder === 'asc' && sortType === 'priority' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'priority'}
          sortOrder={sortType === 'priority' ? sortOrder : undefined}
          w="8%" />
        <AdminTableHeaderElement
          data-id="407690a3370e"
          label="Due date"
          onClick={() => {
            setSortType('dueDate');
            setSortOrder(sortOrder === 'asc' && sortType === 'dueDate' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'dueDate'}
          sortOrder={sortType === 'dueDate' ? sortOrder : undefined}
          w="10%" />
        <AdminTableHeaderElement
          data-id="09bd1797f543"
          label="Completed date"
          onClick={() => {
            setSortType('completedDate');
            setSortOrder(sortOrder === 'asc' && sortType === 'completedDate' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'completedDate'}
          sortOrder={sortType === 'completedDate' ? sortOrder : undefined}
          w="10%" />
        <AdminTableHeaderElement
          data-id="cc0d650897d0"
          label="Status"
          onClick={() => {
            setSortType('status');
            setSortOrder(sortOrder === 'asc' && sortType === 'status' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'status'}
          sortOrder={sortType === 'status' ? sortOrder : undefined}
          w="10%" />
        <AdminTableHeaderElement
          data-id="86884fada2c3"
          label="Assignee"
          onClick={() => {
            setSortType('assignee.displayName');
            setSortOrder(sortOrder === 'asc' && sortType === 'assignee.displayName' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'assignee.displayName'}
          sortOrder={sortType === 'assignee.displayName' ? sortOrder : undefined}
          w="10%" />
        <AdminTableHeaderElement
          data-id="46ee67f292a9"
          label="Created by"
          onClick={() => {
            setSortType('creator.displayName');
            setSortOrder(sortOrder === 'asc' && sortType === 'creator.displayName' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'creator.displayName'}
          sortOrder={sortType === 'creator.displayName' ? sortOrder : undefined}
          w="10%" />
        <AdminTableHeaderElement
          data-id="0a6373144493"
          label={capitalize(t('location'))}
          onClick={() => {
            setSortType('answer.audit.location.name');
            setSortOrder(sortOrder === 'asc' && sortType === 'answer.audit.location.name' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'answer.audit.location.name'}
          sortOrder={sortType === 'answer.audit.location.name' ? sortOrder : undefined}
          w="12.5%" />
        <AdminTableHeaderElement
          data-id="9c957de57e7e"
          label={capitalize(t('business unit'))}
          onClick={() => {
            setSortType('answer.businessUnit.name');
            setSortOrder(sortOrder === 'asc' && sortType === 'answer.businessUnit.name' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'answer.businessUnit.name'}
          sortOrder={sortType === 'answer.businessUnit.name' ? sortOrder : undefined}
          w="12.5%" />
      </AdminTableHeader>
      <Flex
        data-id="d2679eb5f11a"
        flexDir="column"
        h="calc(100vh - 310px)"
        overflowY="auto"
        w="full">
        {actions?.map((action) => (
          <ActionsListItem
            action={action}
            data-id="762781f1bbe5"
            editAction={editAction}
            key={action._id} />
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
