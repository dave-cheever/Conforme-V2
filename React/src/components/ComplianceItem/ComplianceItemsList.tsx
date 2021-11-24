import { useHistory } from 'react-router-dom';
import {
  Box,
  Flex,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';

import { IResponse } from '../../interfaces/IResponse';
import useResponseUtils from '../../hooks/useResponseUtils';
import { Building, LocationIcon, UploadedCross, UploadedTick, ArrowDownIcon } from '../../icons';
import BriefcaseIcon from '../BriefcaseIcon';
import MissingQuestions from '../MissingQuestions';

const ComplianceListItems = ({ responses }: { responses: IResponse[] }) => {
  const history = useHistory();
  const { getStatus } = useResponseUtils();

  const renderItem = (response: IResponse, i: number) => {
    const requiredQuestionsLeft = response?.questions?.filter(({ required, value }) => required && (value === undefined || value === ''));

    return (
      <Box
        key={response._id}
        cursor='pointer'
        onClick={() => history.push(`/complianceItem/${response._id}`)}
        bg="white"
        py={[1, 0]}
        w='full'
        pr={[1, 4]}
        borderBottomWidth="1px"
        borderBottomColor="complianceList.headerBorderColor"
      >
        <Flex w='full' h={['full', '73px']} align="center" position='relative'>
          <Box w='30%'>
            <Flex
              fontSize='16px'
              lineHeight='20px'
              color='complianceList.fontColor'
              opacity='1'
              fontWeight='700'
              h='50%'
              align='flex-start'
              pt="3px"
              pl={4}
            >
              {response.complianceItem?.name}
              {response.businessUnit?.type === 'Corporate' && <Box ml={3}><BriefcaseIcon /></Box>}
            </Flex>
            <Stack
              pl={4}
              direction={['column', 'row']}
              spacing={4}
              align={['flex-start', 'center']}
              mt={2}
              fontSize='12px'
              color='complianceList.evidenceFontColor'
            >
              <Flex align='center'>
              <Flex
                h='12px'
                w='12px'
                mr={2}
                bgColor={`complianceList.${getStatus(response)}`}
                rounded="full"/>
              <Flex opacity='0.75'>
                {response.complianceItem?.category?.name ? response.complianceItem?.category?.name : <Flex fontStyle='italic'>Unassigned</Flex>}
              </Flex>
              </Flex>
              <Flex align='center'>
                {response?.evidence?.find(({ uploaded }) => uploaded === undefined) ?
                  <><UploadedCross color='complianceList.crossIcon' mr={2} /><Flex opacity='0.75' color='complianceList.crossIcon'>Missing evidence</Flex></> :
                  <><UploadedTick color='complianceList.tickIcon' mr={2} /><Flex opacity='0.75' color='complianceList.tickIcon' >Uploaded</Flex></>
                }
              </Flex>
              <Flex align='center'>
                {requiredQuestionsLeft && requiredQuestionsLeft.length > 0 && <MissingQuestions questionsLeft={requiredQuestionsLeft.length} />}
              </Flex>
            </Stack>
          </Box>
          <Box w='15%' ml={3}>
            <Box color='complianceList.fontColor' opacity='1' fontWeight="400" fontSize='14px'>
              {response?.nextRenewalDate ? format(new Date(response?.nextRenewalDate), 'd MMM yyyy') : <Flex fontStyle='italic'>No due date</Flex>}
            </Box>
          </Box>
          <Box w='20%'>
            <Box
              color='complianceList.fontColor'
              opacity='1'
              fontSize='14px'
              fontWeight='400'
            >
              {response.complianceItem?.regulatoryBody?.name ? response.complianceItem?.regulatoryBody?.name : <Flex fontStyle='italic'>Unassigned</Flex>}
            </Box>
          </Box>
          <Box w='15%'>
            <Flex direction={['column', 'row']} align='center'>
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
          <Box w='20%'>
            <Flex direction={['column', 'row']} align='center'>
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
    <Box p={[3, 6]} w='full' h='full'>
      <Box bg="complianceList.bg" w="full" h="fit-content" borderRadius="20px" pb={7}>
      <Flex fontSize='12px' w='full' px={4} py={5} color="complianceList.headerTextColor" borderBottomWidth="1px" borderBottomColor="complianceList.headerBorderColor">
        <Flex w='30%' align='center'>
        <Box>
          Item name
        </Box>
        <ArrowDownIcon ml="3"/>
        </Flex>
        <Flex w='15%' align='center'>
        <Box>
          Due date
        </Box>
        <ArrowDownIcon ml="3"/>
        </Flex>
        <Flex w='20%' align='center'>
          <Box>
          Regulatory body
          </Box>
        <ArrowDownIcon ml="3"/>
        </Flex>
        <Flex w='15%' align='center'>
          <Box>
            Responsible
          </Box>
        <ArrowDownIcon ml="3"/>
        </Flex>
        <Flex w='20%' align='center'>
          <Box>
          Business unit
          </Box>
        <ArrowDownIcon ml="3"/>
        </Flex>
      </Flex>
      {responses?.map((response, i) => renderItem(response, i))}
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
    headerTextColor: "#818197",
    headerBorderColor: "#F0F0F0"
  },
}
