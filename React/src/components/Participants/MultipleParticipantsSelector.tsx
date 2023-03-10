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
  <Stack data-id="5c654050a4e1" spacing={6}>
    <ParticipantsSelector
      canDelete
      data-id="28825f446dea"
      defaultSelectedParticipantsIds={selectedParticipants.map(({ _id }) => _id)}
      isUserAllowedToChange={isUserAllowedToChange}
      label={label}
      maxParticipants={maxParticipants}
      onChange={onChange}>
      <Flex align="top" data-id="61f22ce9c992" mt="0!important" wrap="wrap">
        {selectedParticipants.map((participant) => (
          <ParticipantAvatar
            data-id="c5fbdb49310c"
            key={participant._id}
            mr={6}
            mt={6}
            user={participant} />
        ))}
        {isUserAllowedToChange && <ParticipantsAddButton data-id="b4972ddbd31f" mr={6} mt={6} />}
      </Flex>
    </ParticipantsSelector>
  </Stack>
);

export default MultipleParticipantsSelector;
