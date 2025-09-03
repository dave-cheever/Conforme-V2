import { useEffect, useRef } from 'react';

import { Text } from '@chakra-ui/react';

import ParticipantsModalProvider, { useParticipantsModalContext } from '../../contexts/ParticipantsModalProvider';
import { IUser } from '../../interfaces/IUser';
import ParticipantsDeleteModal from './ParticipantsDeleteModal';
import ParticipantsModal from './ParticipantsModal';

function ParticipantsSelector({
  children,
  label,
  maxParticipants,
  canDelete = false,
  isUserAllowedToChange = false,
  defaultSelectedParticipantsIds = [],
  onChange,
}: {
  children: HTMLElement;
  label?: string;
  maxParticipants?: number;
  canDelete: boolean;
  isUserAllowedToChange: boolean;
  defaultSelectedParticipantsIds: string[];
  onChange: (participants: IUser[]) => void;
}) {
  const {
    setDefaultSelectedParticipantsIds,
    selectedParticipants,
    isParticipantsModalOpen,
    isParticipantDeleteModalOpen,
    setMaxParticipants,
    setCanDelete,
    setIsUserAllowedToChange,
    setLabel,
  } = useParticipantsModalContext();

  /**
   * Effect used to set configuration values of participants picker
   */
  useEffect(() => {
    if (maxParticipants) setMaxParticipants(maxParticipants);
    if (label) setLabel(label);
    setCanDelete(canDelete);
    setIsUserAllowedToChange(isUserAllowedToChange);
    setDefaultSelectedParticipantsIds(defaultSelectedParticipantsIds);
  }, [maxParticipants, canDelete, isUserAllowedToChange, JSON.stringify(defaultSelectedParticipantsIds), label]);

  /**
   * Effect used to trigger onChange function when modal is closed
   * If effect was triggered that means isParticipantsModalOpen or isParticipantDeleteModalOpen was updated.
   * If both are false - it was closed
   * didMountRef avoid onChange run on component load
   */
  const didMountRef = useRef(false);
  useEffect(() => {
    const participantsHasChanged =
      defaultSelectedParticipantsIds.sort().join('-') !==
      selectedParticipants
        .map(({ _id }) => _id)
        .sort()
        .join('-');
    if (didMountRef.current && !isParticipantsModalOpen && !isParticipantDeleteModalOpen && participantsHasChanged)
      onChange(selectedParticipants);
    didMountRef.current = true;
  }, [isParticipantsModalOpen, isParticipantDeleteModalOpen]);

  return (
    <>
      <ParticipantsModal data-id="030925-5934ed" />
      <ParticipantsDeleteModal data-id="030925-ec033a" />
      {label && (
        <Text data-id="030925-a59343" fontSize="smm" fontWeight="semibold">
          {label}
        </Text>
      )}
      {children}
    </>
  );
}

function ParticipantsSelectorWithContext(props) {
  return (
    <ParticipantsModalProvider data-id="030925-78c1c5">
      <ParticipantsSelector data-id="030925-34b1df" {...props} />
    </ParticipantsModalProvider>
  );
}

export default ParticipantsSelectorWithContext;
