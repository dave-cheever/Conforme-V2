import JSONfn from 'json-fn';

import { roles as definedRoles } from 'app-utils';

const roles = async () => {
  try {
    return JSONfn.stringify(definedRoles);
  } catch (err: any) {
    throw new Error(err);
  }
};

export default roles;
