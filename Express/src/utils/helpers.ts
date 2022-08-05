import { addDays, addMonths, addWeeks, addYears, differenceInDays, format, subDays, subMonths, subWeeks, subYears } from 'date-fns';
import { diff } from 'deep-object-diff';
import { StatusCodes } from 'http-status-codes';
import { difference } from 'lodash';

import { IAction, IAuditValues, IOrganization, IUser } from 'app-interfaces';
import { Users } from 'app-models';

import roles from './roles';

export const getProtocol = () => (process.env.APPSETTING_NODE_ENV === 'dev' ? 'http://' : 'https://');

export const getClientUrl = (req): string => req.headers.referer?.slice(0, -1);

export const getDomain = (req): string => getClientUrl(req)?.replace(getProtocol(), '');

export const CORSConfig = {
  credentials: true,
  origin: (origin, callback) => {
    if (process.env.APPSETTING_NODE_ENV === 'dev' && origin === 'https://studio.apollographql.com') return callback(null, true);

    const whitelist = [...(process.env.ALLOWED_DOMAINS || '').split(';'), 'login.microsoftonline.com'];
    if (!origin || origin === 'null' || whitelist.indexOf(origin.replace(getProtocol(), '')) !== -1) return callback(null, true);

    callback(new Error(`${origin} is not allowed by CORS`));
  },
};

export const sessionizeUser = async ({
  _id,
  firstName,
  lastName,
  displayName,
  email,
  jobTitle,
  role,
  managerId,
  defaultPage,
  organizationsIds,
  imgUrl,
}: IUser) => ({
  _id,
  firstName,
  lastName,
  displayName,
  email,
  jobTitle,
  role,
  managerId,
  defaultPage,
  organizationsIds,
  imgUrl,
});

export const sessionizeOrganization = ({
  _id,
  name,
  domain,
  logoUrl,
  bgImageUrl,
  bgImageTabletUrl,
  theme,
  modules,
  revokedPermissions,
  spSiteUrl,
  spLibraryId,
  accessGroupId,
  adminsGroupId,
  readersGroupId,
}: Partial<IOrganization>) => ({
  _id,
  name,
  logoUrl,
  bgImageUrl,
  bgImageTabletUrl,
  // emailAddress,
  theme,
  // licenceExpirationDate,
  modules,
  revokedPermissions,
  domain,
  // clientId,
  // tenantId,
  // secret,
  spSiteUrl,
  spLibraryId,
  accessGroupId,
  adminsGroupId,
  readersGroupId,
});

export const isPermitted = ({
  user,
  action,
  data = {},
  revokedPermissions,
}: {
  user: IUser;
  action?: string;
  data?: any;
  revokedPermissions?: string[];
}): boolean => {
  if (!action) return true;

  if (!user || !user.role) return false;

  const permission = roles[user.role];
  if (!permission) return false;

  const [scope] = action.split('.');
  const { normal, restricted } = permission;
  if (normal && (normal.includes(action) || normal.includes(scope))) return true;

  if (
    restricted &&
    ((typeof restricted[action] === 'function' && restricted[action]({ revokedPermissions, permission: action, user, ...data })) ||
      (typeof restricted[scope] === 'function' && restricted[scope]({ revokedPermissions, permission: action, user, ...data })))
  )
    return true;

  return false;
};

export const isSignedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(StatusCodes.FORBIDDEN).json({
      code: 'noAuth',
      message: 'User not authorized',
      redirect: req.headers.referer,
    });
  }
  return next();
};

export const isRoutePermitted = (req, res, next, action, data?) => {
  const { user } = req;
  if (!req.isAuthenticated()) {
    return res.status(StatusCodes.FORBIDDEN).json({
      code: 'noAuth',
      message: 'User not authorized',
      redirect: req.headers.referer,
    });
  }

  if (!isPermitted({ user, action, data }))
    return res.status(StatusCodes.FORBIDDEN).json({ code: 'notPermitted', message: 'User is not permitted' });

  next();
};

export const redirectAfterLogin = async (req, res, errorMessage, organization) => {
  let redirectUrl;
  const { user } = req;
  const clientUrl = `${getProtocol()}${organization.domain}`;

  const params = req.headers.referer?.split('?')[1];
  if (params) {
    const [paramName, paramValue] = params.split('=');
    if (paramName === 'redirect' && paramValue.indexOf(clientUrl) === 0) redirectUrl = paramValue;
  }
  redirectUrl = `${clientUrl}${user?.defaultPage || ''}`;

  if (errorMessage) redirectUrl += `/login?errorMessage=${errorMessage}`;

  // update the last Login of user
  if (user) await Users.updateOne({ _id: user._id }, { ...user, lastLogin: Date.now() });

  return res.redirect(redirectUrl);
};

export const getUserName = (fullName: string) => {
  const names = fullName.split(' ');
  const firstName = names.slice(0, names.length - 1).join(' ');
  const lastName = names[names.length - 1];
  return {
    firstName,
    lastName,
  };
};

export const genMetatags = (action: 'added' | 'updated' | 'removed', userId: string) => ({
  [`${action}By`]: userId,
  [`${action}At`]: new Date(),
});

// This method is used to check if specified path exist in GraphQL query
// It is used to know if specific field was selected to be returned
export const doesPathExist = (nodes, path) => {
  if (!nodes) return false;

  const node = nodes.find((x) => x.name.value === path[0]);
  if (!node) return false;

  if (path.length === 1) return true;

  return doesPathExist(node.selectionSet.selections, path.slice(1));
};

// This method is used to build a MongoDB pipeline to join a collection item
export const join = ({ pipeline, collection, from, to }: { pipeline; collection: string; from: string; to: string }) => {
  pipeline.push(
    {
      $lookup: {
        from: collection,
        localField: from,
        foreignField: '_id',
        as: to,
      },
    },
    {
      $unwind: {
        path: `$${to}`,
        preserveNullAndEmptyArrays: true,
      },
    },
  );
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
  const node = nodes.find((node) => methodName === node.name.value);
  const project = {};
  const { selections } = node.selectionSet;
  for (const selection of selections) {
    if (selection.name.value === '__typename') continue;

    if (selection.selectionSet) project[selection.name.value] = getProjectFields([selection], selection.name.value);
    else project[selection.name.value] = 1;
  }
  return project;
};

export const mentionParser = (markup) => {
  const array = markup.split('@@@');
  const mentions: Array<string> = [];
  for (const arr of array) {
    const id = arr.substring(arr.lastIndexOf('[') + 1, arr.lastIndexOf(']'));
    if (id !== '') mentions.push(id);
  }
  // make unique by id
  return [...new Set(mentions)];
};

export const getNextRenewalDate = (nextRenewalDate: Date, frequency: string) => {
  let newNextRenewalDate;

  switch (frequency) {
    case 'Daily':
      newNextRenewalDate = addDays(nextRenewalDate, 1);
      break;

    case 'Weekly':
      newNextRenewalDate = addWeeks(nextRenewalDate, 1);
      break;

    case 'Monthly':
      newNextRenewalDate = addMonths(nextRenewalDate, 1);
      break;

    case 'Quarterly':
      newNextRenewalDate = addMonths(nextRenewalDate, 3);
      break;

    case '6 months':
      newNextRenewalDate = addMonths(nextRenewalDate, 6);
      break;

    case 'Annual':
      newNextRenewalDate = addYears(nextRenewalDate, 1);
      break;

    case '2 years':
      newNextRenewalDate = addYears(nextRenewalDate, 2);
      break;

    case '3 years':
      newNextRenewalDate = addYears(nextRenewalDate, 3);
      break;

    case '5 years':
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
    case 'Daily':
      newNextRenewalDate = subDays(nextRenewalDate, 1);
      break;

    case 'Weekly':
      newNextRenewalDate = subWeeks(nextRenewalDate, 1);
      break;

    case 'Monthly':
      newNextRenewalDate = subMonths(nextRenewalDate, 1);
      break;

    case 'Quarterly':
      newNextRenewalDate = subMonths(nextRenewalDate, 3);
      break;

    case '6 months':
      newNextRenewalDate = subMonths(nextRenewalDate, 6);
      break;

    case 'Annual':
      newNextRenewalDate = subYears(nextRenewalDate, 1);
      break;

    case '2 years':
      newNextRenewalDate = subYears(nextRenewalDate, 2);
      break;

    case '5 years':
      newNextRenewalDate = subYears(nextRenewalDate, 5);
      break;

    default:
      newNextRenewalDate = null;
      break;
  }
  return newNextRenewalDate;
};

// Audit log methods

export const getBasicElement = ({ _id, name }: { _id: string; name: string }) => ({ _id, name });
export const getForeignElement = ({ _id, name }: { _id: string; name: string }, self_id: string) => ({ _id, name, self_id });

export const removeDatabaseFields = (item) => {
  const cleanItem = { ...item };
  delete cleanItem._id;
  delete cleanItem.organizationId;
  delete cleanItem.metatags;
  delete cleanItem.__v;
  return cleanItem;
};

// This method works for strings and numbers
export const getAuditValueForString = (oldValue?: string, newValue?: string) => {
  const value: any = {};
  if (oldValue) {
    value.old = {
      value: oldValue,
      label: oldValue,
    };
  }
  if (newValue) {
    value.new = {
      value: newValue,
      label: newValue,
    };
  }
  return value;
};

export const getAuditValueForStringsArray = (oldValue?: string[], newValue?: string[]) => {
  const value: any = {};
  const removed = difference(oldValue || [], newValue || []);
  if (removed.length > 0) {
    value.old = {
      value: removed,
      label: removed.join(', '),
    };
  }
  const added = difference(newValue || [], oldValue || []);
  if (added.length > 0) {
    value.new = {
      value: added,
      label: added.join(', '),
    };
  }
  return value;
};

export const getAuditValueForDate = (oldValue?: string, newValue?: string) => {
  const value: any = {};
  if (oldValue) {
    value.old = {
      value: oldValue,
      label: format(new Date(oldValue), 'dd MMMM yyyy'),
    };
  }
  if (newValue) {
    value.new = {
      value: newValue,
      label: format(new Date(newValue), 'dd MMMM yyyy'),
    };
  }
  return value;
};

export const getAuditValueForBoolean = (oldValue?: string, newValue?: string) => {
  const value: any = {};
  if (oldValue !== undefined) {
    value.old = {
      value: oldValue,
      label: oldValue ? 'Yes' : 'No',
    };
  }
  if (newValue !== undefined) {
    value.new = {
      value: newValue,
      label: newValue ? 'Yes' : 'No',
    };
  }
  return value;
};

export const getAuditValueForLookup = async ({ collection, labelField, oldValue, newValue }) => {
  const value: any = {};

  if (collection === Users) {
    console.log('getAuditValueForLookup: For Users collection please use method getAuditValueForUser.');
    return;
  }

  if (oldValue) {
    const item = await collection.customFindById(oldValue);

    if (item) {
      let label;
      if (typeof labelField === 'string') {
        // If a 'labelField' is an array of strings, concat them
        label = item[labelField];
      } else label = labelField.map((field) => item[field]).join(' ');

      value.old = {
        value: oldValue,
        label,
      };
    }
  }
  if (newValue) {
    const item = await collection.customFindById(newValue);

    if (item) {
      let label;
      if (typeof labelField === 'string') {
        // If a 'labelField' is an array of strings, concat them
        label = item[labelField];
      } else label = labelField.map((field) => item[field]).join(' ');

      value.new = {
        value: newValue,
        label,
      };
    }
  }
  return value;
};

export const getAuditValueForLookupsArray = async ({ collection, labelField, oldValue, newValue }) => {
  const value: any = {};
  const removedIds: string[] = difference(oldValue || [], newValue || []);
  const addedIds: string[] = difference(newValue || [], oldValue || []);

  if (collection === Users) {
    console.log('getAuditValueForLookupsArray: For Users collection please use method getAuditValueForUsersArray.');
    return;
  }

  if (removedIds.length > 0) {
    const items = await collection.find({ _id: { $in: removedIds } });

    // If a 'labelField' is an array of strings, concat them
    let labels = [];
    if (typeof labelField === 'string') labels = items.map((item) => item[labelField]);
    else labels = items.map((item) => labelField.map((field) => item[field]).join(' '));

    value.old = {
      value: items.map(({ id }) => id),
      label: labels.join(', '),
    };
  }
  if (addedIds.length > 0) {
    const items = await collection.find({ _id: { $in: addedIds } });

    // If a 'labelField' is an array of strings, concat them
    let labels = [];
    if (typeof labelField === 'string') labels = items.map((item) => item[labelField]);
    else labels = items.map((item) => labelField.map((field) => item[field]).join(' '));

    value.new = {
      value: items.map(({ id }) => id),
      label: labels.join(', '),
    };
  }
  return value;
};

export const getActionStatus = (action: IAction) => {
  if (!action) return;

  const { dueDate, status } = action;

  if (!dueDate) return status === 'closed' ? 'completed' : 'inProgress';

  const daysToDueDate = dueDate ? differenceInDays(new Date(dueDate), new Date(action.metatags.addedAt)) : 0;

  if (status === 'closed' && (!daysToDueDate || daysToDueDate >= 0)) return 'completed';

  if (status !== 'closed' && (!daysToDueDate || daysToDueDate >= 0)) return 'inProgress';

  return 'overdue';
};

export const getAuditValueForUser = async ({ oldValue, newValue, organization }) => {
  const value: any = {};
  if (oldValue) {
    const item = await Users.customFindByIdWithDetails({
      userId: oldValue,
      organization,
    });
    if (item) {
      value.old = {
        value: oldValue,
        label: item.displayName,
      };
    }
  }
  if (newValue) {
    const item = await Users.customFindByIdWithDetails({
      userId: newValue,
      organization,
    });
    if (item) {
      value.new = {
        value: newValue,
        label: item.displayName,
      };
    }
  }
  return value;
};

export const getAuditValueForUsersArray = async ({ oldValue, newValue, organization }) => {
  const value: any = {};
  const removedIds: string[] = difference(oldValue || [], newValue || []);
  const addedIds: string[] = difference(newValue || [], oldValue || []);

  if (removedIds.length > 0) {
    const items = await Promise.all(
      removedIds.map(async (id) => {
        const item = await Users.customFindByIdWithDetails({
          userId: id,
          organization,
        });
        if (!item) {
          return {
            id,
            label: 'User not found',
          };
        }
        return {
          id,
          label: item.displayName,
        };
      }),
    );

    value.old = {
      value: items.map(({ id }) => id),
      label: items.map(({ label }) => label).join(', '),
    };
  }

  if (addedIds.length > 0) {
    const items = await Promise.all(
      addedIds.map(async (id) => {
        const item = await Users.customFindByIdWithDetails({
          userId: id,
          organization,
        });
        if (!item) {
          return {
            id,
            label: 'User not found',
          };
        }
        return {
          id,
          label: item.displayName,
        };
      }),
    );

    value.new = {
      value: items.map(({ id }) => id),
      label: items.map(({ label }) => label).join(', '),
    };
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
