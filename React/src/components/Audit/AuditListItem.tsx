import { Avatar, Box, Flex, Skeleton, Stack, Text } from '@chakra-ui/react';
import { format } from 'date-fns';

import { useAppContext } from '../../contexts/AppProvider';
import { auditStatuses } from '../../hooks/useAuditUtils';
import { auditWalkTypes } from '../../hooks/useFiltersUtils';
import useNavigate from '../../hooks/useNavigate';
// import { LocationIcon } from '../../icons';
import { IAudit } from '../../interfaces/IAudit';

function AuditListItem({ audit, index }: { audit: IAudit, index: number }) {
  const { navigateTo } = useNavigate();
  const { module } = useAppContext();
  return (
    <Box
      data-id="030925-3628ed"
      _hover={{ bg: '#F5F7FA' }}
      bg={index % 2 === 0 ? 'white' : 'gray.50'}
      borderBottomColor="auditsList.headerBorderColor"
      borderBottomWidth="1px"
      cursor={!audit?.metatags?.removedBy ? 'pointer' : 'default'}
      onClick={() => !audit?.metatags?.removedBy && navigateTo(`/audits/${audit._id}`)}
      p="15px 25px"
      py={[1, 0]}
      w="full"
    >
      <Flex data-id="030925-2cc5c2" align="center" h={['full', '55px']} position="relative" w="full">
        <Flex data-id="030925-08c407" w="10%">
          <Flex data-id="030925-51a3ed" color="auditsList.fontColor" fontSize="14px" fontWeight="500" opacity="1" pr={2}>
            {audit?.dueDate ? (
              format(new Date(audit?.dueDate), 'dd-MMM-yyyy')
            ) : (
              <Flex data-id="030925-cd8b5f" fontSize="14px" fontWeight="500">
                No due date
              </Flex>
            )}
          </Flex>
        </Flex>
        <Stack data-id="030925-562c8e" direction="row" pr={2} spacing={1} w="20%">
          {/* <LocationIcon boxSize="12px" data-id="50bf3b8c0b11" mt="2px" /> */}
          <Text
            data-id="030925-7fe9dc"
            color="auditsList.fontColor"
            fontSize="14px"
            fontWeight="500"
            lineHeight="17px"
            opacity="1"
            overflow="hidden"
            textOverflow="ellipsis"
            w="full"
            whiteSpace="nowrap"
          >
            {audit.location?.name ?? 'Virtual'}
          </Text>
        </Stack>
        <Flex data-id="030925-00d26e" w="10%">
          <Flex data-id="030925-73098f" align="center">
            <Flex data-id="030925-ddfff5" color={`auditsList.${audit?.status}`} fontSize="14px" fontWeight="500" pr={2}>
              {auditStatuses[audit?.status]}
            </Flex>
          </Flex>
        </Flex>

        {module?.featureFlags?.enableSafetyWalk && (
          <Flex data-id="030925-64e8e6" flexDir="column" w="10%">
            <Flex
              data-id="030925-1cf6df"
              align="flex-start"
              color="auditsList.fontColor"
              fontSize="14px"
              fontWeight="500"
              h="50%"
              lineHeight="18px"
              noOfLines={1}
              opacity="1"
              overflow="hidden"
              pr={2}
              pt="3px"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {auditWalkTypes[audit?.walkType || '']}
            </Flex>
          </Flex>
        )}
        <Box data-id="030925-d163da" pr={2} w="20%">
          <Skeleton data-id="030925-b43cf3" isLoaded={!!audit} rounded="full">
            {audit.auditor ? (
              <Flex data-id="030925-fb05d0" align="center" direction="row">
                <Avatar data-id="030925-3194ae" name={audit.auditor?.displayName?.replace(/\s*\(.*?\)\s*/g, '')} size="xs" src={audit.auditor?.imgUrl} />
                <Text
                  data-id="030925-92fa84"
                  color="auditsList.fontColor"
                  fontSize="14px"
                  fontWeight="500"
                  lineHeight="17px"
                  opacity="1"
                  overflow="hidden"
                  pl={3}
                  textOverflow="ellipsis"
                  w="full"
                  whiteSpace="nowrap"
                >
                  {audit.auditor?.displayName}
                </Text>
              </Flex>
            ) : (
              <Flex data-id="030925-09aa78" fontSize="14px" fontWeight="500">
                Unassigned
              </Flex>
            )}
          </Skeleton>
        </Box>
        <Flex data-id="030925-5c368e" flexDir="column" w="15%">
          <Flex
            data-id="030925-ae0fec"
            align="flex-start"
            color="auditsList.fontColor"
            fontSize="14px"
            fontWeight="500"
            h="50%"
            lineHeight="18px"
            noOfLines={1}
            opacity="1"
            overflow="hidden"
            pr={2}
            pt="3px"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {audit.reference}
          </Flex>
        </Flex>
        <Flex data-id="030925-9f2a8f" w="15%">
          <Flex data-id="030925-f45121" color="auditsList.fontColor" fontSize="14px" fontWeight="500" opacity="1">
            {audit?.status === 'completed' && audit?.completedDate ? (
              format(new Date(audit?.completedDate), 'dd-MMM-yyyy')
            ) : (
              <Flex data-id="030925-f97cb7" fontSize="14px" fontWeight="500">
                No submitted date
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

export default AuditListItem;
