import { Avatar, Box, Flex, Skeleton, Text, Tooltip } from '@chakra-ui/react';
import { format, isBefore } from 'date-fns';
import { capitalize } from 'lodash';

import { LocationIcon } from '../../icons';
import { IAction } from '../../interfaces/IAction';

function ActionsListItem({ action, editAction, index }: { action: IAction; editAction: (action: IAction) => void; index: number }) {
  const isOverdue = action.dueDate && action.status === 'open' && isBefore(new Date(action.dueDate), new Date());
  const rowBg = index % 2 === 0 ? 'white' : 'gray.50';

  return (
    <Box
      data-id="030925-170070"
      _hover={{ bg: '#F5F7FA' }}
      bg={rowBg}
      borderBottomColor="auditsList.headerBorderColor"
      borderBottomWidth="1px"
      color="auditsList.fontColor"
      cursor="pointer"
      fontSize="14px"
      onClick={() => editAction(action)}
      px="10px"
      py={[1, 0]}
      w="full"
    >
      <Flex data-id="030925-ddcefd" align="center" h={['full', '60px']} position="relative" w="full">
        <Flex data-id="030925-877145" flexDir="column" w="13%">
          <Flex
            data-id="030925-283153"
            align="flex-start"
            color="auditsList.fontColor"
            fontSize="14px"
            fontWeight="500"
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
        <Flex data-id="030925-72f6a0" flexDir="column" w="7%">
          <Flex
            data-id="030925-1369c7"
            align="flex-start"
            color="auditsList.fontColor"
            fontSize="14px"
            fontWeight="500"
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
        <Flex data-id="030925-f1b873" w="10%">
          <Flex data-id="030925-c924de" color="auditsList.fontColor" fontSize="14px" fontWeight="500" opacity="1">
            {action?.dueDate ? (
              format(new Date(action?.dueDate), 'd MMM yyyy')
            ) : (
              <Flex data-id="030925-6293ff" fontStyle="italic">
                No date
              </Flex>
            )}
          </Flex>
        </Flex>
        <Flex data-id="030925-f008b8" w="10%">
          <Flex data-id="030925-35691d" color="auditsList.fontColor" fontSize="14px" fontWeight="500" opacity="1">
            {action?.completedDate ? (
              format(new Date(action?.completedDate), 'd MMM yyyy')
            ) : (
              <Flex data-id="030925-08df03" fontStyle="italic">
                No date
              </Flex>
            )}
          </Flex>
        </Flex>
        <Flex data-id="030925-136961" w="7%">
          <Flex data-id="030925-e3775d" align="center">
            <Flex data-id="030925-d10eb2" color={`auditsList.${isOverdue ? 'missed' : action.status}`} fontSize="14px" fontWeight="500">
              {isOverdue ? 'Overdue' : capitalize(action.status)}
            </Flex>
          </Flex>
        </Flex>
        <Box data-id="030925-6d96e8" w="18%">
          <Skeleton data-id="030925-bad793" isLoaded={!!action} rounded="full">
            {action.assignee ? (
              <Tooltip data-id="030925-2ad029" label={action.assignee?.displayName}>
                <Avatar data-id="030925-325f0a"  name={action?.assignee?.displayName?.replace(/\s*\(.*?\)\s*/g, '')} size="xs" src={action.assignee?.imgUrl} />
              </Tooltip>
            ) : (
              <Flex data-id="030925-7d7e2a" fontSize="14px" fontStyle="italic" fontWeight="500">
                Unassigned
              </Flex>
            )}
          </Skeleton>
        </Box>
        <Box data-id="030925-1c049c" w="10%">
          <Skeleton data-id="030925-f4175c" isLoaded={!!action} rounded="full">
            {action.creator ? (
              <Tooltip data-id="030925-e23b81" label={action.creator?.displayName}>
                <Avatar data-id="030925-445435"  name={action?.creator?.displayName?.replace(/\s*\(.*?\)\s*/g, '')} size="xs" src={action.creator?.imgUrl} />
              </Tooltip>
            ) : (
              <Flex data-id="030925-7778be" fontSize="14px" fontStyle="italic" fontWeight="500">
                -
              </Flex>
            )}
          </Skeleton>
        </Box>
        <Box data-id="030925-2b8f94" w="14%">
          <Flex data-id="030925-85c37f">
            <LocationIcon data-id="030925-954e9c" boxSize="12px" mt="2px" />
            <Text
              data-id="030925-228543"
              color="auditsList.fontColor"
              fontSize="14px"
              fontWeight="500"
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
        <Box data-id="030925-2c82d3" w="10%">
          <Flex data-id="030925-aef6af">
            <LocationIcon data-id="030925-2ef95e" boxSize="12px" mt="2px" />
            <Text
              data-id="030925-4a53d7"
              color="auditsList.fontColor"
              fontSize="14px"
              fontWeight="500"
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
}

export default ActionsListItem;
