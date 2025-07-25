import { gql, useQuery } from '@apollo/client';
import { Avatar, Box, Divider, Flex, Skeleton, Text, Tooltip } from '@chakra-ui/react';
import { format } from 'date-fns';

import { useAppContext } from '../../contexts/AppProvider';
import { auditStatuses } from '../../hooks/useAuditUtils';
import useNavigate from '../../hooks/useNavigate';
import { CheckIcon, ObservationEye, WarningIcon } from '../../icons';
import { IAudit } from '../../interfaces/IAudit';

const GET_AUDIT_ANSWERS_COUNT = gql`
  query ($auditId: ID!) {
    auditAnswersCount(auditId: $auditId)
  }
`;

function AuditSquare({ audit }: { audit: IAudit }) {
  const { navigateTo } = useNavigate();
  const { module } = useAppContext();
  const { data, loading, error } = useQuery(GET_AUDIT_ANSWERS_COUNT, {
    variables: {
      auditId: audit._id,
    },
    fetchPolicy: 'cache-and-network',
  });

  return (
    <Box
      _hover={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.04)' }}
      bg="white"
      border="1px solid #CBD5E0"
      borderRadius="10px"
      boxShadow="sm"
      cursor={!audit?.metatags?.removedBy ? 'pointer' : 'default'}
      data-id="79b84fc1b82b"
      flexShrink={0}
      h={'200px'}
      onClick={() => !audit?.metatags?.removedBy && navigateTo(`/audits/${audit._id}`)}
      p="16px 0px 16px 0px"
      w={['full', 'full', '350px']}
    >
      <Flex
        align="center"
        data-id="234fbf9153b6"
        h="40px"
        justify="space-between"
        minW={0}
        mt={2}
        p="0px 16px 16px 16px"
        position="relative"
        w="full" 
      >
        <Skeleton data-id="818e323eea55" isLoaded={!!audit} minW={0} rounded="full">
          <Flex align="center" minW={0}>
            <Tooltip data-id="16be615c3cf3" label={audit?.auditor?.displayName}>
              <Avatar
                borderRadius="8px"
                boxSize="36px"
                cursor="pointer"
                data-id="e4b8bb88a47d"
                flexShrink={0}
                name={audit.auditor?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
                size="sm"
                src={audit?.auditor?.imgUrl}
              />
            </Tooltip>

            <Flex
              align="flex-start"
              direction="column"
              maxW="100%"
              minW={0}
              ml={3}
            >
              <Text
                color="auditSquare.nameFontColor"
                data-id="84c14f877bab"
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
                color="auditSquare.fontColor"
                data-id="4fc30da2b418"
                fontSize={["12px", "11px"]}
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

        {!loading && !error && data && (
          <Tooltip data-id="ee49241a0676" label="Observations">
            <Flex
              align="center"
              data-id="9defc41d2bc3"
              flexShrink={0} // Prevent it from being squeezed
              fontSize="11px"
              fontWeight="700"
            >
              <ObservationEye
                data-id="67fb03afc899"
                fill="auditSquare.eyeIconColor"
                h="16px"
                w="16px"
              />
              <Text
                as="span"
                color="auditSquare.nameFontColor"
                data-id="f093c9f9c1c5"
                ml="2"
              >
                {data?.auditAnswersCount}
              </Text>
            </Flex>
          </Tooltip>
        )}
      </Flex>

      <Divider color="#CBD5E0" w="full" />
      <Box p="16px">
        <Box display="grid" gridColumnGap="32px" gridRowGap="18px" gridTemplateColumns="1fr 1fr">
          {/* Row 1: Site | Due date */}
          <Box>
            <Text color="#4A5568" fontSize="14px" fontWeight="600">
              Site
            </Text>
            <Text
              color="#282F36"
              fontSize="14px"
              fontWeight="400"
              isTruncated
              lineHeight="17px"
              opacity="1"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {audit?.location?.name ?? 'Virtual'}
            </Text>
          </Box>
          <Box>
            <Text color="#4A5568" fontSize="14px" fontWeight="600">
              Due date
            </Text>
            <Text
              color="#282F36"
              fontSize="14px"
              fontWeight="400"
              isTruncated
              lineHeight="17px"
              opacity="1"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {audit?.dueDate ? format(new Date(audit?.dueDate), 'd MMM yyyy') : <Flex fontStyle="italic">No due date</Flex>}
            </Text>
          </Box>
          {/* Row 2: Type | Status */}
          <Box>
            <Text color="#4A5568" fontSize="14px" fontWeight="600">
              Type
            </Text>
            <Text
              color="#282F36"
              fontSize="14px"
              fontWeight="400"
              isTruncated
              lineHeight="17px"
              opacity="1"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {module?.featureFlags?.enableSafetyWalk ? audit?.walkType : audit?.auditType?.name}
            </Text>
          </Box>
          <Box>
            <Text color="#4A5568" fontSize="14px" fontWeight="600">
              Status
            </Text>
            <Flex align="center" gap={2}>
              {audit?.status === 'missed' && <WarningIcon fill="transparent" h="16px" stroke="auditSquare.missed" w="16px" />}
              {audit?.status === 'completed' && <CheckIcon fill="transparent" h="16px" stroke="#62C240" w="16px" />}
              <Text color={`auditSquare.${audit?.status}`} fontSize="14px" fontWeight="700">
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
