import { Avatar, Box, Divider, Flex, Skeleton, Text, Tooltip } from '@chakra-ui/react';
import { format } from 'date-fns';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import useNavigate from '../../hooks/useNavigate';
import { OpenExternalIcon } from '../../icons';
import { IAnswer } from '../../interfaces/IAnswer';

function AnswerSquare({ answer, editAnswer }: { answer: IAnswer; editAnswer: (answer: IAnswer) => void }) {
  const { openInNewTab } = useNavigate();
  return (
    <Box
      _hover={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)' }}
      bg="white"
      border="1px solid #E2E8F0"
      borderRadius="10px"
      boxShadow="sm"
      cursor="pointer"
      data-id="274beff484fa"
      flexShrink={0}
      h="250px"
      onClick={() => editAnswer(answer)}
      p="16px 0px 16px 0px"
      w={['full', 'full', '350px']}
    >
      {/* Header */}
      <Flex align="center" h="40px" justify="space-between" p="0px 16px 16px 16px" w="full">
        <Skeleton isLoaded={!!answer} rounded="full">
          <Flex alignItems="center">
            <Tooltip label={answer?.addedBy?.displayName}>
              <Avatar
                borderRadius={'8px'}
                boxSize="36px"
                cursor="pointer"
                name={answer?.addedBy?.displayName}
                size="sm"
                src={answer?.addedBy?.imgUrl}
              />
            </Tooltip>
            <Flex align={'flex-start'} flexDirection={'column'} minW={0} ml={3}>
              <Text color="#282F36" fontSize="16px" fontWeight="600" lineHeight="100%" noOfLines={2} w="full">
                {answer?.question?.question}
              </Text>
              <Text color="#818197" fontSize="11px" opacity="1" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                {answer?.audit?.auditType?.name}
              </Text>
            </Flex>
          </Flex>
        </Skeleton>
      </Flex>
      <Divider color="#E2E8F0" w="full" />
      {/* Details Grid */}
      <Box p="16px">
        <Box display="grid" gridColumnGap="32px" gridRowGap="18px" gridTemplateColumns="1fr 1fr">
          {/* Row 1: Location | Date */}
          <Box>
            <Text color="#4A5568" fontSize="14px" fontWeight="600">
              {capitalize(t('location'))}
            </Text>
            <Tooltip label={answer?.audit?.location?.name ?? '-'}>
              <Text color="#282F36" fontSize="14px" fontWeight="400" isTruncated>
                {answer?.audit?.location?.name ?? '-'}
              </Text>
            </Tooltip>
          </Box>
          <Box>
            <Text color="#4A5568" fontSize="14px" fontWeight="600">
              Date
            </Text>
            <Tooltip label={answer?.metatags?.addedAt ? format(new Date(answer?.metatags?.addedAt), 'd MMM yyyy') : '-'}>
              <Text color="#282F36" fontSize="14px" fontWeight="400" isTruncated>
                {answer?.metatags?.addedAt ? format(new Date(answer?.metatags?.addedAt), 'd MMM yyyy') : '-'}
              </Text>
            </Tooltip>
          </Box>
          {/* Row 2: Status | Business Unit */}
          <Box>
            <Text color="#4A5568" fontSize="14px" fontWeight="600">
              Status
            </Text>
            <Text color="#282F36" fontSize="14px" fontWeight="400" isTruncated textTransform="capitalize">
              {answer?.status ?? '-'}
            </Text>
          </Box>
          <Box>
            <Text color="#4A5568" fontSize="14px" fontWeight="600">
              {capitalize(t('business unit'))}
            </Text>
            <Tooltip
              label={
                answer?.audit?.auditType?.businessUnitScope === 'audit'
                  ? answer?.audit?.businessUnit?.name ?? '-'
                  : answer?.businessUnit?.name ?? '-'
              }
            >
              <Text color="#282F36" fontSize="14px" fontWeight="400" isTruncated textTransform="capitalize">
                {answer?.audit?.auditType?.businessUnitScope === 'audit'
                  ? answer?.audit?.businessUnit?.name ?? '-'
                  : answer?.businessUnit?.name ?? '-'}
              </Text>
            </Tooltip>
          </Box>
        </Box>
        {/* Restore Linked to section above the Update/View button */}
        <Flex align="center" justify="space-between" mb={-2} mt={2}>
          <Box fontSize="ssm" lineHeight="20px" overflow="hidden" textOverflow="ellipsis" w="200px" whiteSpace="nowrap">
            <Text color="#4A5568" fontSize="14px" fontWeight="600">
              Linked To
            </Text>
            <Flex
              _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
              align="center"
              gap={1}
              onClick={(e) => {
                e.stopPropagation();
                openInNewTab(`/audits/${answer?.audit?._id}`);
              }}
            >
              <Text color="answerSquare.section.text" fontSize="ssm" maxWidth="250px" noOfLines={1}>
                {`${answer?.audit?.auditor?.displayName} - ${answer?.audit?.reference}`}
              </Text>
              <OpenExternalIcon fill="transparent" stroke="black" />
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default AnswerSquare;

export const answerSquareStyles = {
  answerSquare: {
    badge: {
      bg: '#41B916',
      color: '#FFF',
    },
    audit: '#1E183670',
    title: '#1E1836',
    section: {
      title: '#1E183670',
      text: '#1E1836',
    },
    button: {
      default: {
        bg: '#1315351A',
        color: '#1E1836',
      },
    },
  },
};
