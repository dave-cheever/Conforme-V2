import { useContext } from "react";

import { store, IStore, IState } from "../bootstrap/store";
import { User } from "../models";

export const isPermitted = ({
  user,
  action,
  data = {},
}: {
  user?: User;
  action?: string;
  data?: object;
}): boolean => {
  if (!action) {
    return true;
  }

  if (!user) {
    return false;
  }

  const permission = globalThis.roles[user.getRole()];
  if (!permission) {
    return false;
  }

  const scope = action.split(".")[0];
  const { normal, restricted } = permission;
  if (normal && (normal.includes(action) || normal.includes(scope))) {
    return true;
  }
  if (
    restricted &&
    ((typeof restricted[action] === "function" &&
      restricted[action]({ user, ...data })) ||
      (typeof restricted[scope] === "function" &&
        restricted[scope]({ user, ...data })))
  ) {
    return true;
  }

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
  const { state }: IStore = useContext(store);
  const { user }: IState = state;

  if (isPermitted({ user, action, data })) {
    return yes();
  }

  return no();
};

export default Can;
