import { AddIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';

import { useParticipantsModalContext } from '../../contexts/ParticipantsModalProvider';

const ParticipantsAddButton = (props) => {
  const { openParticipantsModal } = useParticipantsModalContext();

  return (
    (<IconButton
      aria-label="Add participant"
      bg="participantsAddButton.bg"
      color="participantsAddButton.color"
      data-id="80335e69006a"
      h="64px"
      icon={<AddIcon data-id="463875e4cd26" />}
      isRound
      mx="8px"
      onClick={openParticipantsModal}
      w="64px"
      {...props} />)
  );
};

export const participantsAddButtonStyles = {
  participantsAddButton: {
    bg: '#1E1836',
    color: '#FFFFFF',
  },
};

export default ParticipantsAddButton;
