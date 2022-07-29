import { useState } from 'react';

import { Flex, HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import { format } from 'date-fns';

import { useAuditContext } from '../../contexts/AuditProvider';
import { EditIcon, Trashcan } from '../../icons';
import { IAction } from '../../interfaces/IAction';
import { IUser } from '../../interfaces/IUser';
import UserAvatar from '../UserAvatar';

const ActionListItem = ({
  action,
  disabled = false,
  index,
  onDelete,
}: {
  action: IAction;
  disabled?: boolean;
  index: number;
  onDelete?: () => void;
}) => {
  const { setSelectedAction } = useAuditContext();
  const [assigneeDetails, setAssigneeDetails] = useState<IUser>();

  return (
    <HStack spacing={6} w="full">
      <Flex
        align="center"
        bg="actionListElement.number.bg"
        color="actionListElement.number.color"
        h="30px"
        justify="center"
        rounded="full"
        w="30px"
      >
        {index + 1}
      </Flex>
      <HStack bg="actionListElement.bg" flexGrow={1} px={5} py={3} rounded="10px" spacing={5}>
        {action?.assigneeId && <UserAvatar callback={setAssigneeDetails} h="36px" userId={action.assigneeId} w="36px" />}
        <Stack flexGrow={1} spacing={0}>
          <HStack color="actionListElement.color" fontSize="ssm" spacing={4}>
            {action?.assigneeId && <Text>{assigneeDetails?.displayName}</Text>}
            {action.dueDate && <Text>{format(new Date(action.dueDate), 'd LLLL Y')}</Text>}
          </HStack>
          <Text color="actionListElement.color" fontSize="smm">
            {action.title}
          </Text>
        </Stack>
        {!disabled && (
          <HStack spacing={2}>
            <EditIcon cursor="pointer" onClick={() => setSelectedAction(action)} stroke="actionListElement.icon" />
            <Spacer />
            <Trashcan cursor="pointer" onClick={onDelete} stroke="actionListElement.icon" />
          </HStack>
        )}
      </HStack>
    </HStack>
  );
};

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
