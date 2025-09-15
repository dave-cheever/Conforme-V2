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
    <Box bg="#ffffff" data-id="030925-d7352d" h="full" ml="10px" overflow="none" p={[3, 6]} w="full">
      <Box
        bg="auditsList.bg"
        border="1px solid #CBD5E0"
        borderRadius="10px"
        data-id="030925-87f2e3"
        h="fit-content"
        minH="full"
        overflow="hidden"
        pb={7}
        w="full"
      >
        <AdminTableHeader data-id="030925-2ab60e">
          <AdminTableHeaderElement
            data-id="030925-9b2eae"
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
            data-id="030925-fa5762"
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
            data-id="030925-23bd13"
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
              data-id="030925-ea602c"
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
            data-id="030925-2fe121"
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
            data-id="030925-a6b60d"
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
            data-id="030925-ccddb4"
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
        <Flex data-id="030925-7c5ad8" flexDir="column" h={['full', 'calc(100vh - 290px)', 'calc(100vh - 276px)']} overflowY="auto" w="full">
          {audits?.map((audit, index) => <AuditListItem audit={audit} data-id="030925-50548b" index={index} key={audit._id} />)}
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
