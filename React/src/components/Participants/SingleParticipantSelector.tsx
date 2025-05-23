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
  return <Stack data-id="44fe7e8537a8" spacing={6}>
    <ParticipantsSelector
      data-id="a9519f8bde3d"
      defaultSelectedParticipantsIds={[ selectedParticipant && selectedParticipant._id]}
      isUserAllowedToChange={isUserAllowedToChange}
      label={label}
      maxParticipants={1}
      onChange={(participants) => participants[0] && onChange(participants[0])}>
      <ParticipantAvatar data-id="81c9b8130ecd" user={selectedParticipant && selectedParticipant} />
    </ParticipantsSelector>
  </Stack>
}

export default SingleParticipantSelector;
