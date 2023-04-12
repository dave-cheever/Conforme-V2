import { IBase } from "./IBase";
import { IScope } from "./IScope";

export interface INotification extends IBase {
  emailType: string;
  emailData: {
    [key: string]: string;
  };
  to: string[];
  status: 'pending' | 'processing' | 'sent' | 'failed';
  sentDate?: Date;
  error?: string;
  organizationId: string;
  scope: IScope;
}
