import { Box, Flex, Text } from '@chakra-ui/react';

import { TickIcon } from '../../icons';
import { IUser } from '../../interfaces/IUser';
import { formatEmail } from '../../utils/helpers';

function ParticipantListItem({
  user,
  isSelected,
  onSelectParticipant,
}: {
  user: IUser;
  isSelected: boolean;
  onSelectParticipant: (user: IUser) => void;
}) {
  return (
    <Flex
      align="center"
      cursor="pointer"
      data-id="030925-3ce00e"
      key={user.userId}
      onClick={() => onSelectParticipant(user)}
      w="full">
      <Flex
        align="center"
        basis="20px"
        bg={`participantListItem.checkbox.${isSelected ? 'selected' : 'nonSelected'}`}
        borderColor="participantListItem.checkbox.border"
        borderRadius="full"
        borderWidth="1px"
        data-id="030925-59e620"
        h="20px"
        justify="center"
        pt="1"
        shrink={0}>
        <TickIcon data-id="030925-e850e3" h="10px" stroke="white" w="10px" />
      </Flex>
      <Flex data-id="030925-38926b" direction="column" ml="2">
        <Text
          color="participantListItem.font"
          data-id="030925-e59c6a"
          fontSize="smm"
          fontWeight="semibold"
          wordBreak="break-word">
          {user.displayName}{user.jobTitle && ` - ${user.jobTitle}`}
        </Text>
        <Box data-id="030925-e8b302" fontSize="sm" top="-4px" wordBreak="break-word">
          {formatEmail(user.email)}
        </Box>
      </Flex>
    </Flex>
  );
}

export default ParticipantListItem;

export const participantListItemStyles = {
  participantListItem: {
    checkbox: {
      selected: '#462AC4',
      nonSelected: '#FFFFFF',
      border: '#81819750',
    },
    font: '#000000',
  },
};
