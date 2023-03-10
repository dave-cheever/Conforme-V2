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
  <Flex
    align="center"
    cursor="pointer"
    data-id="af8a6dfc65ea"
    key={user._id}
    onClick={() => onSelectParticipant(user)}
    w="full">
    <Flex
      align="center"
      basis="20px"
      bg={`participantListItem.checkbox.${isSelected ? 'selected' : 'nonSelected'}`}
      borderColor="participantListItem.checkbox.border"
      borderRadius="full"
      borderWidth="1px"
      data-id="b060c5761cbe"
      h="20px"
      justify="center"
      pt="1"
      shrink={0}>
      <TickIcon data-id="1060ec85f7d3" h="10px" stroke="white" w="10px" />
    </Flex>
    <Flex data-id="1bf23ffa8f13" direction="column" ml="2">
      <Text
        color="participantListItem.font"
        data-id="82c249c37314"
        fontSize="smm"
        fontWeight="semibold"
        wordBreak="break-word">
        {user.displayName} - {user.jobTitle || 'No job title'}
      </Text>
      <Box data-id="19d537928976" fontSize="sm" top="-4px" wordBreak="break-word">
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
