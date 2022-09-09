import { AddIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';

import { useParticipantsModalContext } from '../../contexts/ParticipantsModalProvider';

const ParticipantsAddButton = (props) => {
  const { openParticipantsModal } = useParticipantsModalContext();

  return (
    <IconButton
      aria-label="Add participant"
      bg="participantsAddButton.bg"
      color="participantsAddButton.color"
      h="64px"
      icon={<AddIcon />}
      isRound
      mx="8px"
      onClick={openParticipantsModal}
      w="64px"
      {...props}
    />
  );
};

export const participantsAddButtonStyles = {
  participantsAddButton: {
    bg: '#1E1836',
    color: '#FFFFFF',
  },
};

export default ParticipantsAddButton;
