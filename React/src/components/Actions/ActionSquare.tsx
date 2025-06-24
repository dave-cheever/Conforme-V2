import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Skeleton,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { formatDistanceToNow, isBefore } from 'date-fns';

import useNavigate from '../../hooks/useNavigate';
import { ChevronRight, OpenExternalIcon, WarningIcon } from '../../icons';
import { IAction } from '../../interfaces/IAction';

function ActionSquare({ action, editAction }: { action: IAction; editAction: (action: IAction) => void }) {
  const { openInNewTab } = useNavigate();

  const isOverdue = action.dueDate && action.status === 'open' && isBefore(new Date(action.dueDate), new Date());

  return (
    <Box
      _hover={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)' }}
      bg="white"
      border="1px solid #E2E8F0"
      borderRadius="10px"
      boxShadow="sm"
      cursor="pointer"
      data-id="c183bb49dbf2"
      flexShrink={0}
      h="250px"
      onClick={() => editAction(action)}
      p="16px 0px"
      w={['full', 'full', '350px']}
    >
      <Flex align="center" data-id="8ff8e7b553a1" h="40px" justify="space-between" p="0px 16px 16px 16px" w="full">
        <Skeleton data-id="cd4cbf19cc19" isLoaded={!!action} rounded="full">
          <Flex alignItems="center">
            <Tooltip data-id="01a1cd7a7e9a" label={action?.assignee?.displayName ?? 'No assignee'}>
              <Avatar
                borderRadius="8px"
                boxSize="36px"
                cursor="pointer"
                data-id="02bc017105fd"
                name={action?.assignee?.displayName}
                src={action?.assignee?.imgUrl}
              />
            </Tooltip>
            <Flex direction="column" minW={0} ml={3}>
              <Text color="#282F36" data-id="a020a4b78b8d" fontSize="16px" fontWeight="600" isTruncated noOfLines={1}>
                {action?.title}
              </Text>
              <Text color="#818197" data-id="f80fabbc8028" fontSize="11px" noOfLines={1}>
                {action?.answer?.audit?.auditType?.name}
              </Text>
            </Flex>
          </Flex>
        </Skeleton>
        {!action?.metatags?.updatedAt && (
          <Box bg="#41B916" color="#FFF" data-id="33d156b035ec" fontSize="11px" px={2} py="1px" rounded="2px">
            New
          </Box>
        )}
      </Flex>

      <Divider color="#E2E8F0" w="full" />

      <Box p="16px">
        <Box columnGap="32px" display="grid" gridTemplateColumns="1fr 1fr" rowGap="18px">
          <Box data-id="0d7f81443288">
            <Text color="#4A5568" data-id="e1ea5964506f" fontSize="14px" fontWeight="600">
              Priority
            </Text>
            <Text color="#282F36" data-id="3600a90aea56" fontSize="14px" fontWeight="400" textTransform="capitalize">
              {action?.priority ?? '-'}
            </Text>
          </Box>
  
            <Box data-id="d5368487d206">
              <Text color="#4A5568" data-id="3b6c01cc03c0" fontSize="14px" fontWeight="600">
                Due in
              </Text>
              <Text color="#282F36" data-id="73ef0e3249c6" fontSize="14px" fontWeight="400">
               {action?.dueDate ? formatDistanceToNow(new Date(action.dueDate)) : "No Due Date"}
              </Text>
            </Box>
  
        </Box>

        <Box data-id="7d072c317876" mt={4}>
          <Text color="#4A5568" data-id="51d58e6f255a" fontSize="14px" fontWeight="600">
            Linked To
          </Text>
          <Flex
            _hover={{ textDecoration: 'underline' }}
            align="center"
            cursor="pointer"
            data-id="94b7cb9d3d5e"
            gap={1}
            mt={1}
            onClick={(e) => {
              e.stopPropagation();
              openInNewTab(`/audits/${action?.answer?.audit?._id}`);
            }}
          >
            <Text color="#282F36" data-id="7d858fa06e38" fontSize="14px" fontWeight="400" noOfLines={1}>
              {action?.answer?.question?.question
                ? `${action.answer.question.question}: `
                : ''}
              {action?.answer?.audit?.auditType?.businessUnitScope === 'audit'
                ? action?.answer?.audit?.businessUnit?.name ?? '-'
                : action?.answer?.businessUnit?.name ?? '-'}
            </Text>
            <OpenExternalIcon data-id="46925e0859eb" fill="transparent" stroke="black" />
          </Flex>
        </Box>

        <Flex align="center" data-id="e3dc8efaacab" justify="space-between" mt={4}>
          <Button
            _hover={{ bg: isOverdue ? '#C5003C' : '#E6E8F0' }}
            bg={isOverdue ? '#DC0043' : '#F0F2F5'}
            color={isOverdue ? '#FFFFFF' : '#1E1836'}
            data-id="9e94cb369ecd"
            fontSize="12px"
            h="28px"
            onClick={(e) => {
              e.stopPropagation();
              editAction(action);
            }}
            rightIcon={<ChevronRight boxSize="14px" data-id="137cbad8b61b" />}
          >
            More
          </Button>
          {isOverdue && (
            <HStack data-id="97a8026dc449" spacing={2}>
              <WarningIcon data-id="9370ac121b56" fill="transparent" h="22px" stroke="#DC0043" w="18px" />
              <Text color="#DC0043" data-id="9de502775ba4" fontSize="12px" fontWeight="bold">
                Overdue
              </Text>
            </HStack>
          )}
        </Flex>
      </Box>
    </Box>
  );
}

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
      missed: {
        bg: '#DC0043',
        color: '#FFFFFF',
      },
    },
    missed: {
      icon: {
        stroke: '#DC0043',
        fill: 'transparent',
      },
      color: '#DC0043',
    },
  },
};
