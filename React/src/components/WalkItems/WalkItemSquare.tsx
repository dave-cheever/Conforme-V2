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
      flexShrink={0}
      h="290px"
      p="20px 25px 20px 25px"
      spacing={4}
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
      <Flex w="full" height="40px">
        <Box overflow="hidden" lineHeight="20px" textOverflow="ellipsis" w={['auto', '200px']} whiteSpace="nowrap">
          <Text color="walkItemSquare.section.title" fontSize="ssm">
            Status
          </Text>
          <Text color="walkItemSquare.section.text" fontSize="ssm" textTransform="capitalize">
            {answer?.status}
          </Text>
        </Box>
        <Box fontSize="ssm" lineHeight="20px" overflow="hidden" pl={2} textOverflow="ellipsis" w={['auto', '200px']} whiteSpace="nowrap">
          <Text color="walkItemSquare.section.title">Date</Text>
          <Text color="walkItemSquare.section.text" fontSize="ssm" textTransform="capitalize">
            {format(new Date(answer?.metatags?.addedAt!), 'LLL/y')}
          </Text>
        </Box>
      </Flex>
      <Flex w="full" height="40px">
        <Box fontSize="ssm" lineHeight="20px" overflow="hidden" textOverflow="ellipsis" w={['auto', '200px']} whiteSpace="nowrap">
          <Text color="walkItemSquare.section.title">Site</Text>
          <Text color="walkItemSquare.section.text" fontSize="ssm" textTransform="capitalize">
            {answer?.audit?.site?.name ?? 'Virtual'}
          </Text>
        </Box>
        <Box fontSize="ssm" lineHeight="20px" overflow="hidden" pl={2} textOverflow="ellipsis" w={['auto', '200px']} whiteSpace="nowrap">
          <Text color="walkItemSquare.section.title">Area</Text>
          <Text color="walkItemSquare.section.text" fontSize="ssm" textTransform="capitalize">
            {answer?.audit?.area?.name ?? 'Virtual'}
          </Text>
        </Box>
      </Flex>
      <Flex align="center" justify="space-between" w="full">
        <Box
          fontSize="ssm"
          lineHeight="20px"
          overflow="hidden"
          textOverflow="ellipsis"
          w={['max(calc(100% - 100px),100px)']}
          whiteSpace="nowrap"
        >
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
              {answer?.audit?.area?.name}
            </Text>
            <OpenExternalIcon fill="transparent" stroke="black" />
          </Stack>
        </Box>
        <Button
          alignSelf="flex-end"
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
          Update
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
