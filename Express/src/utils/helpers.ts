import { StatusCodes } from 'http-status-codes';
import moment, { Moment } from 'moment';
import { difference } from 'lodash';
import { addMonths, addDays, addWeeks, addYears, format, subMonths, subDays, subWeeks, subYears } from 'date-fns';
import { diff } from 'deep-object-diff';

import { IAuditValues, IOrganization, IUser } from 'app-interfaces';
import roles from './roles';
import { Users } from 'app-models';
import { GraphService } from 'app-services';

export const CORSConfig = {
  credentials: true,
  origin: (origin, callback) => {
    if (process.env.APPSETTING_NODE_ENV === 'dev' && origin === 'https://studio.apollographql.com') {
      return callback(null, true);
    }

    const whitelist = [
      ...(process.env.ALLOWED_DOMAINS || '').split(';'),
      'login.microsoftonline.com',
    ];
    if (!origin || origin === 'null' || whitelist.indexOf(origin.replace(getProtocol(), '')) !== -1) {
      return callback(null, true);
    }

    callback(new Error(`${origin} is not allowed by CORS`));
  },
};

export const getProtocol = () => {
  return process.env.APPSETTING_NODE_ENV === 'dev' ? 'http://' : 'https://';
};

export const getClientUrl = (req): string => {
  return req.headers.referer?.slice(0, -1);
}

export const getDomain = (req): string => {
  return getClientUrl(req)?.replace(getProtocol(), '');
}

export const sessionizeUser = async ({ _id, firstName, lastName, displayName, email, jobTitle, role, defaultPage, organizationsIds, imgUrl }: IUser) => {
  return {
    _id,
    firstName,
    lastName,
    displayName,
    email,
    jobTitle,
    role,
    defaultPage,
    organizationsIds,
    imgUrl
  };
};

export const sessionizeOrganization = ({ _id, name, domain, logoUrl, emailAddress, bgImageUrl, bgImageTabletUrl, theme, licenceExpirationDate,
  addons, clientId, tenantId, secret, spSiteUrl, spLibraryId, accessGroupId, adminsGroupId, readersGroupId }: Partial<IOrganization>) => {
  return {
    _id,
    name,
    logoUrl,
    bgImageUrl,
    bgImageTabletUrl,
    // emailAddress,
    theme,
    // licenceExpirationDate,
    addons,
    domain,
    // clientId,
    // tenantId,
    // secret,
    // spSiteUrl,
    // spLibraryId,
    accessGroupId,
    adminsGroupId,
    readersGroupId,
  }
}

export const isPermitted = ({ user, action, data = {} }: { user: IUser, action?: string, data?: any }): boolean => {
  if (!action) {
    return true;
  }

  if (!user || !user.role) {
    return false;
  }
  const permission = roles[user.role];
  if (!permission) {
    return false;
  }

  const scope = action.split('.')[0];
  const { normal, restricted } = permission;
  if (normal && (normal.includes(action) || normal.includes(scope))) {
    return true;
  }
  if (restricted &&
    (
      (typeof restricted[action] === 'function' && restricted[action]({ user, ...data })) ||
      (typeof restricted[scope] === 'function' && restricted[scope]({ user, ...data }))
    )
  ) {
    return true;
  }

  return false;
};

export const isSignedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(StatusCodes.FORBIDDEN).json({ code: 'noAuth', message: 'User not authorized', redirect: req.headers.referer });
  }
  return next();
};

export const isRoutePermitted = (req, res, next, action, data?) => {
  const { user } = req;
  if (!req.isAuthenticated()) {
    return res.status(StatusCodes.FORBIDDEN).json({ code: 'noAuth', message: 'User not authorized', redirect: req.headers.referer });
  }

  if (!isPermitted({ user, action, data })) {
    return res.status(StatusCodes.FORBIDDEN).json({ code: 'notPermitted', message: 'User is not permitted' });
  }

  next();
};

export const redirectAfterLogin = async (req, res, errorMessage, organization) => {
  let redirectUrl;
  const { user } = req;
  const clientUrl = `${getProtocol()}${organization.domain}`;

  const params = req.headers.referer?.split('?')[1];
  if (params) {
    const [paramName, paramValue] = params.split('=');
    if (paramName === 'redirect' && paramValue.indexOf(clientUrl) === 0) {
      redirectUrl = paramValue;
    }
  }
  redirectUrl = `${clientUrl}${user?.defaultPage || ''}`;

  if (errorMessage) {
    redirectUrl += `/login?errorMessage=${errorMessage}`;
  }

  //update the last Login of user
  if (user) {
    await Users.updateOne({ _id: user._id }, { ...user, lastLogin: Date.now() });
  }
  return res.redirect(redirectUrl);
};

export const getUserName = (fullName: string) => {
  const names = fullName.split(' ');
  const firstName = names.slice(0, names.length - 1).join(' ');
  const lastName = names[names.length - 1];
  return {
    firstName,
    lastName
  };
};

export const getNextDueDate = (frequency: String, dueDate: Date) => {
  let nextDueDate;
  switch (frequency) {
    case "Daily":
      nextDueDate = moment(dueDate).add(1, 'day');
      break;

    case "Weekly":
      nextDueDate = moment(dueDate).add(1, 'week');
      break;

    case "Monthly":
      nextDueDate = moment(dueDate).add(1, 'month');
      break;

    case "Quarterly":
      nextDueDate = moment(dueDate).add(3, 'months');
      break;

    case "6 Months":
      nextDueDate = moment(dueDate).add(6, 'months');
      break;

    case "Annual":
      nextDueDate = moment(dueDate).add(1, 'year');
      break;

    case "2 years":
      nextDueDate = moment(dueDate).add(2, 'years');
      break;

    case "5 years":
      nextDueDate = moment(dueDate).add(5, 'years');
      break;

    default:
      nextDueDate = null;
      break;
  }
  return nextDueDate;
};

export const getStatus = (frequency: String) => {
  let status = "";
  switch (frequency) {
    case "Daily":
      status = "notStarted";
      break;

    case "Weekly":
      status = "notStarted";
      break;

    case "Monthly":
      status = "notStarted";
      break;

    case "Quarterly":
      status = "notStarted";
      break;

    case "6 Months":
      status = "notStarted";
      break;

    case "Annual":
      status = "notStarted";
      break;

    case "2 years":
      status = "notStarted";
      break;

    case "5 years":
      status = "notStarted";
      break;

    case "Ad-hoc":
      status = "completed";
      break;

    case "Variable":
      status = "completed";
      break;

    default:
      status = "";
      break;
  }
  return status;
};

export const genMetatags = (action: 'added' | 'updated' | 'removed', userId: string) => {
  return {
    [`${action}By`]: userId,
    [`${action}At`]: new Date(),
  };
};

// This method is used to check if specified path exist in GraphQL query
// It is used to know if specific field was selected to be returned
export const doesPathExist = (nodes, path) => {
  if (!nodes) {
    return false;
  }

  const node = nodes.find(x => x.name.value === path[0]);
  if (!node) {
    return false;
  }

  if (path.length === 1) {
    return true;
  }
  return doesPathExist(node.selectionSet.selections, path.slice(1));
};

// This method is used to build a MongoDB pipeline to join a collection item
export const join = ({ pipeline, collection, from, to }: { pipeline, collection: string; from: string; to: string }) => {
  pipeline.push({
    $lookup: {
      from: collection,
      localField: from,
      foreignField: '_id',
      as: to,
    },
  }, {
    $unwind: {
      path: `$${to}`,
      preserveNullAndEmptyArrays: true,
    },
  });
};

// 
// This method is used to generate $project object for MongoDB aggregation
// It selects only fields and objects selected in GraphQL query
// It generates an object like
// {
//   _id: 1,
//   name: 1
// }
//
export const getProjectFields = (nodes: any, methodName: string) => {
  const node = nodes.find(node => methodName === node.name.value);
  const project = {};
  const selections = node.selectionSet.selections;
  for (const selection of selections) {
    if (selection.name.value === '__typename') {
      continue;
    }
    if (selection.selectionSet) {
      project[selection.name.value] = getProjectFields([selection], selection.name.value);
    } else {
      project[selection.name.value] = 1;
    }
  }
  return project;
};

export const mentionParser = (markup) => {
  let array = markup.split("@@@");
  let mentions: Array<string> = [];
  for (const arr of array) {
    const id = arr.substring(
      arr.lastIndexOf("[") + 1,
      arr.lastIndexOf("]"));
    if (id !== "") {
      mentions.push(id);
    }
  }
  //make unique by id
  return [...new Set(mentions)];
};

export const getNextRenewalDate = (nextRenewalDate: Date, frequency: string) => {
  let newNextRenewalDate;

  switch (frequency) {
    case "Daily":
      newNextRenewalDate = addDays(nextRenewalDate, 1);
      break;

    case "Weekly":
      newNextRenewalDate = addWeeks(nextRenewalDate, 1);
      break;

    case "Monthly":
      newNextRenewalDate = addMonths(nextRenewalDate, 1);
      break;

    case "Quarterly":
      newNextRenewalDate = addMonths(nextRenewalDate, 3);
      break;

    case "6 months":
      newNextRenewalDate = addMonths(nextRenewalDate, 6);
      break;

    case "Annual":
      newNextRenewalDate = addYears(nextRenewalDate, 1);
      break;

    case "2 years":
      newNextRenewalDate = addYears(nextRenewalDate, 2);
      break;

    case "5 years":
      newNextRenewalDate = addYears(nextRenewalDate, 5);
      break;

    default:
      newNextRenewalDate = null;
      break;
  }
  return newNextRenewalDate;
};

export const getPrevRenewalDate = (nextRenewalDate: Date, frequency: string) => {
  let newNextRenewalDate;
  switch (frequency) {
    case "Daily":
      newNextRenewalDate = subDays(nextRenewalDate, 1);
      break;

    case "Weekly":
      newNextRenewalDate = subWeeks(nextRenewalDate, 1);
      break;

    case "Monthly":
      newNextRenewalDate = subMonths(nextRenewalDate, 1);
      break;

    case "Quarterly":
      newNextRenewalDate = subMonths(nextRenewalDate, 3);
      break;

    case "6 months":
      newNextRenewalDate = subMonths(nextRenewalDate, 6);
      break;

    case "Annual":
      newNextRenewalDate = subYears(nextRenewalDate, 1);
      break;

    case "2 years":
      newNextRenewalDate = subYears(nextRenewalDate, 2);
      break;

    case "5 years":
      newNextRenewalDate = subYears(nextRenewalDate, 5);
      break;

    default:
      newNextRenewalDate = null;
      break;
  }
  return newNextRenewalDate;
};

// Audit log methods

export const getBasicElement = ({ _id, name }: { _id: string, name: string }) => ({ _id, name });
export const getForeignElement = ({ _id, name }: { _id: string, name: string }, self_id: string) => ({ _id, name, self_id });

export const removeDatabaseFields = item => {
  const cleanItem = { ...item };
  delete cleanItem._id;
  delete cleanItem.organizationId;
  delete cleanItem.metatags;
  delete cleanItem.__v;
  return cleanItem;
};

// This method works for strings and numbers
export const getAuditValueForString = (oldValue?: string, newValue?: string) => {
  let value = {};
  if (oldValue) {
    value['old'] = {
      value: oldValue,
      label: oldValue,
    };
  }
  if (newValue) {
    value['new'] = {
      value: newValue,
      label: newValue,
    };
  }
  return value;
};

export const getAuditValueForStringsArray = (oldValue?: string[], newValue?: string[]) => {
  let value = {};
  const removed = difference(oldValue || [], newValue || []);
  if (removed.length > 0) {
    value['old'] = {
      value: removed,
      label: removed.join(', '),
    };
  }
  const added = difference(newValue || [], oldValue || []);
  if (added.length > 0) {
    value['new'] = {
      value: added,
      label: added.join(', '),
    };
  }
  return value;
};

export const getAuditValueForDate = (oldValue?: string, newValue?: string) => {
  let value = {};
  if (oldValue) {
    value['old'] = {
      value: oldValue,
      label: format(new Date(oldValue), 'dd MMMM yyyy'),
    };
  }
  if (newValue) {
    value['new'] = {
      value: newValue,
      label: format(new Date(newValue), 'dd MMMM yyyy'),
    };
  }
  return value;
};

export const getAuditValueForBoolean = (oldValue?: string, newValue?: string) => {
  let value = {};
  if (oldValue !== undefined) {
    value['old'] = {
      value: oldValue,
      label: oldValue ? 'Yes' : 'No',
    };
  }
  if (newValue !== undefined) {
    value['new'] = {
      value: newValue,
      label: newValue ? 'Yes' : 'No',
    };
  }
  return value;
};

export const getAuditValueForLookup = async ({ collection, labelField, oldValue, newValue, organization }) => {
  let value = {};
  if (oldValue) {
    let item;
    if (collection === Users) {
      item = await GraphService.getUserData({ userId: oldValue, organization });
    } else {
      item = await collection.customFindById(oldValue);
    }

    if (item) {
      let label;
      if (collection === Users) {
        // If a collection is Users, get his name
        label = item.givenName !== null || item.surname !== null ? `${item.givenName} ${item.surname}` : item.displayName;
      } else if (typeof labelField === 'string') {
        // If a 'labelField' is an array of strings, concat them
        label = item[labelField];
      } else {
        label = labelField.map(field => item[field]).join(' ');
      }

      value['old'] = {
        value: oldValue,
        label,
      };
    }
  }
  if (newValue) {
    let item;
    if (collection === Users) {
      item = await GraphService.getUserData({ userId: newValue, organization });
    } else {
      item = await collection.customFindById(newValue);
    }

    if (item) {
      let label;
      if (collection === Users) {
        // If a collection is Users, get his name
        label = item.givenName !== null || item.surname !== null ? `${item.givenName} ${item.surname}` : item.displayName;
      } else if (typeof labelField === 'string') {
        // If a 'labelField' is an array of strings, concat them
        label = item[labelField];
      } else {
        label = labelField.map(field => item[field]).join(' ');
      }

      value['new'] = {
        value: newValue,
        label,
      };
    }
  }
  return value;
};

export const getAuditValueForLookupsArray = async ({ collection, labelField, oldValue, newValue, organization }) => {
  let value = {};
  const removedIds = difference(oldValue || [], newValue || []);
  const addedIds = difference(newValue || [], oldValue || []);


  let user;
  if (collection === Users && (removedIds.length !== 0 && typeof removedIds[0] === 'string')) {
    user = await GraphService.getUserData({ userId: removedIds[0], organization });
  } else if (collection === Users && (addedIds.length === 1 && typeof addedIds[0] === 'string')) {
    user = await GraphService.getUserData({ userId: addedIds[0], organization });
  }

  let users: any[] = [];
  if (collection === Users && (addedIds.length > 1)) {
    for (const addedId of addedIds) {
      let data = await GraphService.getUserData({ userId: addedId, organization });
      users.push(data);
    }
  }

  if (removedIds.length > 0 && collection !== Users) {
    const items = await collection.find({ _id: { $in: removedIds } });

    // If a 'labelField' is an array of strings, concat them
    let labels = [];
    if (typeof labelField === 'string') {
      labels = items.map(item => item[labelField]);
    } else {
      labels = items.map(item => labelField.map(field => item[field]).join(' '));
    }

    value['old'] = {
      value: items.map(({ id }) => id),
      label: labels.join(', '),
    };
  } else if (removedIds.length > 0 && collection === Users) {
    value['old'] = {
      value: user.id,
      label: user.givenName !== null || user.surname !== null ? `${user.givenName} ${user.surname}` : user.displayName,
    };
  }
  if (addedIds.length > 0 && collection !== Users) {
    const items = await collection.find({ _id: { $in: addedIds } });

    // If a 'labelField' is an array of strings, concat them
    let labels = [];
    if (typeof labelField === 'string') {
      labels = items.map(item => item[labelField]);
    } else {
      labels = items.map(item => labelField.map(field => item[field]).join(' '));
    }

    value['new'] = {
      value: items.map(({ id }) => id),
      label: labels.join(', '),
    };
  } else if (addedIds.length > 1 && collection === Users) {
    value['new'] = {
      value: users.map(({ id }) => id),
      label: users.map((user) => user.givenName !== null || user.surname !== null ? `${user.givenName} ${user.surname}` : user.displayName).join(', '),
    };

  } else if (addedIds.length > 0 && collection === Users) {
    value['new'] = {
      value: user.id,
      label: user.givenName !== null || user.surname !== null ? `${user.givenName} ${user.surname}` : user.displayName,
    };
  }
  return value;
};

export const getAuditValueForUser = async ({ oldValue, newValue, organization }) => {
  let value = {};
  if (oldValue) {
    const item = await Users.customFindByIdWithDetails({ userId: oldValue, organization });
    if (item) {
      value['old'] = {
        value: oldValue,
        label: `${item.firstName} ${item.lastName}`,
      };
    }
  }
  if (newValue) {
    const item = await Users.customFindByIdWithDetails({ userId: newValue, organization });
    if (item) {
      value['new'] = {
        value: newValue,
        label: `${item.firstName} ${item.lastName}`,
      };
    }
  }
  return value;
};

export const getAuditRecordValues = async ({ oldValues = {}, newValues = {} }): Promise<IAuditValues> => {
  // It takes all the differencies between old and new object
  const differencies = diff(oldValues, newValues);
  const fields = Object.keys(differencies);

  // and fills the audit record obejct with these differencies
  const auditRecordValues = fields.reduce((acc, field) => {
    if ((oldValues[field] && typeof oldValues[field] !== 'string') || (newValues[field] && typeof newValues[field] !== 'string')) {
      console.warn(`Audit log method defaultGetAuditRecordValues works only on strings, please create custom method for ${field} field!`);
      return acc;
    }

    return {
      ...acc,
      [field]: getAuditValueForString(oldValues[field], newValues[field]),
    };
  }, {});

  return auditRecordValues;
};
