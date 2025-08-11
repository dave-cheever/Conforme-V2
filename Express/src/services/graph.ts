import { ConfidentialClientApplication, Configuration } from '@azure/msal-node';
import axios from 'axios';
import multer from 'multer';

import { IOrganization } from 'app-interfaces';
import { Organizations } from 'app-models';
import { logger } from 'app-shared';
import { getProtocol } from 'app-utils';

const inMemoryStorage = multer.memoryStorage();
const inMemoryStrategy = multer({ storage: inMemoryStorage });

// Function used where Graph API is used via HTTP request
const getClient = async (organizationId: string) => {
  if (!organizationId) throw new Error('No organization id');

  const organization = await Organizations.customFindById(organizationId);
  if (!organizationId) throw new Error('Wrong organization config');

  const { clientId, tenantId, secret } = organization;

  // Create MSAL confidential client application
  const msalConfig: Configuration = {
    auth: {
      clientId: clientId || '',
      authority: `https://login.microsoftonline.com/${tenantId || ''}`,
      clientSecret: secret || '',
    },
  };

  const cca = new ConfidentialClientApplication(msalConfig);

  // Acquire token for Microsoft Graph
  const tokenRequest = {
    scopes: ['https://graph.microsoft.com/.default'],
  };

  try {
    const response = await cca.acquireTokenByClientCredential(tokenRequest);
    if (!response || !response.accessToken) {
      throw new Error('Failed to acquire access token');
    }

    const client = axios.create({
      baseURL: process.env.GRAPH_URL,
      headers: {
        Authorization: `Bearer ${response.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return client;
  } catch (error) {
    logger.error('MSAL token acquisition failed:', error);
    throw new Error('Failed to authenticate with Microsoft Graph');
  }
};

// userId can be AAD ID or email
const getUserPhoto = async ({ userId, organization }: { userId: string; organization: IOrganization }) => {
  try {
    const client = await getClient(organization._id);
    const res = await client.get(`users/${userId}/photos/96x96/$value`, {
      responseType: 'arraybuffer',
    });
    return Buffer.from(res.data as ArrayBuffer);
  } catch (e) {
    // console.log(`Not found profile photo for user with ID ${userId}`);
    return undefined;
  }
};

// This function is specifically for login with better Auth. Better auth is only returning the user email and if the user is a guest of the tenant getUserData with userId does not work. 
// Therefore we use this function to get the users id by email.
const getUserDataByEmail = async ({ userEmail, organization }: { userEmail: string; organization: IOrganization }) => {
  try {
    const client = await getClient(organization._id);
    const res = await client.get(`users?$filter=mail eq '${userEmail}'`);
    return res.data;
  } catch (e) {
    // console.log(e);
    return null;
  }
};

// userId can be AAD ID 
const getUserData = async ({ userId, organization }: { userId: string; organization: IOrganization }) => {
  try {
    const client = await getClient(organization._id);
    const res = await client.get(`users/${userId}`);
    return res.data;
  } catch (e) {
    // console.log(e);
    return null;
  }
};

const getBasicUsers = async ({ usersIds, organization }: { usersIds: string[]; organization: IOrganization }) => {
  try {
    // const graph = await graphSetup(organization._id);
    const client = await getClient(organization._id);
    if (usersIds.length === 0) return [];

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
        const res = await client.get(`users?$filter=${query}`);
        const responseData = res.data as { value?: any[] };
        users.push(...(responseData?.value || []));
      } catch (e: any) {
        logger.error(e.message);
        return [];
      }
    }
    return users.map(({ id, givenName, displayName, surname, userPrincipalName, jobTitle }) => ({
      _id: id,
      displayName,
      firstName: givenName,
      lastName: surname,
      email: userPrincipalName,
      jobTitle,
      imgUrl: `${getProtocol()}${process.env.API_URL}/files/photo/${id}`,
    }));
  } catch (e) {
    console.log(e);
    return [];
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
    const client = await getClient(organization._id);
    let filterQuery = '';
    if (searchText) {
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(searchText))
        filterQuery = `id eq '${searchText}'`;
      else {
        filterQuery = `
          startsWith(givenName,'${searchText}') or
          startsWith(surname,'${searchText}') or
          startsWith(displayName,'${searchText}') or
          startsWith(userPrincipalName,'${searchText}') or
          startsWith(mail,'${searchText}')
        `;
      }
    }
    const properties = ['id', 'givenName', 'surname', 'displayName', 'userPrincipalName', 'jobTitle', 'department'].join(',');
    const res = await client.get(`users?$filter=${filterQuery}&$select=${properties}`);
    const responseData = res.data as { value?: any[] };
    let users = responseData?.value || [];
    if (filterByJobTitle && filterByJobTitle.length > 0)
      users = users.filter((el) => el.jobTitle && filterByJobTitle.includes(el.jobTitle));

    return users.map(({ id, givenName, displayName, surname, userPrincipalName, jobTitle, department }) => ({
      _id: id,
      displayName,
      firstName: givenName,
      lastName: surname,
      email: userPrincipalName,
      jobTitle,
      department,
      imgUrl: `${getProtocol()}${process.env.API_URL}/files/photo/${id}`,
    }));
  } catch (e: any) {
    console.log(e);
    throw new Error(e);
  }
};

const getUsersWithOrg = async ({
  searchText,
  filterByJobTitle,
  organization,
}: {
  searchText: string;
  filterByJobTitle?: string[];
  organization: string;
}) => {
  try {
    const client = await getClient(organization);
    let filterQuery = '';
    if (searchText) {
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(searchText))
        filterQuery = `id eq '${searchText}'`;
      else {
        filterQuery = `
          startsWith(givenName,'${searchText}') or
          startsWith(surname,'${searchText}') or
          startsWith(displayName,'${searchText}') or
          startsWith(userPrincipalName,'${searchText}') or
          startsWith(mail,'${searchText}')
        `;
      }
    }
    const properties = ['id', 'givenName', 'surname', 'displayName', 'userPrincipalName', 'jobTitle', 'department'].join(',');
    const res = await client.get(`users?$filter=${filterQuery}&$select=${properties}`);
    const responseData = res.data as { value?: any[] };
    let users = responseData?.value || [];
    if (filterByJobTitle && filterByJobTitle.length > 0)
      users = users.filter((el) => el.jobTitle && filterByJobTitle.includes(el.jobTitle));

    return users.map(({ id, givenName, displayName, surname, userPrincipalName, jobTitle, department }) => ({
      _id: id,
      userId: id,
      displayName,
      firstName: givenName,
      lastName: surname,
      email: userPrincipalName,
      jobTitle,
      department,
      imgUrl: `${getProtocol()}${process.env.API_URL}/files/photo/${id}`,
    }));
  } catch (e: any) {
    console.log(e);
    throw new Error(e);
  }
};

// userId can be AAD ID or email
const checkMemberGroups = async ({
  userIdOrEmail,
  groups,
  organization,
}: {
  userIdOrEmail: string;
  groups: { [name: string]: string };
  organization: IOrganization;
}) => {
  try {
    const client = await getClient(organization._id);
    const res = await client.post(`/users/${userIdOrEmail}/checkMemberGroups`, {
      groupIds: Object.values(groups),
    });
    const responseData = res.data as { value?: string[] };
    return Object.keys(groups).reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: (responseData?.value || []).includes(groups[curr]),
      }),
      {},
    );
  } catch (e) {
    // console.log(e);
    return {};
  }
};

// userId can be AAD ID or email
const getLineManagerId = async ({ userId, organization }: { userId: string; organization: IOrganization }) => {
  try {
    const client = await getClient(organization._id);
    const res = await client.get(`users/${userId}/manager`);
    const responseData = res.data as { id?: string };
    return responseData.id;
  } catch (e: any) {
    // console.log(`Line manager not found for user with ID ${userId}`);
  }
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
  } catch (e) {
    return null;
  }
};


const getFileDetails = async (id: string, organization: IOrganization): Promise<{ thumbnail: string; path: string; preview: string }> => {
  if (!organization.spSiteUrl || !organization.spLibraryId) {
    logger.error('Graph error: Wrong SharePoint configuration');
    throw new Error('Graph error: Wrong SharePoint configuration');
  }
  const splocationId = `sites/${organization.spSiteUrl.replace('https://', '').replace('.com', '.com:')}`;
  const client = await getClient(organization._id);
  const site = await client.get(splocationId);
  const siteData = site.data as { id?: string };
  const { id: siteId } = siteData;
  if (!siteId) {
    throw new Error('Graph error: Wrong SharePoint site configuration');
  }

  try {
    const fileRes = await client.get(`sites/${siteId}/lists/${organization.spLibraryId}/items/${id}/driveItem/`);
    const thumbnailRes = await client.get(`sites/${siteId}/lists/${organization.spLibraryId}/items/${id}/driveItem/thumbnails/0/small`);
    const fileData = fileRes.data as any;
    const thumbnailData = thumbnailRes.data as any;
    return {
      thumbnail: thumbnailData?.url,
      path: fileData?.['@microsoft.graph.downloadUrl'],
      preview: fileData?.webUrl,
    };
  } catch (e: any) {
    logger.error(e.response?.data?.error?.message || 'Unknown error');
    throw new Error(e.response?.data?.error?.message || 'Unknown error');
  }
};

const uploadDocuments = async (
  documents: Express.Multer.File[],
  path: string,
  organization: IOrganization,
): Promise<{ name: string; id: string; addedAt: Date }[]> => {
  if (!organization.spSiteUrl) {
    logger.error('Graph error: Wrong SharePoint site configuration');
    return [];
  }
  const splocationId = `sites/${organization.spSiteUrl.replace('https://', '').replace('.com', '.com:')}`;

  const client = await getClient(organization._id);
  const site = await client.get(splocationId);
  const siteData = site.data as { id?: string };
  const { id } = siteData;
  if (!id) {
    logger.error('Graph error: Wrong SharePoint site configuration');
    return [];
  }

  const incrementFileName = (name: string, increment: number) => {
    if (increment === 0) return name;

    const extension = name.match(/\..*$/)?.[0] ?? '';
    const withoutExtensionAndParentheses = name.replace(/\..*$/, '').replace(/\(|\)/, '');

    return `${withoutExtensionAndParentheses.split(' ')[0]} (${increment})${extension}`;
  };

  const uploadedDocuments = await Promise.all(
    documents.map(async (document) => {
      try {
        let documentExistantTimes = 0;

        try {
          const childrenRes = await client.get(`sites/${id}/drive/root:/${path}:/children`);
          const childrenData = childrenRes.data as { value?: any[] };
          childrenData?.value?.map((file) => {
            if (new RegExp(document.originalname.split('.')[0]).test(file?.name)) documentExistantTimes += 1;

            return undefined;
          });
        } catch {}

        const uploadSession = await client.post(
          `sites/${id}/drive/root:/${path}/${incrementFileName(document.originalname, documentExistantTimes)}:/createUploadSession`,
          {},
        );
        const uploadSessionData = uploadSession.data as { uploadUrl?: string };
        const { uploadUrl } = uploadSessionData;
        if (!uploadUrl) throw new Error('Graph error: Cannot generate upload url');

        let uploadedBytes = 0;
        const upload = async () => {
          const chunk = document.buffer.slice(uploadedBytes, 10 * 1024 * 1024 + uploadedBytes); // Chunks has 10 megabytes
          const result = await client.put(uploadUrl, chunk, {
            headers: {
              'Content-Length': chunk.length,
              'Content-Range': `bytes ${uploadedBytes}-${chunk.length + uploadedBytes - 1}/${document.size}`,
            },
          });
          uploadedBytes += chunk.length;
          if (uploadedBytes < document.size) await upload();

          return result;
        };

        const getItemId = async (result: any) => {
          const res = await client.get(`drives/${result.data.parentReference.driveId}/items/${result.data.id}?$select=sharepointids`);
          const resData = res.data as { sharepointIds?: { listItemId?: string } };
          return resData.sharepointIds?.listItemId;
        };

        const result = await upload();
        const locationId = await getItemId(result);
        return {
          name: incrementFileName(document.originalname, documentExistantTimes),
          id: locationId || '',
          addedAt: new Date(),
        };
      } catch (e: any) {
        logger.error(e.response?.data?.error?.message || 'Unknown error');
        throw new Error(e.response?.data?.error?.message || 'Unknown error');
      }
    }),
  );
  return uploadedDocuments;
};

const moveDocument = async (id: string, newPath: string, newName: string, organization: IOrganization): Promise<boolean> => {
  if (!organization.spSiteUrl || !organization.spLibraryId) {
    logger.error('Graph error: Wrong SharePoint configuration');
    return false;
  }
  const client = await getClient(organization._id);
  const spUrlStart = organization.spSiteUrl?.match(/https:\/\/.*\.com/g) || '';
  const spStart = spUrlStart[0].replace('https://', '').replace('.com', '.com:');
  const spUrlSite = organization.spSiteUrl?.match(/sites\/.*/g) || organization.spSiteUrl?.match(/teams\/.*/g);
  const splocationId = `sites/${organization.spSiteUrl.replace('https://', '').replace('.com', '.com:')}`;

  const site = await client.get(splocationId);
  const siteData = site.data as { id?: string };
  const { id: locationId } = siteData;
  if (!locationId) {
    logger.error('Graph error: Wrong SharePoint site configuration');
    return false;
  }

  try {
    // Get file details
    const fileDetails = await client.get(`sites/${spStart}/${spUrlSite}:/lists/${organization.spLibraryId}/items/${id}/driveItem/`);
    const fileDetailsData = fileDetails.data as any;

    // Create folder
    const folderRes = await client.post(`sites/${locationId}/drive/items/root/children`, {
      name: newPath,
      folder: {},
      '@microsoft.graph.conflictBehavior': 'replace',
    });
    const folderResData = folderRes.data as { id?: string };

    // Move file to new folder
    await client.patch(`sites/${spStart}/${spUrlSite}:/lists/${organization.spLibraryId}/items/${id}/driveItem/`, {
      parentReference: {
        path: `sites/${locationId}/drive/items/root:/${newPath}`,
        id: folderResData.id,
      },
      name: newName,
    });

    try {
      // Get old folder details
      const tempFolderDetails = await client.get(`sites/${locationId}/drive/items/${fileDetailsData.parentReference.id}`);
      const tempFolderDetailsData = tempFolderDetails.data as { folder?: { childCount?: number } };

      // Delete old folder if empty
      if (tempFolderDetailsData.folder?.childCount === 0)
        await client.delete(`sites/${locationId}/drive/items/${fileDetailsData.parentReference.id}`);
    } catch (deleteErr: any) {} // do not do anything if folder was already removed

    return true;
  } catch (e: any) {
    logger.error(e.response?.data?.error?.message || 'Unknown error');
    throw new Error(e.response?.data?.error?.message || 'Unknown error');
  }
};

const deleteDocument = async (id: string, organization: IOrganization): Promise<boolean> => {
  if (!organization.spSiteUrl || !organization.spLibraryId) {
    logger.error('Graph error: Wrong SharePoint configuration');
    return false;
  }
  const client = await getClient(organization._id);
  const spUrlStart = organization.spSiteUrl?.match(/https:\/\/.*\.com/g) || '';
  const spStart = spUrlStart[0].replace('https://', '').replace('.com', '.com:');
  const spUrlSite = organization.spSiteUrl?.match(/sites\/.*/g) || organization.spSiteUrl?.match(/teams\/.*/g);
  try {
    await client.delete(`sites/${spStart}/${spUrlSite}:/lists/${organization.spLibraryId}/items/${id}/driveItem/`);
    return true;
  } catch (e: any) {
    logger.error(e.response?.data?.error?.message || 'Unknown error');
    throw new Error(e.response?.data?.error?.message || 'Unknown error');
  }
};

export default {
  inMemoryStrategy,
  getUserData,
  getUserDataByEmail,
  getUserPhoto,
  checkMemberGroups,
  getLineManagerId,
  getUsers,
  uploadDocuments,
  getBasicUsers,
  addMemberToAccessGroup,
  moveDocument,
  deleteDocument,
  getFileDetails,
  getUsersWithOrg,
};
