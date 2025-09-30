import { Avatar, Box, Flex, Skeleton, Text, Tooltip } from '@chakra-ui/react';
import { format, isBefore } from 'date-fns';
import { capitalize } from 'lodash';

import { LocationIcon } from '../../icons';
import { IAction } from '../../interfaces/IAction';
import sanitizeDisplayName from '../../utils/sanitizeDisplayName';

function ActionsListItem({ action, editAction, index }: { action: IAction; editAction: (action: IAction) => void; index: number }) {
  const isOverdue = action.dueDate && action.status === 'open' && isBefore(new Date(action.dueDate), new Date());
  const rowBg = index % 2 === 0 ? 'white' : 'gray.50';

  return (
    <Box
      _hover={{ bg: '#F5F7FA' }}
      bg={rowBg}
      borderBottomColor="auditsList.headerBorderColor"
      borderBottomWidth="1px"
      color="auditsList.fontColor"
      cursor="pointer"
      data-id="000361"
      fontSize="14px"
      onClick={() => editAction(action)}
      px="10px"
      py={[1, 0]}
      w="full"
    >
      <Flex align="center" data-id="000362" h={['full', '60px']} position="relative" w="full">
        <Flex data-id="000363" flexDir="column" w="13%">
          <Flex
            align="flex-start"
            color="auditsList.fontColor"
            data-id="000364"
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
        <Flex data-id="000365" flexDir="column" w="7%">
          <Flex
            align="flex-start"
            color="auditsList.fontColor"
            data-id="000366"
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
        <Flex data-id="000367" w="10%">
          <Flex color="auditsList.fontColor" data-id="000368" fontSize="14px" fontWeight="500" opacity="1">
            {action?.dueDate ? (
              format(new Date(action?.dueDate), 'd MMM yyyy')
            ) : (
              <Flex data-id="000369" fontStyle="italic">
                No date
              </Flex>
            )}
          </Flex>
        </Flex>
        <Flex data-id="000370" w="10%">
          <Flex color="auditsList.fontColor" data-id="000371" fontSize="14px" fontWeight="500" opacity="1">
            {action?.completedDate ? (
              format(new Date(action?.completedDate), 'd MMM yyyy')
            ) : (
              <Flex data-id="000372" fontStyle="italic">
                No date
              </Flex>
            )}
          </Flex>
        </Flex>
        <Flex data-id="000373" w="7%">
          <Flex align="center" data-id="000374">
            <Flex color={`auditsList.${isOverdue ? 'missed' : action.status}`} data-id="000375" fontSize="14px" fontWeight="500">
              {isOverdue ? 'Overdue' : capitalize(action.status)}
            </Flex>
          </Flex>
        </Flex>
        <Box data-id="000376" w="18%">
          <Skeleton data-id="000377" isLoaded={!!action} rounded="full">
            {action.assignee ? (
              <Tooltip data-id="030925-2ad029" label={action.assignee?.displayName}>
                <Flex alignItems="center" data-id="001080">
                  <Avatar
                    data-id="030925-325f0a"
                    name={sanitizeDisplayName(action?.assignee?.displayName)}
                    size="xs"
                    src={action.assignee?.imgUrl}
                  />
                  <Text
                    color="auditsList.fontColor"
                    data-id="030925-2282143"
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
                    {action?.assignee?.displayName}
                  </Text>
                </Flex>
              </Tooltip>
            ) : (
              <Flex data-id="000380" fontSize="14px" fontStyle="italic" fontWeight="500">
                Unassigned
              </Flex>
            )}
          </Skeleton>
        </Box>
        <Box data-id="000381" w="10%">
          <Skeleton data-id="000382" isLoaded={!!action} rounded="full">
            {action.creator ? (
              <Tooltip data-id="030925-e23b81" label={action.creator?.displayName}>
                <Flex alignItems="center" data-id="001081">
                  <Avatar
                    data-id="030925-445435"
                    name={sanitizeDisplayName(action?.creator?.displayName)}
                    size="xs"
                    src={action.creator?.imgUrl}
                  />
                  <Text
                    color="auditsList.fontColor"
                    data-id="030925-2192143"
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
                    {action?.creator?.displayName}
                  </Text>
                </Flex>
              </Tooltip>
            ) : (
              <Flex data-id="000385" fontSize="14px" fontStyle="italic" fontWeight="500">
                -
              </Flex>
            )}
          </Skeleton>
        </Box>
        <Box data-id="000386" w="14%">
          <Flex data-id="000387">
            <LocationIcon boxSize="12px" data-id="000388" mt="2px" />
            <Text
              color="auditsList.fontColor"
              data-id="000389"
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
        <Box data-id="000390" w="10%">
          <Flex data-id="000391">
            <LocationIcon boxSize="12px" data-id="000392" mt="2px" />
            <Text
              color="auditsList.fontColor"
              data-id="000393"
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
                ? (action?.answer?.audit?.businessUnit?.name ?? '-')
                : (action?.answer?.businessUnit?.name ?? '-')}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export default ActionsListItem;
