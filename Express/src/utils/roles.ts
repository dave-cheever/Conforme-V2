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

const ifRACHasAccess = ({ user, response }) =>
  user && (response?.contributorsIds?.includes(user._id) || response?.accountableId === user._id || response?.responsibleId === user._id);

const ifRACFHasAccess = ({ user, response }) =>
  user && (
    response?.contributorsIds?.includes(user._id) ||
    response?.followersIds?.includes(user._id) ||
    response?.accountableId === user._id ||
    response?.responsibleId === user._id);

const ifRAHasAccess = ({ user, response }) =>
  user && (response?.accountableId === user._id || response?.responsibleId === user._id);

const defaultPermissions = [
  "home.view",
  "help.view",
  "terms.view",
  "contact.view",
  "items.view",
  "actions.view",
  "categories.view",
  "locations.view",
  "regulatoryBodies.view",
  "settings.view",
  "businessUnits.view",
  "complianceItems.view"
];

const roles = {
  user: {
    normal: [...defaultPermissions],
    restricted: {
      "auditLogs.view": ifRACHasAccess,
      "responses.view": ifRACHasAccess,
      "responses.edit": ifRACHasAccess,
      "responses.manageResponsible": ({ user, response }) =>
        user && response?.accountableId === user._id,
      "responses.manageContributor": ifRAHasAccess,
      "comments.add": ifRACFHasAccess,
      "comments.delete": ({ user, comment }) => user._id === comment.authorId,
      "responses.manageMultipleFollowers": ifRAHasAccess,
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
      "responses.manageFollower"
    ],
    restricted: {
      "responses.edit": ifRACHasAccess,
      "responses.manageResponsible": ({ user, response }) =>
        user && response?.accountableId === user._id,
      "responses.manageContributor": ifRAHasAccess,
      "comments.add": ifRACFHasAccess,
      "comments.delete": ({ user, comment }) => user._id === comment.authorId,
      "responses.manageMultipleFollowers": ifRAHasAccess,
    },
  },

  admin: {
    normal: [
      ...defaultPermissions,
      "adminPanel", //permission to see admin items in menu
      "auditLogs",
      "auditTypes",
      "businessUnits",
      "categories",
      "comments.add",
      "complianceItems",
      "insights",
      "items",
      "locations",
      "questions",
      "questionsCategories",
      "responses",
      "regulatoryBodies",
      "settings",
      "users",
    ],
    restricted: {
      "comments.delete": ({ user, comment }) => user._id === comment.authorId,
    }
  },
};

export default roles;
