import { gql, useQuery } from '@apollo/client';
import { Avatar, Box, Divider, Flex, Skeleton, Text, Tooltip } from '@chakra-ui/react';
import { format } from 'date-fns';

import useNavigate from '../../hooks/useNavigate';
import { CircledCross, CircledTickBold } from '../../icons';
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

function TrackerItemSquare({ response }: { response: IResponse }) {
  const { navigateTo } = useNavigate();
  // const { getCustomQuestionsInDashboard } = useResponseUtils();
  const { data: { usersById: responseResponsible } = [], loading: responsibleLoading } = useQuery(GET_USERS_BY_ID, {
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
      _hover={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.04)' }}
      bg="white"
      border={"1px solid #E2E8F0"}
      borderRadius="10px"
      boxShadow="sm"
      cursor="pointer"
      data-id="b768fed011d7"
      flexShrink={0}
      h={"254px"}
      onClick={() => navigateTo(`/tracker-item/${response._id}`)}
      p="16px 0px 16px 0px"
      w={['full', 'full', '350px']}>
      {/* <Flex align="center" data-id="c6cebe2642f9" justify="space-between">
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
      </Flex> */}
      <Flex
        align="center"
        data-id="fb1ae407c62c"
        h="32px"
        mt={2}
        p="0px 16px 16px 16px"
        position="relative"
        w="full">
        <Skeleton data-id="42f3b24c3b28" isLoaded={!responsibleLoading} rounded="full">
          <Tooltip data-id="3309a70a8a66" label={responsible?.displayName}>
            <Avatar
              borderRadius={"8px"}
              boxSize="36px"
              cursor="pointer"
              data-id="df094a1f37ab"
              name={responsible?.displayName}
              size="sm"
              src={responsible?.imgUrl} />
          </Tooltip>
        </Skeleton>
        <Flex align={"flex-start"} flexDirection={"column"}>
          <Text
            color="trackerSquare.nameFontColor"
            data-id="76f96b7e5b6e"
            fontSize="16px"
            fontWeight="600"
            lineHeight="100%"
            ml={3}
            noOfLines={2}
            w="full">
            {response.trackerItem?.name}
          </Text>
          <Text
            color="trackerSquare.fontColor"
            data-id="fd632f8dc403"
            fontSize="11px"
            ml={3}

            opacity="1"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap">
            {response.trackerItem?.category?.name ? response.trackerItem?.category?.name : <Flex data-id="7a7048a5e737" fontStyle="italic">Unassigned</Flex>}
          </Text>
        </Flex>
      </Flex>
      <Divider color={"#E2E8F0"} w={"full"} />

      <Flex data-id="ad60805790d9" flexDirection={"row"} justifyContent={"space-between"} p="16px">

        <Flex data-id="ad60805790d9" flexDirection={"column"} gap={"16px"} w={"60%"}>
          <Text
            color={"#4A5568"}
            fontSize={"14px"}
            fontWeight={"600"}
          >
            Compliant
          </Text>
          {response && response.calculatedStatus === 'nonCompliant' ? (
            <Flex align="center" data-id="c63dcb7094a8">
              <CircledCross data-id="36f28ceab0c4" mr={2} stroke="trackerList.crossIcon" />
              <Flex
                color="trackerList.crossIcon"
                data-id="cd7f66f6f585"
                fontSize="14px"
                fontWeight="700">
                No
              </Flex>
            </Flex>
          ) : (
            <Flex align="flex-end" data-id="0ce15d4739e6">
              <CircledTickBold data-id="d92e102e49c1" mr={2} stroke="trackerList.tickIcon" />
              <Flex
                color="trackerList.tickIcon"
                data-id="e1b2ea6eef46"
                fontSize="14px"
                fontWeight="700">
                Yes
              </Flex>
            </Flex>
          )}
          <Flex  data-id="5b66254df22c" flexDirection={"column"} gap={"16px"} w={"60%"} >
            <Text
              color={"#4A5568"}
              fontSize={"14px"}
              fontWeight={"600"}
            >
              Business unit        </Text>
            <Text
              color="trackerList.fontColor"
              data-id="83206fb5d1e3"
              fontSize="13px"
              isTruncated
              lineHeight="17px"
              opacity="1"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {response.businessUnit?.name}
              </Text>
          </Flex>
        </Flex>
        <Flex  data-id="ad60805790d9" flexDirection={"column"} gap={"16px"} w={"60%"}>

          <Text
            color={"#4A5568"}
            fontSize={"14px"}
            fontWeight={"600"}
          >
            Evidence
          </Text>
          <Flex data-id="ad60805790d9" >
            {response && Array.isArray(response.evidence) && response.evidence.length > 0 ? (
              <Flex align="flex-end" data-id="0ce15d4739e6">
                <CircledTickBold data-id="d92e102e49c1" mr={2} stroke="trackerList.tickIcon" />
                <Flex
                  color="trackerList.tickIcon"
                  data-id="e1b2ea6eef46"
                  fontSize="14px"
                  fontWeight="700">
                  Uploaded
                </Flex>
              </Flex>
            ) : (
              <Flex align="center" data-id="c63dcb7094a8">
                <CircledCross data-id="36f28ceab0c4" mr={2} stroke="trackerList.crossIcon" />
                <Flex
                  color="trackerList.crossIcon"
                  data-id="cd7f66f6f585"
                  fontSize="14px"
                  fontWeight="700">
                  Missing
                </Flex>
              </Flex>

            )}

          </Flex>
          <Flex data-id="5b66254df22c" flexDirection={"column"} gap={"16px"} w={"60%"}>
            <Text
              color={"#4A5568"}
              fontSize={"14px"}
              fontWeight={"600"}
            >
              Due Date
            </Text>
            <Flex
              color="trackerList.fontColor"
              data-id="dcbdd90a95dc"
              fontSize="14px"
              fontWeight="500"
              opacity="1">
              {response?.dueDate ? format(new Date(response?.dueDate), 'dd/MM/yyyy') : <Flex data-id="575ecfde3d16" fontStyle="italic">No Due Date</Flex>}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex  align={"center"} bg={"#EDF2F7"} borderRadius={"0px 0px 8px 8px"} h="32px" w={"full"}>

            {response.contributors?.map((contributor, index)=>{
              console.log("contributor", contributor)
               return <Avatar
              boxSize="20px"
              cursor="pointer"
              data-id="df094a1f37ab"
              ml={`${16+index+1}px`}
              name={contributor?.displayName}
              size="sm"
              src={contributor?.imgUrl} />},
            )}

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
