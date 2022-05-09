import {
  Avatar,
  Box,
  Flex,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';

import useNavigate from '../../hooks/useNavigate';
import { OpenExternalIcon } from '../../icons';
import { IAnswer } from '../../interfaces/IAnswer';

const WalkItemSquare = ({ answer }: { answer: IAnswer }) => {
  const { openInNewTab } = useNavigate();

  return (
    <Stack
      _hover={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.18)' }}
      bg="white"
      borderRadius="20px"
      boxShadow="sm"
      flexShrink={0}
      h="250px"
      p="20px 25px 20px 25px"
      spacing={6}
      w={['full', '350px', '350px']}
    >
      <Flex align="center" justify="space-between">
        <Box
          color="walkItemSquare.audit"
          fontSize="ssm"
          opacity="1"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          <Flex>{answer?.audit?.auditType?.name}</Flex>
        </Box>
      </Flex>
      {/* eslint-disable-next-line react/jsx-max-props-per-line */}
      <Flex w="full">
        <Skeleton isLoaded={!!answer} rounded="full">
          <Tooltip label={answer?.addedBy?.displayName}>
            <Avatar
              boxSize="24px"
              cursor="pointer"
              name={answer?.addedBy?.displayName}
              size="sm"
              src={answer?.addedBy?.imgUrl}
            />
          </Tooltip>
        </Skeleton>
        <Text
          color="walkItemSquare.title"
          fontSize="md"
          fontWeight="bold"
          isTruncated
          ml={3}
          w="calc(100% - 24px)"
        >
          {answer?.question?.question}
        </Text>
      </Flex>
      <Flex w="full">
        <Box
          overflow="hidden"
          textOverflow="ellipsis"
          w="200px"
          whiteSpace="nowrap"
        >
          <Text color="walkItemSquare.section.title" fontSize="ssm">
            Status
          </Text>
          <Text
            color="walkItemSquare.section.text"
            fontSize="md"
            textTransform="capitalize"
          >
            {answer?.status}
          </Text>
        </Box>
      </Flex>
      <Box w="full">
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
          <Text color="walkItemSquare.section.text" fontSize="md" isTruncated>
            {answer?.question?.question}, {answer?.audit?.area?.name}
          </Text>
          <OpenExternalIcon fill="transparent" stroke="black" />
        </Stack>
      </Box>
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
