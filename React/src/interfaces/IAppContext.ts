import { Dispatch, SetStateAction } from "react";
import { IOrganization } from "./IOrganization";

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
  
  user: IUser | null | undefined;
  setUser: Dispatch<SetStateAction<IUser | null | undefined>>;

}
