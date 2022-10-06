import { Avatar, Box, Flex, Skeleton, Text, Tooltip } from '@chakra-ui/react';
import { format, isBefore } from 'date-fns';
import { capitalize } from 'lodash';

import { LocationIcon } from '../../icons';
import { IAction } from '../../interfaces/IAction';

const ActionsListItem = ({ action, editAction }: { action: IAction; editAction: (action: IAction) => void }) => {
  const isOverdue = action.dueDate && action.status === 'open' && isBefore(new Date(action.dueDate), new Date());

  return (
    <Box
      bg="white"
      borderBottomColor="actionsList.headerBorderColor"
      borderBottomWidth="1px"
      cursor="pointer"
      onClick={() => editAction(action)}
      p="15px 25px"
      py={[1, 0]}
      w="full"
    >
      <Flex align="center" h={['full', '73px']} position="relative" w="full">
        <Flex flexDir="column" w="17%">
          <Flex
            align="flex-start"
            color="actionsList.fontColor"
            fontSize="smm"
            fontWeight="400"
            h="50%"
            lineHeight="18px"
            noOfLines={1}
            opacity="1"
            pt="3px"
            textOverflow="ellipsis"
          >
            {action.title}
          </Flex>
        </Flex>
        <Flex flexDir="column" w="8%">
          <Flex
            align="flex-start"
            color="actionsList.fontColor"
            fontSize="smm"
            fontWeight="400"
            h="50%"
            lineHeight="18px"
            noOfLines={1}
            opacity="1"
            pt="3px"
            textOverflow="ellipsis"
          >
            {capitalize(action.priority)}
          </Flex>
        </Flex>
        <Flex w="10%">
          <Flex color="actionsList.fontColor" fontSize="smm" fontWeight="400" opacity="1">
            {action?.dueDate ? format(new Date(action?.dueDate), 'd MMM yyyy') : <Flex fontStyle="italic">No date</Flex>}
          </Flex>
        </Flex>
        <Flex w="10%">
          <Flex color="actionsList.fontColor" fontSize="smm" fontWeight="400" opacity="1">
            {action?.completedDate ? format(new Date(action?.completedDate), 'd MMM yyyy') : <Flex fontStyle="italic">No date</Flex>}
          </Flex>
        </Flex>
        <Flex w="10%">
          <Flex align="center">
            <Flex color={`actionsList.${isOverdue ? 'overdue' : action.status}`} fontSize="smm">
              {isOverdue ? 'Overdue' : capitalize(action.status)}
            </Flex>
          </Flex>
        </Flex>
        <Box w="10%">
          <Skeleton isLoaded={!!action} rounded="full">
            {action.assignee ? (
              <Tooltip label={action.assignee?.displayName}>
                <Avatar name={action.assignee?.displayName} size="sm" src={action.assignee?.imgUrl} />
              </Tooltip>
            ) : (
              <Flex fontSize="13px" fontStyle="italic">
                Unassigned
              </Flex>
            )}
          </Skeleton>
        </Box>
        <Box w="10%">
          <Skeleton isLoaded={!!action} rounded="full">
            {action.creator ? (
              <Tooltip label={action.creator?.displayName}>
                <Avatar name={action.creator?.displayName} size="sm" src={action.creator?.imgUrl} />
              </Tooltip>
            ) : (
              <Flex fontSize="13px" fontStyle="italic">
                -
              </Flex>
            )}
          </Skeleton>
        </Box>
        <Box w="12.5%">
          <Flex>
            <LocationIcon boxSize="12px" mt="2px" />
            <Text
              color="actionsList.fontColor"
              fontSize="13px"
              lineHeight="17px"
              opacity="1"
              overflow="hidden"
              pl={2}
              textOverflow="ellipsis"
              w="full"
              whiteSpace="nowrap"
            >
              {action.answer?.audit?.location?.name ?? 'Virtual'}
            </Text>
          </Flex>
        </Box>
        <Box w="12.5%">
          <Flex>
            <LocationIcon boxSize="12px" mt="2px" />
            <Text
              color="actionsList.fontColor"
              fontSize="13px"
              lineHeight="17px"
              opacity="1"
              overflow="hidden"
              pl={2}
              textOverflow="ellipsis"
              w="full"
              whiteSpace="nowrap"
            >
              {action?.answer?.audit?.auditType?.businessUnitScope === 'audit'
                ? action?.answer?.audit?.businessUnit?.name ?? '-'
                : action?.answer?.businessUnit?.name ?? '-'}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default ActionsListItem;
