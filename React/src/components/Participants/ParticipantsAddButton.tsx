import { Button, Text } from '@chakra-ui/react';

import { useParticipantsModalContext } from '../../contexts/ParticipantsModalProvider';
import { AddUserIcon } from '../../icons';

function ParticipantsAddButton(props) {
  const { openParticipantsModal } = useParticipantsModalContext();

  return (
    <Button
      bg="#FFFFFF"
      border="1px solid #CBD5E0"
      borderRadius="8px"
      color="#2D3748"
      data-id="000608"
      fontSize="14px"
      fontWeight="500"
      height="44px"
      leftIcon={<AddUserIcon data-id="000609" />}
      onClick={openParticipantsModal}
      px="16px"
      {...props}
    >
      <Text as="span" data-id="000610" mr="1">Add </Text> {props.label ? <Text as="span" data-id="000611">{props.label}</Text> : 'Participant'}
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
