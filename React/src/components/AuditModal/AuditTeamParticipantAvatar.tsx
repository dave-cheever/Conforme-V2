import { useState } from 'react';

import { Avatar, Flex, Text } from '@chakra-ui/react';

import { ReplaceIcon } from '../../icons';
import { IAudit } from '../../interfaces/IAudit';
import { IUser } from '../../interfaces/IUser';

type AuditTeamParticipantAvatarProps = {
  audit?: IAudit;
  participant: IUser;
  setParticipantsModalOpen: any;
};

const AuditTeamParticipantAvatar = ({ audit, participant, setParticipantsModalOpen }: AuditTeamParticipantAvatarProps) => {
  const [showDelete, setShowDelete] = useState(false);
  return (
    <Flex align="center" direction="column" fontSize={['14px', '24px']} position="relative" textAlign="center" w="64px">
      <Avatar
        cursor={audit?.status === 'upcoming' ? 'pointer' : 'default'}
        name={participant.displayName}
        onMouseOver={() => setShowDelete(true)}
        rounded="full"
        size="lg"
        src={participant.imgUrl}
      />
      {showDelete ? (
        <Flex
          alignItems="center"
          cursor="pointer"
          justifyContent="center"
          onClick={async () => {
            if (audit?.status === 'upcoming' || !audit) setParticipantsModalOpen(true);
            setShowDelete(false);
          }}
          pos="absolute"
        >
          <Flex bg="avatarUser.overlay" h="64px" onMouseOut={() => setShowDelete(false)} rounded="50%" w="64px" />
          <ReplaceIcon h="20px" onMouseOver={() => setShowDelete(true)} opacity="0.95" pos="absolute" stroke="avatarUser.icon" w="20px" />
        </Flex>
      ) : (
        <></>
      )}
      <Text fontSize="ssm" fontWeight="semi_medium" mt="10px">
        {participant.firstName || participant.lastName ? `${participant.firstName} ${participant.lastName}` : participant.displayName}
      </Text>
    </Flex>
  );
};

export default AuditTeamParticipantAvatar;
