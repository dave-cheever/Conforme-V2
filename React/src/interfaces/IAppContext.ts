import { Dispatch, SetStateAction } from "react";
import IFilters from "./IFilters";
import { IOrganization } from "./IOrganization";

import { IResponse } from "./IResponse";
import { IRoles } from "./IRoles";
import { ISetting } from "./ISetting";
import { IUser } from "./IUser";

export interface IAppContext {
  roles?: IRoles;
  setRoles: Dispatch<SetStateAction<IRoles | undefined>>;

  settings: ISetting[];
  setSettings: Dispatch<SetStateAction<ISetting[]>>;

  organizationConfig?: IOrganization;
  setOrganizationConfig: Dispatch<SetStateAction<IOrganization | undefined>>;
  
  // mentionsCount: number;
  // filters: IFilters;

  user: IUser | null | undefined;
  setUser: Dispatch<SetStateAction<IUser | null | undefined>>;
  
  // adminModalState: AdminModalState;
  // setAdminModalState: Dispatch<SetStateAction<AdminModalState>>,
  
  // response: IResponse | undefined,
  // setResponse: Dispatch<SetStateAction<IResponse | undefined>>,

  // isShareOpen: boolean,
  // handleShareOpen: () => void,
  // handleShareClose: () => void,

  // isConfirmationOpen: boolean,
  // handleConfirmationOpen: () => void,
  // handleConfirmationClose: () => void,

  // isRenewalOpen: boolean,
  // handleRenewalOpen: () => void,
  // handleRenewalClose: () => void,

  // isDueDateOpen: boolean,
  // handleDueDateOpen: () => void,
  // handleDueDateClose: () => void,
}
