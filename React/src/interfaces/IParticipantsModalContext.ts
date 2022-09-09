import { IUser } from './IUser';

export interface IParticipantsModalContext {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  data: any;
  loading: boolean;
  usersList: IUser[];

  isParticipantsModalOpen: boolean;
  openParticipantsModal: () => void;
  closeParticipantsModal: () => void;
  isParticipantDeleteModalOpen: boolean;
  openParticipantDeleteModal: () => void;
  closeParticipantDeleteModal: () => void;

  isParticipantSelected: (userId: string) => boolean;
  selectParticipant: (participant: IUser) => void;

  defaultSelectedParticipantsIds: string[];
  setDefaultSelectedParticipantsIds: (ids: string[]) => void;
  selectedParticipants: IUser[];
  setSelectedParticipants: (value: IUser[]) => void;
  participantToDelete: IUser | undefined;
  setParticipantToDelete: (value: IUser | undefined) => void;

  label: string;
  setLabel: (value: string) => void;
  maxParticipants: number | undefined;
  setMaxParticipants: (value: number) => void;
  canDelete: boolean;
  setCanDelete: (value: boolean) => void;
  isUserAllowedToChange: boolean;
  setIsUserAllowedToChange: (value: boolean) => void;
}
