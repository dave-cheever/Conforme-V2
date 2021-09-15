import { IBase } from "./IBase";

export interface IBusinessUnitAddress {
  lineOne: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
}

export interface IBusinessUnitPerson {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
}

export interface IBusinessUnit extends IBase {
  identifier: string;
  name: string;
  type: string;
  imgUrl?: string;
  region?: string;
  communications: {
    type: string;
    value: string;
  }[],
  address: IBusinessUnitAddress;
  ed: IBusinessUnitPerson;
  rd: IBusinessUnitPerson;
  responsesCount?: number;
  totalResponses?: number; // Injected number of total responses for business unit
  overdueResponses?: number; // Injected number of overdue responses for business unit
}
