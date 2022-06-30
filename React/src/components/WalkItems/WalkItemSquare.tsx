import { Avatar, Box, Button, Flex, Skeleton, Stack, Text, Tooltip } from '@chakra-ui/react';

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
      flexShrink={0}
      h="250px"
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
        <Box overflow="hidden" textOverflow="ellipsis" w={['auto', '200px']} whiteSpace="nowrap">
          <Text color="walkItemSquare.section.title" fontSize="ssm">
            Status
          </Text>
          <Text color="walkItemSquare.section.text" fontSize="ssm" textTransform="capitalize">
            {answer?.status}
          </Text>
        </Box>
      </Flex>
      <Box w="full">
        <Text color="walkItemSquare.section.title" fontSize="ssm">
          Linked to
        </Text>
        <Flex align="center" justify="space-between" w="full">
          <Stack
            _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
            align="center"
            direction="row"
            onClick={() => openInNewTab(`/audits/${answer?.audit?._id}`)}
            spacing={2}
          >
            <Text color="walkItemSquare.section.text" fontSize="ssm" isTruncated maxWidth="150px">
              {answer?.question?.question}, {answer?.audit?.area?.name}
            </Text>
            <OpenExternalIcon fill="transparent" stroke="black" />
          </Stack>
          <Button
            _hover={{
              bg: 'walkItemSquare.button.default.bg',
            }}
            bg="walkItemSquare.button.default.bg"
            color="walkItemSquare.button.default.color"
            fontSize="ssm"
            h="28px"
            onClick={() => editAnswer(answer)}
            rightIcon={<ChevronRight boxSize="15px" color="walkItemSquare.button.default.color" />}
            w="85px"
          >
            More
          </Button>
        </Flex>
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
