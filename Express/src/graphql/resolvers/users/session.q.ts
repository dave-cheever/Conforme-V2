import { Users } from "app-models";
import { add } from "date-fns";

const session = async (_, __, { req, authorize }) => {
  try {
    const user = await authorize();
    const sessionExpiration = add(new Date(), { minutes: Number(process.env.SESS_LIFETIME_IN_MINUTES || 15) });
    return { 
      user,
      sessionExpiration,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

export default session;
