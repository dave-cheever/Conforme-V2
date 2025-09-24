import { Box, Flex } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import { useAppContext } from '../../contexts/AppProvider';
import { IAudit } from '../../interfaces/IAudit';
import AdminTableHeader from '../Admin/AdminTableHeader';
import AdminTableHeaderElement from '../Admin/AdminTableHeaderElement';
import AuditListItem from './AuditListItem';

function AuditsList({
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
}) {
  const { module } = useAppContext();
  return (
    <Box data-id="000306" bg="#ffffff" h="full" ml="10px" overflow="none" p={[3, 6]} w="full">
      <Box
        data-id="000307"
        bg="auditsList.bg"
        border="1px solid #CBD5E0"
        borderRadius="10px"
        h="fit-content"
        minH="full"
        overflow="hidden"
        pb={7}
        w="full"
      >
        <AdminTableHeader data-id="000308">
          <AdminTableHeaderElement
            data-id="000309"
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
            data-id="000310"
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
            data-id="000311"
            label="Status"
            onClick={() => {
              setSortType('status');
              setSortOrder(sortOrder === 'asc' && sortType === 'status' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'status'}
            sortOrder={sortType === 'status' ? sortOrder : undefined}
            w="10%"
          />
          {module?.featureFlags?.enableSafetyWalk && (
            <AdminTableHeaderElement
              data-id="000312"
              label="Walk type"
              onClick={() => {
                setSortType('walkType');
                setSortOrder(sortOrder === 'asc' && sortType === 'walkType' ? 'desc' : 'asc');
              }}
              showSortingIcon={sortType === 'walkType'}
              sortOrder={sortType === 'walkType' ? sortOrder : undefined}
              w="10%"
            />
          )}
          <AdminTableHeaderElement
            data-id="000313"
            label="Auditor"
            onClick={() => {
              setSortType('auditor.displayName');
              setSortOrder(sortOrder === 'asc' && sortType === 'auditor.displayName' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'auditor.displayName'}
            sortOrder={sortType === 'auditor.displayName' ? sortOrder : undefined}
            w="20%"
          />
          <AdminTableHeaderElement
            data-id="000314"
            label="Reference"
            onClick={() => {
              setSortType('reference');
              setSortOrder(sortOrder === 'asc' && sortType === 'reference' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'reference'}
            sortOrder={sortType === 'reference' ? sortOrder : undefined}
            w="15%"
          />
          <AdminTableHeaderElement
            data-id="000315"
            label="Date submitted"
            onClick={() => {
              setSortType('completedDate');
              setSortOrder(sortOrder === 'asc' && sortType === 'completedDate' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'completedDate'}
            sortOrder={sortType === 'completedDate' ? sortOrder : undefined}
            w="15%"
          />
        </AdminTableHeader>
        <Flex data-id="000316" flexDir="column" h={['full', 'calc(100vh - 290px)', 'calc(100vh - 276px)']} overflowY="auto" w="full">
          {audits?.map((audit, index) => <AuditListItem data-id="000317" audit={audit} index={index} key={audit._id} />)}
        </Flex>
      </Box>
    </Box>
  );
}

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
    headerBorderColor: '#CBD5E0',
  },
};
