import { AdalFetchClient } from '@pnp/nodejs-commonjs';
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
  const token = await new AdalFetchClient(tenantId || '', clientId || '', secret || '').acquireToken();
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
const getUserPhoto = async ({ userId, organization }) => {
  try {
    const client = await getClient(organization._id);
    const res = await client.get(`users/${userId}/photos/96x96/$value`, {
      responseType: 'arraybuffer',
    });
    return Buffer.from(res.data);
  } catch (e) {
    console.log(`Not found profile photo for user with ID ${userId}`);
    return undefined;
  }
};

// userId can be AAD ID or email
const getUserData = async ({ userId, organization }: { userId: string; organization: IOrganization }) => {
  try {
    const client = await getClient(organization._id);
    const res = await client.get(`users/${userId}`);
    return res.data;
  } catch (e) {
    console.log(e);
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
        users.push(...(res.data?.value || []));
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
    let users = res.data?.value || [];
    if (filterByJobTitle && filterByJobTitle.length > 0) users = users.filter((el) => el.jobTitle && filterByJobTitle.includes(el.jobTitle));

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
  try {
    const client = await getClient(organization._id);
    const res = await client.post(`/users/${userId}/checkMemberGroups`, {
      groupIds: Object.values(groups),
    });
    return Object.keys(groups).reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: (res.data?.value || []).includes(groups[curr]),
      }),
      {},
    );
  } catch (e) {
    console.log(e);
    return {};
  }
};

// userId can be AAD ID or email
const getLineManagerId = async ({ userId, organization }: { userId: string; organization: IOrganization }) => {
  try {
    const client = await getClient(organization._id);
    const res = await client.get(`users/${userId}/manager`);
    return res.data.id;
  } catch (e: any) {
    console.log(`Line manager not found for user with ID ${userId}`);
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
  const { id: siteId } = site.data;
  if (!siteId) {
    throw new Error('Graph error: Wrong SharePoint site configuration');
  }

  try {
    const fileRes = await client.get(`sites/${siteId}/lists/${organization.spLibraryId}/items/${id}/driveItem/`);
    const thumbnailRes = await client.get(`sites/${siteId}/lists/${organization.spLibraryId}/items/${id}/driveItem/thumbnails/0/small`);
    return {
      thumbnail: thumbnailRes?.data.url,
      path: fileRes?.data['@microsoft.graph.downloadUrl'],
      preview: fileRes?.data.webUrl,
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
  const { id } = site.data;
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
          (await client.get(`sites/${id}/drive/root:/${path}:/children`))?.data?.value?.map((file) => {
            if (new RegExp(document.originalname.split('.')[0]).test(file?.name)) documentExistantTimes += 1;

            return undefined;
          });
        } catch { }

        const uploadSession = await client.post(
          `sites/${id}/drive/root:/${path}/${incrementFileName(document.originalname, documentExistantTimes)}:/createUploadSession`,
          {},
        );
        const { uploadUrl } = uploadSession.data;
        if (!uploadUrl) throw new Error('Graph error: Cannot generate upload url');

        let uploadedBytes = 0;
        const upload = async () => {
          const chunk = document.buffer.slice(uploadedBytes, 10 * 1024 * 1024 + uploadedBytes); // Chunks has 10 megabytes
          const result = await client.put(uploadUrl, chunk, {
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            headers: {
              'Content-Length': chunk.length,
              'Content-Range': `bytes ${uploadedBytes}-${chunk.length + uploadedBytes - 1}/${document.size}`,
            },
          });
          uploadedBytes += chunk.length;
          if (uploadedBytes < document.size) await upload();

          return result;
        };

        const getItemId = async (result) => {
          const res = await client.get(`drives/${result.data.parentReference.driveId}/items/${result.data.id}?$select=sharepointids`);
          return res.data.sharepointIds.listItemId;
        };

        const result = await upload();
        const locationId = await getItemId(result);
        return {
          name: incrementFileName(document.originalname, documentExistantTimes),
          id: locationId,
          addedAt: new Date(),
        };
      } catch (e: any) {
        logger.error(e.response.data.error.message);
        throw new Error(e.response.data.error.message);
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
  const { id: locationId } = site.data;
  if (!locationId) {
    logger.error('Graph error: Wrong SharePoint site configuration');
    return false;
  }

  try {
    // Get file details
    const fileDetails = await client.get(`sites/${spStart}/${spUrlSite}:/lists/${organization.spLibraryId}/items/${id}/driveItem/`);

    // Create folder
    const folderRes = await client.post(`sites/${locationId}/drive/items/root/children`, {
      name: newPath,
      folder: {},
      '@microsoft.graph.conflictBehavior': 'replace',
    });

    // Move file to new folder
    await client.patch(`sites/${spStart}/${spUrlSite}:/lists/${organization.spLibraryId}/items/${id}/driveItem/`, {
      parentReference: {
        path: `sites/${locationId}/drive/items/root:/${newPath}`,
        id: folderRes.data.id,
      },
      name: newName,
    });

    try {
      // Get old folder details
      const tempFolderDetails = await client.get(`sites/${locationId}/drive/items/${fileDetails.data.parentReference.id}`);

      // Delete old folder if empty
      if (tempFolderDetails.data.folder.childCount === 0)
        await client.delete(`sites/${locationId}/drive/items/${fileDetails.data.parentReference.id}`);
    } catch (deleteErr: any) { } // do not do anything if folder was already removed

    return true;
  } catch (e: any) {
    logger.error(e.response.data.error.message);
    throw new Error(e.response.data.error.message);
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
    logger.error(e.response.data.error.message);
    throw new Error(e.response.data.error.message);
  }
};

export default {
  inMemoryStrategy,
  getUserData,
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
};
