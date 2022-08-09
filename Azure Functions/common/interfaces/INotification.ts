import { IBase } from "./IBase";

export interface INotification extends IBase {
  emailType: string;
  emailData: {
    [key: string]: string;
  };
  to: string[];
  template?: string;
  status: "pending" | "processing" | "sent" | "failed";
  sentDate?: Date;
  organizationId: string;
}
