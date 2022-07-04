import auditLog from './auditLogs.q';

const auditLogsResolvers = {
  Query: {
    auditLog,
  },
  Mutation: {},
};

export const auditLogsTypeDefs = `
type AuditLogElement {
  _id: String!
  name: String!
  self_id: String!
}

type AuditLogRecord {
  _id: ID!
  action: String!
  element: AuditLogElement!
  coll: String!
  values: Any
  metatags: Metatags!
}

type AuditLogsData {
  _id: ID!
  totalAuditLogs: Int
  records: [AuditLogRecord]!
}

type AuditLog {
  _id: ID!
  totalAuditLogs: Int
  auditLogs: [AuditLogsData!]!
}

input AuditLogsQuery {
  skip: Int
  limit: Int
  actions: [String]
  dateLimit: Date
  elementId: String
  userId: String
  moduleId: String
  fields: [String]
}
`;

export const auditLogsQueryDefs = `
  auditLog(auditLogsQuery: AuditLogsQuery): AuditLog!
`;

export const auditLogsMutationDefs = `
`;

export default auditLogsResolvers;
