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
    (<Box
  _hover={{ boxShadow: "0px 4px 12px rgba(16, 24, 40, 0.08)" }}
  bg="white"
  border="1px solid #CBD5E0"
  borderRadius="12px"
  boxShadow="0px 1px 2px rgba(16, 24, 40, 0.05)"
  cursor="pointer"
  maxW="350px"
  onClick={() => navigateTo(`/tracker-item/${response._id}`)}
  transition="box-shadow 0.2s ease"
  w="full"
>
  {/* Top section - Title + Avatar */}
  <Flex align="center" gap="12px" pt="16px" px="16px">
    <Skeleton isLoaded={!responsibleLoading} rounded="full">
      <Tooltip label={responsible?.displayName}>
        <Avatar
          borderRadius="8px"
          boxSize="36px"
          name={responsible?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
          src={responsible?.imgUrl}
        />
      </Tooltip>
    </Skeleton>
        <Box flex="1" minW={0}>
            <Text
              color="#1A202C"
              fontSize="16px"
              fontWeight="600"
              isTruncated
              lineHeight="1.4"
              maxW={isGroupView ? { base: "100%", md: "220px" } : { base: "100%", md: "180px" }}
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {response.trackerItem?.name}
            </Text>

            <Text
              color="#718096"
              fontSize="14px"
              fontWeight="500"
              isTruncated
              noOfLines={1}
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {response.trackerItem?.category?.name || <i>Unassigned</i>}
            </Text>
    </Box>

  </Flex>

  <Divider my="12px" />

  {/* Middle section - Details */}
  <Flex gap="24px" pb="16px" px="16px">
    <Flex direction="column" flex="1" gap="12px">
      <Box>
        <Text color="#4A5568" fontSize="14px" fontWeight="600">
          Compliant
        </Text>
        <Flex align="center" mt="4px">
          {response.calculatedStatus === 'nonCompliant' ? (
            <>
              <CircledCross mr={2} stroke="trackerList.crossIcon" />
              <Text color="trackerList.crossIcon" fontSize="14px" fontWeight="700">No</Text>
            </>
          ) : (
            <>
              <CircledTickBold mr={2} stroke="trackerList.tickIcon" />
              <Text color="trackerList.tickIcon" fontSize="14px" fontWeight="700">Yes</Text>
            </>
          )}
        </Flex>
      </Box>
      <Box>
        <Text color="#4A5568" fontSize="14px" fontWeight="600">
          Business unit
        </Text>
        <Text color="#4A5568" fontSize="14px" fontWeight="500" noOfLines={1}>
          {response.businessUnit?.name}
        </Text>
      </Box>
    </Flex>

    <Flex direction="column" flex="1" gap="12px">
      <Box>
        <Text color="#4A5568" fontSize="14px" fontWeight="600">
          Evidence
        </Text>
        <Flex align="center" mt="4px">
          {isEvidenceUploaded(response) ? (
            <>
              <CircledTickBold mr={1} stroke="trackerList.tickIcon" />
              <Text color="trackerList.tickIcon" fontSize="14px" fontWeight="700">Uploaded</Text>
            </>
          ) : (
            <>
              <CircledCross mr={1} stroke="trackerList.crossIcon" />
              <Text color="trackerList.crossIcon" fontSize="14px" fontWeight="700">Missing</Text>
            </>
          )}
        </Flex>
      </Box>
      <Box>
        <Text color="#4A5568" fontSize="14px" fontWeight="600">
          Due date
        </Text>
        <Text color="#535862" fontSize="14px" fontWeight="500">
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
    minH="36px"
    overflowX="auto"
    px="12px"
    py="8px"
  >
    {response.contributors?.map((c, index) => (
      <Avatar
        border="2px solid white"
        boxSize="20px"
        key={index}
        ml={index === 0 ? '0' : '-6px'}
        name={c?.displayName?.replace(/\s*\(.*?\)\s*/g, '')} 
        src={c.imgUrl}
      />
    ))}
  </Flex>
</Box>)
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
