import { Box, Flex } from '@chakra-ui/react';

import { IAudit } from '../../interfaces/IAudit';
import AdminTableHeader from '../Admin/AdminTableHeader';
import AdminTableHeaderElement from '../Admin/AdminTableHeaderElement';
import AuditListItem from './AuditListItem';

const AuditsList = ({
  audits,
  sortOrder,
  sortType,
  setSortType,
  setSortOrder,
}: {
  audits: IAudit[];
  sortOrder: boolean;
  sortType: string;
  setSortType: (key: string) => void;
  setSortOrder: (order: boolean) => void;
}) => (
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
            setSortType('auditor.displayName');
            setSortOrder(!sortOrder);
          }}
          showSortingIcon={sortType === 'auditor.displayName'}
          sortOrder={sortType === 'auditor.displayName' && !sortOrder}
          w="20%"
        />
        <AdminTableHeaderElement
          label="Area"
          onClick={() => {
            setSortType('area.name');
            setSortOrder(!sortOrder);
          }}
          showSortingIcon={sortType === 'area.name'}
          sortOrder={sortType === 'area.name' && !sortOrder}
          w="20%"
        />
      </AdminTableHeader>
      <Flex
        flexDir="column"
        h={['full', 'calc(100vh - 280px)', 'calc(100vh - 270px)']}
        overflowY="auto"
        w="full"
      >
        {audits?.map((audit) => (
          <AuditListItem audit={audit} key={audit._id} />
        ))}
      </Flex>
    </Box>
  </Box>
);

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
