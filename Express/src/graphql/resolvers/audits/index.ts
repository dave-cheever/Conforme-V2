import audits from './audits.q';
import createAudit from './createAudit.m';
import deleteAudit from './deleteAudit.m';
import submitAudit from './submitAudit.m';
import updateAudit from './updateAudit.m';

const auditsResolvers = {
  Query: {
    audits,
  },
  Mutation: {
    createAudit,
    deleteAudit,
    submitAudit,
    updateAudit,
  },
};

export const auditsTypeDefs = `
  type Audit {
    _id: ID!
    auditTypeId: String!
    walkType: String!
    reference: String!
    status: String!
    dueDate: Date!
    auditType: AuditType!
    siteId: ID
    site: Location
    areaId: ID
    area: BusinessUnit
    auditorId: ID!
    auditor: User!
    participantsIds: [ID]
    participants: [User]
    metatags: Metatags
    questions: [Question]
  }

  input AuditUsersInput {
    auditorsIds: [ID]
    participantsIds: [ID]
  }

  input AuditQueryInput {
    _id: ID
    status: [String]
    auditTypesIds: [ID]
    walkType: [String]
    areasIds: [ID]
    sitesIds: [ID]
    usersIds: AuditUsersInput
  }

  input AuditCreateInput {
    auditTypeId: String!
    walkType: String!
    siteId: ID
    areaId: ID
    auditorId: ID!
    participantsIds: [ID]
  }
  
  input AuditModifyInput {
    _id: ID!
    auditTypeId: String
    auditorId: ID
    participantsIds: [ID]
  }
`;

export const auditsQueryDefs = `
  audits(auditQueryInput: AuditQueryInput): [Audit!]!
`;

export const auditsMutationDefs = `
  createAudit(audit: AuditCreateInput!): Audit!
  deleteAudit(_id: String!): Boolean!
  submitAudit(auditId: ID!): Boolean!
  updateAudit(auditInput: AuditModifyInput!): Audit!
`;

export default auditsResolvers;
