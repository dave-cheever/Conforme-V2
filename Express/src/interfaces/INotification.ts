import { IBase } from "./IBase";

export interface INotification extends IBase {
  emailType: number;
  emailData: {
    [key: string]: string;
  };
  to: string[];
  status: "pending" | "processing" | "sent" | "failed";
  sentDate?: Date;
  organizationId: string;
}
