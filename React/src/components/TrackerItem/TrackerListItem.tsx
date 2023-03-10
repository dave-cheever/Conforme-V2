import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { format } from 'date-fns';

import useNavigate from '../../hooks/useNavigate';
import { Close, LocationIcon, TickIcon } from '../../icons';
import { IResponse } from '../../interfaces/IResponse';

const TrackerListItem = ({ response }: { response: IResponse }) => {
  const { navigateTo } = useNavigate();

  return (
    (<Box
      bg="white"
      borderBottomColor="trackerList.headerBorderColor"
      borderBottomWidth="1px"
      cursor="pointer"
      data-id="224dd8f3a847"
      onClick={() => navigateTo(`/tracker-item/${response._id}`)}
      p="15px 25px"
      py={[1, 0]}
      w="full">
      <Flex
        align="center"
        data-id="b9eb0fdd699d"
        h={['full', '73px']}
        position="relative"
        w="full">
        <Flex data-id="d3f2e9709450" flexDir="column" w="20%">
          <Flex
            align="flex-start"
            color="trackerList.fontColor"
            data-id="a809f8d9a091"
            fontSize="14px"
            fontWeight="400"
            h="50%"
            lineHeight="18px"
            noOfLines={1}
            opacity="1"
            pt="3px"
            textOverflow="ellipsis">
            {response.trackerItem?.name}
          </Flex>
        </Flex>
        <Flex data-id="5b66254df22c" w="12%">
          <Flex
            color="trackerList.fontColor"
            data-id="dcbdd90a95dc"
            fontSize="14px"
            fontWeight="400"
            opacity="1">
            {response?.dueDate ? format(new Date(response?.dueDate), 'd MMM yyyy') : <Flex data-id="575ecfde3d16" fontStyle="italic">No due date</Flex>}
          </Flex>
        </Flex>
        <Flex data-id="ad60805790d9" w="10%">
          {response && response.calculatedStatus === 'nonCompliant' ? (
            <Flex align="center" data-id="c63dcb7094a8">
              <Close data-id="36f28ceab0c4" mr={2} stroke="trackerList.crossIcon" />
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
              <TickIcon data-id="d92e102e49c1" mr={2} stroke="trackerList.tickIcon" />
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
        <Box data-id="dcf65665ac32" w="18%">
          <Box
            color="trackerList.fontColor"
            data-id="fb2328ea6fc5"
            fontSize="14px"
            fontWeight="400"
            opacity="1">
            {response.trackerItem?.regulatoryBody?.name ? (
              response.trackerItem?.regulatoryBody?.name
            ) : (
              <Flex data-id="8a85dbfcfb9e" fontStyle="italic">Unassigned</Flex>
            )}
          </Box>
        </Box>
        <Box data-id="2837ac2f6ba5" pr={4} w="20%">
          {response.responsible ? (
            <Flex align="center" data-id="735022a416dc" direction="row">
              <Avatar
                data-id="dc03862aae27"
                name={response.responsible.displayName}
                size="xs"
                src={`${process.env.REACT_APP_API_URL}/files/photo/${response.responsible._id}`} />
              <Text
                color="trackerList.fontColor"
                data-id="d645c961ebcc"
                fontSize="13px"
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
            <Flex data-id="034127dd3372" fontSize="13px" fontStyle="italic">
              Unassigned
            </Flex>
          )}
        </Box>
        <Box data-id="19eb22f1e66d" w="20%">
          <Flex data-id="ec3e298e5b76">
            <LocationIcon boxSize="12px" data-id="282c7de29976" mt="2px" />
            <Text
              color="trackerList.fontColor"
              data-id="83206fb5d1e3"
              fontSize="13px"
              lineHeight="17px"
              opacity="1"
              overflow="hidden"
              pl={2}
              textOverflow="ellipsis"
              w="full"
              whiteSpace="nowrap">
              {response.businessUnit?.name}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>)
  );
};

export default TrackerListItem;
