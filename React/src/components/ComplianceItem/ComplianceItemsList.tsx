import moment from 'moment';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Flex,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';


import { IResponse } from '../../interfaces/IResponse';
import useResponseUtils from '../../hook/useResponseUtils';
import { Building, CircledCross, CircledTickBold, ComingUpIcon, UploadedCross, UploadedTick } from '../../icons';
import BriefcaseIcon from '../BriefcaseIcon';
import MissingQuestions from '../MissingQuestions';

const ComplianceListItems = ({ responses }: { responses: IResponse[] }) => {
  const history = useHistory();
  const { getRenewalStatus, getStatus } = useResponseUtils();

  const renderItem = (response: IResponse, i: number) => {
    const requiredQuestionsLeft = response?.questions?.filter(({ required, value }) => required && (value === undefined || value === ''));

    return (
      <Box
        key={response.id}
        cursor='pointer'
        onClick={() => history.push(`/items/${response.id}`)}
        boxShadow="sm"
        bg="white"
        roundedTop={i === 0 ? "lg" : "none"}
        roundedBottom={i === (responses.length - 1) ? "lg" : "none"}
        py={[1, 0]}
        w='full'
        pr={[1, 4]}
        mb="1px"
      >
        <Flex w='full' h={['full', '73px']} align="center" position='relative'>
          <Flex
            h='full'
            w='25px'
            bgColor={`brand.${getStatus(response)}`}
            roundedTopRight={i === 0 ? "lg" : "none"}
            roundedBottomRight={i === (responses.length - 1) ? "lg" : "none"}
            roundedBottomLeft={i === (responses.length - 1) ? "lg" : "none"}
            roundedTopLeft={i === 0 ? "lg" : "none"}
            align='flex-end'
            justify='center'
          >
            {getRenewalStatus(response) === 'comingUp' && getStatus(response) === 'compliant' && (
              <Flex
                w='full'
                justify='center'
                bgColor='brand.comingUp'
                roundedTopRight={i === 0 ? "lg" : "none"}
                roundedBottomRight={i === (responses.length - 1) ? "lg" : "none"}
                roundedBottomLeft={i === (responses.length - 1) ? "lg" : "none"}
                roundedTopLeft={i === 0 ? "lg" : "none"}
              >
                <ComingUpIcon w='24px' h='24px' fill="brand.comingUp" />
              </Flex>
            )}
          </Flex>
          <Box w='calc(40% - 50px)'>
            <Flex
              fontSize='14px'
              lineHeight='18px'
              color='brand.darkGrey'
              opacity='1'
              fontWeight='700'
              h='50%'
              align='flex-start'
              pt="3px"
              pl={4}
            >
              {response.name}
              {response?.businessUnit?.type === 'Corporate' && <Box ml={3}><BriefcaseIcon /></Box>}
            </Flex>
            <Stack pl={4} direction={['column', 'row']} spacing={4} align={['flex-start', 'center']} mt={2} fontSize='12px' color='brand.secondary'>
              <Flex opacity='0.75'>{response.category?.name ? response.category?.name : <Flex fontStyle='italic'>Unassigned</Flex>}</Flex>
              {response.actionExpected &&
                <>
                  {response.verified ?
                    <CircledTickBold h='12px' w='12px' mr={1} color='brand.completed' />
                    : <CircledCross h='12px' w='12px' mr={1} />}
                  <Flex opacity='0.75' mr={5}>Verified </Flex>
                </>}
              <Flex align='center'>
                {response?.evidenceExpected?.find(({ uploaded }) => uploaded === undefined) ?
                  <><UploadedCross color='brand.primary' mr={1} /><Flex opacity='0.75'>Missing evidence</Flex></> :
                  <><UploadedTick color='brand.completed' mr={1} /><Flex opacity='0.75'>Uploaded</Flex></>
                }
              </Flex>
              <Flex align='center'>
                {requiredQuestionsLeft && requiredQuestionsLeft.length > 0 && <MissingQuestions questionsLeft={requiredQuestionsLeft.length} />}
              </Flex>
            </Stack>
          </Box>
          <Box w='15%' ml={3}>
            <Box color='brand.darkGrey' opacity='1' fontSize='14px'>
              {response?.nextRenewalDate ? moment(response?.nextRenewalDate).format('D MMM YYYY') : <Flex fontStyle='italic'>No due date</Flex>}
            </Box>
          </Box>
          <Box w='20%'>
            <Box
              color='brand.darkGrey'
              opacity='1'
              fontSize='14px'
              fontWeight='700'
            >
              {response.regulatoryBody?.name ? response.regulatoryBody?.name : <Flex fontStyle='italic'>Unassigned</Flex>}
            </Box>
          </Box>
          <Box w='25%'>
            <Flex direction={['column', 'row']} align='center'>
              <Image
                flexShrink={0}
                fit='cover'
                rounded='md'
                h='36px'
                bg='brand.primaryFont'
                w='36px'
                color='brand.darkGrey'
                src={`${response.businessUnit?.imgUrl}`}
                fallback={
                  <Flex
                    align='center'
                    justify='center'
                    bg='brand.primaryFont'
                    h='36px'
                    w='36px'
                    rounded='md'
                    color='brand.darkGrey'
                    flexShrink={0}
                  >
                    <Building h='18px' w='18px' color='brand.darkGrey' />
                  </Flex>} />
              <Text
                w='full'
                pl={3}
                lineHeight='17px'
                color='brand.darkGrey'
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
      <Flex fontSize='14px' w='full' px={4} pb={4} color='#9A9EA1'>
        <Box w='40%'>
          Compliance item
        </Box>
        <Box w='15%'>
          Next renewal on
        </Box>
        <Box w='20%'>
          Regulatory body
        </Box>
        <Box w='25%'>
          Business unit
        </Box>
      </Flex>
      {responses?.map((response, i) => renderItem(response, i))}
    </Box>
  );
};

export default ComplianceListItems;
