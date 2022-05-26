import axios from 'axios';

import { Organizations } from 'app-models';

const getClient = async (organizationId: string) => {
  if (!organizationId) throw new Error('No organization id');

  const organization = await Organizations.customFindById(organizationId, organizationId);
  if (!organization) throw new Error('Wrong organization config');

  const client = axios.create({
    baseURL: process.env.FUNCTION_URL,
  });
  return client;
};

const sendNotification = async (organizationId, notificationId) => {
  const client = await getClient(organizationId);

  await client.post('/SendNotification', {
    notificationId,
    organizationId,
  });
};

export default {
  getClient,
  sendNotification,
};
