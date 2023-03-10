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

const TrackerItemSquare = ({ response }: { response: IResponse }) => {
  const { navigateTo } = useNavigate();
  const { responseStatuses, isEvidenceUploaded, areRequiredQuestionsAnswered } = useResponseUtils();
  const { data: { usersById: responseResponsible } = [], loading: responsibleLoading } = useQuery(GET_USERS_BY_ID, {
    variables: {
      userQueryInput: {
        usersIds: response?.responsibleId || [],
      },
    },
  });
  const responsible: IUser = responseResponsible && responseResponsible.length !== 0 && responseResponsible[0];

  return (
    (<Box
      _hover={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.18)' }}
      bg="white"
      borderRadius="20px"
      boxShadow="sm"
      cursor="pointer"
      data-id="b768fed011d7"
      flexShrink={0}
      h="290px"
      onClick={() => navigateTo(`/tracker-item/${response._id}`)}
      p="20px 25px 20px 25px"
      w={['full', 'full', '350px']}>
      <Flex align="center" data-id="c6cebe2642f9" justify="space-between">
        <Flex align="center" data-id="5ca8d46aed4f">
          <Flex
            bgColor={`trackerSquare.${response.calculatedStatus}`}
            data-id="b7088e8a1b4d"
            h="12px"
            rounded="full"
            w="12px" />
          <Box
            color="trackerSquare.fontColor"
            data-id="fd632f8dc403"
            fontSize="11px"
            ml={2}
            opacity="1"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap">
            {response.trackerItem?.category?.name ? response.trackerItem?.category?.name : <Flex data-id="7a7048a5e737" fontStyle="italic">Unassigned</Flex>}
          </Box>
        </Flex>
        <Stack data-id="6007f389a658" direction="row" spacing={1}>
          {response.evidence?.length > 0 && (
            <Flex align="center" data-id="206eb0774bd7">
              <Tooltip
                data-id="2a8c32e21c6e"
                hasArrow
                label={`Evidence ${isEvidenceUploaded(response) ? 'uploaded' : 'required'}`}
                placement="top">
                <UploadedTick
                  color={`trackerSquare.${isEvidenceUploaded(response) ? 'tickIcon' : 'crossIcon'}`}
                  data-id="f6a64434e20d" />
              </Tooltip>
            </Flex>
          )}
          {response.questions?.filter(({ required }) => required).length > 0 && (
            <Tooltip
              data-id="e7ee7bd08dcf"
              hasArrow
              label={`Required questions ${areRequiredQuestionsAnswered(response) ? '' : 'not '}answered`}
              placement="top">
              <QuestionIcon
                color={`trackerSquare.${areRequiredQuestionsAnswered(response) ? 'tickIcon' : 'crossIcon'}`}
                data-id="cceb585b2f33" />
            </Tooltip>
          )}
        </Stack>
      </Flex>
      <Flex
        align="center"
        data-id="fb1ae407c62c"
        h="52px"
        mt={2}
        position="relative"
        w="full">
        <Skeleton data-id="42f3b24c3b28" isLoaded={!responsibleLoading} rounded="full">
          <Tooltip data-id="3309a70a8a66" label={responsible?.displayName}>
            <Avatar
              boxSize="24px"
              cursor="pointer"
              data-id="df094a1f37ab"
              name={responsible?.displayName}
              size="sm"
              src={responsible?.imgUrl} />
          </Tooltip>
        </Skeleton>
        <Text
          color="trackerSquare.nameFontColor"
          data-id="76f96b7e5b6e"
          fontSize="16px"
          fontWeight="700"
          lineHeight="20px"
          ml={3}
          noOfLines={2}
          w="full">
          {response.trackerItem?.name}
        </Text>
      </Flex>
      <Flex align="center" data-id="db683189b029" h="40px" w="full">
        <LocationIcon color="trackerSquare.businessUnitFontColor" data-id="4a9b5f8ec4d6" ml={1} />
        <Box
          color="trackerSquare.businessUnitFontColor"
          data-id="a97b4e7bf4cc"
          fontSize="14px"
          lineHeight="20px"
          overflow="hidden"
          pl={2}
          textOverflow="ellipsis"
          w="200px"
          whiteSpace="nowrap">
          {response.businessUnit?.name}
        </Box>
      </Flex>
      <Flex alignItems="flex-start" data-id="cb47e2c4fbdf" h="50px" py="4" w="full">
        <Box
          color="trackerSquare.categoryFontColor"
          data-id="e9373a2261dc"
          fontSize="11px"
          w="50%">
          <Box data-id="b80e8789c400">Regulatory body</Box>
          <Box
            color="trackerSquare.nameFontColor"
            data-id="627778184142"
            fontSize="14px"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap">
            {response.trackerItem?.regulatoryBody?.name ? (
              response.trackerItem?.regulatoryBody?.name
            ) : (
              <Flex data-id="04d32603a42b" fontStyle="italic">Unassigned</Flex>
            )}
          </Box>
        </Box>
        <Box
          color="trackerSquare.regulatoryFontColor"
          data-id="53d37c03dbca"
          fontSize="11px"
          ml={3}
          w="50%">
          <Box data-id="28a0b4220bb2">Next renewal on</Box>
          <Box
            color="trackerSquare.nameFontColor"
            data-id="7f7168426a6b"
            fontSize="13px"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap">
            {response?.dueDate ? format(new Date(response?.dueDate), 'd MMM yyyy') : <Flex data-id="ab8eb41a747c" fontStyle="italic">No due date</Flex>}
          </Box>
        </Box>
      </Flex>
      <Flex
        align="center"
        data-id="75c788998fcd"
        justify="space-between"
        pt="50px"
        w="full">
        <Button
          _hover={{
            bg: response.calculatedStatus === 'nonCompliant' ? 'trackerSquare.nonCompliant' : 'trackerSquare.buttonBg',
          }}
          bg={response.calculatedStatus === 'nonCompliant' ? 'trackerSquare.nonCompliant' : 'trackerSquare.buttonBg'}
          color={response.calculatedStatus === 'nonCompliant' ? 'white' : 'trackerSquare.fontColor'}
          data-id="cda89f75ede5"
          fontSize="11px"
          h="28px"
          onClick={() => navigateTo(`/tracker-item/${response._id}`)}
          rightIcon={
            <ChevronRightIcon
              boxSize="20px"
              color={response.calculatedStatus === 'nonCompliant' ? 'white' : 'trackerSquare.fontColor'}
              data-id="1fb2f808ddf8" />
          }
          w="85px">
          Details
        </Button>
        <Flex
          align="center"
          color="trackerSquare.nameFontColor"
          data-id="f4e3b68e4087"
          flexDirection="column"
          justify="center"
          mr={1}>
          <Box data-id="ee1ccb50bedb" fontSize="11px" fontWeight="700">
            {response.calculatedStatus && responseStatuses[response.calculatedStatus]}
          </Box>
        </Flex>
      </Flex>
    </Box>)
  );
};

export default TrackerItemSquare;

export const trackerItemsSquareStyles = {
  trackerSquare: {
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
