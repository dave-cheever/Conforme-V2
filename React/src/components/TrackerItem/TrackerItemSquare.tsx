import { gql, useQuery } from '@apollo/client';
import { Avatar, Box, Divider, Flex, Skeleton, Text, Tooltip } from '@chakra-ui/react';
import { format } from 'date-fns';

import useNavigate from '../../hooks/useNavigate';
import useResponseUtils from '../../hooks/useResponseUtils';
import { CircledCross, CircledTickBold } from '../../icons';
import { IResponse } from '../../interfaces/IResponse';
import { IUser } from '../../interfaces/IUser';

const GET_USERS_BY_ID = gql`
  query ($userQueryInput: UserQueryInput) {
    usersByIdFromDb(userQueryInput: $userQueryInput) {
      _id
      displayName
      imgUrl
    }
  }
`;

function TrackerItemSquare({ response, isGroupView }: { response: IResponse, isGroupView?: boolean }) {
  const { navigateTo } = useNavigate();
    const { isEvidenceUploaded } = useResponseUtils();
  // const { getCustomQuestionsInDashboard } = useResponseUtils();
  const { data: { usersByIdFromDb: responseResponsible } = [], loading: responsibleLoading } = useQuery(GET_USERS_BY_ID, {
    variables: {
      userQueryInput: {
        usersIds: response?.responsibleId || [],
      },
    },
  });
  const responsible: IUser = responseResponsible && responseResponsible.length !== 0 && responseResponsible[0];
  // const customQuestionsInDashboard = useMemo(() => getCustomQuestionsInDashboard(module!, response), [module, response]);

  return (
    <Box
      _hover={{ boxShadow: "0px 4px 12px rgba(16, 24, 40, 0.08)" }}
      bg="white"
      border="1px solid #CBD5E0"
      borderRadius="12px"
      boxShadow="0px 1px 2px rgba(16, 24, 40, 0.05)"
      cursor="pointer"
      data-id="030925-192395"
      maxW="350px"
      onClick={() => navigateTo(`/tracker-item/${response._id}`)}
      transition="box-shadow 0.2s ease"
      w="full">
      {/* Top section - Title + Avatar */}
      <Flex align="center" data-id="030925-29fe25" gap="12px" pt="16px" px="16px">
        <Skeleton data-id="030925-b305ec" isLoaded={!responsibleLoading} rounded="full">
          <Tooltip data-id="030925-9b3017" label={responsible?.displayName}>
            <Avatar
              borderRadius="8px"
              boxSize="36px"
              data-id="030925-035336"
              name={responsible?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
              src={responsible?.imgUrl} />
          </Tooltip>
        </Skeleton>
            <Box data-id="030925-11176a" flex="1" minW={0}>
                <Text
                  color="#1A202C"
                  data-id="030925-690dd8"
                  fontSize="16px"
                  fontWeight="600"
                  isTruncated
                  lineHeight="1.4"
                  maxW={isGroupView ? { base: "100%", md: "220px" } : { base: "100%", md: "180px" }}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap">
                  {response.trackerItem?.name}
                </Text>

                <Text
                  color="#718096"
                  data-id="030925-1673c2"
                  fontSize="14px"
                  fontWeight="500"
                  isTruncated
                  noOfLines={1}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap">
                  {response.trackerItem?.category?.name || <i data-id="030925-a4a15c">Unassigned</i>}
                </Text>
        </Box>

      </Flex>
      <Divider data-id="030925-dcc435" my="12px" />
      {/* Middle section - Details */}
      <Flex data-id="030925-665074" gap="24px" pb="16px" px="16px">
        <Flex data-id="030925-d8635c" direction="column" flex="1" gap="12px">
          <Box data-id="030925-ec4437">
            <Text color="#4A5568" data-id="030925-5d7e21" fontSize="14px" fontWeight="600">
              Compliant
            </Text>
            <Flex align="center" data-id="030925-99f5e9" mt="4px">
              {response.calculatedStatus === 'nonCompliant' ? (
                <>
                  <CircledCross data-id="030925-96ee05" mr={2} stroke="trackerList.crossIcon" />
                  <Text
                    color="trackerList.crossIcon"
                    data-id="030925-271e09"
                    fontSize="14px"
                    fontWeight="700">No</Text>
                </>
              ) : (
                <>
                  <CircledTickBold data-id="030925-01ee71" mr={2} stroke="trackerList.tickIcon" />
                  <Text
                    color="trackerList.tickIcon"
                    data-id="030925-a45c62"
                    fontSize="14px"
                    fontWeight="700">Yes</Text>
                </>
              )}
            </Flex>
          </Box>
          <Box data-id="030925-e61a60">
            <Text color="#4A5568" data-id="030925-296e86" fontSize="14px" fontWeight="600">
              Business unit
            </Text>
            <Text
              color="#4A5568"
              data-id="030925-34be90"
              fontSize="14px"
              fontWeight="500"
              noOfLines={1}>
              {response.businessUnit?.name}
            </Text>
          </Box>
        </Flex>

        <Flex data-id="030925-e4258f" direction="column" flex="1" gap="12px">
          <Box data-id="030925-f766ab">
            <Text color="#4A5568" data-id="030925-d6bfde" fontSize="14px" fontWeight="600">
              Evidence
            </Text>
            <Flex align="center" data-id="030925-9b8bfd" mt="4px">
              {isEvidenceUploaded(response) ? (
                <>
                  <CircledTickBold data-id="030925-6c6598" mr={1} stroke="trackerList.tickIcon" />
                  <Text
                    color="trackerList.tickIcon"
                    data-id="030925-4d1aed"
                    fontSize="14px"
                    fontWeight="700">Uploaded</Text>
                </>
              ) : (
                <>
                  <CircledCross data-id="030925-c3411d" mr={1} stroke="trackerList.crossIcon" />
                  <Text
                    color="trackerList.crossIcon"
                    data-id="030925-1120d9"
                    fontSize="14px"
                    fontWeight="700">Missing</Text>
                </>
              )}
            </Flex>
          </Box>
          <Box data-id="030925-258585">
            <Text color="#4A5568" data-id="030925-5c981f" fontSize="14px" fontWeight="600">
              Due date
            </Text>
            <Text color="#535862" data-id="030925-b38836" fontSize="14px" fontWeight="500">
              {response.dueDate ? format(new Date(response.dueDate), 'dd/MM/yyyy') : "No Due Date"}
            </Text>
          </Box>
        </Flex>
      </Flex>
      {/* Bottom section - Contributors */}
      <Flex
        align="center"
        bg="#EDF2F7"
        borderBottomRadius="12px"
        data-id="030925-8dde36"
        minH="36px"
        overflowX="auto"
        px="12px"
        py="8px">
        {response.contributors?.map((c, index) => (
          <Avatar
            border="2px solid white"
            boxSize="20px"
            data-id="030925-a1c312"
            key={index}
            ml={index === 0 ? '0' : '-6px'}
            name={c?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
            src={c.imgUrl} />
        ))}
      </Flex>
    </Box>
  );
}

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
