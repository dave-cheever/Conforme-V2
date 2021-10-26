import { IBase } from "app-interfaces";

export interface IOrganization extends IBase {
  name: string;
  domain: string;
  licenceExpirationDate: Date;
  logoUrl: string;
  theme: object;
  addons: object;
  allowedTenantsIds: string[]; // 'all' for all tenants
  accessGroupId?: string; // ID of Azure AD group if required to login
  readersGroupId?: string; // ID of Azure AD group of users with role "reader"
  adminsGroupId?: string; // ID of Azure AD group of users with role "admin"
  spSiteUrl: string; // SharePoint site url
  spLibraryId: string; // SharePoint library url for storing the documents
  emailAddress: string; // Email address used to send emails
  emailPassword: string; // Email password used to send emails
  tenantId: string; // Tenant ID of Azure App
  clientId: string; // Client ID of Azure App
  secret: string; // Secret of Azure App
}
