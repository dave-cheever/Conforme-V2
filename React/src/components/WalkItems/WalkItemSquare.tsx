import { Avatar, Box, Button, Flex, Skeleton, Stack, Text, Tooltip } from '@chakra-ui/react';
import { format } from 'date-fns';

import useNavigate from '../../hooks/useNavigate';
import { ChevronRight, OpenExternalIcon } from '../../icons';
import { IAnswer } from '../../interfaces/IAnswer';

const WalkItemSquare = ({ answer, editAnswer }: { answer: IAnswer; editAnswer: (answer: IAnswer) => void }) => {
  const { openInNewTab } = useNavigate();

  return (
    <Stack
      _hover={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.18)' }}
      bg="white"
      borderRadius="20px"
      boxShadow="sm"
      cursor="pointer"
      flexShrink={0}
      h="290px"
      onClick={() => editAnswer(answer)}
      p="20px 25px 20px 25px"
      spacing={6}
      w={['full', 'full', '350px']}
    >
      <Flex align="center" justify="space-between">
        <Box color="walkItemSquare.audit" fontSize="ssm" opacity="1" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
          <Flex>{answer?.audit?.auditType?.name}</Flex>
        </Box>
      </Flex>
      <Flex w="full">
        <Skeleton isLoaded={!!answer} rounded="full">
          <Tooltip label={answer?.addedBy?.displayName}>
            <Avatar boxSize="24px" cursor="pointer" name={answer?.addedBy?.displayName} size="sm" src={answer?.addedBy?.imgUrl} />
          </Tooltip>
        </Skeleton>
        <Text color="walkItemSquare.title" fontSize="md" fontWeight="bold" isTruncated ml={3} w="calc(100% - 24px)">
          {answer?.question?.question}
        </Text>
      </Flex>
      <Flex w="full">
        <Box fontSize={['smm', 'ssm']} overflow="hidden" textOverflow="ellipsis" w="200px" whiteSpace="nowrap">
          <Text color="walkItemSquare.section.title">Status</Text>
          <Text color="walkItemSquare.section.text" fontSize="ssm" textTransform="capitalize">
            {answer?.status ?? '-'}
          </Text>
        </Box>
        <Box fontSize={['smm', 'ssm']} lineHeight="20px" overflow="hidden" pl={2} textOverflow="ellipsis" w="200px" whiteSpace="nowrap">
          <Text color="walkItemSquare.section.title">Date</Text>
          <Tooltip label={format(new Date(answer?.metatags?.addedAt!), 'LLL/y') ?? '-'}>
            <Text color="walkItemSquare.section.text" fontSize="ssm" textTransform="capitalize">
              {format(new Date(answer?.metatags?.addedAt!), 'LLL/y') ?? '-'}
            </Text>
          </Tooltip>
        </Box>
      </Flex>
      <Flex w="full">
        <Box fontSize={['smm', 'ssm']} lineHeight="20px" overflow="hidden" textOverflow="ellipsis" w="200px" whiteSpace="nowrap">
          <Text color="walkItemSquare.section.title">Site</Text>
          <Tooltip label={answer?.audit?.site?.name ?? '-'}>
            <Text color="walkItemSquare.section.text" fontSize="ssm" isTruncated textTransform="capitalize">
              {answer?.audit?.site?.name ?? '-'}
            </Text>
          </Tooltip>
        </Box>
        <Box fontSize={['smm', 'ssm']} lineHeight="20px" overflow="hidden" pl={2} textOverflow="ellipsis" w="200px" whiteSpace="nowrap">
          <Text color="walkItemSquare.section.title">Area</Text>
          <Tooltip label={answer?.audit?.area?.name ?? '-'}>
            <Text color="walkItemSquare.section.text" fontSize="ssm" textTransform="capitalize">
              {answer?.audit?.area?.name ?? '-'}
            </Text>
          </Tooltip>
        </Box>
      </Flex>
      <Flex align="center" justify="space-between" w="full">
        <Box fontSize={['smm', 'ssm']} lineHeight="20px" overflow="hidden" textOverflow="ellipsis" w="200px" whiteSpace="nowrap">
          <Text color="walkItemSquare.section.title" fontSize="ssm">
            Linked to
          </Text>
          <Stack
            _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
            align="center"
            direction="row"
            onClick={() => openInNewTab(`/audits/${answer?.audit?._id}`)}
            spacing={2}
          >
            <Text color="walkItemSquare.section.text" fontSize="ssm" isTruncated maxWidth="250px">
              {answer?.audit?.area?.name ?? '-'}
            </Text>
            <OpenExternalIcon fill="transparent" stroke="black" />
          </Stack>
        </Box>
        <Button
          _hover={{
            bg: 'walkItemSquare.button.default.bg',
          }}
          alignSelf="flex-end"
          bg="walkItemSquare.button.default.bg"
          color="walkItemSquare.button.default.color"
          fontSize="ssm"
          h="28px"
          onClick={() => editAnswer(answer)}
          rightIcon={<ChevronRight boxSize="15px" color="walkItemSquare.button.default.color" />}
          w="85px"
        >
          {answer?.audit?.status === 'upcoming' ? 'Update' : 'View'}
        </Button>
      </Flex>
    </Stack>
  );
};

export default WalkItemSquare;

export const walkItemSquareStyles = {
  walkItemSquare: {
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
