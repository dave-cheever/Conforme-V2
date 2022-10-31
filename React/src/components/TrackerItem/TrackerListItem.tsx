import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { format } from 'date-fns';

import useNavigate from '../../hooks/useNavigate';
import { Close, LocationIcon, TickIcon } from '../../icons';
import { IResponse } from '../../interfaces/IResponse';

const TrackerListItem = ({ response }: { response: IResponse }) => {
  const { navigateTo } = useNavigate();

  return (
    <Box
      bg="white"
      borderBottomColor="trackerList.headerBorderColor"
      borderBottomWidth="1px"
      cursor="pointer"
      onClick={() => navigateTo(`/tracker-item/${response._id}`)}
      p="15px 25px"
      py={[1, 0]}
      w="full"
    >
      <Flex align="center" h={['full', '73px']} position="relative" w="full">
        <Flex flexDir="column" w="20%">
          <Flex
            align="flex-start"
            color="trackerList.fontColor"
            fontSize="14px"
            fontWeight="400"
            h="50%"
            lineHeight="18px"
            noOfLines={1}
            opacity="1"
            pt="3px"
            textOverflow="ellipsis"
          >
            {response.trackerItem?.name}
          </Flex>
        </Flex>
        <Flex w="12%">
          <Flex color="trackerList.fontColor" fontSize="14px" fontWeight="400" opacity="1">
            {response?.dueDate ? format(new Date(response?.dueDate), 'd MMM yyyy') : <Flex fontStyle="italic">No due date</Flex>}
          </Flex>
        </Flex>
        <Flex w="10%">
          {response && response.calculatedStatus === 'nonCompliant' ? (
            <Flex align="center">
              <Close mr={2} stroke="trackerList.crossIcon" />
              <Flex color="trackerList.crossIcon" fontSize="14px" fontWeight="700">
                No
              </Flex>
            </Flex>
          ) : (
            <Flex align="flex-end">
              <TickIcon mr={2} stroke="trackerList.tickIcon" />
              <Flex color="trackerList.tickIcon" fontSize="14px" fontWeight="700">
                Yes
              </Flex>
            </Flex>
          )}
        </Flex>
        <Box w="18%">
          <Box color="trackerList.fontColor" fontSize="14px" fontWeight="400" opacity="1">
            {response.trackerItem?.regulatoryBody?.name ? (
              response.trackerItem?.regulatoryBody?.name
            ) : (
              <Flex fontStyle="italic">Unassigned</Flex>
            )}
          </Box>
        </Box>
        <Box pr={4} w="20%">
          {response.responsible ? (
            <Flex align="center" direction="row">
              <Avatar
                name={response.responsible.displayName}
                size="xs"
                src={`${process.env.REACT_APP_API_URL}/files/photo/${response.responsible._id}`}
              />
              <Text
                color="trackerList.fontColor"
                fontSize="13px"
                lineHeight="17px"
                opacity="1"
                overflow="hidden"
                pl={3}
                textOverflow="ellipsis"
                w="full"
                whiteSpace="nowrap"
              >
                {response.responsible.displayName}
              </Text>
            </Flex>
          ) : (
            <Flex fontSize="13px" fontStyle="italic">
              Unassigned
            </Flex>
          )}
        </Box>
        <Box w="20%">
          <Flex>
            <LocationIcon boxSize="12px" mt="2px" />
            <Text
              color="trackerList.fontColor"
              fontSize="13px"
              lineHeight="17px"
              opacity="1"
              overflow="hidden"
              pl={2}
              textOverflow="ellipsis"
              w="full"
              whiteSpace="nowrap"
            >
              {response.businessUnit?.name}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default TrackerListItem;
