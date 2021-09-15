import { Dispatch, SetStateAction } from "react";

import { IResponse } from "./IResponse";

export interface IResponseContext {
  loading: boolean,
  setLoading: Dispatch<SetStateAction<boolean>>,

  response: IResponse | undefined,
  setResponse: Dispatch<SetStateAction<IResponse | undefined>>,

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
