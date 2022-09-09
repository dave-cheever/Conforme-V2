import { Box, Flex, Text } from '@chakra-ui/react';

import { TickIcon } from '../../icons';
import { IUser } from '../../interfaces/IUser';

const ParticipantListItem = ({
  user,
  isSelected,
  onSelectParticipant,
}: {
  user: IUser;
  isSelected: boolean;
  onSelectParticipant: (user: IUser) => void;
}) => (
  <Flex align="center" cursor="pointer" key={user._id} onClick={() => onSelectParticipant(user)} w="full">
    <Flex
      align="center"
      basis="20px"
      bg={`participantListItem.checkbox.${isSelected ? 'selected' : 'nonSelected'}`}
      borderColor="participantListItem.checkbox.border"
      borderRadius="full"
      borderWidth="1px"
      h="20px"
      justify="center"
      pt="1"
      shrink={0}
    >
      <TickIcon h="10px" stroke="white" w="10px" />
    </Flex>
    <Flex direction="column" ml="2">
      <Text color="participantListItem.font" fontSize="smm" fontWeight="semibold" wordBreak="break-word">
        {user.displayName} - {user.jobTitle || 'No job title'}
      </Text>
      <Box fontSize="sm" top="-4px" wordBreak="break-word">
        {user.email}
      </Box>
    </Flex>
  </Flex>
);

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
