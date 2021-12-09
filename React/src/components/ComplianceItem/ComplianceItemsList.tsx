import { useHistory } from 'react-router-dom';
import {
  Box,
  Flex,
  Image,
  Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';

import { IResponse } from '../../interfaces/IResponse';
import { Building, Close, LocationIcon, TickIcon } from '../../icons';
import BriefcaseIcon from '../BriefcaseIcon';
import AdminTableHeader from '../Admin/AdminTableHeader';
import AdminTableHeaderElement from '../Admin/AdminTableHeaderElement';
import useResponseUtils from '../../hooks/useResponseUtils';

const ComplianceListItems = ({ responses }: { responses: IResponse[] }) => {
  const history = useHistory();
  const { getStatus } = useResponseUtils();

  const renderItem = (response: IResponse, i: number) => {
    return (
      <Box
        key={response._id}
        cursor='pointer'
        onClick={() => history.push(`/compliance-item/${response._id}`)}
        bg="white"
        py={[1, 0]}
        w='full'
        borderBottomWidth="1px"
        borderBottomColor="complianceList.headerBorderColor"
        p="15px 25px"
      >
        <Flex w='full' h={['full', '73px']}  align="center" position='relative'>
          <Flex w="20%" flexDir="column">
            <Flex
              fontSize='14px'
              lineHeight='18px'
              color='complianceList.fontColor'
              opacity='1'
              fontWeight='400'
              h='50%'
              align='flex-start'
              pt="3px"
            >
              {response.complianceItem?.name}
              {response.businessUnit?.type === 'Corporate' && <Box ml={3}><BriefcaseIcon /></Box>}
            </Flex>
          </Flex>
          <Flex w='10%' ml={2}>
            <Text color='complianceList.fontColor' opacity='1' fontWeight="400" fontSize='14px'>
              {response?.nextRenewalDate ? format(new Date(response?.nextRenewalDate), 'd MMM yyyy') : <Flex fontStyle='italic'>No due date</Flex>}
            </Text>
          </Flex>
          <Flex w='10%' ml={2} >
            {response && getStatus(response) === "nonCompliant" ?
                <Flex align="center"><Close stroke='complianceList.crossIcon' mr={2} /><Flex fontWeight="700" fontSize="14px" color='complianceList.crossIcon'>No</Flex></Flex> :
                <Flex align="flex-end"><TickIcon stroke='complianceList.tickIcon' mr={2} /><Flex fontWeight="700" fontSize="14px"  color='complianceList.tickIcon' >Yes</Flex></Flex>
              }
          </Flex>
          <Box w='15%' ml={2}>
            {response?.evidence?.find(({ uploaded }) => uploaded === undefined) ?
              <Flex align="center"><Close stroke='complianceList.crossIcon' mr={2} /><Flex fontWeight="700" fontSize="14px" color='complianceList.crossIcon'>Missing</Flex></Flex> :
              <Flex align="flex-end"><TickIcon stroke='complianceList.tickIcon' mr={2} /><Flex fontWeight="700" fontSize="14px"  color='complianceList.tickIcon' >Uploaded</Flex></Flex>
            }
          </Box>
          <Box w='15%' ml={2}>
            <Box
              color='complianceList.fontColor'
              opacity='1'
              fontSize='14px'
              fontWeight='400'
            >
              {response.complianceItem?.regulatoryBody?.name ? response.complianceItem?.regulatoryBody?.name : <Flex fontStyle='italic'>Unassigned</Flex>}
            </Box>
          </Box>
          <Box w='15%'  ml={2}>
            <Flex direction="row" align='center'>
              <Image
                flexShrink={0}
                fit='cover'
                rounded='full'
                h='36px'
                bg='complianceList.imageBg'
                w='36px'
                color='complianceList.fontColor'
                src={`${response.businessUnit?.imgUrl}`}
                fallback={
                  <Flex
                    align='center'
                    justify='center'
                    bg='complianceList.imageBg'
                    h='36px'
                    w='36px'
                    rounded='md'
                    color='complianceList.fontColor'
                    flexShrink={0}
                  >
                    <Building h='18px' w='18px' color='complianceList.buildingIcon' />
                  </Flex>} />
              <Text
                w='full'
                pl={3}
                lineHeight='17px'
                color='complianceList.fontColor'
                opacity='1'
                fontSize='13px'
                overflow='hidden'
                textOverflow='ellipsis'
                whiteSpace='nowrap'
              >
                {response.businessUnit?.name}
              </Text>
            </Flex>
          </Box>
          <Box w='15%' ml={3}>
          <Flex>
            <LocationIcon boxSize="12px"/>
            <Text
              w='full'
              pl={3}
              lineHeight='17px'
              color='complianceList.fontColor'
              opacity='1'
              fontSize='13px'
              overflow='hidden'
              textOverflow='ellipsis'
              whiteSpace='nowrap'
            >
              {response.businessUnit?.name}
            </Text>
          </Flex>
          </Box>
        </Flex>
      </Box>
    );
  };

  return (
    <Box p={[3, 6]} pt={0} w='full' h='full' overflow="none" minW="1200px">
      <Box bg="complianceList.bg" w="full" minH="full" h="fit-content" borderRadius="20px" pb={7} mb={7}>
      <AdminTableHeader>
        <AdminTableHeaderElement w="20%" label="Item name" />
        <AdminTableHeaderElement w="10%" label="Due date" />
        <AdminTableHeaderElement w="10%" label="Compliant" />
        <AdminTableHeaderElement w="15%" label="Evidence" />
        <AdminTableHeaderElement w="15%" label="Regulatory body" />
        <AdminTableHeaderElement w="15%" label="Responsible" />
        <AdminTableHeaderElement w="15%" label="Business unit" />
      </AdminTableHeader>
      <Flex flexDir="column" overflowY="auto" w="full" h={["full","calc(100vh - 280px)","calc(100vh - 270px)"]}>
      {responses?.map((response, i) => renderItem(response, i))}
      </Flex>
      </Box>
    </Box>
  );
};

export default ComplianceListItems;


export const complianceListItemsStyles = {
  complianceList: {
    bg:"white",
    compliant: "#62c240",
    nonCompliant: "#FC5960",
    comingUp: "#FFA012",
    fontColor: "#282F36",
    buildingIcon: "#2B3236",
    crossIcon: "#FC5960",
    tickIcon: "#41BA17",
    imageBg: "#ffffff",
    evidenceFontColor: "#818197",
    headerBorderColor: "#F0F0F0"
  },
}
