import { graph } from '@pnp/graph-commonjs';
import { AdalFetchClient } from '@pnp/nodejs-commonjs';
import axios from 'axios';
import { filter } from 'lodash';
import { Multer } from 'multer';

import { logger } from 'app-shared';
import { Organizations } from 'app-models';
import { IOrganization } from 'app-interfaces';
// import { getEmailSubject, getEmailTemplate } from 'app-utils';

const graphSetup = async (organization: IOrganization) => {
  if (!organization) {
    throw new Error('Wrong organization config');
  }
  const { clientId, tenantId, secret } = organization;
  
  graph.setup({
    graph: {
      fetchClientFactory: () => new AdalFetchClient(tenantId || '', clientId || '', secret || ''),
    },
  });
}

const getClient = async (organization: IOrganization) => {
  if (!organization) {
    throw new Error('Wrong organization config');
  }
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
const getUserData = async ({ userId, organization }: { userId: string, organization: IOrganization }) => {
  await graphSetup(organization);
  const userData = await graph.users.getById(userId)();
  const userGroups = await graph.users.getById(userId).memberOf();
  return {
    ...userData,
    // groups: userGroups.map(({ id, displayName }) => ({ id, displayName })) // TODO: fix me
  };
};

// userId can be AAD ID or email
const getUserPhoto = async ({ userId, organization }: { userId: string, organization: IOrganization }) => {
  try {
    await graphSetup(organization);
    return await graph.users.getById(userId).photo.getBlob();
  } catch (e) {
    return undefined;
  }
};

// userId can be AAD ID or email
const checkMemberGroup = async ({ userId, groupId, organization }: { userId: string, groupId?: string, organization: IOrganization }) => {
  if (!groupId) {
    return false;
  }
  await graphSetup(organization);
  const res = await graph.users.getById(userId).checkMemberGroups([groupId]);
  return res.length === 1;
};

const addMemberToAccessGroup = async ({ userId, groupId, organization }: { userId: string, groupId: string, organization: IOrganization }) => {
  try {
    const client = await getClient(organization);
    const user = {
      "@odata.id": `https://graph.microsoft.com/v1.0/directoryObjects/${userId}`
    };
    const addMember = await client.post(`groups/${groupId}/members/$ref`, user);

    return addMember;
  } catch (error) {
    return null;
  }
}

const getBasicUser = async ({ userId, organization }: { userId: string, organization: IOrganization }) => {
  await graphSetup(organization);
  const userData = await graph.users.getById(userId)();
  const image = await getUserPhoto({ userId, organization });
  return {
    ...userData,
    image
  };
};

// const getFileDetails = async (id: string) => {
//   const client = await getClient();
//   const organization = await Organizations.findById(global.organizationId);
//   if (!organization.spSiteUrl) {
//     return logger.error('Graph error: Wrong SharePoint site configuration');
//   }
//   let spUrlStart = organization.spSiteUrl?.match(/https:\/\/.*\.com/g) || '';
//   const spStart = spUrlStart[0].replace('https://', '').replace('.com', '.com:');
//   const spUrlSite = organization.spSiteUrl?.match(/sites\/.*/g);
//   try {
//     const { data } = await client.get(`sites/${spStart}/${spUrlSite}:/lists/${organization.spLibraryId}/items/${id}/driveItem/`);

//     const res = await client.get(`sites/${spStart}/${spUrlSite}:/lists/${organization.spLibraryId}/items/${id}/driveItem/thumbnails/0/small`);
//     return {
//       thumbnail: res.data.url,
//       path: data['@microsoft.graph.downloadUrl']
//     }
//   } catch (e) {
//     throw new Error(e.response?.data?.error?.message || 'Unknown error');
//   }
// };

const getUsers = async ({ searchText, filterByJobTitle, organization }: { searchText: string, filterByJobTitle?: string[], organization: IOrganization }) => {
  try {
    await graphSetup(organization);
    let res = await graph.users.filter(searchText ? `
      startsWith(givenName,'${searchText}') or
      startsWith(surname,'${searchText}') or
      startsWith(displayName,'${searchText}') or
      startsWith(userPrincipalName,'${searchText}') or
      startsWith(mail,'${searchText}')
    ` : '').get();

    if (filterByJobTitle && filterByJobTitle.length > 0) {
      res = res.filter(el => el.jobTitle && filterByJobTitle.includes(el.jobTitle))
    }

    return res.map(({ id, givenName, displayName, surname, userPrincipalName, jobTitle }) => ({
      _id: id,
      displayName,
      firstName: givenName,
      lastName: surname,
      email: userPrincipalName,
      jobTitle,
    }));
  } catch (error: any) {
    throw new Error(error);
  }
};

// const uploadDocuments = async (documents: Express.Multer.File[], responseId) => {
//   const client = await getClient();
//   const organization = await Organizations.findById(global.organizationId);
//   if (!organization.spSiteUrl) {
//     return logger.error('Graph error: Wrong SharePoint site configuration');
//   }
//   const spSiteId = `sites/${organization.spSiteUrl.replace('https://', '').replace('.com', '.com:')}`;

//   const site = await client.get(spSiteId);
//   const { id } = site.data;
//   if (!id) {
//     return logger.error('Graph error: Wrong SharePoint site configuration');
//   }
//   const uploadedDocuments = await Promise.all(documents.map(async document => {
//     try {
//       const uploadSession = await client.post(`sites/${id}/drive/root:/${responseId}/${document.originalname}:/createUploadSession`, {});
//       const { uploadUrl } = uploadSession.data;
//       if (!uploadUrl) {
//         return logger.error('Graph error: Cannot generate upload url');
//       }

//       let uploadedBytes = 0;
//       const upload = async () => {
//         const chunk = document.buffer.slice(uploadedBytes, 10 * 1024 * 1024 + uploadedBytes); // Chunks has 10 megabytes
//         const result = await client.put(uploadUrl, chunk, {
//           maxContentLength: Infinity,
//           maxBodyLength: Infinity,
//           headers: {
//             'Content-Length': chunk.length,
//             'Content-Range': `bytes ${uploadedBytes}-${chunk.length + uploadedBytes - 1}/${document.size}`,
//           },
//         });
//         uploadedBytes += chunk.length;
//         if (uploadedBytes < document.size) {
//           await upload();
//         }
//         return result;
//       }

//       const getItemId = async (result) => {
//         const res = await client.get(`drives/${result.data.parentReference.driveId}/items/${result.data.id}?$select=sharepointids`);
//         return res.data.sharepointIds.listItemId
//       }

//       const result = await upload();
//       const siteId = await getItemId(result);
//       return {
//         "id": siteId
//       };
//     } catch (e) {
//       logger.error(e.response.data.error.message);
//       throw new Error(e.response.data.error.message);
//     }
//   }));
//   return uploadedDocuments;
// };

// const deleteDocument = async (id: string) => {
//   const client = await getClient();
//   const organization = await Organizations.findById(global.organizationId);
//   if (!organization.spSiteUrl) {
//     return logger.error('Graph error: Wrong SharePoint site configuration');
//   }
//   let spUrlStart = organization.spSiteUrl?.match(/https:\/\/.*\.com/g) || ''
//   const spStart = spUrlStart[0].replace('https://', '').replace('.com', '.com:');
//   const spUrlSite = organization.spSiteUrl?.match(/sites\/.*/g);
//   try {
//     const res = await client.delete(`sites/${spStart}/${spUrlSite}:/lists/${organization.spLibraryId}/items/${id}/driveItem/`);
//     return {
//       "status": "deleted"
//     }
//   } catch (e) {
//     logger.error(e.response.data.error.message);
//     throw new Error(e.response.data.error.message);
//   }
// };

// const sendEmail = async ({ emailType, emailData, from, to }: { emailType: number, emailData: any, from: string, to: string[] }) => {
//   try {
//     const client = await getClient();
//     if (!to) {
//       return logger.error('Graph error: Wrong Email configuration');
//     }
//     const toRecipients = to.map(address => ({
//       emailAddress: {
//         address,
//       }
//     }));
//     const options = { // TODO: fix emails
//       // message: {
//       //   subject: getEmailSubject(emailType, emailData),
//       //   body: {
//       //     contentType: 'HTML',
//       //     content: await getEmailTemplate(emailType, emailData),
//       //   },
//       //   toRecipients,
//       // }
//     };
//     const sent = await client.post(`users/${from}/sendMail`, options);
//     return sent.status === 202;
//   } catch (error) {
//     return false;
//   }
// };

//this function is used for moving the evidence from response when complete to attachments.
// const moveEvidences = async (responseId: string) => {
//   const client = await getClient();
//   const organization = await Organizations.findById(global.organizationId);
//   if (!organization.spSiteUrl) {
//     return logger.error('Graph error: Wrong SharePoint site configuration');
//   }
//   let spUrlStart = organization.spSiteUrl?.match(/https:\/\/.*\.com/g) || ''
//   const spStart = spUrlStart[0].replace('https://', '').replace('.com', '.com:');
//   const spUrlSite = organization.spSiteUrl?.match(/sites\/.*/g);
//   try {
//     const response = await client.get(`sites/${spStart}/${spUrlSite}:/lists/${organization.spLibraryId}/items`);

//     let filteredEvidenceData: any[] = filter(response.data?.value, (d) => d?.contentType?.name === 'Folder'
//       && d?.webUrl?.includes("Evidence") && d?.webUrl?.includes(`${responseId}`));

//     let filteredAttachmentData: any[] = filter(response.data?.value, (d) => d?.contentType?.name === 'Folder'
//       && d?.webUrl?.includes("Attachment") && d?.webUrl?.includes(`${responseId}`));

//     filteredEvidenceData?.map(async (evidence, index) => {
//       await client.patch(`sites/${spStart}/${spUrlSite}:/lists/${organization.spLibraryId}/items/${evidence.id}/driveItem`,
//         {
//           "name": `Attachment-Item-${index + filteredAttachmentData.length + 1}`
//         }
//       );
//     })

//     return {
//       "status": "moved"
//     }
//   } catch (e) {
//     logger.error(e.response.data.error.message);
//     throw new Error(e.response.data.error.message);
//   }
// };

export default {
  getUserData,
  getUserPhoto,
  checkMemberGroup,
  getUsers,
  // uploadDocuments,
  getBasicUser,
  addMemberToAccessGroup,
  // deleteDocument,
  // getFileDetails,
  // sendEmail,
  // moveEvidences,
};
