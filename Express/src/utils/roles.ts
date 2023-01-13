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

import {
  ifHasActionAccess,
  ifHasAnswerAccess,
  ifHasAuditAccess,
  ifHasQuestionAccess,
  ifHasQuestionEditAccess,
  ifRACFHasAccess,
  ifRACHasAccess,
  ifRAHasAccess,
} from './permissions-checkers';

const defaultPermissions = [
  'home.view',
  'help.view',
  'terms.view',
  'contact.view',
  'items.view',
  'actions.view',
  'questions.view',
  'categories.view',
  'locations.view',
  'regulatoryBodies.view',
  'settings.view',
  'businessUnits.view',
  'trackerItems.view',
  'audits.add',
];

const roles = {
  user: {
    normal: [...defaultPermissions],
    restricted: {
      'auditLogs.view': ifRACHasAccess,
      'responses.view': ifRACHasAccess,
      'responses.edit': ifRACHasAccess,
      'responses.manageResponsible': ({ user, response }) => user && response?.accountableId === user._id,
      'responses.manageContributors': ifRAHasAccess,
      'comments.add': ifRACFHasAccess,
      'auditComments.add': ifHasAuditAccess,
      'comments.delete': ({ user, comment }) => user._id === comment.authorId,
      'responses.manageFollowers': ifRAHasAccess,
      'actions.add': ifHasActionAccess,
      'actions.edit': ifHasActionAccess,
      'actions.delete': ifHasActionAccess,
      'answers.add': ifHasAnswerAccess,
      'answers.edit': ifHasAnswerAccess,
      'audits.edit': ifHasAuditAccess,
      'questions.add': ifHasQuestionAccess,
      'questions.edit': ifHasQuestionEditAccess,
      'questions.delete': ifHasQuestionEditAccess,
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
      'responses.manageFollower',
      'audits.viewAll',
      'actions.viewAll',
      'questions.viewAll',
    ],
    restricted: {
      'responses.edit': ifRACHasAccess,
      'responses.manageResponsible': ({ user, response }) => user && response?.accountableId === user._id,
      'responses.manageContributors': ifRAHasAccess,
      'comments.add': ifRACFHasAccess,
      'auditComments.add': ifHasAuditAccess,
      'comments.delete': ({ user, comment }) => user._id === comment.authorId,
      'responses.manageFollowers': ifRAHasAccess,
      'actions.add': ifHasActionAccess,
      'actions.edit': ifHasActionAccess,
      'answers.add': ifHasAnswerAccess,
      'answers.edit': ifHasAnswerAccess,
      'audits.edit': ifHasAuditAccess,
      'questions.add': ifHasQuestionAccess,
      'questions.edit': ifHasQuestionEditAccess,
      'questions.delete': ifHasQuestionEditAccess,
    },
  },

  admin: {
    normal: [
      ...defaultPermissions,
      'actions',
      'answers.add',
      'answers.edit',
      'answers.editStatus',
      'answers.viewAll',
      'auditLogs',
      'audits.changeRecurring',
      'audits.delete',
      'audits.viewAll',
      'audits.viewDeleted',
      'auditTypes',
      'businessUnits',
      'categories',
      'comments.add',
      'trackerItems',
      'insights',
      'items',
      'locations',
      'questions',
      'questionsCategories',
      'responses',
      'regulatoryBodies',
      'settings',
      'users',
      'auditComments.add',
    ],
    restricted: {
      'audits.changeAuditor': ({ audit }) => audit.status !== 'completed',
      'audits.edit': ({ audit }) => audit.status !== 'completed',
      'comments.delete': ({ user, comment }) => user._id === comment.authorId,
      'answers.delete': ({ audit }) => audit.status !== 'completed',
      adminPanel: ({ permission, revokedPermissions }) => {
        if (revokedPermissions?.includes(permission)) return false;
        return true;
      },
    },
  },
};

export default roles;
