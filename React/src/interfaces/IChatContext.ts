import { IUser } from "./IUser";

export interface IChatContext {
  isOpenMessage: boolean;
  handleOpenMessage: () => void;
  handleCloseMessage: () => void;
  participantsLoading: boolean;
  chatParticipants: IUser[];
}
