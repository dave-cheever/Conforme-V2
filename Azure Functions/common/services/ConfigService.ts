import * as mongoose from "mongoose";
import IConfig from "../interfaces/IConfig";
import { IOrganization } from "../interfaces/IOrganization";
import Organizations from "./collections/Organizations";

export class ConfigService {
  private _config: IConfig;
  private _organization: IOrganization;

  public async getConfig(
    organizationId: string = process.env.CONFORME_ORGANIZATION_ID
  ): Promise<IConfig> {
    this._config = {
      Environment: process.env.ENV,
      DebugMode: process.env.DEBUG == "true" ? true : false,
      GraphScope: process.env.MS_GRAPH_SCOPE,
      GraphUrl: process.env.MS_GRAPH_URL,
      GraphTokenEndpoint: process.env.TOKEN_ENDPOINT,
      MongoConnectionString: process.env.MONGO_CONNECTION_STRING,
      EmailSender: process.env.EMAIL_SENDER,
      StorageConnectionString: process.env.AzureWebJobsStorage,
    };

    // 0 = disconnected
    // 1 = connected
    if (mongoose.connection.readyState === 1) {
      const organization = await Organizations.customFindById(
        organizationId,
        organizationId
      );
      this._organization = organization;
      this._config = {
        ...this._config,
        GraphTenantId: organization.tenantId,
        GraphAppId: organization.clientId,
        GraphSecret: organization.secret,
      };
    }

    // Set up environment specific configuration
    switch (this._config.Environment.toLowerCase()) {
      case "dev":
        break;
      case "sit":
        break;
      case "sat":
        break;
      default:
        break;
    }
    return this._config;
  }

  public getOrganization(): IOrganization {
    return this._organization;
  }
}
