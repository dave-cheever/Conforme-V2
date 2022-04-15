import audits from './audits.q';
import createAudit from './createAudit.m';
import deleteAudit from './deleteAudit.m';
import updateAudit from './updateAudit.m';

const auditsResolvers = {
  Query: {
    audits,
  },
  Mutation: {
    createAudit,
    deleteAudit,
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
    site: Location!
    area: BusinessUnit
    auditor: User!
    participants: [User]
    siteId: ID!
    areaId: ID
    auditorId: ID!
    participantsIds: [ID]
    metatags: Metatags
  }

  input AuditQueryInput {
    _id: ID
  }

  input AuditCreateInput {
    auditTypeId: String!
    walkType: String!
    siteId: ID!
    areaId: ID
    auditorId: ID!
    participantsIds: [ID]
  }
  
  input AuditModifyInput {
    _id: ID!
    auditTypeId: String!
    walkType: String!
    siteId: ID!
    areaId: ID
    auditorId: ID!
    participantsIds: [ID]
  }
`;

export const auditsQueryDefs = `
  audits(auditQueryInput: AuditQueryInput): [Audit!]!
`;

export const auditsMutationDefs = `
  createAudit(audit: AuditCreateInput!): Audit!
  updateAudit(auditInput: AuditModifyInput!): Audit!
  deleteAudit(_id: String!): Boolean!
`;

export default auditsResolvers;
