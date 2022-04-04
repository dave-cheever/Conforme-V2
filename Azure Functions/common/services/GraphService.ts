import { graph } from '@pnp/graph-commonjs';
import { AdalFetchClient } from '@pnp/nodejs-commonjs';
import axios from "axios";

import IConfig from '../interfaces/IConfig';
import { IOrganization } from '../interfaces/IOrganization';
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
        fetchClientFactory: () => this._adalClient,
      },
    });
  }

  private async getClient() {
    const token = await this._adalClient.acquireToken();
    const client = axios.create({
      baseURL: this._config.GraphUrl,
      headers: {
        Authorization: `${token.tokenType} ${token.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return client;
  }

  public async sendEmail({
    from,
    emailType,
    emailData,
    to,
    organization,
  }: {
    from: string;
    emailType: number,
    emailData: any,
    to: string[],
    organization: IOrganization,
  }
  ) {
    try {
      const client = await this.getClient();

      const toRecipients = to.map(address => ({
        emailAddress: {
          address,
        }
      }));

      const options = {
        message: {
          subject: getEmailSubject(emailType, emailData),
          body: {
            contentType: 'HTML',
            content: await getEmailTemplate(emailType, emailData, organization),
          },
          toRecipients,
        }
      };
      const sent = await client.post(`users/${from}/sendMail`, options);
      return sent.status === 202;
    } catch (error) {
      console.log(error);
      console.log(`Failed to send '${emailType}' email to '${to.join(', ')}'`);
    }
  }
}
