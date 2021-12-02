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
  "home.view",
  "help.view",
  "terms.view",
  "contact.view",
  "items.view",
  "categories.view",
  "regulatoryBodies.view",
  "settings.view",
  "businessUnits.view",
];

const roles = {
  user: {
    normal: [...defaultPermissions],
    restricted: {
      "auditLogs.view": ({ user, response, businessUnitOwnerId }) =>
        user && (response?.delegateIds?.includes(user.id) || businessUnitOwnerId === user.id),
      "responses.view": ({ user, response, businessUnitOwnerId }) =>
        user && (response?.delegateIds?.includes(user.id) || businessUnitOwnerId === user.id),
      "responses.edit": ({ user, response, businessUnitOwnerId }) =>
        user && (response?.delegateIds?.includes(user.id) || businessUnitOwnerId === user.id),
    },
  },

  reader: {
    normal: [
      ...defaultPermissions,
      "items.view",
      "responses.viewAll",
      "insights",
      "auditLogs.view",
      "responses.view",
      "users.searchInAAD",
    ],
    restricted: {
      "responses.edit": ({ user, response, businessUnitOwnerId }) =>
        user && (response?.delegateIds?.includes(user.id) || businessUnitOwnerId === user.id),
    },
  },

  admin: {
    normal: [
      ...defaultPermissions,
      "auditLogs",
      "businessUnits",
      "categories",
      "comments",
      "complianceItems",
      "insights",
      "items",
      "responses",
      "regulatoryBodies",
      "settings",
      "users",
      "adminPanel" //permission to see admin items in menu
    ],
  },
};

export default roles;
