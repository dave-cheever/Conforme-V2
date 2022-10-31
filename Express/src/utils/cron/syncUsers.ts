import { Organizations, Users } from "app-models";

const syncUsers = async () => {
  const allowedDomains: string[] = process.env.ALLOWED_DOMAINS?.split(';') || [];
  const organizations = await Organizations.find({ domain: { $in: allowedDomains } }).lean();
  for (const organization of organizations) await Users.customFindWithDetails({ selector: {}, organization, awaitForResponse: true });
};

export default syncUsers;
