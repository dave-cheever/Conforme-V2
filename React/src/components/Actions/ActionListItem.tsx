import { useState } from 'react';

import { Flex, HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import { format } from 'date-fns';

import { useAuditContext } from '../../contexts/AuditProvider';
import { EditIcon, Trashcan } from '../../icons';
import { IAction } from '../../interfaces/IAction';
import { IUser } from '../../interfaces/IUser';
import UserAvatar from '../UserAvatar';

function ActionListItem({
  action,
  disabled = false,
  index,
  onDelete,
}: {
  action: IAction;
  disabled?: boolean;
  index: number;
  onDelete?: () => void;
}) {
  const { setSelectedAction } = useAuditContext();
  const [assigneeDetails, setAssigneeDetails] = useState<IUser>();

  return (
    <HStack data-id="000348" spacing={[2, 6]} w="full">
      <Flex
        align="center"
        bg="actionListElement.number.bg"
        color="actionListElement.number.color"
        data-id="000349"
        h="30px"
        justify="center"
        rounded="full"
        w="30px">
        {index + 1}
      </Flex>
      <HStack
        bg="actionListElement.bg"
        data-id="000350"
        flexGrow={1}
        px={[3, 5]}
        py={3}
        rounded="10px"
        spacing={[2, 5]}>
        {action?.assigneeId && <UserAvatar
          callback={setAssigneeDetails}
          data-id="000351"
          h="36px"
          userId={action.assigneeId}
          w="36px" />}
        <Stack data-id="000352" flexGrow={1} spacing={0}>
          <HStack
            color="actionListElement.color"
            data-id="000353"
            fontSize="ssm"
            spacing={4}>
            {action?.assigneeId && <Text data-id="000354">{assigneeDetails?.displayName}</Text>}
            {action.dueDate && <Text data-id="000355">{format(new Date(action.dueDate), 'd LLLL Y')}</Text>}
          </HStack>
          <Text
            color="actionListElement.color"
            data-id="000356"
            fontSize="smm"
            wordBreak="break-all">
            {action.title}
          </Text>
        </Stack>
        {!disabled && (
          <HStack data-id="000357" spacing={2}>
            <EditIcon
              cursor="pointer"
              data-id="000358"
              onClick={() => setSelectedAction(action)}
              stroke="actionListElement.icon" />
            <Spacer data-id="000359" />
            <Trashcan
              cursor="pointer"
              data-id="000360"
              onClick={onDelete}
              stroke="actionListElement.icon" />
          </HStack>
        )}
      </HStack>
    </HStack>
  );
}

export const actionListElementStyles = {
  actionListElement: {
    bg: '#F4F3F5',
    color: '#787486',
    icon: '#1E1836',
    number: {
      bg: '#F4F3F5',
      color: '#787486',
    },
  },
};

export default ActionListItem;
