import { useMemo } from "react";
import { Box, Button, Flex, Image, Text, Tooltip } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { format } from "date-fns";
import { ChevronRightIcon } from "@chakra-ui/icons";

import { Building, LocationIcon, UploadedTick } from "../../icons";
import { responseStatuses } from "../../hooks/useResponseUtils";
import { IResponse } from "../../interfaces/IResponse";
import useResponseUtils from "../../hooks/useResponseUtils";

const ComplianceItemSquare = ({ response }: {response: IResponse}) => {
  const history = useHistory();
  const { getStatus, getRenewalStatus } = useResponseUtils();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const responseStatus = useMemo(() => getStatus(response), [response]);

  return (
    <Box
      _hover={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.18)' }}
      boxShadow="sm"
      bg="white"
      borderRadius="20px"
      w='325px'
      flexShrink={0}
      p="20px 25px 20px 25px"
      m={2}
    >
      <Flex align='center' justify="space-between">
        <Flex align='center'>
          <Flex
            h='12px'
            bgColor={`complianceSquare.${responseStatus}`}
            w='12px'
            rounded="full"
          />
          <Box
            color='complianceSquare.fontColor'
            opacity='1'
            fontSize='11px'
            overflow='hidden'
            textOverflow='ellipsis'
            whiteSpace='nowrap'
            ml={2}
          >
            {response.complianceItem?.category?.name ? response.complianceItem?.category?.name : <Flex fontStyle='italic'>Unassigned</Flex>}
          </Box>
        </Flex>
        <Flex align='center'>
          {response?.evidenceExpected?.find(({ uploaded }) => uploaded === undefined) ?
            <UploadedTick color='complianceSquare.crossIcon'/> :
            <><Flex fontSize="11px" color='complianceSquare.tickIcon' >Uploaded</Flex><UploadedTick color='complianceSquare.tickIcon' ml={2} /></>
          }
        </Flex>
      </Flex>
      <Flex h='52px' w='full' mt={2} align='center' position='relative'>
      <Tooltip label={response.complianceItem?.name}>
      <Image
        flexShrink={0}
        rounded='full'
        fit='cover'
        h='24px'
        bg='complianceSquare.imageBg'
        w='24px'
        color='complianceSquare.fontColor'
        src={`${response.businessUnit?.imgUrl}`}
        fallback={
          <Flex
            align='center'
            justify='center'
            bg='complianceSquare.imageBg'
            h='36px'
            w='36px'
            rounded='md'
            color='complianceSquare.fontColor'
            flexShrink={0}
          >
            <Building h='18px' w='18px' color='complianceSquare.fontColor' />
          </Flex>} />
        </Tooltip>
        <Text
          w='full'
          fontSize='16px'
          lineHeight='20px'
          color='complianceSquare.nameFontColor'
          fontWeight='700'
          noOfLines={2}
          ml={3}
        >
          {response.complianceItem?.name}
        </Text>
      </Flex>
      <Flex h='40px' w='full' align='center'>
        <LocationIcon color='complianceSquare.businessUnitFontColor' />
        <Box 
          w='200px' 
          pl={3} 
          lineHeight='20px' 
          color='complianceSquare.businessUnitFontColor'
          fontSize='14px' 
          overflow='hidden' 
          textOverflow='ellipsis' 
          whiteSpace='nowrap'
        >
          {response.businessUnit?.name}
        </Box>
      </Flex>
      <Flex h='50px' w='full' py='4' alignItems='flex-start'>
        <Box w='50%' color='complianceSquare.categoryFontColor' fontSize='11px'>
          <Box>Regulatory body</Box>
          <Box
            color='complianceSquare.nameFontColor'
            fontSize='14px'
            overflow='hidden'
            textOverflow='ellipsis'
            whiteSpace='nowrap'
          >
            {response.complianceItem?.regulatoryBody?.name ? response.complianceItem?.regulatoryBody?.name : <Flex fontStyle='italic'>Unassigned</Flex>}
          </Box>
        </Box>
        <Box w='50%' color='complianceSquare.regulatoryFontColor' fontSize='11px'>
          <Box>Next renewal on</Box>
          <Box
            color='complianceSquare.nameFontColor'
            fontSize='13px'
            overflow='hidden'
            textOverflow='ellipsis'
            whiteSpace='nowrap'
          >
            {response?.nextRenewalDate ? format(new Date(response?.nextRenewalDate), 'd MMM yyyy') : <Flex fontStyle='italic'>No due date</Flex>}
          </Box>
        </Box>
      </Flex>
      <Flex pt="50px" w="full" align='center' justify="space-between">
        <Button 
          bg={responseStatus === "nonCompliant" ? "complianceSquare.nonCompliant" : "complianceSquare.buttonBg"}
          fontSize="11px" 
          rightIcon={<ChevronRightIcon color={responseStatus === "nonCompliant" ? "white" : "complianceSquare.fontColor"} boxSize="20px"/>} 
          color={responseStatus === "nonCompliant" ? "white" : "complianceSquare.fontColor"}
          w="85px" h="28px"
          _hover={{bg: responseStatus === "nonCompliant" ? "complianceSquare.nonCompliant" : "complianceSquare.buttonBg"}}
          onClick={() => history.push(`/complianceItem/${response._id}`)}>
            Details
        </Button>
        <Flex align="center" justify="center" flexDirection="column" color='complianceSquare.nameFontColor'>
          <Box fontSize="11px" fontWeight="700">
            {responseStatuses[responseStatus]}
          </Box>
          {getRenewalStatus(response) === 'comingUp' && responseStatus === 'compliant' && (
            <Box fontSize="11px" fontWeight="700">
              Coming up
            </Box>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default ComplianceItemSquare;

export const complianceItemsSquareStyles = {
  complianceSquare: {
    compliant: "#62c240",
    nonCompliant: "#FC5960",
    comingUp: "#FFA012",
    statusFontColor: '#FFFFFF',
    imageBg: "#ffffff",
    rightIcon: "#9A9EA1",
    crossIcon: "#F0F0F0",
    tickIcon: "#41BA17",
    fontColor: "#818197",
    regulatoryFontColor: "#818197",
    renewalFontColor: "#424B50",
    evidenceFontColor: "#424B50",
    businessUnitFontColor: "#818197",
    categoryFontColor: "#818197",
    nameFontColor: "#282F36",
    buttonBg: "#F0F2F5"
  }
}
