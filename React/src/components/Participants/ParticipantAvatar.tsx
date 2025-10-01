import { CloseIcon } from '@chakra-ui/icons';
import { Avatar, Flex, IconButton, Text } from '@chakra-ui/react';

import { useParticipantsModalContext } from '../../contexts/ParticipantsModalProvider';
import { SwapIcon } from '../../icons';
import { IUser } from '../../interfaces/IUser';

function ParticipantAvatar({
  user,
  ...props
}: {
  user?: IUser;
} & any) {
  const {
    openParticipantsModal,
    openParticipantDeleteModal,
    canDelete,
    isUserAllowedToChange,
    setParticipantToDelete,
  } = useParticipantsModalContext();

  if (!user) {
    return (
      <Flex
        align="center"
        data-id="000590"
        flexDirection="row"
        textAlign="center"
        w="180px"
        {...props}>
        <Avatar
          cursor="pointer"
          data-id="000591"
          h="38px"
          name="Add User"
          onClick={() => isUserAllowedToChange && openParticipantsModal()}
          w="38px" />
        <Text data-id="000592" fontSize="11px" fontWeight="semi_medium" ml="10px">
          Add User
        </Text>
      </Flex>
    );
  }

  const { displayName, imgUrl } = user;

  return (
    <Flex
      align="center"
      border="1px solid #CBD5E0"
      borderRadius="8px"
      data-id="000593"
      justify="space-between"
      padding="10px"
      w="260px"
      {...props}>
      {/* Left side: Avatar + Name */}
      <Flex align="center" columnGap="10px" data-id="000594">
        <Avatar
          borderRadius="4px"
          data-id="000595"
          h="38px"
          name={displayName?.replace(/\s*\(.*?\)\s*/g, '')}
          src={imgUrl}
          w="38px" />

        <Flex align="start" columnGap="10px" data-id="000596" direction="column">
          <Text color="#2D3748" data-id="000597" fontSize="14px" fontWeight="600">
             {displayName}
         </Text>
          <Text color="#718096" data-id="000598" fontSize="12px" fontWeight="500">
            {user?.jobTitle}
          </Text>
        </Flex>

      </Flex>
      {/* Right side: Icon */}
      {isUserAllowedToChange && (
        <IconButton
          aria-label={canDelete ? 'Delete Participant' : 'Replace Participant'}
          data-id="000599"
          icon={
            canDelete ? (
              <CloseIcon boxSize="3" data-id="000600" />
            ) : (
              <SwapIcon data-id="000601" height="18px" width="18px" />
            )
          }
          onClick={() => {
            if (canDelete) {
              setParticipantToDelete(user);
              openParticipantDeleteModal();
            } else 
              openParticipantsModal();
            
          }}
          size="sm"
          variant="ghost" />
      )}
    </Flex>
  );
}

export default ParticipantAvatar;

export const participantAvatarStyles = {
  participantAvatar: {
    overlay: 'linear-gradient(0deg, rgba(232, 60, 67, 0.8), rgba(232, 60, 67, 0.8)), url(.png)',
    icon: '#FFFFFF',
  },
};
