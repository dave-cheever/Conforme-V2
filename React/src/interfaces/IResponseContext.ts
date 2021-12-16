import { Dispatch, SetStateAction } from "react";

import { IResponse } from "./IResponse";
import { IUser } from "./IUser";

export interface IResponseContext {
  response: IResponse,
  users: IUser[],
  loading: boolean,
  refetch: () => void;

  isShareOpen: boolean,
  handleShareOpen: () => void,
  handleShareClose: () => void,

  getUpdatedDisplayName: (userId:string) => string,
  getParticipantDetailById: (userId:string) => IUser

  isConfirmationOpen: boolean,
  handleConfirmationOpen: () => void,
  handleConfirmationClose: () => void,

  isRenewalOpen: boolean,
  handleRenewalOpen: () => void,
  handleRenewalClose: () => void,

  isDueDateOpen: boolean,
  handleDueDateOpen: () => void,
  handleDueDateClose: () => void,
}
