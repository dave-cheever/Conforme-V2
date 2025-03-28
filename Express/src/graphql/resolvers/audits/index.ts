import auditAnswersCount from './auditAnswersCount.q';
import audits from './audits.q';
import createAudit from './createAudit.m';
import deleteAudit from './deleteAudit.m';
import submitAudit from './submitAudit.m';
import updateAudit from './updateAudit.m';

const auditsResolvers = {
  Query: {
    audits,
    auditAnswersCount,
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
    walkType: String
    reference: String!
    status: String!
    dueDate: Date!
    completedDate: Date
    auditType: AuditType!
    locationId: ID
    location: Location
    businessUnitId: ID
    businessUnit: BusinessUnit
    auditorId: ID!
    auditor: User!
    participantsIds: [ID]
    participants: [User]
    metatags: Metatags
    questions: [Question]
    numberOfActions: Int
    recurring: Boolean!
    scope: Scope!
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
    businessUnitsIds: [ID]
    locationsIds: [ID]
    usersIds: AuditUsersInput
    createdDate: [String]
    dueDate: [String]
    showArchived: Boolean
  }

  input AuditCreateInput {
    auditTypeId: String!
    walkType: String
    locationId: ID
    businessUnitId: ID
    auditorId: ID!
    participantsIds: [ID]
    recurring: Boolean!
    scope: ScopeInput!
  }
  
  input AuditModifyInput {
    _id: ID!
    auditTypeId: String
    auditorId: ID
    participantsIds: [ID]
    recurring: Boolean
  }
`;

export const auditsQueryDefs = `
  audits(auditQueryInput: AuditQueryInput): [Audit!]!
  auditAnswersCount (auditId: ID!): Int!
`;

export const auditsMutationDefs = `
  createAudit(audit: AuditCreateInput!): Audit!
  deleteAudit(_id: String!): Boolean!
  submitAudit(auditId: ID!): Boolean!
  updateAudit(auditInput: AuditModifyInput!): Audit!
`;

export default auditsResolvers;
