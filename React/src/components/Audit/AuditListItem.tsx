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
      _hover={{ bg: '#F5F7FA' }}
      bg={index % 2 === 0 ? 'white' : 'gray.50'}
      borderBottomColor="auditsList.headerBorderColor"
      borderBottomWidth="1px"
      cursor={!audit?.metatags?.removedBy ? 'pointer' : 'default'}
      data-id="4f60324a20f3"
      onClick={() => !audit?.metatags?.removedBy && navigateTo(`/audits/${audit._id}`)}
      p="15px 25px"
      py={[1, 0]}
      w="full"
    >
      <Flex align="center" data-id="289e52ec130d" h={['full', '55px']} position="relative" w="full">
        <Flex data-id="509b2d90ef50" w="10%">
          <Flex color="auditsList.fontColor" data-id="50cab1117feb" fontSize="14px" fontWeight="500" opacity="1" pr={2}>
            {audit?.dueDate ? (
              format(new Date(audit?.dueDate), 'MMM-yy')
            ) : (
              <Flex data-id="6f021beb92cc" fontSize="14px" fontWeight="500">
                No due date
              </Flex>
            )}
          </Flex>
        </Flex>
        <Stack data-id="192814b517d5" direction="row" pr={2} spacing={1} w="20%">
          {/* <LocationIcon boxSize="12px" data-id="50bf3b8c0b11" mt="2px" /> */}
          <Text
            color="auditsList.fontColor"
            data-id="b5b273fe8ff8"
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
        <Flex data-id="fed08140eb45" w="10%">
          <Flex align="center" data-id="ca58524fd3f5">
            <Flex color={`auditsList.${audit?.status}`} data-id="f899b643cf6f" fontSize="14px" fontWeight="500" pr={2}>
              {auditStatuses[audit?.status]}
            </Flex>
          </Flex>
        </Flex>

        {module?.featureFlags?.enableSafetyWalk && (
          <Flex data-id="adaf80016293" flexDir="column" w="10%">
            <Flex
              align="flex-start"
              color="auditsList.fontColor"
              data-id="277232c3e4e3"
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
        <Box data-id="efe9c7681a1d" pr={2} w="20%">
          <Skeleton data-id="30660cd6f678" isLoaded={!!audit} rounded="full">
            {audit.auditor ? (
              <Flex align="center" data-id="b58e2c0e5930" direction="row">
                <Avatar data-id="b92882619dcf" name={audit.auditor?.displayName} size="xs" src={audit.auditor?.imgUrl} />
                <Text
                  color="auditsList.fontColor"
                  data-id="92431cfa5efa"
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
              <Flex data-id="21e95eb6fca3" fontSize="14px" fontWeight="500">
                Unassigned
              </Flex>
            )}
          </Skeleton>
        </Box>
        <Flex data-id="3ed7eaa08285" flexDir="column" w="15%">
          <Flex
            align="flex-start"
            color="auditsList.fontColor"
            data-id="40e6a48d2551"
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
        <Flex data-id="7145b061c35e" w="15%">
          <Flex color="auditsList.fontColor" data-id="ecfe0c8bb3eb" fontSize="14px" fontWeight="500" opacity="1">
            {audit?.status === 'completed' && audit?.completedDate ? (
              format(new Date(audit?.completedDate), 'MMM-yy')
            ) : (
              <Flex data-id="db9afb7d8b5b" fontSize="14px" fontWeight="500">
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
