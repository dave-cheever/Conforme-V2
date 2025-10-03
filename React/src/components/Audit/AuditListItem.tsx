import { Box, Flex, Skeleton, Stack, Text } from '@chakra-ui/react';
import { format } from 'date-fns';

import { useAppContext } from '../../contexts/AppProvider';
import { auditStatuses } from '../../hooks/useAuditUtils';
import { auditWalkTypes } from '../../hooks/useFiltersUtils';
import useNavigate from '../../hooks/useNavigate';
// import { LocationIcon } from '../../icons';
import { IAudit } from '../../interfaces/IAudit';
import AvatarCell from '../Table/Cells/AvatarCell';

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
      data-id="000216"
      onClick={() => !audit?.metatags?.removedBy && navigateTo(`/audits/${audit._id}`)}
      p="15px 25px"
      py={[1, 0]}
      w="full"
    >
      <Flex align="center" data-id="000217" h={['full', '55px']} position="relative" w="full">
        <Flex data-id="000218" w="10%">
          <Flex color="auditsList.fontColor" data-id="000219" fontSize="14px" fontWeight="500" opacity="1" pr={2}>
            {audit?.dueDate ? (
              format(new Date(audit?.dueDate), 'dd-MMM-yyyy')
            ) : (
              <Flex data-id="000220" fontSize="14px" fontWeight="500">
                No due date
              </Flex>
            )}
          </Flex>
        </Flex>
        <Stack data-id="000221" direction="row" pr={2} spacing={1} w="20%">
          {/* <LocationIcon boxSize="12px" data-id="50bf3b8c0b11" mt="2px" /> */}
          <Text
            color="auditsList.fontColor"
            data-id="000222"
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
        <Flex data-id="000223" w="10%">
          <Flex align="center" data-id="000224">
            <Flex color={`auditsList.${audit?.status}`} data-id="000225" fontSize="14px" fontWeight="500" pr={2}>
              {auditStatuses[audit?.status]}
            </Flex>
          </Flex>
        </Flex>

        {module?.featureFlags?.enableSafetyWalk && (
          <Flex data-id="000226" flexDir="column" w="10%">
            <Flex
              align="flex-start"
              color="auditsList.fontColor"
              data-id="000227"
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
        <Box data-id="000228" pr={2} w="20%">
          <Skeleton data-id="000229" isLoaded={!!audit} rounded="full">
            <AvatarCell
              data-id="001206"
              users={audit.auditor ? [audit.auditor ] : []}
              userType="auditors" />
          </Skeleton>
        </Box>
        <Flex data-id="000234" flexDir="column" w="15%">
          <Flex
            align="flex-start"
            color="auditsList.fontColor"
            data-id="000235"
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
        <Flex data-id="000236" w="15%">
          <Flex color="auditsList.fontColor" data-id="000237" fontSize="14px" fontWeight="500" opacity="1">
            {audit?.status === 'completed' && audit?.completedDate ? (
              format(new Date(audit?.completedDate), 'dd-MMM-yyyy')
            ) : (
              <Flex data-id="000238" fontSize="14px" fontWeight="500">
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
