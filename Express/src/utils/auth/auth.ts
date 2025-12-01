import { betterAuth } from 'better-auth';
import { APIError } from 'better-auth/api';
import { customSession } from 'better-auth/plugins';
import { isBefore } from 'date-fns';
import { MongoClient } from 'mongodb';

import { Organizations, Users } from 'app-models';
import { GraphService } from 'app-services';
import { getProtocol } from 'app-utils';
import { IUser } from 'app-interfaces';
import { mongodbCustomAdapter } from 'app-adapters';

// Extend Better Auth user shape locally to include our domain userId
type AuthSessionUser = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name?: string;
  image?: string | null;
  userId?: string; // our domain user id (e.g., Graph id)
};

const client = new MongoClient(process.env.DB_CONNECTION_STRING || '');
const db = client.db();

// Helper function to safely extract domain from URL
function extractDomainFromUrl(url: string): string {
  try {
    if (!url) throw new Error('Empty URL');
    return new URL(url).host;
  } catch (error) {
    console.error('Error extracting domain from URL:', url, error);
    // Fallback to environment variable or default
    return process.env.CLIENT_URL || '';
  }
}

// Helper function to get client URL with fallbacks
function getClientUrl(ctx: any): string {
  // Try multiple sources for client URL
  const clientUrl =
    ctx?.getCookie('clientUrl') ||
    ctx?.request?.headers?.referer ||
    ctx?.request?.headers?.origin ||
    `${getProtocol()}${process.env.CLIENT_URL}`;

  return clientUrl;
}

export const auth = betterAuth({
  database: mongodbCustomAdapter(db),
  trustedOrigins: [`${getProtocol()}${process.env.CLIENT_URL}`],
  socialProviders: {
    microsoft: {
      clientId: process.env.AZURE_AD_CLIENT_ID as string,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string,
      tenantId: process.env.AZURE_AD_TENANT_ID as string,
    },
  },
  plugins: [
    customSession(async ({ user, session }, context) => {
      try {
        const clientUrl = getClientUrl(context);
        const domain = extractDomainFromUrl(clientUrl);

        const organization = await Organizations.customFindByDomain(domain);
        if (!organization) {
          console.warn('No organization found for domain:', domain);
        }
        const authUser = user as unknown as AuthSessionUser;
        const dbUser = await Users.findOne({ userId: authUser.userId });
        // Extract only the actual user data, excluding Mongoose properties
        const userData = dbUser
          ? {
              _id: dbUser._id,
              userId: dbUser.userId,
              firstName: dbUser.firstName,
              lastName: dbUser.lastName,
              displayName: dbUser.displayName,
              jobTitle: dbUser.jobTitle,
              email: dbUser.email,
              imgUrl: dbUser.imgUrl,
              role: dbUser.role,
              organizationsIds: dbUser.organizationsIds,
              defaultPage: dbUser.defaultPage,
              managerId: dbUser.managerId,
              lastLogin: dbUser.lastLogin,
              userCreated: dbUser.userCreated,
              filtersPreset: dbUser.filtersPreset,
              organizationId: organization?._id || '',
              metatags: dbUser.metatags || {
                addedBy: dbUser.userId || '',
                addedAt: new Date(),
              },
            }
          : {
              organizationId: organization?._id || '',
              metatags: {
                addedBy: user.id || '',
                addedAt: new Date(),
              },
            };

        return {
          user: { ...user, ...userData } as IUser,
          session,
          organization,
        };
      } catch (error) {
        console.error('Error in customSession:', error);
        // Return basic session if organization lookup fails
        return {
          user: {
            ...user,
            _id: user.id,
            userId: user.id,
            displayName: user.name || user.email,
            role: 'user',
            organizationId: '',
            metatags: {
              addedBy: user.id,
              addedAt: new Date(),
            },
          } as IUser,
          session,
          organization: null,
        };
      }
    }),
  ],
  
  user: {
    modelName: 'users',
    fields: {
      name: 'displayName',
      createdAt: 'userCreated',
    },
    additionalFields: {
      defaultPage: {
        type: 'string[]',
        required: true,
        defaultValue: [],
        input: false,
      },
      organizationsIds: {
        type: 'string[]',
        required: true,
        input: false,
      },
      userId: {
        type: 'string',
        required: true,
        input: false,
      },
      role: {
        type: 'string',
        required: true,
        input: false,
        defaultValue: 'user',
      },
      imgUrl: {
        type: 'string',
        required: true,
        input: false,
      },
      displayName: {
        type: 'string',
        required: true,
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          try {
            console.log('User creation before hook started for:', user.email);

            // Get client URL with better error handling
            const clientUrl = getClientUrl(ctx);
            const domain = extractDomainFromUrl(clientUrl);
            console.log('Before hook - Domain resolved to:', domain);

            // Get Microsoft provider tenant ID
            const microsoftProvider = ctx?.context?.socialProviders?.find((p) => p.id === 'microsoft');
            const tenantId = (microsoftProvider?.options as any)?.tenantId;
            console.log('Tenant ID:', tenantId);

            // Find organization by domain
            const organization = await Organizations.customFindByDomain(domain);
            if (!organization) {
              throw new APIError('BAD_REQUEST', {
                message: `No organization found for domain: ${domain}`,
              });
            }

            // Check organization licence
            if (isBefore(new Date(organization.licenceExpirationDate), new Date())) {
              throw new APIError('BAD_REQUEST', {
                message: "Organization's licence expired",
              });
            }

            // Get user data from Microsoft Graph
            const graphUser = await GraphService.getUserDataByEmail({
              userEmail: user.email,
              organization,
            });
            const graphId = graphUser?.value?.[0]?.id;

            if (!graphId) {
              throw new APIError('BAD_REQUEST', {
                message: 'User not found in Microsoft Graph',
              });
            }

            // Check if logged user is from allowed tenant or organization is open to all tenants
            if (!organization.allowedTenantsIds.includes('all') && !organization.allowedTenantsIds.includes(tenantId)) {
              throw new APIError('BAD_REQUEST', {
                message: 'User from this tenant is not allowed',
              });
            }

            // Check if logged user belong to access group (if configured)
            if (organization.accessGroupId) {
              const groups: any = await GraphService.checkMemberGroups({
                userIdOrEmail: graphId,
                groups: {
                  access: organization.accessGroupId || '',
                },
                organization,
              });

              if (!groups.access) {
                throw new APIError('BAD_REQUEST', {
                  message: "User doesn't exist in Conforme AAD group",
                });
              }
            }

            // Find existing user
            let existingDbUser: Partial<IUser> = {};
            try {
              existingDbUser =
                (
                  await Users.customFindWithDetails({
                    selector: { email: user.email },
                    organization,
                    caseInsensitive: true,
                  })
                )[0] || {};
            } catch (error) {
              console.log('Error finding existing user:', error);
            }

            // Update organization IDs
            const updatedOrganisationIds = (existingDbUser.organizationsIds || []).includes(organization._id)
              ? existingDbUser.organizationsIds
              : ([...(existingDbUser.organizationsIds || []), organization._id] as any);

            const userId = graphId;

            // Get additional user details from Graph
            const userDetails = await GraphService.getUserData({ userId, organization });
            const managerId = await GraphService.getLineManagerId({ userId, organization });

            const normalizedEmail = user.email?.toLowerCase();
            
            const enrichedUser = {
              ...user,
              imgUrl: `${getProtocol()}${process.env.API_URL}/files/photo/${userId}`,
              firstName: userDetails?.givenName || '',
              lastName: userDetails?.surname || '',
              displayName: userDetails?.displayName || '',
              jobTitle: userDetails?.jobTitle || '',
              ...existingDbUser,
              email: normalizedEmail, // Override with normalized email from OAuth (source of truth)
              organizationsIds: updatedOrganisationIds,
              userId,
              managerId,
            };

            return { data: enrichedUser };
          } catch (error) {
            console.error('Error in user creation before hook:', error);
            throw error;
          }
        },
        after: async (user: Partial<IUser>, ctx) => {
          // Delete the existingDbUser from the database with try catch
          try {
            const dbUser = await Users.findById(user?.userId);
            if (dbUser) {
              await Users.findOneAndRemove({ _id: dbUser.userId });
              console.log('Deleted old user record for user.id', user.userId);
            }
          } catch (error) {
            console.error('Error deleting user:', error);
          }
        },
      },
    },
  },
});

export default auth;
