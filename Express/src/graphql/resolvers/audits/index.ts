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
    name: String!
    walkType: String!
    siteId: ID
    areaId: ID
    answersIds: [ID],
    actionsIds: [ID],
    metatags: Metatags
  }

  input AuditQueryInput {
    _id: ID
  }

  input AuditCreateInput {
    name: String!
    walkType: String!
    siteId: ID
    areaId: ID
    answersIds: [ID],
    actionsIds: [ID],
    participantsIds: [ID!]!
  }
  
  input AuditModifyInput {
    _id: ID!
    name: String!
    walkType: String!
    siteId: ID
    areaId: ID
    answersIds: [ID],
    actionsIds: [ID],
    participantsIds: [ID!]!
  }
`;

export const auditsQueryDefs = `
  audits: [Audit!]!
`;

export const auditsMutationDefs = `
  createAudit(audit: AuditCreateInput!): Audit!
  updateAudit(auditInput: AuditModifyInput!): Audit!
  deleteAudit(_id: String!): Boolean!
`;

export default auditsResolvers;
