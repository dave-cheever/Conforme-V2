import { Avatar, Box, Divider, Flex, Skeleton, Text, Tooltip } from '@chakra-ui/react';
import { format } from 'date-fns';

import { useAppContext } from '../../contexts/AppProvider';
import { auditStatuses } from '../../hooks/useAuditUtils';
import useNavigate from '../../hooks/useNavigate';
import { CheckIcon, ObservationEye, WarningIcon } from '../../icons';
import { IAudit } from '../../interfaces/IAudit';

function AuditSquare({ audit }: { audit: IAudit }) {
  const { navigateTo } = useNavigate();
  const { module } = useAppContext();

  return (
    <Box
      data-id="030925-b18f36"
      _hover={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.04)' }}
      bg="white"
      border="1px solid #CBD5E0"
      borderRadius="10px"
      boxShadow="sm"
      cursor={!audit?.metatags?.removedBy ? 'pointer' : 'default'}
      flexShrink={0}
      h={'200px'}
      onClick={() => !audit?.metatags?.removedBy && navigateTo(`/audits/${audit._id}`)}
      p="16px 0px 16px 0px"
      w={['full', 'full', '350px']}
    >
      <Flex
        data-id="030925-5bb1d7"
        align="center"
        h="40px"
        justify="space-between"
        minW={0}
        mt={2}
        p="0px 16px 16px 16px"
        position="relative"
        w="full"
      >
        <Skeleton data-id="030925-3ee13b" isLoaded={!!audit} minW={0} rounded="full">
          <Flex data-id="030925-3ea4f3" align="center" minW={0}>
            <Tooltip data-id="030925-f4b913" label={audit?.auditor?.displayName}>
              <Avatar
                data-id="030925-56b73f"
                borderRadius="8px"
                boxSize="36px"
                cursor="pointer"
                flexShrink={0}
                name={audit.auditor?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
                size="sm"
                src={audit?.auditor?.imgUrl}
              />
            </Tooltip>

            <Flex
              data-id="030925-e4c642"
              align="flex-start"
              direction="column"
              maxW="100%"
              minW={0}
              ml={3}>
              <Text
                data-id="030925-427803"
                color="auditSquare.nameFontColor"
                fontSize="16px"
                fontWeight="600"
                isTruncated
                lineHeight="100%"
                noOfLines={1}
                w="full"
              >
                {`${audit?.auditor?.displayName} - ${audit?.reference}`}
              </Text>

              <Text
                data-id="030925-358348"
                color="auditSquare.fontColor"
                fontSize={['12px', '11px']}
                isTruncated
                noOfLines={1}
                opacity="1"
                w="full"
              >
                {audit?.auditType?.name}
              </Text>
            </Flex>
          </Flex>
        </Skeleton>

        <Tooltip data-id="030925-10dc4f" label="Observations">
          <Flex
            data-id="030925-4717ab"
            align="center"
            flexShrink={0} // Prevent it from being squeezed
            fontSize="11px"
            fontWeight="700"
          >
            <ObservationEye data-id="030925-821e75" fill="auditSquare.eyeIconColor" h="16px" w="16px" />
            <Text data-id="030925-a19daa" as="span" color="auditSquare.nameFontColor" ml="2">
              {audit?.answersCount}
            </Text>
          </Flex>
        </Tooltip>
      </Flex>
      <Divider data-id="030925-35b97f" color="#CBD5E0" w="full" />
      <Box data-id="030925-c3b30b" p="16px">
        <Box
          data-id="030925-db6320"
          display="grid"
          gridColumnGap="32px"
          gridRowGap="18px"
          gridTemplateColumns="1fr 1fr">
          {/* Row 1: Site | Due date */}
          <Box data-id="030925-fd1646">
            <Text data-id="030925-44d2d2" color="#4A5568" fontSize="14px" fontWeight="600">
              Site
            </Text>
            <Text
              data-id="030925-40830d"
              color="#282F36"
              fontSize="14px"
              fontWeight="400"
              isTruncated
              lineHeight="17px"
              opacity="1"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap">
              {audit?.location?.name ?? 'Virtual'}
            </Text>
          </Box>
          <Box data-id="030925-bdcb1d">
            <Text data-id="030925-5601cb" color="#4A5568" fontSize="14px" fontWeight="600">
              Due date
            </Text>
            <Text
              data-id="030925-135da4"
              color="#282F36"
              fontSize="14px"
              fontWeight="400"
              isTruncated
              lineHeight="17px"
              opacity="1"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap">
              {audit?.dueDate ? format(new Date(audit?.dueDate), 'd MMM yyyy') : <Flex data-id="030925-2d7307" fontStyle="italic">No due date</Flex>}
            </Text>
          </Box>
          {/* Row 2: Type | Status */}
          <Box data-id="030925-9ff544">
            <Text data-id="030925-5518aa" color="#4A5568" fontSize="14px" fontWeight="600">
              Type
            </Text>
            <Text
              data-id="030925-518f9a"
              color="#282F36"
              fontSize="14px"
              fontWeight="400"
              isTruncated
              lineHeight="17px"
              opacity="1"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap">
              {module?.featureFlags?.enableSafetyWalk ? audit?.walkType : audit?.auditType?.name}
            </Text>
          </Box>
          <Box data-id="030925-132eee">
            <Text data-id="030925-acbc77" color="#4A5568" fontSize="14px" fontWeight="600">
              Status
            </Text>
            <Flex data-id="030925-3c5574" align="center" gap={2}>
              {audit?.status === 'missed' && <WarningIcon
                data-id="030925-d02545"
                fill="transparent"
                h="16px"
                stroke="auditSquare.missed"
                w="16px" />}
              {audit?.status === 'completed' && <CheckIcon
                data-id="030925-7c372d"
                fill="transparent"
                h="16px"
                stroke="#62C240"
                w="16px" />}
              <Text
                data-id="030925-b205fe"
                color={`auditSquare.${audit?.status}`}
                fontSize="14px"
                fontWeight="700">
                {auditStatuses[audit?.status]}
              </Text>
            </Flex>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AuditSquare;

export const auditSquareStyles = {
  auditSquare: {
    completed: '#62c240',
    missed: '#FC5960',
    upcoming: '#FFA012',
    statusFontColor: '#FFFFFF',
    imageBg: '#ffffff',
    rightIcon: '#9A9EA1',
    crossIcon: '#F0F0F0',
    tickIcon: '#41BA17',
    fontColor: '#818197',
    dueDateColor: '#424B50',
    evidenceFontColor: '#424B50',
    titleFontColor: '#818197',
    categoryFontColor: '#818197',
    nameFontColor: '#282F36',
    buttonBg: '#F0F2F5',
    eyeIconColor: '#D2D1D7',
  },
};
