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

  type AuditOption {
    type: String!
    name: String!
    value: Any!
  }

  type AuditType {
    _id: ID!
    name: String!
    frequency: String!
    startingDate: Date!
    view: String!
    recurring: Boolean!
    sections: [AuditSection!]!
    questionsCategories: [QuestionsCategory!]!
    options: [AuditOption!]
    businessUnitScope: String
    metatags: Metatags
  }

  input AuditTypeQueryInput {
    _id: ID
  }

  input AuditSectionInput {
    type: String!
    _id: ID
  }

  input AuditOptionInput {
    type: String!
    name: String!
    value: Any!
  }

  input AuditTypeCreateInput {
    name: String!
    frequency: String!
    startingDate: Date!
    recurring: Boolean!
    sections: [AuditSectionInput!]!
    options: [AuditOptionInput!]
    view: String!
    businessUnitScope: String
  }
  
  input AuditTypeModifyInput {
    _id: ID!
    name: String!
    frequency: String!
    startingDate: Date!
    recurring: Boolean!
    sections: [AuditSectionInput!]!
    options: [AuditOptionInput!]
    view: String!
    businessUnitScope: String
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
