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

function AuditSquare({ audit }: { audit: IAudit }) {
  const { navigateTo } = useNavigate();

  const { data, loading, error } = useQuery(GET_AUDIT_ANSWERS_COUNT, {
    variables: {
      auditId: audit._id,
    },
    fetchPolicy: 'cache-and-network',
  });

  return (
    (<Box
      _hover={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.04)' }}
      bg="white"
      borderRadius="10px"
      boxShadow="sm"
      cursor={!audit?.metatags?.removedBy ? 'pointer' : 'default'}
      data-id="79b84fc1b82b"
      flexShrink={0}
      h="290px"
      onClick={() => !audit?.metatags?.removedBy && navigateTo(`/audits/${audit._id}`)}
      p="20px 25px 20px 25px"
      w={['full', 'full', '350px']}>
      <Flex align="center" data-id="234fbf9153b6" justify="space-between">
        <Flex align="center" data-id="a8da1a24e99f">
          <Flex data-id="2dce58212a4d" h="12px" rounded="full" w="12px" />
          <Box
            color="auditSquare.fontColor"
            data-id="4fc30da2b418"
            fontSize="11px"
            opacity="1"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap">
            <Flex data-id="4b90cc336c8c">{audit?.auditType?.name}</Flex>
          </Box>
        </Flex>
        {!loading && !error && data && (
          <Tooltip data-id="ee49241a0676" label="Observations">
            <Flex align="center" data-id="9defc41d2bc3" fontSize="11px" fontWeight="700">
              <ObservationEye data-id="67fb03afc899" fill="auditSquare.eyeIconColor" h="16px" w="16px" />
              <Text as="span" color="auditSquare.nameFontColor" data-id="f093c9f9c1c5" ml="2">
                {data?.auditAnswersCount}
              </Text>
            </Flex>
          </Tooltip>
        )}
      </Flex>
      <Flex
        align="center"
        data-id="a57edaefc234"
        h="52px"
        ml={2}
        mt={2}
        position="relative"
        w="full">
        <Skeleton data-id="818e323eea55" isLoaded={!!audit} rounded="full">
          <Tooltip data-id="16be615c3cf3" label={audit?.auditor?.displayName}>
            <Avatar
              boxSize="24px"
              cursor="pointer"
              data-id="e4b8bb88a47d"
              name={audit?.auditor?.displayName}
              size="sm"
              src={audit?.auditor?.imgUrl} />
          </Tooltip>
        </Skeleton>
        <Text
          color="auditSquare.nameFontColor"
          data-id="84c14f877bab"
          fontSize="16px"
          fontWeight="700"
          lineHeight="20px"
          ml={3}
          noOfLines={2}
          w="full">
          {`${audit?.auditor?.displayName} - ${audit?.reference}`}
        </Text>
      </Flex>
      <Flex align="center" data-id="d635af5fa959" h="40px" w="full">
        <Box
          data-id="8df1aa555e32"
          fontSize={['smm', 'ssm']}
          lineHeight="20px"
          overflow="hidden"
          pl={2}
          textOverflow="ellipsis"
          w="200px"
          whiteSpace="nowrap">
          <Text color="auditSquare.titleFontColor" data-id="6b9e284a5444">{capitalize(t('location'))}</Text>
          <Tooltip data-id="7b8fe4d4a757" label={audit?.location?.name}>
            <Text data-id="1e178faf7018" maxWidth="80%" noOfLines={1}>
              {audit?.location?.name}
            </Text>
          </Tooltip>
        </Box>
        <Box
          data-id="8aaa5fe38bae"
          fontSize={['smm', 'ssm']}
          lineHeight="20px"
          overflow="hidden"
          pl={2}
          textOverflow="ellipsis"
          w="200px"
          whiteSpace="nowrap">
          <Text color="auditSquare.titleFontColor" data-id="7dd6692ae6ac">Type</Text>
          <Text data-id="4733171fb578" textTransform="capitalize">{audit?.walkType}</Text>
        </Box>
      </Flex>
      <Flex alignItems="flex-start" data-id="3cebc66717c1" h="50px" py="4" w="full">
        <Box data-id="9dc70ae5e075" fontSize={['smm', 'ssm']} ml={2} w="50%">
          <Text color="auditSquare.titleFontColor" data-id="5d548c5ca822">Due date</Text>
          <Box
            data-id="28866608a8a6"
            fontSize="ssm"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap">
            {audit?.dueDate ? format(new Date(audit?.dueDate), 'd MMM yyyy') : <Flex data-id="c3d4be9ae938" fontStyle="italic">No due date</Flex>}
          </Box>
        </Box>
      </Flex>
      <Flex
        align="center"
        data-id="0e6515706f20"
        justify="space-between"
        pl={2}
        pt="50px"
        w="full">
        <Flex
          align="center"
          color={`auditSquare.${audit?.status}`}
          data-id="6ee39fcf23eb"
          flexDirection="column"
          justify="center"
          mr={1}>
          <Flex data-id="feab43a7e15a" fontSize="11px" fontWeight="700">
            {audit?.status === 'missed' && <WarningIcon
              data-id="e5d6e426379d"
              fill="transparent"
              h="16px"
              mr={2}
              stroke="auditSquare.missed"
              w="16px" />}
            <Text as="span" data-id="1924eb35d1e6">{auditStatuses[audit?.status]}</Text>
          </Flex>
        </Flex>
        <Flex data-id="db44bd074a89" fontSize="11px" fontWeight="700">
          {audit?.status === 'completed' && (
            <>
              <CheckIcon
                data-id="2f92ad423695"
                fill="transparent"
                h="16px"
                stroke="#D2D1D7"
                w="16px" />
              <Text as="span" color="auditSquare.nameFontColor" data-id="fc987033ec19" ml={2}>
                {audit?.numberOfActions}
              </Text>
            </>
          )}
        </Flex>
      </Flex>
    </Box>)
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
