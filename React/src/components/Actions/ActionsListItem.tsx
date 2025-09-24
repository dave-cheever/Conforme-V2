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
      data-id="000361"
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
      <Flex data-id="000362" align="center" h={['full', '60px']} position="relative" w="full">
        <Flex data-id="000363" flexDir="column" w="13%">
          <Flex
            data-id="000364"
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
        <Flex data-id="000365" flexDir="column" w="7%">
          <Flex
            data-id="000366"
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
        <Flex data-id="000367" w="10%">
          <Flex data-id="000368" color="auditsList.fontColor" fontSize="14px" fontWeight="500" opacity="1">
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
          <Flex data-id="000371" color="auditsList.fontColor" fontSize="14px" fontWeight="500" opacity="1">
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
          <Flex data-id="000374" align="center">
            <Flex data-id="000375" color={`auditsList.${isOverdue ? 'missed' : action.status}`} fontSize="14px" fontWeight="500">
              {isOverdue ? 'Overdue' : capitalize(action.status)}
            </Flex>
          </Flex>
        </Flex>
        <Box data-id="000376" w="18%">
          <Skeleton data-id="000377" isLoaded={!!action} rounded="full">
            {action.assignee ? (
              <Tooltip data-id="000378" label={action.assignee?.displayName}>
                <Avatar data-id="000379"  name={action?.assignee?.displayName?.replace(/\s*\(.*?\)\s*/g, '')} size="xs" src={action.assignee?.imgUrl} />
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
              <Tooltip data-id="000383" label={action.creator?.displayName}>
                <Avatar data-id="000384"  name={action?.creator?.displayName?.replace(/\s*\(.*?\)\s*/g, '')} size="xs" src={action.creator?.imgUrl} />
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
            <LocationIcon data-id="000388" boxSize="12px" mt="2px" />
            <Text
              data-id="000389"
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
        <Box data-id="000390" w="10%">
          <Flex data-id="000391">
            <LocationIcon data-id="000392" boxSize="12px" mt="2px" />
            <Text
              data-id="000393"
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
