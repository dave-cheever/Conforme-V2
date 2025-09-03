import { Avatar, Box, Flex, Stack, Text } from '@chakra-ui/react';
import { format } from 'date-fns';

import useNavigate from '../../hooks/useNavigate';
import useResponseUtils from '../../hooks/useResponseUtils';
import { ErrorCircleIcon, SuccessCircleIcon } from '../../icons';
import { IResponse } from '../../interfaces/IResponse';

function TrackerListItem({ response, index }: { response: IResponse; index: number }) {
  const { navigateTo } = useNavigate();
  const { isEvidenceUploaded } = useResponseUtils();

  return (
    <Box
        data-id="030925-69fe28"
        _hover={{ bg: '#F5F7FA' }}
        bg={index % 2 === 0 ? 'white' : 'gray.50'}
        borderBottomColor="trackerList.headerBorderColor"
        borderBottomWidth="1px"
        cursor="pointer"
        onClick={() => navigateTo(`/tracker-item/${response._id}`)}
        px="10px"
        py={[1, 0]}
        w="full">
      <Flex
        data-id="030925-6b8f05"
        align="center"
        h={['full', '55px']}
        position="relative"
        w="full">
        <Flex data-id="030925-0f3a63" flexDir="column" w={"13%"}>
          <Flex
            data-id="030925-058ed2"
            align="flex-start"
            color="trackerList.fontColor"
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
        <Flex data-id="030925-7effcc" w={"11%"}>
          <Flex
            data-id="030925-3bfe0e"
            color="trackerList.fontColor"
            fontSize="14px"
            fontWeight="500"
            opacity="1">
            {response?.dueDate ? format(new Date(response?.dueDate), 'dd/MM/yyyy') : <Flex data-id="030925-2756df" fontSize="14px" fontWeight="500">No Due Date</Flex>}
          </Flex>
        </Flex>
        <Flex data-id="030925-844456" w={"8%"}>
          {response && response.calculatedStatus === 'nonCompliant' ? (
            <Flex data-id="030925-3ac0f2" align="center">
              <ErrorCircleIcon data-id="030925-45cf4f" mr={1}  />
              <Flex
                data-id="030925-05e236"
                color="trackerList.crossIcon"
                fontSize="14px"
                fontWeight="700">
                No
              </Flex>
            </Flex>
          ) : (
            <Flex data-id="030925-2a6dfc" align="flex-end">
              <SuccessCircleIcon data-id="030925-e9db4a" mr={1}  />
              <Flex
                data-id="030925-b119e9"
                color="trackerList.tickIcon"
                fontSize="14px"
                fontWeight="700">
                Yes
              </Flex>
            </Flex>
          )}
        </Flex>
        <Flex data-id="030925-23c0e7" w={'12%'}>
          <Stack data-id="030925-64b6e0" align="center" direction="row" pr="10px" spacing={2}>
            {isEvidenceUploaded(response) ? (
              <SuccessCircleIcon data-id="030925-31e21d" h="18px" w="18px" />
            ) : (
              <ErrorCircleIcon data-id="030925-d8dfff" h="18px" w="18px" />
            )}
            <Text
              data-id="030925-99cd3d"
              color={isEvidenceUploaded(response) ? '#41B916' : '#E93C44'}
              fontSize="smm"
              fontStyle="normal"
              fontWeight="bold"
              lineHeight="20px"
            >
              {isEvidenceUploaded(response) ? 'Uploaded' : 'Missing'}
            </Text>
          </Stack>
        </Flex>
        <Box data-id="030925-76a7de" w={"12%"}>
          <Box
            data-id="030925-89fe4d"
            color="trackerList.fontColor"
            fontSize="14px"
            fontWeight="500"
            opacity="1">
            {response.trackerItem?.category?.name ? (
              response.trackerItem?.category?.name
            ) : (
              <Flex data-id="030925-efb8fb" fontSize="14px" fontWeight="500">-</Flex>
            )}
          </Box>
        </Box>
        <Box data-id="030925-78ce49" w={"12%"}>
          <Box
            data-id="030925-8073a5"
            color="trackerList.fontColor"
            fontSize="14px"
            fontWeight="500"
            opacity="1">
            {response.trackerItem?.regulatoryBody?.name ? (
              response.trackerItem?.regulatoryBody?.name
            ) : (
              <Flex data-id="030925-3e751d" fontSize="14px" fontWeight="500">Unassigned</Flex>
            )}
          </Box>
        </Box>
        <Box
          data-id="030925-d1d3c7"
          pr={4}
          w={"13%"}
        >
          {response.responsible ? (
            <Flex data-id="030925-26ae80" align="center" direction="row">
              <Avatar
                data-id="030925-9c1e36"
                name={response.responsible.displayName?.replace(/\s*\(.*?\)\s*/g, '')} 
                size="xs"
                src={`${process.env.REACT_APP_API_URL}/files/photo/${response.responsible._id}`} />
              <Text
                data-id="030925-02965c"
                color="trackerList.fontColor"
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
            <Flex data-id="030925-71eb2d" fontSize="14px" fontWeight="500">
              Unassigned
            </Flex>
          )}
        </Box>
        <Box
          data-id="030925-83eaa7"
          w={"12%"}
        >
          <Flex data-id="030925-21b89a">
            {/* <LocationIcon boxSize="12px" data-id="282c7de29976" mt="2px" /> */}
            <Text
              data-id="030925-724853"
              color="trackerList.fontColor"
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
          data-id="030925-8e1b54"
          w={"8%"}
        >
          <Flex data-id="030925-fa1e61">
            <Text
              data-id="030925-0b1427"
              color="trackerList.fontColor"
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
              {Array.isArray(response.trackerItem?.locations) && response.trackerItem?.locations?.length > 0 ? `${response.trackerItem?.locations[0].name}, +${response.trackerItem?.locations?.length} other ` : "-"}
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
    </Box>
  );
}

export default TrackerListItem;
