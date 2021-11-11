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
  displayName: string;
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
  type: string;
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
  responsesCount?: number;
}
