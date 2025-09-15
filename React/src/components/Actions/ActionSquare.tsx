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
      border="1px solid #CBD5E0"
      borderRadius="10px"
      boxShadow="sm"
      cursor="pointer"
      data-id="030925-45cdf1"
      flexShrink={0}
      h="250px"
      onClick={() => editAction(action)}
      p="16px 0px"
      w={['full', 'full', '350px']}
    >
      <Flex align="center" data-id="030925-16e930" h="40px" justify="space-between" p="0px 16px 16px 16px" w="full">
        <Skeleton data-id="030925-27aa26" isLoaded={!!action} rounded="full">
          <Flex alignItems="center" data-id="030925-769b7b">
            <Tooltip data-id="030925-9fee8c" label={action?.assignee?.displayName ?? 'No assignee'}>
              <Avatar
                borderRadius="8px"
                boxSize="36px"
                cursor="pointer"
                data-id="030925-e0f0ba"                
                name={action?.assignee?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
                src={action?.assignee?.imgUrl}
              />
            </Tooltip>
            <Flex data-id="030925-be84a4" direction="column" minW={0} ml={3}>
               <Text
                  color="#282F36"
                  data-id="030925-f77cf6"
                  fontSize="16px"
                  fontWeight="600"
                  maxW="220px"
                  noOfLines={1}
                  wordBreak="break-word"
                >
                  {action?.title}
                </Text>

              <Text color="#818197" data-id="030925-657c0b" fontSize="11px" noOfLines={1}>
                {action?.answer?.audit?.auditType?.name}
              </Text>
            </Flex>
          </Flex>
        </Skeleton>
        {!action?.metatags?.updatedAt && (
          <Box bg="#41B916" color="#FFF" data-id="030925-44f761" fontSize="11px" px={2} py="1px" rounded="2px">
            New
          </Box>
        )}
      </Flex>
      <Divider color="#CBD5E0" data-id="030925-ff484e" w="full" />
      <Box data-id="030925-06c417" p="16px">
        <Box
          columnGap="32px"
          data-id="030925-d4c34c"
          display="grid"
          gridTemplateColumns="1fr 1fr"
          rowGap="18px">
          <Box data-id="030925-629b68">
            <Text color="#4A5568" data-id="030925-b02a2e" fontSize="14px" fontWeight="600">
              Priority
            </Text>
            <Text color="#282F36" data-id="030925-ce02e9" fontSize="14px" fontWeight="400" textTransform="capitalize">
              {action?.priority ?? '-'}
            </Text>
          </Box>
  
            <Box data-id="030925-2119f5">
              <Text color="#4A5568" data-id="030925-c4f69f" fontSize="14px" fontWeight="600">
                Due in
              </Text>
              <Text color="#282F36" data-id="030925-3a4c15" fontSize="14px" fontWeight="400">
               {action?.dueDate ? formatDistanceToNow(new Date(action.dueDate)) : "No Due Date"}
              </Text>
            </Box>
  
        </Box>

        <Box data-id="030925-27d9eb" mt={4}>
          <Text color="#4A5568" data-id="030925-94209a" fontSize="14px" fontWeight="600">
            Linked To
          </Text>
          <Flex
            _hover={{ textDecoration: 'underline' }}
            align="center"
            cursor="pointer"
            data-id="030925-3231c2"
            gap={1}
            mt={1}
            onClick={(e) => {
              e.stopPropagation();
              openInNewTab(`/audits/${action?.answer?.audit?._id}`);
            }}
          >
            <Text color="#282F36" data-id="030925-822e35" fontSize="14px" fontWeight="400" noOfLines={1}>
              {action?.answer?.question?.question
                ? `${action.answer.question.question}: `
                : ''}
              {action?.answer?.audit?.auditType?.businessUnitScope === 'audit'
                ? action?.answer?.audit?.businessUnit?.name ?? '-'
                : action?.answer?.businessUnit?.name ?? '-'}
            </Text>
            <OpenExternalIcon data-id="030925-5baea6" fill="transparent" stroke="black" />
          </Flex>
        </Box>

        <Flex align="center" data-id="030925-c2ab84" justify="space-between" mt={4}>
          <Button
            _hover={{ bg: isOverdue ? '#C5003C' : '#E6E8F0' }}
            bg={isOverdue ? '#DC0043' : '#F0F2F5'}
            color={isOverdue ? '#FFFFFF' : '#1E1836'}
            data-id="030925-260365"
            fontSize="12px"
            h="28px"
            onClick={(e) => {
              e.stopPropagation();
              editAction(action);
            }}
            rightIcon={<ChevronRight boxSize="14px" data-id="030925-ae48fc" />}
          >
            More
          </Button>
          {isOverdue && (
            <HStack data-id="030925-02b0c2" spacing={2}>
              <WarningIcon data-id="030925-be4c91" fill="transparent" h="22px" stroke="#DC0043" w="18px" />
              <Text color="#DC0043" data-id="030925-b1f379" fontSize="12px" fontWeight="bold">
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
