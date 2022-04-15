import { useEffect, useState } from 'react';

import { Box, Flex } from '@chakra-ui/react';
import { compareDesc } from 'date-fns';

import { IAudit } from '../../interfaces/IAudit';
import AdminTableHeader from '../Admin/AdminTableHeader';
import AdminTableHeaderElement from '../Admin/AdminTableHeaderElement';
import AuditListItem from './AuditListItem';

const AuditsList = ({ audits }: { audits: IAudit[] }) => {
  const [sortType, setSortType] = useState('name');
  const [sortOrder, setSortOrder] = useState(true);
  const [sortedData, setSortedData] = useState<any>([]);

  useEffect(() => {
    const sort = (a, b) => {
      if (sortType === 'walkType') return a.walkType.localeCompare(b.walkType);
      if (sortType === 'dueDate') {
        return compareDesc(
          new Date(a.metatags.addedAt),
          new Date(b.metatags.addedAt),
        );
      }
      if (sortType === 'area')
        return a.area?.name!.localeCompare(b.area?.name!);
      if (sortType === 'auditor') {
        return (a.auditor?.displayName || 'unassigned').localeCompare(
          b.auditor?.displayName || 'unassigned',
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
    setSortedData(audits);
  }, [audits]);

  return (
    <Box h="full" ml="10px" overflow="none" p={[3, 6]} w="full">
      <Box
        bg="auditsList.bg"
        borderRadius="20px"
        h="fit-content"
        mb={7}
        minH="full"
        pb={7}
        w="full"
      >
        <AdminTableHeader>
          <AdminTableHeaderElement
            label="Walk type"
            onClick={() => {
              setSortType('walkType');
              setSortOrder(!sortOrder);
            }}
            showSortingIcon={sortType === 'walkType'}
            sortOrder={sortType === 'walkType' && !sortOrder}
            w="20%"
          />
          <AdminTableHeaderElement
            label="Due date"
            onClick={() => {
              setSortType('dueDate');
              setSortOrder(!sortOrder);
            }}
            showSortingIcon={sortType === 'dueDate'}
            sortOrder={sortType === 'dueDate' && !sortOrder}
            w="12%"
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
            label="Audior"
            onClick={() => {
              setSortType('auditor');
              setSortOrder(!sortOrder);
            }}
            showSortingIcon={sortType === 'auditor'}
            sortOrder={sortType === 'auditor' && !sortOrder}
            w="20%"
          />
          <AdminTableHeaderElement
            label="Area"
            onClick={() => {
              setSortType('area');
              setSortOrder(!sortOrder);
            }}
            showSortingIcon={sortType === 'area'}
            sortOrder={sortType === 'area' && !sortOrder}
            w="20%"
          />
        </AdminTableHeader>
        <Flex
          flexDir="column"
          h={['full', 'calc(100vh - 280px)', 'calc(100vh - 270px)']}
          overflowY="auto"
          w="full"
        >
          {sortedData?.map((audit) => (
            <AuditListItem audit={audit} key={audit._id} />
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default AuditsList;

export const auditsListStyles = {
  auditsList: {
    bg: 'white',
    completed: '#62c240',
    overdue: '#FC5960',
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
