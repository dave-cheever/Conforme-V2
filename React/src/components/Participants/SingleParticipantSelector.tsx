import { Stack } from '@chakra-ui/react';

import { IUser } from '../../interfaces/IUser';
import ParticipantAvatar from './ParticipantAvatar';
import ParticipantsSelector from './ParticipantsSelector';

const SingleParticipantSelector = ({
  label,
  isUserAllowedToChange = false,
  selectedParticipant,
  onChange,
}: {
  label?: string;
  isUserAllowedToChange: boolean;
  selectedParticipant: IUser;
  onChange: (participants: IUser) => void;
}) => (
  <Stack spacing={6}>
    <ParticipantsSelector
      defaultSelectedParticipantsIds={[selectedParticipant._id]}
      isUserAllowedToChange={isUserAllowedToChange}
      label={label}
      maxParticipants={1}
      onChange={(participants) => participants[0] && onChange(participants[0])}
    >
      <ParticipantAvatar user={selectedParticipant} />
    </ParticipantsSelector>
  </Stack>
);

export default SingleParticipantSelector;
