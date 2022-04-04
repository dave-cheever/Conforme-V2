export default interface IConfig {
    "Environment": string;
    "DebugMode": boolean;
    "GraphUrl": string;
    "GraphTokenEndpoint": string;
    "GraphScope": string;
    "GraphTenantId"?: string;
    "GraphAppId"?: string;
    "GraphSecret"?: string;
    "MongoConnectionString": string;
    "EmailSender": string;
}