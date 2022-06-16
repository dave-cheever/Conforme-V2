import { graph } from '@pnp/graph-commonjs';
import { AdalFetchClient } from '@pnp/nodejs-commonjs';
import axios from 'axios';

import IConfig from '../interfaces/IConfig';
import { IOrganization } from '../interfaces/IOrganization';
import Organizations from './collections/Organizations';
import { getEmailSubject, getEmailTemplate } from './notifications';

export class GraphService {
  private _config: IConfig;
  private _adalClient: AdalFetchClient;

  public constructor(config: IConfig) {
    this._config = config;

    this._adalClient = new AdalFetchClient(
      config.GraphTenantId || '',
      config.GraphAppId || '',
      config.GraphSecret || ''
    );

    graph.setup({
      graph: {
        fetchClientFactory: () => this._adalClient
      }
    });
  }

  private async getClient() {
    const token = await this._adalClient.acquireToken();
    const client = axios.create({
      baseURL: this._config.GraphUrl,
      headers: {
        Authorization: `${token.tokenType} ${token.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return client;
  }

  private static async graphSetup(organizationId: string) {
    if (!organizationId) throw new Error('No organization id');

    const organization = await Organizations.customFindById(organizationId);
    if (!organizationId) throw new Error('Wrong organization config');

    const { clientId, tenantId, secret } = organization;
    graph.setup({
      graph: {
        fetchClientFactory: () => new AdalFetchClient(tenantId || '', clientId || '', secret || '')
      }
    });
  }

  // userId can be AAD ID or email
  public static async getUserData({
    userId,
    organization
  }: {
    userId: string;
    organization: IOrganization;
  }) {
    await this.graphSetup(organization._id);
    const userData = await graph.users.getById(userId)();
    // const userGroups = await graph.users.getById(userId).memberOf();
    return {
      ...userData
      // groups: userGroups.map(({ id, displayName }) => ({ id, displayName })) // TODO: fix me
    };
  }

  public static async checkMemberGroups({
    userId,
    groups,
    organization
  }: {
    userId: string;
    groups: { [name: string]: string };
    organization: IOrganization;
  }) {
    await this.graphSetup(organization._id);
    const res = await graph.users.getById(userId).checkMemberGroups(Object.values(groups));
    return Object.keys(groups).reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: res.includes(groups[curr])
      }),
      {}
    );
  }

  public async sendEmail({
    from,
    emailType,
    emailData,
    to,
    organization
  }: {
    from: string;
    emailType: string;
    emailData: any;
    to: string[];
    organization: IOrganization;
  }) {
    try {
      const client = await this.getClient();

      const toRecipients = to.map(address => ({
        emailAddress: {
          address
        }
      }));

      const options = {
        message: {
          subject: getEmailSubject(emailType, emailData),
          body: {
            contentType: 'HTML',
            content: await getEmailTemplate({
              emailType,
              emailData,
              organization
            })
          },
          toRecipients
        }
      };
      const sent = await client.post(`users/${from}/sendMail`, options);
      return sent.status === 202;
    } catch (error) {
      console.log(error.response.data);
      console.log(`Failed to send '${emailType}' email to '${to.join(', ')}'`);
    }
  }

  public async sendDirectEmail({
    from,
    to,
    subject,
    body
  }: {
    from: string;
    to: string[];
    subject: string;
    body: string;
  }) {
    try {
      const client = await this.getClient();

      const toRecipients = to.map(address => ({
        emailAddress: {
          address
        }
      }));

      const options = {
        message: {
          subject,
          body: {
            contentType: 'HTML',
            content: body
          },
          toRecipients
        }
      };
      const sent = await client.post(`users/${from}/sendMail`, options);
      return sent.status === 202;
    } catch (error) {
      console.log(error);
      console.log(`Failed to send email to '${to.join(', ')}'`);
    }
  }
}
