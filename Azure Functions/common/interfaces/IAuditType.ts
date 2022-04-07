import { IAuditSection } from "./IAuditSection";
import { IBase } from "./IBase";
import { TFrequency } from "./TFrequency";

export interface IAuditType extends IBase {
  name: string;
  frequency: TFrequency;
  sections: IAuditSection[];
  view: "categorized" | "singlePage";
  organizationId: String;
}
