import { useAppContext } from '../contexts/AppProvider';
import { IUser } from '../interfaces/IUser';

export const isPermitted = ({
  user,
  action,
  data = {},
  revokedPermissions,
}: {
  user: IUser | null | undefined;
  action?: string;
  data?: object;
  revokedPermissions?: string[];
}): boolean => {
  if (!action) return true;

  if (!user) return false;

  if (!globalThis.roles) return false;
  const permission = globalThis.roles[user.role];
  if (!permission) return false;

  const scope = action.split('.')[0];
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

const Can = ({
  action,
  data = {},
  yes = () => true,
  no = () => false,
}: {
  action?: string;
  data?: object;
  yes?: () => JSX.Element | true;
  no?: () => JSX.Element | false;
}): any => {
  const { user, organizationConfig } = useAppContext();

  // If no action is required, always allow
  if (!action) return yes();

  // If user or roles aren't loaded yet, wait (return yes to prevent redirects during loading)
  // This prevents redirects when refreshing pages before permissions are loaded
  if (!user || !globalThis.roles) {
    // Return yes() to prevent redirects during initial load
    // The permission check will re-run once user/roles are loaded
    return yes();
  }

  if (isPermitted({ user, action, data, revokedPermissions: organizationConfig?.revokedPermissions })) return yes();

  return no();
};

export default Can;
