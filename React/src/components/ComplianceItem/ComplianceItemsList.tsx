import { useEffect, useState } from 'react';

import { Box, Flex } from '@chakra-ui/react';

import useResponseUtils from '../../hooks/useResponseUtils';
import { IResponse } from '../../interfaces/IResponse';
import AdminTableHeader from '../Admin/AdminTableHeader';
import AdminTableHeaderElement from '../Admin/AdminTableHeaderElement';
import ComplianceListItem from './ComplianceListItem';

const ComplianceListItems = ({ responses }: { responses: IResponse[] }) => {
  const { getStatus } = useResponseUtils();
  const [sortType, setSortType] = useState('name');
  const [sortOrder, setSortOrder] = useState(true);
  const [sortedData, setSortedData] = useState<any>([]);

  useEffect(() => {
    const sort = (a, b) => {
      if (sortType === 'name')
        return a.complianceItem?.name.localeCompare(b.complianceItem?.name);
      if (sortType === 'regulatoryBody') {
        return a.complianceItem.regulatoryBody?.name!.localeCompare(
          b.complianceItem.regulatoryBody?.name!,
        );
      }
      if (sortType === 'businessUnit')
        return a.businessUnit?.name!.localeCompare(b.businessUnit?.name!);
      if (sortType === 'category') {
        return (a.complianceItem?.category?.name).localeCompare(
          b.complianceItem?.category?.name,
        );
      }
      if (sortType === 'compliant') {
        return (getStatus(a) === 'nonCompliant' ? 'Yes' : 'No').localeCompare(
          getStatus(b) === 'nonCompliant' ? 'Yes' : 'No',
        );
      }
      if (sortType === 'evidence') {
        return (
          a.evidence?.find(({ uploaded }) => uploaded === undefined)
            ? 'Missing'
            : 'Uploaded'
        ).localeCompare(
          b.evidence?.find(({ uploaded }) => uploaded === undefined)
            ? 'Missing'
            : 'Uploaded',
        );
      }
      if (sortType === 'responsible') {
        return (a.responsible?.displayName || 'unassigned').localeCompare(
          b.responsible?.displayName || 'unassigned',
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
    setSortedData(
      [...responses].sort((a, b) =>
        a.complianceItem?.name.localeCompare(b.complianceItem?.name),
      ),
    );
  }, [responses]);

  return (
    <Box h="full" ml="10px" overflow="none" p={[3, 6]} w="full">
      <Box
        bg="complianceList.bg"
        borderRadius="20px"
        h="fit-content"
        mb={7}
        minH="full"
        pb={7}
        w="full"
      >
        <AdminTableHeader>
          <AdminTableHeaderElement
            label="Item name"
            onClick={() => {
              setSortType('name');
              setSortOrder(!sortOrder);
            }}
            showSortingIcon={sortType === 'name'}
            sortOrder={sortType === 'name' && !sortOrder}
            w="20%"
          />
          <AdminTableHeaderElement
            label="Expires on"
            onClick={() => {
              setSortType('nextRenewalDate');
              setSortOrder(!sortOrder);
            }}
            showSortingIcon={sortType === 'nextRenewalDate'}
            sortOrder={sortType === 'nextRenewalDate' && !sortOrder}
            w="12%"
          />
          <AdminTableHeaderElement
            label="Compliant"
            onClick={() => {
              setSortType('compliant');
              setSortOrder(!sortOrder);
            }}
            showSortingIcon={sortType === 'compliant'}
            sortOrder={sortType === 'compliant' && !sortOrder}
            w="10%"
          />
          <AdminTableHeaderElement
            label="Regulatory body"
            onClick={() => {
              setSortType('regulatoryBody');
              setSortOrder(!sortOrder);
            }}
            showSortingIcon={sortType === 'regulatoryBody'}
            sortOrder={sortType === 'regulatoryBody' && !sortOrder}
            w="18%"
          />
          <AdminTableHeaderElement
            label="Responsible"
            onClick={() => {
              setSortType('responsible');
              setSortOrder(!sortOrder);
            }}
            showSortingIcon={sortType === 'responsible'}
            sortOrder={sortType === 'responsible' && !sortOrder}
            w="20%"
          />
          <AdminTableHeaderElement
            label="Business unit"
            onClick={() => {
              setSortType('businessUnit');
              setSortOrder(!sortOrder);
            }}
            showSortingIcon={sortType === 'businessUnit'}
            sortOrder={sortType === 'businessUnit' && !sortOrder}
            w="20%"
          />
        </AdminTableHeader>
        <Flex
          flexDir="column"
          h={['full', 'calc(100vh - 280px)', 'calc(100vh - 270px)']}
          overflowY="auto"
          w="full"
        >
          {sortedData?.map((response) => (
            <ComplianceListItem key={response._id} response={response} />
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default ComplianceListItems;

export const complianceListItemsStyles = {
  complianceList: {
    bg: 'white',
    compliant: '#62c240',
    nonCompliant: '#FC5960',
    comingUp: '#FFA012',
    fontColor: '#282F36',
    buildingIcon: '#2B3236',
    crossIcon: '#FC5960',
    tickIcon: '#41BA17',
    imageBg: '#ffffff',
    evidenceFontColor: '#818197',
    headerBorderColor: '#F0F0F0',
  },
};
