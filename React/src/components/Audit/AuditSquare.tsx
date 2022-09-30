import { gql, useQuery } from '@apollo/client';
import { Avatar, Box, Flex, Skeleton, Text, Tooltip } from '@chakra-ui/react';
import { format } from 'date-fns';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import { auditStatuses } from '../../hooks/useAuditUtils';
import useNavigate from '../../hooks/useNavigate';
import { CheckIcon, ObservationEye, WarningIcon } from '../../icons';
import { IAudit } from '../../interfaces/IAudit';

const GET_AUDIT_ANSWERS_COUNT = gql`
  query ($auditId: ID!) {
    auditAnswersCount(auditId: $auditId)
  }
`;

const AuditSquare = ({ audit }: { audit: IAudit }) => {
  const { navigateTo } = useNavigate();

  const { data, loading, error } = useQuery(GET_AUDIT_ANSWERS_COUNT, {
    variables: {
      auditId: audit._id,
    },
    fetchPolicy: 'cache-and-network',
  });

  return (
    <Box
      _hover={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.18)' }}
      bg="white"
      borderRadius="20px"
      boxShadow="sm"
      cursor={!audit?.metatags?.removedBy ? 'pointer' : 'default'}
      flexShrink={0}
      h="290px"
      onClick={() => !audit?.metatags?.removedBy && navigateTo(`/audits/${audit._id}`)}
      p="20px 25px 20px 25px"
      w={['full', 'full', '350px']}
    >
      <Flex align="center" justify="space-between">
        <Flex align="center">
          <Flex h="12px" rounded="full" w="12px" />
          <Box color="auditSquare.fontColor" fontSize="11px" opacity="1" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            <Flex>{audit?.auditType?.name}</Flex>
          </Box>
        </Flex>
        {!loading && !error && data && (
          <Tooltip label="Observations">
            <Flex align="center" fontSize="11px" fontWeight="700">
              <ObservationEye fill="none" h="18px" stroke="auditSquare.eyeIconColor" w="18px" />
              <Text as="span" color="auditSquare.nameFontColor" ml="1.5">
                {data?.auditAnswersCount}
              </Text>
            </Flex>
          </Tooltip>
        )}
      </Flex>
      <Flex align="center" h="52px" ml={2} mt={2} position="relative" w="full">
        <Skeleton isLoaded={!!audit} rounded="full">
          <Tooltip label={audit?.auditor?.displayName}>
            <Avatar boxSize="24px" cursor="pointer" name={audit?.auditor?.displayName} size="sm" src={audit?.auditor?.imgUrl} />
          </Tooltip>
        </Skeleton>
        <Text color="auditSquare.nameFontColor" fontSize="16px" fontWeight="700" lineHeight="20px" ml={3} noOfLines={2} w="full">
          {audit?.businessUnit?.name}
        </Text>
      </Flex>
      <Flex align="center" h="40px" w="full">
        <Box fontSize={['smm', 'ssm']} lineHeight="20px" overflow="hidden" pl={2} textOverflow="ellipsis" w="200px" whiteSpace="nowrap">
          <Text color="auditSquare.titleFontColor">{capitalize(t('location'))}</Text>
          <Tooltip label={audit?.location?.name}>
            <Text isTruncated maxWidth="80%">
              {audit?.location?.name}
            </Text>
          </Tooltip>
        </Box>
        <Box fontSize={['smm', 'ssm']} lineHeight="20px" overflow="hidden" pl={2} textOverflow="ellipsis" w="200px" whiteSpace="nowrap">
          <Text color="auditSquare.titleFontColor">Type</Text>
          <Text textTransform="capitalize">{audit?.walkType}</Text>
        </Box>
      </Flex>
      <Flex alignItems="flex-start" h="50px" py="4" w="full">
        <Box fontSize={['smm', 'ssm']} ml={2} w="50%">
          <Text color="auditSquare.titleFontColor">Due date</Text>
          <Box fontSize="ssm" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            {audit?.dueDate ? format(new Date(audit?.dueDate), 'd MMM yyyy') : <Flex fontStyle="italic">No due date</Flex>}
          </Box>
        </Box>
      </Flex>
      <Flex align="center" justify="space-between" pl={2} pt="50px" w="full">
        <Flex align="center" color={`auditSquare.${audit?.status}`} flexDirection="column" justify="center" mr={1}>
          <Flex fontSize="11px" fontWeight="700">
            {audit?.status === 'missed' && <WarningIcon fill="transparent" h="16px" mr={2} stroke="auditSquare.missed" w="16px" />}
            <Text as="span">{auditStatuses[audit?.status]}</Text>
          </Flex>
        </Flex>
        <Flex fontSize="11px" fontWeight="700">
          {audit?.status === 'completed' && (
            <>
              <CheckIcon fill="transparent" h="16px" stroke="#D2D1D7" w="16px" />
              <Text as="span" color="auditSquare.nameFontColor" ml={2}>
                {audit?.numberOfActions}
              </Text>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

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
