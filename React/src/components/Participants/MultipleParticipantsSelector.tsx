import { Flex, Stack } from '@chakra-ui/react';

import { IUser } from '../../interfaces/IUser';
import ParticipantAvatar from './ParticipantAvatar';
import ParticipantsAddButton from './ParticipantsAddButton';
import ParticipantsSelector from './ParticipantsSelector';

const MultipleParticipantsSelector = ({
  label,
  maxParticipants,
  isUserAllowedToChange = false,
  selectedParticipants = [],
  onChange,
}: {
  label?: string;
  maxParticipants?: number;
  isUserAllowedToChange: boolean;
  selectedParticipants: IUser[];
  onChange: (participants: IUser[]) => void;
}) => (
  <Stack spacing={6}>
    <ParticipantsSelector
      canDelete
      defaultSelectedParticipantsIds={selectedParticipants.map(({ _id }) => _id)}
      isUserAllowedToChange={isUserAllowedToChange}
      label={label}
      maxParticipants={maxParticipants}
      onChange={onChange}
    >
      <Flex align="top" mt="0!important" wrap="wrap">
        {selectedParticipants.map((participant) => (
          <ParticipantAvatar key={participant._id} mr={6} mt={6} user={participant} />
        ))}
        {isUserAllowedToChange && <ParticipantsAddButton mr={6} mt={6} />}
      </Flex>
    </ParticipantsSelector>
  </Stack>
);

export default MultipleParticipantsSelector;
