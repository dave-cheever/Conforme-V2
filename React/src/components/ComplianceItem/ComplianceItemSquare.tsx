import { useMemo } from 'react';

import { gql, useQuery } from '@apollo/client';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Flex, Skeleton, Stack, Text, Tooltip } from '@chakra-ui/react';
import format from 'date-fns/format';

import useNavigate from '../../hooks/useNavigate';
import useResponseUtils from '../../hooks/useResponseUtils';
import { LocationIcon, QuestionIcon, UploadedTick } from '../../icons';
import { IResponse } from '../../interfaces/IResponse';
import { IUser } from '../../interfaces/IUser';

const GET_USERS_BY_ID = gql`
  query ($userQueryInput: UserQueryInput) {
    usersById(userQueryInput: $userQueryInput) {
      _id
      displayName
      imgUrl
    }
  }
`;

const ComplianceItemSquare = ({ response }: { response: IResponse }) => {
  const { navigateTo } = useNavigate();
  const { responseStatuses, getStatus, getRenewalStatus, isEvidenceUploaded, areRequiredQuestionsAnswered } = useResponseUtils();
  const responseStatus = useMemo(() => getStatus(response), [getStatus, response]);
  const { data: { usersById: responseResponsible } = [], loading: responsibleLoading } = useQuery(GET_USERS_BY_ID, {
    variables: {
      userQueryInput: {
        usersIds: response?.responsibleId || [],
      },
    },
  });
  const responsible: IUser = responseResponsible && responseResponsible.length !== 0 && responseResponsible[0];

  return (
    <Box
      _hover={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.18)' }}
      bg="white"
      borderRadius="20px"
      boxShadow="sm"
      cursor="pointer"
      flexShrink={0}
      h="290px"
      onClick={() => navigateTo(`/compliance-item/${response._id}`)}
      p="20px 25px 20px 25px"
      w={['full', 'full', '350px']}
    >
      <Flex align="center" justify="space-between">
        <Flex align="center">
          <Flex
            bgColor={getRenewalStatus(response) === 'comingUp' ? 'complianceSquare.comingUp' : `complianceSquare.${responseStatus}`}
            h="12px"
            rounded="full"
            w="12px"
          />
          <Box
            color="complianceSquare.fontColor"
            fontSize="11px"
            ml={2}
            opacity="1"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {response.complianceItem?.category?.name ? response.complianceItem?.category?.name : <Flex fontStyle="italic">Unassigned</Flex>}
          </Box>
        </Flex>
        <Stack direction="row" spacing={1}>
          {response.evidence?.length > 0 && (
            <Flex align="center">
              <Tooltip hasArrow label={`Evidence ${isEvidenceUploaded(response) ? 'uploaded' : 'required'}`} placement="top">
                <UploadedTick color={`complianceSquare.${isEvidenceUploaded(response) ? 'tickIcon' : 'crossIcon'}`} />
              </Tooltip>
            </Flex>
          )}
          {response.questions?.filter(({ required }) => required).length > 0 && (
            <Tooltip hasArrow label={`Required questions ${areRequiredQuestionsAnswered(response) ? '' : 'not '}answered`} placement="top">
              <QuestionIcon color={`complianceSquare.${areRequiredQuestionsAnswered(response) ? 'tickIcon' : 'crossIcon'}`} />
            </Tooltip>
          )}
        </Stack>
      </Flex>
      <Flex align="center" h="52px" mt={2} position="relative" w="full">
        <Skeleton isLoaded={!responsibleLoading} rounded="full">
          <Tooltip label={responsible?.displayName}>
            <Avatar boxSize="24px" cursor="pointer" name={responsible?.displayName} size="sm" src={responsible?.imgUrl} />
          </Tooltip>
        </Skeleton>
        <Text color="complianceSquare.nameFontColor" fontSize="16px" fontWeight="700" lineHeight="20px" ml={3} noOfLines={2} w="full">
          {response.complianceItem?.name}
        </Text>
      </Flex>
      <Flex align="center" h="40px" w="full">
        <LocationIcon color="complianceSquare.businessUnitFontColor" ml={1} />
        <Box
          color="complianceSquare.businessUnitFontColor"
          fontSize="14px"
          lineHeight="20px"
          overflow="hidden"
          pl={2}
          textOverflow="ellipsis"
          w="200px"
          whiteSpace="nowrap"
        >
          {response.businessUnit?.name}
        </Box>
      </Flex>
      <Flex alignItems="flex-start" h="50px" py="4" w="full">
        <Box color="complianceSquare.categoryFontColor" fontSize="11px" w="50%">
          <Box>Regulatory body</Box>
          <Box color="complianceSquare.nameFontColor" fontSize="14px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            {response.complianceItem?.regulatoryBody?.name ? (
              response.complianceItem?.regulatoryBody?.name
            ) : (
              <Flex fontStyle="italic">Unassigned</Flex>
            )}
          </Box>
        </Box>
        <Box color="complianceSquare.regulatoryFontColor" fontSize="11px" ml={3} w="50%">
          <Box>Next renewal on</Box>
          <Box color="complianceSquare.nameFontColor" fontSize="13px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            {response?.nextRenewalDate ? (
              format(new Date(response?.nextRenewalDate), 'd MMM yyyy')
            ) : (
              <Flex fontStyle="italic">No due date</Flex>
            )}
          </Box>
        </Box>
      </Flex>
      <Flex align="center" justify="space-between" pt="50px" w="full">
        <Button
          _hover={{
            bg: responseStatus === 'nonCompliant' ? 'complianceSquare.nonCompliant' : 'complianceSquare.buttonBg',
          }}
          bg={responseStatus === 'nonCompliant' ? 'complianceSquare.nonCompliant' : 'complianceSquare.buttonBg'}
          color={responseStatus === 'nonCompliant' ? 'white' : 'complianceSquare.fontColor'}
          fontSize="11px"
          h="28px"
          onClick={() => navigateTo(`/compliance-item/${response._id}`)}
          rightIcon={<ChevronRightIcon boxSize="20px" color={responseStatus === 'nonCompliant' ? 'white' : 'complianceSquare.fontColor'} />}
          w="85px"
        >
          Details
        </Button>
        <Flex align="center" color="complianceSquare.nameFontColor" flexDirection="column" justify="center" mr={1}>
          <Box fontSize="11px" fontWeight="700">
            {responseStatus && responseStatuses[responseStatus]}
          </Box>
          {getRenewalStatus(response) === 'comingUp' && (
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
    compliant: '#62c240',
    nonCompliant: '#FC5960',
    comingUp: '#FFA012',
    statusFontColor: '#FFFFFF',
    imageBg: '#ffffff',
    rightIcon: '#9A9EA1',
    crossIcon: '#ddd',
    tickIcon: '#41BA17',
    fontColor: '#818197',
    regulatoryFontColor: '#818197',
    renewalFontColor: '#424B50',
    evidenceFontColor: '#424B50',
    businessUnitFontColor: '#818197',
    categoryFontColor: '#818197',
    nameFontColor: '#282F36',
    buttonBg: '#F0F2F5',
  },
};
