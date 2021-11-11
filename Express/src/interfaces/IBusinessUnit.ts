import { IBase } from "app-interfaces";

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
  email: string;
  id: string;
}

export interface IBusinessUnitIdentifier {
  system: string;
  value: string;
}

export interface IBusinessUnit extends IBase {
  identifier: string;
  name: string;
  type: 'Hospital' | 'Corporate';
  region: string;
  identifiers?: IBusinessUnitIdentifier[];
  imgUrl?: string;
  communications: {
    type: string;
    value: string;
  }[],
  address: IBusinessUnitAddress;
  ed: IBusinessUnitPerson;
  rd: IBusinessUnitPerson;
  totalResponses?: number; // Injected number of total responses for business unit
  overdueResponses?: number; // Injected number of overdue responses for business unit
}
