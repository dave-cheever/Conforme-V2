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
      data-id="030925-db39ac"
      _hover={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)' }}
      bg="white"
      border="1px solid #CBD5E0"
      borderRadius="10px"
      boxShadow="sm"
      cursor="pointer"
      flexShrink={0}
      h="250px"
      onClick={() => editAnswer(answer)}
      p="16px 0px 16px 0px"
      w={['full', 'full', '350px']}
    >
      {/* Header */}
      <Flex
        data-id="030925-c80e5c"
        align="center"
        h="40px"
        justify="space-between"
        p="0px 16px 16px 16px"
        w="full">
        <Skeleton data-id="030925-6eb409" isLoaded={!!answer} rounded="full">
          <Flex data-id="030925-0c45e4" alignItems="center">
            <Tooltip data-id="030925-61bff8" label={answer?.addedBy?.displayName}>
              <Avatar
                data-id="030925-e48f53"
                borderRadius={'8px'}
                boxSize="36px"
                cursor="pointer"
                name={answer?.addedBy?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
                size="sm"
                src={answer?.addedBy?.imgUrl} />
            </Tooltip>
            <Flex
              data-id="030925-7a36ad"
              align={'flex-start'}
              flexDirection={'column'}
              minW={0}
              ml={3}>
              <Text
                data-id="030925-09a212"
                color="#282F36"
                fontSize="16px"
                fontWeight="600"
                lineHeight="100%"
                noOfLines={2}
                w="full">
                {answer?.question?.question}
              </Text>
              <Text
                data-id="030925-3d4183"
                color="#818197"
                fontSize="11px"
                opacity="1"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap">
                {answer?.audit?.auditType?.name}
              </Text>
            </Flex>
          </Flex>
        </Skeleton>
      </Flex>
      <Divider data-id="030925-2568e8" color="#CBD5E0" w="full" />
      {/* Details Grid */}
      <Box data-id="030925-61153e" p="16px">
        <Box
          data-id="030925-55407c"
          display="grid"
          gridColumnGap="32px"
          gridRowGap="18px"
          gridTemplateColumns="1fr 1fr">
          {/* Row 1: Location | Date */}
          <Box data-id="030925-f93cbe">
            <Text data-id="030925-c52cbc" color="#4A5568" fontSize="14px" fontWeight="600">
              {capitalize(t('location'))}
            </Text>
            <Tooltip data-id="030925-a196f7" label={answer?.audit?.location?.name ?? '-'}>
              <Text
                data-id="030925-4aaf68"
                color="#282F36"
                fontSize="14px"
                fontWeight="400"
                isTruncated>
                {answer?.audit?.location?.name ?? '-'}
              </Text>
            </Tooltip>
          </Box>
          <Box data-id="030925-2fbdc5">
            <Text data-id="030925-f5d509" color="#4A5568" fontSize="14px" fontWeight="600">
              Date
            </Text>
            <Tooltip
              data-id="030925-b75173"
              label={answer?.metatags?.addedAt ? format(new Date(answer?.metatags?.addedAt), 'd MMM yyyy') : '-'}>
              <Text
                data-id="030925-d426e8"
                color="#282F36"
                fontSize="14px"
                fontWeight="400"
                isTruncated>
                {answer?.metatags?.addedAt ? format(new Date(answer?.metatags?.addedAt), 'd MMM yyyy') : '-'}
              </Text>
            </Tooltip>
          </Box>
          {/* Row 2: Status | Business Unit */}
          <Box data-id="030925-2d652a">
            <Text data-id="030925-a773c6" color="#4A5568" fontSize="14px" fontWeight="600">
              Status
            </Text>
            <Text
              data-id="030925-db6e53"
              color="#282F36"
              fontSize="14px"
              fontWeight="400"
              isTruncated
              textTransform="capitalize">
              {answer?.status ?? '-'}
            </Text>
          </Box>
          <Box data-id="030925-7733f1">
            <Text data-id="030925-d22d54" color="#4A5568" fontSize="14px" fontWeight="600">
              {capitalize(t('business unit'))}
            </Text>
            <Tooltip
              data-id="030925-3a09f9"
              label={
                answer?.audit?.auditType?.businessUnitScope === 'audit'
                  ? answer?.audit?.businessUnit?.name ?? '-'
                  : answer?.businessUnit?.name ?? '-'
              }>
              <Text
                data-id="030925-b4f5ac"
                color="#282F36"
                fontSize="14px"
                fontWeight="400"
                isTruncated
                textTransform="capitalize">
                {answer?.audit?.auditType?.businessUnitScope === 'audit'
                  ? answer?.audit?.businessUnit?.name ?? '-'
                  : answer?.businessUnit?.name ?? '-'}
              </Text>
            </Tooltip>
          </Box>
        </Box>
        {/* Restore Linked to section above the Update/View button */}
        <Flex
          data-id="030925-461aad"
          align="center"
          justify="space-between"
          mb={-2}
          mt={2}>
          <Box
            data-id="030925-3255e3"
            fontSize="ssm"
            lineHeight="20px"
            overflow="hidden"
            textOverflow="ellipsis"
            w="200px"
            whiteSpace="nowrap">
            <Text data-id="030925-a77794" color="#4A5568" fontSize="14px" fontWeight="600">
              Linked To
            </Text>
            <Flex
              data-id="030925-cfe737"
              _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
              align="center"
              gap={1}
              onClick={(e) => {
                e.stopPropagation();
                openInNewTab(`/audits/${answer?.audit?._id}`);
              }}>
              <Text
                data-id="030925-703fb1"
                color="answerSquare.section.text"
                fontSize="ssm"
                maxWidth="250px"
                noOfLines={1}>
                {`${answer?.audit?.auditor?.displayName} - ${answer?.audit?.reference}`}
              </Text>
              <OpenExternalIcon data-id="030925-258146" fill="transparent" stroke="black" />
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
