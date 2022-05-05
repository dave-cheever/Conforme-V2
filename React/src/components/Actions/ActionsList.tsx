import { useEffect, useState } from 'react';

import { Box, Flex } from '@chakra-ui/react';
import { compareDesc } from 'date-fns';

import { IAction } from '../../interfaces/IAction';
import AdminTableHeader from '../Admin/AdminTableHeader';
import AdminTableHeaderElement from '../Admin/AdminTableHeaderElement';
import ActionsListItem from './ActionsListItem';

const ActionsList = ({ actions }: { actions: IAction[] }) => {
  const [sortType, setSortType] = useState('title');
  const [sortOrder, setSortOrder] = useState(true);
  const [sortedData, setSortedData] = useState<any>([]);

  useEffect(() => {
    const sort = (a, b) => {
      if (sortType === 'dueDate') {
        return compareDesc(
          new Date(a.metatags.addedAt),
          new Date(b.metatags.addedAt),
        );
      }
      if (sortType === 'completedDate') {
        return compareDesc(
          new Date(a.metatags.addedAt),
          new Date(b.metatags.addedAt),
        );
      }
      if (sortType === 'site') {
        return a.answer?.audit?.site?.name!.localeCompare(
          b.answer?.audit?.site?.name!,
        );
      }
      if (sortType === 'area') {
        return a.answer?.audit?.area?.name!.localeCompare(
          b.answer?.audit?.area?.name!,
        );
      }
      if (sortType === 'assignee') {
        return (a.assignee?.displayName || 'unassigned').localeCompare(
          b.assignee?.displayName || 'unassigned',
        );
      }

      if (a[sortType] === null) return 1;

      if (b[sortType] === null) return -1;

      return a[sortType] ? a[sortType].localeCompare(b[sortType]) : 0;
    };
    if (sortOrder) setSortedData([...sortedData].sort((a, b) => sort(a, b)));
    else setSortedData([...sortedData].sort((a, b) => sort(b, a)));
  }, [sortType, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSortedData(actions);
  }, [actions]);

  return (
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
            showSortingIcon={sortType === 'assignee'}
            sortOrder={sortType === 'assignee' && !sortOrder}
            w="20%"
          />
          <AdminTableHeaderElement
            label="Site"
            onClick={() => {
              setSortType('site');
              setSortOrder(!sortOrder);
            }}
            showSortingIcon={sortType === 'site'}
            sortOrder={sortType === 'site' && !sortOrder}
            w="12.5%"
          />
          <AdminTableHeaderElement
            label="Area"
            onClick={() => {
              setSortType('area');
              setSortOrder(!sortOrder);
            }}
            showSortingIcon={sortType === 'area'}
            sortOrder={sortType === 'area' && !sortOrder}
            w="12.5%"
          />
        </AdminTableHeader>
        <Flex
          flexDir="column"
          h={['full', 'calc(100vh - 340px)', 'calc(100vh - 325px)']}
          overflowY="auto"
          w="full"
        >
          {sortedData?.map((action) => (
            <ActionsListItem action={action} key={action._id} />
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

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
