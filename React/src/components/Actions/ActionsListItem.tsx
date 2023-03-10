import { Avatar, Box, Flex, Skeleton, Text, Tooltip } from '@chakra-ui/react';
import { format, isBefore } from 'date-fns';
import { capitalize } from 'lodash';

import { LocationIcon } from '../../icons';
import { IAction } from '../../interfaces/IAction';

const ActionsListItem = ({ action, editAction }: { action: IAction; editAction: (action: IAction) => void }) => {
  const isOverdue = action.dueDate && action.status === 'open' && isBefore(new Date(action.dueDate), new Date());

  return (
    (<Box
      bg="white"
      borderBottomColor="actionsList.headerBorderColor"
      borderBottomWidth="1px"
      cursor="pointer"
      data-id="3c3884e96633"
      onClick={() => editAction(action)}
      p="15px 25px"
      py={[1, 0]}
      w="full">
      <Flex
        align="center"
        data-id="1accd9b27b82"
        h={['full', '73px']}
        position="relative"
        w="full">
        <Flex data-id="63d7e16ea028" flexDir="column" w="17%">
          <Flex
            align="flex-start"
            color="actionsList.fontColor"
            data-id="ea8ea20172a2"
            fontSize="smm"
            fontWeight="400"
            h="50%"
            lineHeight="18px"
            noOfLines={1}
            opacity="1"
            pt="3px"
            textOverflow="ellipsis">
            {action.title}
          </Flex>
        </Flex>
        <Flex data-id="9cf7c79ed8cb" flexDir="column" w="8%">
          <Flex
            align="flex-start"
            color="actionsList.fontColor"
            data-id="3f714ab1b23e"
            fontSize="smm"
            fontWeight="400"
            h="50%"
            lineHeight="18px"
            noOfLines={1}
            opacity="1"
            pt="3px"
            textOverflow="ellipsis">
            {capitalize(action.priority)}
          </Flex>
        </Flex>
        <Flex data-id="febb0efc7044" w="10%">
          <Flex
            color="actionsList.fontColor"
            data-id="df25c4646779"
            fontSize="smm"
            fontWeight="400"
            opacity="1">
            {action?.dueDate ? format(new Date(action?.dueDate), 'd MMM yyyy') : <Flex data-id="ab6cd6a27313" fontStyle="italic">No date</Flex>}
          </Flex>
        </Flex>
        <Flex data-id="aec5431a00b7" w="10%">
          <Flex
            color="actionsList.fontColor"
            data-id="d1a1d75b852f"
            fontSize="smm"
            fontWeight="400"
            opacity="1">
            {action?.completedDate ? format(new Date(action?.completedDate), 'd MMM yyyy') : <Flex data-id="e141182f0573" fontStyle="italic">No date</Flex>}
          </Flex>
        </Flex>
        <Flex data-id="b80b95d97d66" w="10%">
          <Flex align="center" data-id="a20f161b6ef5">
            <Flex
              color={`actionsList.${isOverdue ? 'overdue' : action.status}`}
              data-id="cc01978eb1f0"
              fontSize="smm">
              {isOverdue ? 'Overdue' : capitalize(action.status)}
            </Flex>
          </Flex>
        </Flex>
        <Box data-id="1a726a9c8957" w="10%">
          <Skeleton data-id="584507e45ec0" isLoaded={!!action} rounded="full">
            {action.assignee ? (
              <Tooltip data-id="f0e177c067ad" label={action.assignee?.displayName}>
                <Avatar
                  data-id="f999c936b314"
                  name={action.assignee?.displayName}
                  size="sm"
                  src={action.assignee?.imgUrl} />
              </Tooltip>
            ) : (
              <Flex data-id="2a0c06e3e9b8" fontSize="13px" fontStyle="italic">
                Unassigned
              </Flex>
            )}
          </Skeleton>
        </Box>
        <Box data-id="14ee12520b62" w="10%">
          <Skeleton data-id="c2be8acc8c98" isLoaded={!!action} rounded="full">
            {action.creator ? (
              <Tooltip data-id="fbe47ff88856" label={action.creator?.displayName}>
                <Avatar
                  data-id="e04ef11669ef"
                  name={action.creator?.displayName}
                  size="sm"
                  src={action.creator?.imgUrl} />
              </Tooltip>
            ) : (
              <Flex data-id="5a73ad0ae8b8" fontSize="13px" fontStyle="italic">
                -
              </Flex>
            )}
          </Skeleton>
        </Box>
        <Box data-id="30baee63afb6" w="12.5%">
          <Flex data-id="accdbc41b333">
            <LocationIcon boxSize="12px" data-id="a8ad0331cc83" mt="2px" />
            <Text
              color="actionsList.fontColor"
              data-id="cb468d4e302d"
              fontSize="13px"
              lineHeight="17px"
              opacity="1"
              overflow="hidden"
              pl={2}
              textOverflow="ellipsis"
              w="full"
              whiteSpace="nowrap">
              {action.answer?.audit?.location?.name ?? 'Virtual'}
            </Text>
          </Flex>
        </Box>
        <Box data-id="fea4828b91fc" w="12.5%">
          <Flex data-id="f5977432e70e">
            <LocationIcon boxSize="12px" data-id="ab8c08c566e7" mt="2px" />
            <Text
              color="actionsList.fontColor"
              data-id="004ab0adef9b"
              fontSize="13px"
              lineHeight="17px"
              opacity="1"
              overflow="hidden"
              pl={2}
              textOverflow="ellipsis"
              w="full"
              whiteSpace="nowrap">
              {action?.answer?.audit?.auditType?.businessUnitScope === 'audit'
                ? action?.answer?.audit?.businessUnit?.name ?? '-'
                : action?.answer?.businessUnit?.name ?? '-'}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>)
  );
};

export default ActionsListItem;
