import { IBase } from "./IBase";

export interface IAudit extends IBase {
  auditTypeId: string;
  walkType: "physical" | "virtual";
  siteId?: string;
  areaId?: string;
  auditorId: string;
  participantsIds: string[];
  organizationId: string;
}
