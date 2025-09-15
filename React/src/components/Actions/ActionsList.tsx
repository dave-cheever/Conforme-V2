import { Box, Flex } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import { IAction } from '../../interfaces/IAction';
import AdminTableHeader from '../Admin/AdminTableHeader';
import AdminTableHeaderElement from '../Admin/AdminTableHeaderElement';
import ActionsListItem from './ActionsListItem';

function ActionsList({
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
}) {
  return (
    <Box
      bg="auditsList.bg"
      border="1px solid"
      borderColor="auditsList.headerBorderColor"
      borderRadius="10px"
      data-id="030925-636888"
      h="full"
      ml="10px"
      overflow="hidden"
      w="full"
    >
      <Box bg="auditsList.bg" data-id="030925-7e7535" h="fit-content" minH="full" pb={7} w="full">
        <AdminTableHeader data-id="030925-68d0c8">
          <AdminTableHeaderElement
            data-id="030925-7421c5"
            label="Title"
            onClick={() => {
              setSortType('title');
              setSortOrder(sortOrder === 'asc' && sortType === 'title' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'title'}
            sortOrder={sortType === 'title' ? sortOrder : undefined}
            w="13%"
          />
          <AdminTableHeaderElement
            data-id="030925-c85d5d"
            label="Priority"
            onClick={() => {
              setSortType('priority');
              setSortOrder(sortOrder === 'asc' && sortType === 'priority' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'priority'}
            sortOrder={sortType === 'priority' ? sortOrder : undefined}
            w="7%"
          />
          <AdminTableHeaderElement
            data-id="030925-4cc7d6"
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
            data-id="030925-4661c4"
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
            data-id="030925-b3b42b"
            label="Status"
            onClick={() => {
              setSortType('status');
              setSortOrder(sortOrder === 'asc' && sortType === 'status' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'status'}
            sortOrder={sortType === 'status' ? sortOrder : undefined}
            w="7%"
          />
          <AdminTableHeaderElement
            data-id="030925-e75c8d"
            label="Assignee"
            onClick={() => {
              setSortType('assignee.displayName');
              setSortOrder(sortOrder === 'asc' && sortType === 'assignee.displayName' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'assignee.displayName'}
            sortOrder={sortType === 'assignee.displayName' ? sortOrder : undefined}
            w="18%"
          />
          <AdminTableHeaderElement
            data-id="030925-e48059"
            label="Created by"
            onClick={() => {
              setSortType('creator.displayName');
              setSortOrder(sortOrder === 'asc' && sortType === 'creator.displayName' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'creator.displayName'}
            sortOrder={sortType === 'creator.displayName' ? sortOrder : undefined}
            w="10%"
          />
          <AdminTableHeaderElement
            data-id="030925-8d1d04"
            label={capitalize(t('location'))}
            onClick={() => {
              setSortType('answer.audit.location.name');
              setSortOrder(sortOrder === 'asc' && sortType === 'answer.audit.location.name' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'answer.audit.location.name'}
            sortOrder={sortType === 'answer.audit.location.name' ? sortOrder : undefined}
            w="14%"
          />
          <AdminTableHeaderElement
            data-id="030925-ff7fb6"
            label={capitalize(t('business unit'))}
            onClick={() => {
              setSortType('answer.businessUnit.name');
              setSortOrder(sortOrder === 'asc' && sortType === 'answer.businessUnit.name' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'answer.businessUnit.name'}
            sortOrder={sortType === 'answer.businessUnit.name' ? sortOrder : undefined}
            w="10%"
          />
        </AdminTableHeader>
        <Flex data-id="030925-2a4751" flexDir="column" h="calc(100vh - 310px)" overflowY="auto" w="full">
          {actions?.map((action, idx) => (
            <ActionsListItem action={action} data-id="030925-e45091" editAction={editAction} index={idx} key={action._id} />
          ))}
        </Flex>
      </Box>
    </Box>
  );
}

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
