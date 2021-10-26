// 
// This is permissions system created by Cielo Costa
//
// Every role has two type of permissions - normal and restricted
//
// Normal permissions
// These permissions doesn't require additional check.
//
// Resctricted permissions
// These permissions require additional check, depending on passed data.
// You have to write a simple JavaScript function to check for values in a way you want.
// First parameter in restricted permission function is always "user" object.
// Next parameters you can define on restricted permission function definition.
//

const defaultPermissions = [
  'home.view',
  'help.view',
  'terms.view',
  'contact.view',
  'items.view',
  'areas.view',
  'categories.view',
  'regulatoryBodies.view',
  'settings.view',
  'businessUnits.view',
];

const roles = {
  user: {
    normal: [
      ...defaultPermissions,
    ],
    restricted: {
      'auditLogs.view': ({ user, response }) => user && (response?.delegateIds?.includes(user.id) || response.owner?.id === user.id),
      'responses.view': ({ user, response }) => user && (response?.delegateIds?.includes(user.id) || response.owner?.id === user.id),
      'responses.edit': ({ user, response }) => user && (response?.delegateIds?.includes(user.id) || response.owner?.id === user.id),
    },
  },

  reader: {
    normal: [
      ...defaultPermissions,
      'items.view',
      'responses.viewAll',
      'insights',
      'auditLogs.view',
      'responses.view',
      'users.searchInAAD',
    ],
    restricted: {
      'responses.edit': ({ user, response }) => user && (response?.delegateIds?.includes(user.id) || response.owner?.id === user.id),
    },
  },

  admin: {
    normal: [
      ...defaultPermissions,
      'insights',
      'settings',
      'items',
      'responses',
      'businessUnits',
      'users',
      'complianceItems',
      'auditLogs.view',
    ],
  },
};

export default roles;
