import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { format } from 'date-fns';

import useNavigate from '../../hooks/useNavigate';
import { ErrorCircleIcon, SuccessCircleIcon } from '../../icons';
import { IResponse } from '../../interfaces/IResponse';

function TrackerListItem({ response, index }: { response: IResponse, index: number}) {
  const { navigateTo } = useNavigate();

  return (
    (<Box
      _hover={{ bg: '#F5F7FA' }}
      bg={index % 2 === 0 ? 'white' : 'gray.50'}
      borderBottomColor="trackerList.headerBorderColor"
      borderBottomWidth="1px"
      cursor="pointer"
      data-id="224dd8f3a847"
      onClick={() => navigateTo(`/tracker-item/${response._id}`)}
      px="10px"
      py={[1, 0]}
      w="full">
      <Flex
        align="center"
        data-id="b9eb0fdd699d"
        h={['full', '55px']}
        position="relative"
        w="full">
        <Flex data-id="d3f2e9709450" flexDir="column" w={"13%"}>
          <Flex
            align="flex-start"
            color="trackerList.fontColor"
            data-id="a809f8d9a091"
            fontSize="14px"
            fontWeight="500"
            h="50%"
            noOfLines={1}
            opacity="1"
            pt="3px"
            textOverflow="ellipsis" >
            {response.trackerItem?.name}
          </Flex>
        </Flex>
        <Flex data-id="5b66254df22c" w={"11%"}>
          <Flex
            color="trackerList.fontColor"
            data-id="dcbdd90a95dc"
            fontSize="14px"
            fontWeight="500"
            opacity="1">
            {response?.dueDate ? format(new Date(response?.dueDate), 'dd/MM/yyyy') : <Flex data-id="575ecfde3d16" fontSize="14px" fontWeight="500">No Due Date</Flex>}
          </Flex>
        </Flex>
        <Flex data-id="ad60805790d9" w={"8%"}>
          {response && response.calculatedStatus === 'nonCompliant' ? (
            <Flex align="center" data-id="c63dcb7094a8">
              <ErrorCircleIcon data-id="36f28ceab0c4" mr={1}  />
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
              <SuccessCircleIcon data-id="d92e102e49c1" mr={1}  />
              <Flex
                color="trackerList.tickIcon"
                data-id="e1b2ea6eef46"
                fontSize="14px"
                fontWeight="700">
                Yes
              </Flex>
            </Flex>
          )}
        </Flex>
        <Flex data-id="ad60805790d9" w={"12%"}>
          {response && Array.isArray(response.evidence) && response.evidence.length > 0 ? (
            <Flex align="center" data-id="0ce15d4739e6">
             <SuccessCircleIcon data-id="d92e102e49c1" mr={1}  />
              <Flex
                color="trackerList.tickIcon"
                data-id="e1b2ea6eef46"
                fontSize="14px"
                fontWeight="600">
                Uploaded
              </Flex>
            </Flex>
          ) : (
            <Flex align="center" data-id="c63dcb7094a8">
              <ErrorCircleIcon data-id="36f28ceab0c4" mr={1}  />
              <Flex
                color="trackerList.crossIcon"
                data-id="cd7f66f6f585"
                fontSize="14px"
                fontWeight="600">
                Missing
              </Flex>
            </Flex>

          )}
        </Flex>
        <Box data-id="dcf65665ac32" w={"12%"}>
          <Box
            color="trackerList.fontColor"
            data-id="fb2328ea6fc5"
            fontSize="14px"
            fontWeight="500"
            opacity="1">
            {response.trackerItem?.category?.name ? (
              response.trackerItem?.category?.name
            ) : (
              <Flex data-id="8a85dbfcfb9e" fontSize="14px" fontWeight="500">-</Flex>
            )}
          </Box>
        </Box>
        <Box data-id="dcf65665ac32" w={"12%"}>
          <Box
            color="trackerList.fontColor"
            data-id="fb2328ea6fc5"
            fontSize="14px"
            fontWeight="500"
            opacity="1">
            {response.trackerItem?.regulatoryBody?.name ? (
              response.trackerItem?.regulatoryBody?.name
            ) : (
              <Flex data-id="8a85dbfcfb9e" fontSize="14px" fontWeight="500">Unassigned</Flex>
            )}
          </Box>
        </Box>
        <Box
          data-id="2837ac2f6ba5"
          pr={4}
          w={"13%"}
        >
          {response.responsible ? (
            <Flex align="center" data-id="735022a416dc" direction="row">
              <Avatar
                data-id="dc03862aae27"
                name={response.responsible.displayName?.replace(/\s*\(.*?\)\s*/g, '')} 
                size="xs"
                src={`${process.env.REACT_APP_API_URL}/files/photo/${response.responsible._id}`} />
              <Text
                color="trackerList.fontColor"
                data-id="d645c961ebcc"
                fontSize="14px"
               fontWeight="500"
                lineHeight="17px"
                opacity="1"
                overflow="hidden"
                pl={3}
                textOverflow="ellipsis"
                w="full"
                whiteSpace="nowrap">
                {response.responsible.displayName}
              </Text>
            </Flex>
          ) : (
            <Flex data-id="034127dd3372" fontSize="14px" fontWeight="500">
              Unassigned
            </Flex>
          )}
        </Box>
        <Box
          data-id="19eb22f1e66d"
          w={"12%"}
        >
          <Flex data-id="ec3e298e5b76">
            {/* <LocationIcon boxSize="12px" data-id="282c7de29976" mt="2px" /> */}
            <Text
              color="trackerList.fontColor"
              data-id="83206fb5d1e3"
              fontSize="14px"
              fontWeight="500"
              isTruncated
              lineHeight="17px"
              opacity="1"
              overflow="hidden"
              pl={2}
              textOverflow="ellipsis"

              whiteSpace="nowrap"
            >
              {response.businessUnit?.name}
            </Text>
          </Flex>
        </Box>
        <Box
          data-id="19eb22f1e66d"
          w={"8%"}
        >
          <Flex data-id="ec3e298e5b76">
            <Text
              color="trackerList.fontColor"
              data-id="83206fb5d1e3"
              fontSize="14px"
              fontWeight="500"
              isTruncated
              lineHeight="17px"
              opacity="1"
              overflow="hidden"
              pl={2}
              textOverflow="ellipsis"
              w="full"
              whiteSpace="nowrap"
            >
              {Array.isArray(response.trackerItem?.locations) && response.trackerItem?.locations?.length > 0 ? `${response.trackerItem?.locations[0].name},+${response.trackerItem?.locations?.length}other ` : "-"}
            </Text>
          </Flex>
        </Box>
        {/* {customQuestionsInDashboard.length > 0 && (
          <Box flex={1}>
            <Flex>
              <Text
                color="trackerList.fontColor"
                fontSize="13px"
                lineHeight="17px"
                opacity="1"
                overflow="hidden"
                textOverflow="ellipsis"
                w="full"
                whiteSpace="nowrap">
                {customQuestionsInDashboard[0].value || '-'}
              </Text>
            </Flex>
          </Box>
        )}
        {customQuestionsInDashboard.length > 1 && (
          <Box flex={1}>
            <Flex>
              <Text
                color="trackerList.fontColor"
                fontSize="13px"
                lineHeight="17px"
                opacity="1"
                overflow="hidden"
                textOverflow="ellipsis"
                w="full"
                whiteSpace="nowrap">
                {customQuestionsInDashboard[1].value || '-'}
              </Text>
            </Flex>
          </Box>
        )} */}
      </Flex>
    </Box>)
  );
}

export default TrackerListItem;
