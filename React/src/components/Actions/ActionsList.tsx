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
      data-id="000404"
      bg="auditsList.bg"
      border="1px solid"
      borderColor="auditsList.headerBorderColor"
      borderRadius="10px"
      h="full"
      ml="10px"
      overflow="hidden"
      w="full"
    >
      <Box data-id="000405" bg="auditsList.bg" h="fit-content" minH="full" pb={7} w="full">
        <AdminTableHeader data-id="000406">
          <AdminTableHeaderElement
            data-id="000407"
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
            data-id="000408"
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
            data-id="000409"
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
            data-id="000410"
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
            data-id="000411"
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
            data-id="000412"
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
            data-id="000413"
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
            data-id="000414"
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
            data-id="000415"
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
        <Flex data-id="000416" flexDir="column" h="calc(100vh - 310px)" overflowY="auto" w="full">
          {actions?.map((action, idx) => (
            <ActionsListItem data-id="000417" action={action} editAction={editAction} index={idx} key={action._id} />
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
