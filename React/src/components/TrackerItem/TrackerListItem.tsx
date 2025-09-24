import { Avatar, Box, Flex, Stack, Text } from '@chakra-ui/react';
import { runtimeEnv } from '../../utils/runtime-env';
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
        data-id="000398"
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
        data-id="000399"
        align="center"
        h={['full', '55px']}
        position="relative"
        w="full">
        <Flex data-id="000400" flexDir="column" w={"13%"}>
          <Flex
            data-id="000401"
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
        <Flex data-id="000402" w={"11%"}>
          <Flex
            data-id="000403"
            color="trackerList.fontColor"
            fontSize="14px"
            fontWeight="500"
            opacity="1">
            {response?.dueDate ? format(new Date(response?.dueDate), 'dd/MM/yyyy') : <Flex data-id="000404" fontSize="14px" fontWeight="500">No Due Date</Flex>}
          </Flex>
        </Flex>
        <Flex data-id="000405" w={"8%"}>
          {response && response.calculatedStatus === 'nonCompliant' ? (
            <Flex data-id="000406" align="center">
              <ErrorCircleIcon data-id="000407" mr={1}  />
              <Flex
                data-id="000408"
                color="trackerList.crossIcon"
                fontSize="14px"
                fontWeight="700">
                No
              </Flex>
            </Flex>
          ) : (
            <Flex data-id="000409" align="flex-end">
              <SuccessCircleIcon data-id="000410" mr={1}  />
              <Flex
                data-id="000411"
                color="trackerList.tickIcon"
                fontSize="14px"
                fontWeight="700">
                Yes
              </Flex>
            </Flex>
          )}
        </Flex>
        <Flex data-id="000412" w={'12%'}>
          <Stack data-id="000413" align="center" direction="row" pr="10px" spacing={2}>
            {isEvidenceUploaded(response) ? (
              <SuccessCircleIcon data-id="000414" h="18px" w="18px" />
            ) : (
              <ErrorCircleIcon data-id="000415" h="18px" w="18px" />
            )}
            <Text
              data-id="000416"
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
        <Box data-id="000417" w={"12%"}>
          <Box
            data-id="000418"
            color="trackerList.fontColor"
            fontSize="14px"
            fontWeight="500"
            opacity="1">
            {response.trackerItem?.category?.name ? (
              response.trackerItem?.category?.name
            ) : (
              <Flex data-id="000419" fontSize="14px" fontWeight="500">-</Flex>
            )}
          </Box>
        </Box>
        <Box data-id="000420" w={"12%"}>
          <Box
            data-id="000421"
            color="trackerList.fontColor"
            fontSize="14px"
            fontWeight="500"
            opacity="1">
            {response.trackerItem?.regulatoryBody?.name ? (
              response.trackerItem?.regulatoryBody?.name
            ) : (
              <Flex data-id="000422" fontSize="14px" fontWeight="500">Unassigned</Flex>
            )}
          </Box>
        </Box>
        <Box
          data-id="000423"
          pr={4}
          w={"13%"}
        >
          {response.responsible ? (
            <Flex data-id="000424" align="center" direction="row">
              <Avatar
                data-id="000425"
                name={response.responsible.displayName?.replace(/\s*\(.*?\)\s*/g, '')} 
                size="xs"
                src={`${runtimeEnv.apiUrl()}/files/photo/${response.responsible._id}`} />
              <Text
                data-id="000426"
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
            <Flex data-id="000427" fontSize="14px" fontWeight="500">
              Unassigned
            </Flex>
          )}
        </Box>
        <Box
          data-id="000428"
          w={"12%"}
        >
          <Flex data-id="000429">
            {/* <LocationIcon boxSize="12px" data-id="282c7de29976" mt="2px" /> */}
            <Text
              data-id="000430"
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
          data-id="000431"
          w={"8%"}
        >
          <Flex data-id="000432">
            <Text
              data-id="000433"
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
