import { ConfidentialClientApplication } from "@azure/msal-node";
import axios from "axios";

import IConfig from "../interfaces/IConfig";
import { IEmail } from "../interfaces/IEmail";
import { IOrganization } from "../interfaces/IOrganization";
import Organizations from "./collections/Organizations";

export class GraphService {
  private _config: IConfig;
  private _sender: string;

  public constructor(config: IConfig) {
    this._config = config;
    this._sender = config.EmailSender;
  }

  private async getClient(organizationId: string) {
    if (!organizationId) throw new Error("No organization id");

    const organization = await Organizations.customFindById(organizationId);
    if (!organizationId) throw new Error("Wrong organization config");

    const { clientId, tenantId, secret } = organization;
    
    // Create MSAL confidential client application
    const msalConfig = {
      auth: {
        clientId: clientId || '',
        authority: `https://login.microsoftonline.com/${tenantId || ''}`,
        clientSecret: secret || '',
      }
    };

    const cca = new ConfidentialClientApplication(msalConfig);
    
    // Acquire token for Microsoft Graph
    const tokenRequest = {
      scopes: ['https://graph.microsoft.com/.default']
    };

    try {
      const response = await cca.acquireTokenByClientCredential(tokenRequest);
      if (!response || !response.accessToken) {
        throw new Error('Failed to acquire access token');
      }

      const client = axios.create({
        baseURL: this._config.GraphUrl,
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return client;
    } catch (error) {
      console.error('MSAL token acquisition failed:', error);
      throw new Error('Failed to authenticate with Microsoft Graph');
    }
  }

  // userId can be AAD ID or email
  public async getUserData({
    userId,
    organization,
  }: {
    userId: string;
    organization: IOrganization;
  }) {
    const client = await this.getClient(organization._id);
    const res = await client.get(`users/${userId}`);
    return res.data;
  }

  public async checkMemberGroups({
    userId,
    groups,
    organization,
  }: {
    userId: string;
    groups: { [name: string]: string };
    organization: IOrganization;
  }) {
    try {
      const client = await this.getClient(organization._id);
      const res = await client.post(`/users/${userId}/checkMemberGroups`, {
        groupIds: Object.values(groups),
      });
      return Object.keys(groups).reduce(
        (acc, curr) => ({
          ...acc,
          [curr]: (res.data?.value || []).includes(groups[curr]),
        }),
        {},
      );
    } catch (e) {
      console.log(e);
      return {};
    }
  }

  public async sendEmail(email: IEmail, organizationId: string): Promise<number> {
    try {
      const client = await this.getClient(organizationId);

      const toRecipients = email.to.map((address) => ({
        emailAddress: {
          address,
        },
      }));
      const ccRecipients = (email.cc || []).map((address) => ({
        emailAddress: {
          address,
        },
      }));
      const bccRecipients = (email.bcc || []).map((address) => ({
        emailAddress: {
          address,
        },
      }));

      const options = {
        message: {
          subject: email.subject,
          body: {
            contentType: "HTML",
            content: email.body,
          },
          toRecipients,
          ccRecipients,
          bccRecipients,
        },
      };
      const sent = await client.post(`users/${this._sender}/sendMail`, options);
      return sent.status;
    } catch (error) {
      console.log(error);
      console.log(`Failed to send email to '${email.to.join(", ")}'`);
    }
  }
}
