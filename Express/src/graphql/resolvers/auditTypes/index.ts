import auditTypes from './auditTypes.q';
import createAuditType from './createAuditType.m';
import deleteAuditType from './deleteAuditType.m';
import updateAuditType from './updateAuditType.m';

const auditTypesResolvers = {
  Query: {
    auditTypes,
  },
  Mutation: {
    createAuditType,
    deleteAuditType,
    updateAuditType,
  },
};

export const auditTypesTypeDefs = `
  type AuditSection {
    type: String!
    _id: ID
  }

  type AuditType {
    _id: ID!
    name: String!
    frequency: String!
    view: String!
    sections: [AuditSection!]!
    metatags: Metatags
  }

  input AuditTypeQueryInput {
    _id: ID
  }

  input AuditSectionInput {
    type: String!
    _id: ID
  }

  input AuditTypeCreateInput {
    name: String!
    frequency: String!
    sections: [AuditSectionInput!]!
    view: String!
  }
  
  input AuditTypeModifyInput {
    _id: ID!
    name: String!
    frequency: String!
    sections: [AuditSectionInput!]!
    view: String!
  }
`;

export const auditTypesQueryDefs = `
  auditTypes: [AuditType!]!
`;

export const auditTypesMutationDefs = `
  createAuditType(auditType: AuditTypeCreateInput!): AuditType!
  updateAuditType(auditTypeInput: AuditTypeModifyInput!): AuditType!
  deleteAuditType(_id: String!): Boolean!
`;

export default auditTypesResolvers;
