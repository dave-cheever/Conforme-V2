import { Stack } from '@chakra-ui/react';

import { IUser } from '../../interfaces/IUser';
import ParticipantAvatar from './ParticipantAvatar';
import ParticipantsSelector from './ParticipantsSelector';

function SingleParticipantSelector({
  label,
  isUserAllowedToChange = false,
  selectedParticipant,
  onChange,
}: {
  label?: string;
  isUserAllowedToChange: boolean;
  selectedParticipant: IUser | undefined;
  onChange: (participants: IUser) => void;
}) {
  return (
    <Stack data-id="000654" spacing={2}>
      <ParticipantsSelector
        data-id="000655"
        defaultSelectedParticipantsIds={[selectedParticipant && (selectedParticipant.userId || selectedParticipant._id)]}
        isUserAllowedToChange={isUserAllowedToChange}
        label={label}
        maxParticipants={1}
        onChange={(participants) => participants[0] && onChange(participants[0])}
      >
        <ParticipantAvatar data-id="000656" user={selectedParticipant && selectedParticipant} />
      </ParticipantsSelector>
    </Stack>
  );
}

export default SingleParticipantSelector;
