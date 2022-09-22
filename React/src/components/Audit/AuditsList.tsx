import { Box, Flex } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

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
  sortOrder: 'asc' | 'desc';
  sortType: string;
  setSortType: (key: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
}) => (
  <Box h="full" ml="10px" overflow="none" p={[3, 6]} w="full">
    <Box bg="auditsList.bg" borderRadius="20px" h="fit-content" minH="full" pb={7} w="full">
      <AdminTableHeader>
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
          label={capitalize(t('location'))}
          onClick={() => {
            setSortType('location.name');
            setSortOrder(sortOrder === 'asc' && sortType === 'location.name' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'location.name'}
          sortOrder={sortType === 'location.name' ? sortOrder : undefined}
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
          label="Walk type"
          onClick={() => {
            setSortType('walkType');
            setSortOrder(sortOrder === 'asc' && sortType === 'walkType' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'walkType'}
          sortOrder={sortType === 'walkType' ? sortOrder : undefined}
          w="10%"
        />
        <AdminTableHeaderElement
          label="Auditor"
          onClick={() => {
            setSortType('auditor.displayName');
            setSortOrder(sortOrder === 'asc' && sortType === 'auditor.displayName' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'auditor.displayName'}
          sortOrder={sortType === 'auditor.displayName' ? sortOrder : undefined}
          w="18%"
        />
        <AdminTableHeaderElement
          label="Date submitted"
          onClick={() => {
            setSortType('completedDate');
            setSortOrder(sortOrder === 'asc' && sortType === 'completedDate' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'completedDate'}
          sortOrder={sortType === 'completedDate' ? sortOrder : undefined}
          w="12%"
        />
      </AdminTableHeader>
      <Flex flexDir="column" h={['full', 'calc(100vh - 290px)', 'calc(100vh - 276px)']} overflowY="auto" w="full">
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
    completed: '#62C240',
    missed: '#FC5960',
    upcoming: '#FFA012',
    fontColor: '#282F36',
    buildingIcon: '#2B3236',
    crossIcon: '#FC5960',
    tickIcon: '#41BA17',
    imageBg: '#ffffff',
    evidenceFontColor: '#818197',
    headerBorderColor: '#F0F0F0',
  },
};
