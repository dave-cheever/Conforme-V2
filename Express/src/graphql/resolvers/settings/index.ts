import generateThumbnail from './generateThumbnail.m';
import roles from './roles.q';
import settings from './settings.q';
import updateSetting from './updateSetting.m';

const settingsResolvers = {
  Query: {
    roles,
    settings,
  },
  Mutation: {
    updateSetting,
    generateThumbnail
  },
};

export const settingsTypeDefs = `
  type SettingsGet {
    _id: ID!
    name: String!
    value: Any!
    label: String!
    type: String!
    description: String!
    options: [String]
    organizationId: String!
    placeholder: String
    inputType: String
    help: String
  }

  input SettingsUpdate {
    _id: ID!
    name: String!
    value: Any!
  }

  input ThumbnailCreate {
    _id: ID!
    html: Any!
  }
`;

export const settingsQueryDefs = `
  settings(type: String): [SettingsGet!]!
  roles: String!
`;

export const settingsMutationDefs = `
  updateSetting(settingsUpdate: SettingsUpdate!): SettingsGet!
  generateThumbnail(thumbnailCreate: ThumbnailCreate!): Boolean!
`;

export default settingsResolvers;
