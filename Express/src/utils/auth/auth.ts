import { APIError, betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { customSession } from "better-auth/plugins";
import { isBefore } from "date-fns";
import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from 'uuid';

import { Organizations, Users } from "app-models";
import { GraphService } from "app-services";
import { getProtocol } from "app-utils";
import { IUser } from "app-interfaces";
 
const client = new MongoClient(process.env.DB_CONNECTION_STRING || "");
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  trustedOrigins: [`${getProtocol()}${process.env.CLIENT_URL}`],
  socialProviders: {
    microsoft: { 
      clientId: process.env.AZURE_AD_CLIENT_ID as string, 
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string, 
      tenantId: process.env.AZURE_AD_TENANT_ID as string, 
    }
  }, 
  plugins: [
    customSession(async ({ user, session }, context) => {
      const clientUrl = context?.getCookie('clientUrl') || '';     
      const domain = new URL(clientUrl).host;
      const organization = await Organizations.customFindByDomain(domain);
      const dbUser= await Users.findById(user.id);
      return {
          user: { ...user, ...dbUser},
          session,
          organization
      };
    }),
],

  user: {
      modelName: "users",
      fields: {
        name: "displayName",
        createdAt: "userCreated",
        
      },
      additionalFields: {
        defaultPage: {
          type: "string[]",
          required: true,
          defaultValue: [],
          input: false, 
        },
        organizationsIds: {
          type: "string[]",
          required: true,
          input: false, 
        },
        userId: {
          type: "string",
          required: true,  
          input: false, 
        },
        role: {
          type: "string",
          required: true,
          input: false, 
          defaultValue: "user",
        },
        imgUrl: {
          type: "string",
          required: true,
          input: false, 
        },
        displayName: {
          type: "string",
          required: true,
          input: false, 
        },
      },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          // Check organisation licence
          // we set a cookie in the login page to get the client URL (referer header couldnt be used as not passed when user has to msft select account)
          const clientUrl = ctx?.getCookie('clientUrl') || '';     
          const microsoftProvider = ctx?.context?.socialProviders?.find(p => p.id === 'microsoft');
          const tenantId = (microsoftProvider?.options as any)?.tenantId;
          const domain = new URL(clientUrl).host;
          const organization = await Organizations.customFindByDomain(domain);
          if (isBefore(new Date(organization.licenceExpirationDate), new Date())) {
            throw new APIError("BAD_REQUEST", {
              message: "Organization's licence expired",
            });
          }

          // Check if logged user is from allowed tenant or organization is open to all tenants
          if (!organization.allowedTenantsIds.includes('all') && !organization.allowedTenantsIds.includes(tenantId))
            throw new APIError("BAD_REQUEST", {
              message: "User from this tenant is not allowed",
            });
          // Check if logged user belong to access group (if configured)
          if (organization.accessGroupId) {

            const groups: any = await GraphService.checkMemberGroups({
              userIdOrEmail: user.email,
              groups: {
                access: organization.accessGroupId || '',
              },
              organization,
            });

            if (!groups.access)           
              throw new APIError("BAD_REQUEST", {
              message: "User doesn't exist in Conforme AAD group",
            });

          }
          let existingDbUser: Partial<IUser> = {};
          try {
             existingDbUser = (await Users.customFindWithDetails({ selector: { email: user.email }, organization, caseInsensitive: true }))[0] || {};
          }
          catch (error){
            console.log('error finding existing user', error)
          }
          const updatedOrganisationIds = (existingDbUser.organizationsIds || []).includes(organization._id) ? existingDbUser.organizationsIds : [ ...(existingDbUser.organizationsIds || []), organization._id ] as any;
          const userId = existingDbUser?._id || uuidv4();
          const enrichedUser = {
            ...user,
            imgUrl: `${getProtocol()}${process.env.API_URL}/files/photo/${userId}`,
            ...existingDbUser,
            organizationsIds: updatedOrganisationIds,
            userId,

          }
          return { data: enrichedUser };
        },
        after: async (user: Partial<IUser>, ctx) => {
          // delete the existingDbUser from the database with try catch
          try {
            const dbUser = await Users.findById(user?.userId);
            dbUser && await Users.findOneAndRemove({ _id: dbUser.userId });
            console.error(dbUser && 'Deleted old user record for user.id', user.userId);
          } catch (error) {
            console.error('Error deleting user', error);
          }
        }
      },
    }
  }
})
 


export default auth