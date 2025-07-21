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
  onRemove?: (participantId: string) => void;
}) {
  return (
    <Stack data-id="5c654050a4e1" spacing={2}>
      <ParticipantsSelector
        canDelete
        data-id="28825f446dea"
        defaultSelectedParticipantsIds={selectedParticipants.map(({ _id }) => _id)}
        isUserAllowedToChange={isUserAllowedToChange}
        label={label}
        maxParticipants={maxParticipants}
        onChange={onChange}
      >
        <Flex align="center" alignItems="self-end" data-id="61f22ce9c992" mt="0!important" wrap="wrap">
          {selectedParticipants.map((participant) => (
            <ParticipantAvatar data-id="c5fbdb49310c" key={participant._id} mr={6} mt={6} user={participant} />
          ))}
          {isUserAllowedToChange && <ParticipantsAddButton data-id="b4972ddbd31f" label={label} mr={6} />}
        </Flex>
        {/* Only pass onRemove to ParticipantsDeleteModal */}
        <ParticipantsDeleteModal onRemove={onRemove} />
      </ParticipantsSelector>
    </Stack>
  );
}

export default MultipleParticipantsSelector;
