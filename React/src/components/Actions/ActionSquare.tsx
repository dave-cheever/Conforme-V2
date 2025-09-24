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
      data-id="000433"
      _hover={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)' }}
      bg="white"
      border="1px solid #CBD5E0"
      borderRadius="10px"
      boxShadow="sm"
      cursor="pointer"
      flexShrink={0}
      h="250px"
      onClick={() => editAction(action)}
      p="16px 0px"
      w={['full', 'full', '350px']}
    >
      <Flex data-id="000434" align="center" h="40px" justify="space-between" p="0px 16px 16px 16px" w="full">
        <Skeleton data-id="000435" isLoaded={!!action} rounded="full">
          <Flex data-id="000436" alignItems="center">
            <Tooltip data-id="000437" label={action?.assignee?.displayName ?? 'No assignee'}>
              <Avatar
                data-id="000438"
                borderRadius="8px"
                boxSize="36px"
                cursor="pointer"                
                name={action?.assignee?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
                src={action?.assignee?.imgUrl}
              />
            </Tooltip>
            <Flex data-id="000439" direction="column" minW={0} ml={3}>
               <Text
                  data-id="000440"
                  color="#282F36"
                  fontSize="16px"
                  fontWeight="600"
                  maxW="220px"
                  noOfLines={1}
                  wordBreak="break-word"
                >
                  {action?.title}
                </Text>

              <Text data-id="000441" color="#818197" fontSize="11px" noOfLines={1}>
                {action?.answer?.audit?.auditType?.name}
              </Text>
            </Flex>
          </Flex>
        </Skeleton>
        {!action?.metatags?.updatedAt && (
          <Box data-id="000442" bg="#41B916" color="#FFF" fontSize="11px" px={2} py="1px" rounded="2px">
            New
          </Box>
        )}
      </Flex>
      <Divider data-id="000443" color="#CBD5E0" w="full" />
      <Box data-id="000444" p="16px">
        <Box
          data-id="000445"
          columnGap="32px"
          display="grid"
          gridTemplateColumns="1fr 1fr"
          rowGap="18px">
          <Box data-id="000446">
            <Text data-id="000447" color="#4A5568" fontSize="14px" fontWeight="600">
              Priority
            </Text>
            <Text data-id="000448" color="#282F36" fontSize="14px" fontWeight="400" textTransform="capitalize">
              {action?.priority ?? '-'}
            </Text>
          </Box>
  
            <Box data-id="000449">
              <Text data-id="000450" color="#4A5568" fontSize="14px" fontWeight="600">
                Due in
              </Text>
              <Text data-id="000451" color="#282F36" fontSize="14px" fontWeight="400">
               {action?.dueDate ? formatDistanceToNow(new Date(action.dueDate)) : "No Due Date"}
              </Text>
            </Box>
  
        </Box>

        <Box data-id="000452" mt={4}>
          <Text data-id="000453" color="#4A5568" fontSize="14px" fontWeight="600">
            Linked To
          </Text>
          <Flex
            data-id="000454"
            _hover={{ textDecoration: 'underline' }}
            align="center"
            cursor="pointer"
            gap={1}
            mt={1}
            onClick={(e) => {
              e.stopPropagation();
              openInNewTab(`/audits/${action?.answer?.audit?._id}`);
            }}
          >
            <Text data-id="000455" color="#282F36" fontSize="14px" fontWeight="400" noOfLines={1}>
              {action?.answer?.question?.question
                ? `${action.answer.question.question}: `
                : ''}
              {action?.answer?.audit?.auditType?.businessUnitScope === 'audit'
                ? action?.answer?.audit?.businessUnit?.name ?? '-'
                : action?.answer?.businessUnit?.name ?? '-'}
            </Text>
            <OpenExternalIcon data-id="000456" fill="transparent" stroke="black" />
          </Flex>
        </Box>

        <Flex data-id="000457" align="center" justify="space-between" mt={4}>
          <Button
            data-id="000458"
            _hover={{ bg: isOverdue ? '#C5003C' : '#E6E8F0' }}
            bg={isOverdue ? '#DC0043' : '#F0F2F5'}
            color={isOverdue ? '#FFFFFF' : '#1E1836'}
            fontSize="12px"
            h="28px"
            onClick={(e) => {
              e.stopPropagation();
              editAction(action);
            }}
            rightIcon={<ChevronRight data-id="000459" boxSize="14px" />}
          >
            More
          </Button>
          {isOverdue && (
            <HStack data-id="000460" spacing={2}>
              <WarningIcon data-id="000461" fill="transparent" h="22px" stroke="#DC0043" w="18px" />
              <Text data-id="000462" color="#DC0043" fontSize="12px" fontWeight="bold">
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
