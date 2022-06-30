import auditLogs from './auditLogs.q';

const auditLogsResolvers = {
  Query: {
    auditLogs,
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

type AuditLog {
  _id: ID!
  records: [AuditLogRecord]!
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
  auditLogs(auditLogsQuery: AuditLogsQuery): [AuditLog!]!
`;

export const auditLogsMutationDefs = `
`;

export default auditLogsResolvers;
