import { graph } from '@pnp/graph-commonjs';
import { AdalFetchClient } from '@pnp/nodejs-commonjs';
import axios from 'axios';
import multer from 'multer';

import { IOrganization } from 'app-interfaces';
import { Organizations } from 'app-models';
import { logger } from 'app-shared';
import { getEmailSubject, getEmailTemplate, getProtocol } from 'app-utils';

// import { getEmailSubject, getEmailTemplate } from 'app-utils';

const inMemoryStorage = multer.memoryStorage();
const inMemoryStrategy = multer({ storage: inMemoryStorage });

const graphSetup = async (organizationId: string) => {
  if (!organizationId) 
    throw new Error('No organization id');
  
  const organization = await Organizations.customFindById(
    organizationId,
    organizationId,
  );
  if (!organizationId) 
    throw new Error('Wrong organization config');
  
  const { clientId, tenantId, secret } = organization;
  graph.setup({
    graph: {
      fetchClientFactory: () =>
        new AdalFetchClient(tenantId || '', clientId || '', secret || ''),
    },
  });
};

const getClient = async (organizationId: string) => {
  if (!organizationId) 
    throw new Error('No organization id');
  
  const organization = await Organizations.customFindById(
    organizationId,
    organizationId,
  );
  if (!organizationId) 
    throw new Error('Wrong organization config');
  
  const { clientId, tenantId, secret } = organization;
  const token = await new AdalFetchClient(
    tenantId || '',
    clientId || '',
    secret || '',
  ).acquireToken();
  const client = axios.create({
    baseURL: process.env.GRAPH_URL,
    headers: {
      Authorization: `${token.tokenType} ${token.accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  return client;
};

// userId can be AAD ID or email
const getUserData = async ({
  userId,
  organization,
}: {
  userId: string;
  organization: IOrganization;
}) => {
  await graphSetup(organization._id);
  const userData = await graph.users.getById(userId)();
  // const userGroups = await graph.users.getById(userId).memberOf();
  return {
    ...userData,
    // groups: userGroups.map(({ id, displayName }) => ({ id, displayName })) // TODO: fix me
  };
};

// userId can be AAD ID or email
const getUserPhoto = async ({ userId, organization }) => {
  try {
    await graphSetup(organization);
    return await graph.users.getById(userId).photo.getBuffer();
  } catch (e) {
    return undefined;
  }
};

// userId can be AAD ID or email
const checkMemberGroups = async ({
  userId,
  groups,
  organization,
}: {
  userId: string;
  groups: { [name: string]: string };
  organization: IOrganization;
}) => {
  await graphSetup(organization._id);
  const res = await graph.users
    .getById(userId)
    .checkMemberGroups(Object.values(groups));
  return Object.keys(groups).reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: res.includes(groups[curr]),
    }),
    {},
  );
};

const addMemberToAccessGroup = async ({
  userId,
  groupId,
  organization,
}: {
  userId: string;
  groupId: string;
  organization: IOrganization;
}) => {
  try {
    const client = await getClient(organization._id);
    const user = {
      '@odata.id': `https://graph.microsoft.com/v1.0/directoryObjects/${userId}`,
    };
    const addMember = await client.post(`groups/${groupId}/members/$ref`, user);

    return addMember;
  } catch (error) {
    return null;
  }
};

const getBasicUser = async ({
  userId,
  organization,
}: {
  userId: string;
  organization: IOrganization;
}) => {
  await graphSetup(organization._id);
  const userData = await graph.users.getById(userId)();
  const image = await getUserPhoto({ userId, organization });
  return {
    ...userData,
    image,
  };
};

const getBasicUsers = async ({
  usersIds,
  organization,
}: {
  usersIds: string[];
  organization: IOrganization;
}) => {
  await graphSetup(organization._id);
  if (usersIds.length === 0) 
    return [];
  
  // Graph API allows to search by maximum 15 child clauses using 'OR' operator
  // so we need to divide usersIds array to chunks
  const chunks = usersIds.reduce((acc, curr, i) => {
    const chunkIndex = Math.floor(i / 15);
    const chunk = [...(acc[chunkIndex] || []), curr];
    const newAcc: string[][] = [...acc];
    newAcc[chunkIndex] = chunk;
    return newAcc;
  }, [] as string[][]);

  const users: any[] = [];
  for (const chunk of chunks) {
    const query = `id in (${chunk.map((id) => `'${id}'`).join(', ')})`;
    try {
      const chunkUsers = await graph.users.filter(query).get();
      users.push(...chunkUsers);
    } catch (e: any) {
      logger.error(e.message);
      return [];
    }
  }
  return users.map(
    ({ id, givenName, displayName, surname, userPrincipalName, jobTitle }) => ({
      _id: id,
      displayName,
      firstName: givenName,
      lastName: surname,
      email: userPrincipalName,
      jobTitle,
      imgUrl: `${getProtocol()}${process.env.API_URL}/files/photo/${id}`,
    }),
  );
};

const getFileDetails = async (
  id: string,
  organization: IOrganization,
): Promise<{ thumbnail: string; path: string; preview: string }> => {
  if (!organization.spSiteUrl || !organization.spLibraryId) {
    logger.error('Graph error: Wrong SharePoint configuration');
    throw new Error('Graph error: Wrong SharePoint configuration');
  }
  const spUrlStart = organization.spSiteUrl?.match(/https:\/\/.*\.com/g) || '';
  const spStart = spUrlStart[0]
    .replace('https://', '')
    .replace('.com', '.com:');
  const spUrlSite =
    organization.spSiteUrl?.match(/sites\/.*/g) ||
    organization.spSiteUrl?.match(/teams\/.*/g);
  const client = await getClient(organization._id);
  try {
    const { data } = await client.get(
      `sites/${spStart}/${spUrlSite}:/lists/${organization.spLibraryId}/items/${id}/driveItem/`,
    );
    const res = await client.get(
      `sites/${spStart}/${spUrlSite}:/lists/${organization.spLibraryId}/items/${id}/driveItem/thumbnails/0/small`,
    );
    return {
      thumbnail: res.data.url,
      path: data['@microsoft.graph.downloadUrl'],
      preview: data.webUrl,
    };
  } catch (e: any) {
    throw new Error(e.response?.data?.error?.message || 'Unknown error');
  }
};

const getUsers = async ({
  searchText,
  filterByJobTitle,
  organization,
}: {
  searchText: string;
  filterByJobTitle?: string[];
  organization: IOrganization;
}) => {
  try {
    await graphSetup(organization._id);
    let res = await graph.users
      .filter(
        searchText
          ? `
      startsWith(givenName,'${searchText}') or
      startsWith(surname,'${searchText}') or
      startsWith(displayName,'${searchText}') or
      startsWith(userPrincipalName,'${searchText}') or
      startsWith(mail,'${searchText}')
    `
          : '',
      )
      .get();

    if (filterByJobTitle && filterByJobTitle.length > 0) {
      res = res.filter(
        (el) => el.jobTitle && filterByJobTitle.includes(el.jobTitle),
      );
    }

    return res.map(
      ({
        id,
        givenName,
        displayName,
        surname,
        userPrincipalName,
        jobTitle,
      }) => ({
        _id: id,
        displayName,
        firstName: givenName,
        lastName: surname,
        email: userPrincipalName,
        jobTitle,
      }),
    );
  } catch (error: any) {
    throw new Error(error);
  }
};

const uploadDocuments = async (
  organization: IOrganization,
  documents: Express.Multer.File[],
  responseId: string,
): Promise<{ name: string; id: string }[]> => {
  if (!organization.spSiteUrl) {
    logger.error('Graph error: Wrong SharePoint site configuration');
    return [];
  }
  const spSiteId = `sites/${organization.spSiteUrl
    .replace('https://', '')
    .replace('.com', '.com:')}`;

  const client = await getClient(organization._id);
  const site = await client.get(spSiteId);
  const { id } = site.data;
  if (!id) {
    logger.error('Graph error: Wrong SharePoint site configuration');
    return [];
  }
  const uploadedDocuments = await Promise.all(
    documents.map(async (document) => {
      try {
        const uploadSession = await client.post(
          `sites/${id}/drive/root:/${responseId}/${document.originalname}:/createUploadSession`,
          {},
        );
        const { uploadUrl } = uploadSession.data;
        if (!uploadUrl) 
          throw new Error('Graph error: Cannot generate upload url');

        let uploadedBytes = 0;
        const upload = async () => {
          const chunk = document.buffer.slice(
            uploadedBytes,
            10 * 1024 * 1024 + uploadedBytes,
          ); // Chunks has 10 megabytes
          const result = await client.put(uploadUrl, chunk, {
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            headers: {
              'Content-Length': chunk.length,
              'Content-Range': `bytes ${uploadedBytes}-${
                chunk.length + uploadedBytes - 1
              }/${document.size}`,
            },
          });
          uploadedBytes += chunk.length;
          if (uploadedBytes < document.size) 
            await upload();
          
          return result;
        };

        const getItemId = async (result) => {
          const res = await client.get(
            `drives/${result.data.parentReference.driveId}/items/${result.data.id}?$select=sharepointids`,
          );
          return res.data.sharepointIds.listItemId;
        };

        const result = await upload();
        const siteId = await getItemId(result);
        return {
          name: document.originalname,
          id: siteId,
        };
      } catch (e: any) {
        logger.error(e.response.data.error.message);
        throw new Error(e.response.data.error.message);
      }
    }),
  );
  return uploadedDocuments;
};

const deleteDocument = async (
  id: string,
  organization: IOrganization,
): Promise<boolean> => {
  if (!organization.spSiteUrl || !organization.spLibraryId) {
    logger.error('Graph error: Wrong SharePoint configuration');
    return false;
  }
  const client = await getClient(organization._id);
  const spUrlStart = organization.spSiteUrl?.match(/https:\/\/.*\.com/g) || '';
  const spStart = spUrlStart[0]
    .replace('https://', '')
    .replace('.com', '.com:');
  const spUrlSite =
    organization.spSiteUrl?.match(/sites\/.*/g) ||
    organization.spSiteUrl?.match(/teams\/.*/g);
  try {
    await client.delete(
      `sites/${spStart}/${spUrlSite}:/lists/${organization.spLibraryId}/items/${id}/driveItem/`,
    );
    return true;
  } catch (e: any) {
    logger.error(e.response.data.error.message);
    throw new Error(e.response.data.error.message);
  }
};

const sendEmail = async ({
  emailType,
  organization,
  emailData,
  from,
  to,
}: {
  emailType: number;
  organization: IOrganization;
  emailData: any;
  from: string;
  to: string[];
}) => {
  try {
    const client = await getClient(organization._id);
    if (!to) 
      return logger.error('Graph error: Wrong Email configuration');
    
    const toRecipients = to.map((address) => ({
      emailAddress: {
        address,
      },
    }));

    const options = {
      message: {
        subject: getEmailSubject(emailType, emailData),
        body: {
          contentType: 'HTML',
          content: await getEmailTemplate(emailType, emailData, organization),
        },
        toRecipients,
      },
    };
    const sent = await client.post(`users/${from}/sendMail`, options);
    return sent.status === 202;
  } catch (error) {
    return false;
  }
};

export default {
  inMemoryStrategy,
  getUserData,
  getUserPhoto,
  checkMemberGroups,
  getUsers,
  uploadDocuments,
  getBasicUser,
  getBasicUsers,
  addMemberToAccessGroup,
  deleteDocument,
  getFileDetails,
  sendEmail,
};
