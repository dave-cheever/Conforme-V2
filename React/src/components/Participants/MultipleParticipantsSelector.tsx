import { useRef } from 'react';

import { Flex, Stack } from '@chakra-ui/react';

import { IUser } from '../../interfaces/IUser';
import ParticipantAvatar from './ParticipantAvatar';
import ParticipantsAddButton from './ParticipantsAddButton';
import ParticipantsDeleteModal from './ParticipantsDeleteModal';
import ParticipantsSelector from './ParticipantsSelector';

function MultipleParticipantsSelector({
  label,
  maxParticipants,
  isUserAllowedToChange = false,
  selectedParticipants = [],
  onChange,
  onRemove,
}: {
  label?: string;
  maxParticipants?: number;
  isUserAllowedToChange: boolean;
  selectedParticipants: IUser[];
  onChange: (participants: IUser[]) => void;
  onRemove?: (participantId: string, selectedParticipants: IUser[]) => void;
}) {
  const justRemovedRef = useRef(false);

  return (
    <Stack data-id="000648" spacing={2}>
      <ParticipantsSelector
        data-id="000649"
        canDelete
        defaultSelectedParticipantsIds={selectedParticipants.map(({ userId, _id }) => userId || _id)}
        isUserAllowedToChange={isUserAllowedToChange}
        label={label}
        maxParticipants={maxParticipants}
        onChange={(participants) => {
          if (justRemovedRef.current) {
            justRemovedRef.current = false;
            return; // Ignore this onChange, it was triggered by a removal
          }
          onChange(participants);
        }}
      >
        <Flex data-id="000650" align="center" alignItems="self-end" gap="3" mt="0!important" wrap="wrap">
          {selectedParticipants.map((participant) => (
            <ParticipantAvatar data-id="000651" key={participant._id} mr={6} mt={6} user={participant} />
          ))}
          {isUserAllowedToChange && <ParticipantsAddButton data-id="000652" label={label} mr={6} />}
        </Flex>
        {/* Only pass onRemove to ParticipantsDeleteModal */}
        <ParticipantsDeleteModal
          data-id="000653"
          onRemove={(participantId) => {
            justRemovedRef.current = true;
            if (onRemove) onRemove(participantId, selectedParticipants);
          }} />
      </ParticipantsSelector>
    </Stack>
  );
}

export default MultipleParticipantsSelector;
