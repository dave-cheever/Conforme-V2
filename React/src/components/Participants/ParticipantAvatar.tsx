import { useState } from 'react';

import { CloseIcon } from '@chakra-ui/icons';
import { Avatar, Flex, Text } from '@chakra-ui/react';

import { useParticipantsModalContext } from '../../contexts/ParticipantsModalProvider';
import { ReplaceIcon } from '../../icons';
import { IUser } from '../../interfaces/IUser';

function ParticipantAvatar({
  user,
  ...props
}: {
  user: IUser;
} & any) {
  const { openParticipantsModal, openParticipantDeleteModal, canDelete, isUserAllowedToChange, setParticipantToDelete } =
    useParticipantsModalContext();
  const { displayName, imgUrl } = user;
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    (<Flex
      align="center"
      data-id="ad44474d7dff"
      flexDirection="column"
      position="relative"
      textAlign="center"
      w="80px"
      {...props}>
      <Avatar
        cursor="default"
        data-id="df467aefcc88"
        h={['55px', '64px']}
        name={displayName}
        onMouseEnter={() => isUserAllowedToChange && setShowOverlay(true)}
        src={imgUrl}
        w={['55px', '64px']} />
      {isUserAllowedToChange && showOverlay && (
        <Flex
          alignItems="center"
          cursor="pointer"
          data-id="46cc97d8d7c0"
          justifyContent="center"
          onClick={async () => {
            if (canDelete) {
              setParticipantToDelete(user);
              openParticipantDeleteModal();
            } else openParticipantsModal();
            setShowOverlay(false);
          }}
          onMouseLeave={() => setShowOverlay(false)}
          pos="absolute">
          <Flex
            bg="participantAvatar.overlay"
            data-id="fb9c63882f2c"
            h={['55px', '64px']}
            rounded="50%"
            w={['55px', '64px']} />
          {canDelete ? (
            <CloseIcon
              color="participantAvatar.icon"
              data-id="4700dd257b07"
              h="20px"
              opacity="0.95"
              pos="absolute"
              w="20px" />
          ) : (
            <ReplaceIcon
              data-id="6a82356319bf"
              h="20px"
              opacity="0.95"
              pos="absolute"
              stroke="participantAvatar.icon"
              w="20px" />
          )}
        </Flex>
      )}
      <Text data-id="70384b08cf67" fontSize="11px" fontWeight="semi_medium" mt="10px">
        {displayName}
      </Text>
    </Flex>)
  );
}

export default ParticipantAvatar;

export const participantAvatarStyles = {
  participantAvatar: {
    overlay: 'linear-gradient(0deg, rgba(232, 60, 67, 0.8), rgba(232, 60, 67, 0.8)), url(.png)',
    icon: '#FFFFFF',
  },
};
