import { Avatar, Box, Button, Flex, HStack, Skeleton, Stack, Text, Tooltip } from '@chakra-ui/react';
import { formatDistanceToNow, isBefore } from 'date-fns';

import useNavigate from '../../hooks/useNavigate';
import { ChevronRight, OpenExternalIcon, WarningIcon } from '../../icons';
import { IAction } from '../../interfaces/IAction';

const ActionSquare = ({ action, editAction }: { action: IAction; editAction: (action: IAction) => void }) => {
  const { openInNewTab } = useNavigate();

  const isOverdue = action.dueDate && !action.done && isBefore(new Date(action.dueDate), new Date());

  return (
    <Stack
      _hover={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.18)' }}
      bg="white"
      borderRadius="20px"
      boxShadow="sm"
      flexShrink={0}
      h="290px"
      p="20px 25px 20px 25px"
      spacing={6}
      w={['full', '350px', '350px']}
    >
      <Flex align="center" justify="space-between">
        <Box color="actionSquare.audit" fontSize="ssm" opacity="1" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
          <Flex>{action?.answer?.audit?.auditType?.name}</Flex>
        </Box>
        {!action?.metatags?.updatedAt && (
          <Box bg="actionSquare.badge.bg" color="actionSquare.badge.color" fontSize="ssm" px={2} py="1px" rounded="full">
            New
          </Box>
        )}
      </Flex>
      <Flex w="full">
        <Skeleton isLoaded={!!action} rounded="full">
          <Tooltip label={action?.assignee?.displayName}>
            <Avatar boxSize="24px" cursor="pointer" name={action?.assignee?.displayName} size="sm" src={action?.assignee?.imgUrl} />
          </Tooltip>
        </Skeleton>
        <Text color="actionSquare.title" fontSize="md" fontWeight="bold" isTruncated ml={3} w="calc(100% - 24px)">
          {action?.title}
        </Text>
      </Flex>
      <Flex w="full">
        <Box overflow="hidden" textOverflow="ellipsis" w="200px" whiteSpace="nowrap">
          <Text color="actionSquare.section.title" fontSize="ssm">
            Priority
          </Text>
          <Text color="actionSquare.section.text" fontSize="md" textTransform="capitalize">
            {action?.priority}
          </Text>
        </Box>
        {action?.dueDate && (
          <Box overflow="hidden" textOverflow="ellipsis" w="200px" whiteSpace="nowrap">
            <Text color="actionSquare.section.title" fontSize="ssm">
              Due in
            </Text>
            <Text color="actionSquare.section.text" fontSize="md">
              {formatDistanceToNow(new Date(action.dueDate))}
            </Text>
          </Box>
        )}
      </Flex>
      <Box w="full">
        <Text color="actionSquare.section.title" fontSize="ssm">
          Linked to
        </Text>
        <Stack
          _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
          align="center"
          direction="row"
          onClick={() => openInNewTab(`/audits/${action?.answer?.audit?._id}`)}
          spacing={2}
        >
          <Text color="actionSquare.section.text" fontSize="md" isTruncated>
            {action?.answer?.question?.question}, {action?.answer?.audit?.area?.name}
          </Text>
          <OpenExternalIcon fill="transparent" stroke="black" />
        </Stack>
      </Box>
      <Flex align="center" justify="space-between" w="full">
        <Button
          _hover={{
            bg: `actionSquare.button.${isOverdue ? 'overdue' : 'default'}.bg`,
          }}
          bg={`actionSquare.button.${isOverdue ? 'overdue' : 'default'}.bg`}
          color={`actionSquare.button.${isOverdue ? 'overdue' : 'default'}.color`}
          fontSize="ssm"
          h="28px"
          onClick={() => editAction(action)}
          rightIcon={<ChevronRight boxSize="15px" color={`actionSquare.button.${isOverdue ? 'overdue' : 'default'}.color`} />}
          w="85px"
        >
          More
        </Button>
        {isOverdue && (
          <HStack align="center" spacing={2}>
            <WarningIcon fill="actionSquare.overdue.icon.fill" h="22px" stroke="actionSquare.overdue.icon.stroke" w="18px" />
            <Text color="actionSquare.overdue.color" fontSize="ssm" fontWeight="bold">
              Overdue
            </Text>
          </HStack>
        )}
      </Flex>
    </Stack>
  );
};

export default ActionSquare;

export const actionSquareStyles = {
  actionSquare: {
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
      overdue: {
        bg: '#DC0043',
        color: '#FFFFFF',
      },
    },
    overdue: {
      icon: {
        stroke: '#DC0043',
        fill: 'transparent',
      },
      color: '#DC0043',
    },
  },
};
