import { useMemo } from "react";
import { Box, Flex, Image, Stack } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { format } from "date-fns";

import { Building, ChevronRight, ComingUpIcon, UploadedCross, UploadedTick } from "../../icons";
import { IResponse } from "../../interfaces/IResponse";
import { responseStatuses } from "../../hooks/useResponseUtils";
import BriefcaseIcon from "../BriefcaseIcon";
import MissingQuestions from "../MissingQuestions";
import useResponseUtils from "../../hooks/useResponseUtils";

const ComplianceItemSquare = ({ response }: {response: IResponse}) => {
  const history = useHistory();
  const { getRenewalStatus, getStatus } = useResponseUtils();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const responseStatus = useMemo(() => getStatus(response), [response]);

  const requiredQuestionsLeft = useMemo(() => response?.questions?.filter(({ required, value }) => required && (value === undefined || value === '')), [response]);

  return (
    <Box
      _hover={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.18)', transform: 'scale(1.02)' }}
      cursor='pointer'
      onClick={() => history.push(`/items/${response._id}`)}
      boxShadow="sm"
      bg="white"
      rounded="lg"
      w='270px'
      h='300px'
      flexShrink={0}
      m={2}
    >
      <Flex
        h='34px'
        bgColor={`complianceSquare.${responseStatus}`}
        color='complianceSquare.statusFontColor'
        roundedTop="lg"
        fontSize='smd'
        pl='15px'
        grow={1}
        align='center'
        justify='space-between'
      >
        {responseStatuses[responseStatus]}
        {getRenewalStatus(response) === 'comingUp' && responseStatus === 'compliant' && (
          <Flex h='full' align='center' p={2} bgColor='complianceSquare.comingUp' roundedTopRight="lg">
            <ComingUpIcon w='24px' h='24px' fill="complianceSquare.comingUp" />
          </Flex>
        )}
      </Flex>
      <Flex h='52px' w='full' mt={2} alignItems='center' position='relative'>
        <Box
          w='full'
          fontSize='14px'
          px={4}
          lineHeight='18px'
          color='complianceSquare.fontColor'
          opacity='1'
          fontWeight='700'
          overflow='hidden'
          textOverflow='ellipsis'
          whiteSpace='nowrap'
        >
          {response.complianceItem?.name}
        </Box>
        <ChevronRight color='complianceSquare.rightIcon' mr={4} />
      </Flex>
      <Flex h='50px' w='full' px='5' pt={4} alignItems='flex-start'>
        <Flex alignItems='center'>
          <Image
            flexShrink={0}
            rounded='md'
            fit='cover'
            h='36px'
            bg='complianceSquare.imageBg'
            w='36px'
            color='complianceList.fontColor'
            src={`${response.businessUnit?.imgUrl}`}
            fallback={
              <Flex
                align='center'
                justify='center'
                bg='complianceSquare.imageBg'
                h='36px'
                w='36px'
                rounded='md'
                color='complianceList.fontColor'
                flexShrink={0}
              >
                <Building h='18px' w='18px' color='complianceList.fontColor' />
              </Flex>} />
          <Box 
            w='200px' 
            pl={3} 
            lineHeight='17px' 
            color='complianceSquare.businessUnitFontColor' 
            opacity='0.75' 
            fontSize='14px' 
            overflow='hidden' 
            textOverflow='ellipsis' 
            whiteSpace='nowrap'
          >
            {response.businessUnit?.name}
          </Box>
        </Flex>
      </Flex>
      <Flex h='50px' w='full' p='5' alignItems='flex-start'>
        <Box w='50%' color='complianceSquare.categoryFontColor' fontSize='12px'>
          <Box opacity='0.75'>Category</Box>
          <Box
            color='complianceSquare.fontColor'
            opacity='1'
            fontSize='14px'
            overflow='hidden'
            textOverflow='ellipsis'
            whiteSpace='nowrap'
          >
            {response.complianceItem?.category?.name ? response.complianceItem?.category?.name : <Flex fontStyle='italic'>Unassigned</Flex>}
          </Box>
        </Box>
        <Box w='50%' color='complianceSquare.regulatoryFontColor' fontSize='12px'>
          <Box opacity='0.75'>Regulatory body</Box>
          <Box
            color='complianceSquare.fontColor'
            opacity='1'
            fontSize='14px'
            overflow='hidden'
            textOverflow='ellipsis'
            whiteSpace='nowrap'
          >
            {response.complianceItem?.regulatoryBody?.name ? response.complianceItem?.regulatoryBody?.name : <Flex fontStyle='italic'>Unassigned</Flex>}
          </Box>
        </Box>
      </Flex>
      <Box color='complianceSquare.renewalFontColor' fontSize='12px' mt={5} pl={5}>
        <Box opacity='0.75'>Next renewal on</Box>
        <Box
          color='complianceList.fontColor'
          opacity='1'
          fontSize='14px'
          overflow='hidden'
          textOverflow='ellipsis'
          whiteSpace='nowrap'
        >
          {response?.nextRenewalDate ? format(new Date(response?.nextRenewalDate), 'd MMM yyyy') : <Flex fontStyle='italic'>No due date</Flex>}
        </Box>
      </Box>
      <Stack
        direction='row'
        w='full'
        h='32px'
        mt={2}
        px={5}
        fontSize='12px'
        color='complianceSquare.evidenceFontColor'
        alignItems='center'
        justifyContent='space-between'
      >
        <Flex flexBasis="50%" align='center'>
          {response?.evidenceExpected?.find(({ uploaded }) => uploaded === undefined) ?
            <><UploadedCross color='complianceSquare.crossIcon' mr={2} /><Flex opacity='0.75'>Missing evidence</Flex></> :
            <><UploadedTick color='complianceSquare.tickIcon' mr={2} /><Flex opacity='0.75'>Uploaded</Flex></>
          }
        </Flex>
        <Flex flexBasis="45%" align='center'>
          {requiredQuestionsLeft && requiredQuestionsLeft.length > 0 && <MissingQuestions questionsLeft={requiredQuestionsLeft.length} />}
        </Flex>
        <Flex flexBasis="5%" justify='flex-end'>
          {response?.businessUnit?.type === 'Corporate' && <Flex opacity={1}><BriefcaseIcon /></Flex>}
        </Flex>
      </Stack>
    </Box>
  );
};

export default ComplianceItemSquare;
