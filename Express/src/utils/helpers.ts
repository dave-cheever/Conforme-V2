import { StatusCodes } from 'http-status-codes';
import moment, { Moment } from 'moment';
import { difference } from 'lodash';

import { IOrganization, IUser } from 'app-interfaces';
import roles from './roles';
import { Users } from 'app-models';

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

export const sessionizeOrganization = ({ _id, name, domain, logoUrl, bgImageUrl,bgImageTabletUrl, theme, licenceExpirationDate,
  addons, clientId, tenantId, secret, spSiteUrl, spLibraryId, accessGroupId, adminsGroupId, readersGroupId }: Partial<IOrganization>) => {
  return {
    _id,
    name,
    logoUrl,
    bgImageUrl,
    bgImageTabletUrl,
    theme,
    licenceExpirationDate,
    addons,
    domain,
    clientId,
    tenantId,
    secret,
    spSiteUrl,
    spLibraryId,
    accessGroupId,
    adminsGroupId,
    readersGroupId
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
  await Users.updateOne({_id:user._id}, {...user, lastLogin: Date.now()});

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

export const removeDatabaseFields = item => {
  const cleanItem = { ...item };
  delete cleanItem.id;
  delete cleanItem.metatags;
  delete cleanItem._rid;
  delete cleanItem._self;
  delete cleanItem._etag;
  delete cleanItem._attachments;
  delete cleanItem._ts;
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
      label: moment(oldValue).format('D MMM YYYY'),
    };
  }
  if (newValue) {
    value['new'] = {
      value: newValue,
      label: moment(newValue).format('D MMM YYYY'),
    };
  }
  return value;
};

export const getAuditValueForBoolean = (oldValue?: string, newValue?: string) => {
  let value = {};
  if (oldValue) {
    value['old'] = {
      value: oldValue,
      label: oldValue ? 'Yes' : 'No',
    };
  }
  if (newValue) {
    value['new'] = {
      value: newValue,
      label: newValue ? 'Yes' : 'No',
    };
  }
  return value;
};

export const getAuditValueForLookup = async ({ collection, labelField, oldValue, newValue }) => {
  let value = {};
  if (oldValue) {
    const item = await collection.getById(oldValue);

    if (item) {
      // If a 'labelField' is an array of strings, concat them
      let label;
      if (typeof labelField === 'string') {
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
    const item = await collection.getById(newValue);

    if (item) {
      // If a 'labelField' is an array of strings, concat them
      let label;
      if (typeof labelField === 'string') {
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

export const getUTCDate = (date?: Date): Moment => {
  const momentDate = moment(date);
  const dateUTC = moment()
    .utc()
    .year(momentDate.year())
    .month(momentDate.month())
    .date(momentDate.date())
    .startOf('day');
  return dateUTC;
};

export const getNextDueDate = (frequency: String, dueDate: Date) => {

  let nextDueDate;

  switch (frequency) {
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
