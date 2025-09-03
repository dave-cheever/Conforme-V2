import { Button, Text } from '@chakra-ui/react';

import { useParticipantsModalContext } from '../../contexts/ParticipantsModalProvider';
import { AddUserIcon } from '../../icons';

function ParticipantsAddButton(props) {
  const { openParticipantsModal } = useParticipantsModalContext();

  return (
    <Button
      data-id="030925-ea17fb"
      bg="#FFFFFF"
      border="1px solid #CBD5E0"
      borderRadius="8px"
      color="#2D3748"
      fontSize="14px"
      fontWeight="500"
      height="44px"
      leftIcon={<AddUserIcon data-id="030925-5d8500" />}
      onClick={openParticipantsModal}
      px="16px"
      {...props}
    >
      <Text data-id="030925-33cf1c" as="span" mr="1">Add </Text> {props.label ? <Text data-id="030925-ef16b6" as="span">{props.label}</Text> : 'Participant'}
    </Button>
  );
}

export const participantsAddButtonStyles = {
  participantsAddButton: {
    bg: '#1E1836',
    color: '#FFFFFF',
  },
};

export default ParticipantsAddButton;
