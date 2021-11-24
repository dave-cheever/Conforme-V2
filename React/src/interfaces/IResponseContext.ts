import { Dispatch, SetStateAction } from "react";

import { IResponse } from "./IResponse";

export interface IResponseContext {
  response: IResponse | undefined,
  loading: boolean,
  refetch: () => void;

  isShareOpen: boolean,
  handleShareOpen: () => void,
  handleShareClose: () => void,

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
