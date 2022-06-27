import { Avatar, Box, Flex, Skeleton, Stack, Text } from '@chakra-ui/react';
import { format } from 'date-fns';

import { auditStatuses } from '../../hooks/useAuditUtils';
import { auditWalkTypes } from '../../hooks/useFiltersUtils';
import useNavigate from '../../hooks/useNavigate';
import { LocationIcon } from '../../icons';
import { IAudit } from '../../interfaces/IAudit';

const AuditListItem = ({ audit }: { audit: IAudit }) => {
  const { navigateTo } = useNavigate();

  return (
    <Box
      bg="white"
      borderBottomColor="auditsList.headerBorderColor"
      borderBottomWidth="1px"
      cursor="pointer"
      onClick={() => navigateTo(`/audits/${audit._id}`)}
      p="15px 25px"
      py={[1, 0]}
      w="full"
    >
      <Flex align="center" h={['full', '73px']} position="relative" w="full">
        <Flex w="10%">
          <Flex color="auditsList.fontColor" fontSize="14px" fontWeight="400" opacity="1">
            {audit?.dueDate ? format(new Date(audit?.dueDate), 'MMM-yy') : <Flex fontStyle="italic">No due date</Flex>}
          </Flex>
        </Flex>
        <Stack direction="row" pr={2} spacing={1} w="20%">
          <LocationIcon boxSize="12px" mt="2px" />
          <Text
            color="auditsList.fontColor"
            fontSize="13px"
            lineHeight="17px"
            opacity="1"
            overflow="hidden"
            textOverflow="ellipsis"
            w="full"
            whiteSpace="nowrap"
          >
            {audit.site?.name ?? 'Virtual'}
          </Text>
        </Stack>
        <Stack direction="row" pr={2} spacing={1} w="20%">
          <LocationIcon boxSize="12px" mt="2px" />
          <Text
            color="auditsList.fontColor"
            fontSize="13px"
            lineHeight="17px"
            opacity="1"
            overflow="hidden"
            textOverflow="ellipsis"
            w="full"
            whiteSpace="nowrap"
          >
            {audit.area?.name ?? 'Virtual'}
          </Text>
        </Stack>
        <Flex w="10%">
          <Flex align="center">
            <Flex color={`auditsList.${audit?.status}`} fontSize="14px" fontWeight="700">
              {auditStatuses[audit?.status]}
            </Flex>
          </Flex>
        </Flex>
        <Flex flexDir="column" w="10%">
          <Flex
            align="flex-start"
            color="auditsList.fontColor"
            fontSize="14px"
            fontWeight="400"
            h="50%"
            lineHeight="18px"
            noOfLines={1}
            opacity="1"
            pt="3px"
            textOverflow="ellipsis"
          >
            {auditWalkTypes[audit.walkType]}
          </Flex>
        </Flex>
        <Box pr={2} w="20%">
          <Skeleton isLoaded={!!audit} rounded="full">
            {audit.auditor ? (
              <Flex align="center" direction="row">
                <Avatar name={audit.auditor?.displayName} size="xs" src={audit.auditor?.imgUrl} />
                <Text
                  color="auditsList.fontColor"
                  fontSize="13px"
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
              <Flex fontSize="13px" fontStyle="italic">
                Unassigned
              </Flex>
            )}
          </Skeleton>
        </Box>
        <Flex w="10%">
          <Flex color="auditsList.fontColor" fontSize="14px" fontWeight="400" opacity="1">
            {audit?.status === 'completed' && audit?.completedDate ? (
              format(new Date(audit?.completedDate), 'MMM-yy')
            ) : (
              <Flex fontStyle="italic">No submitted date</Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default AuditListItem;
