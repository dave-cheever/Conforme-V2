import { IUser } from "app-interfaces";
import { Users } from "app-models";
import { GraphService } from "app-services";
import { doesPathExist, getProtocol } from "app-utils";
import { GraphQLResolveInfo } from "graphql";

const users = async (_, __, { organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, [
    'users',
    ...elements,
  ]);
  try {
    const users:IUser[] = await Users.get({organization});
    const usersWithDetails:IUser[] = [];

    for (const user of users) {
      const userDetails = await GraphService.getUserData({ userId: user._id, organization });
      const { givenName, surname, displayName, mail, jobTitle, userPrincipalName } = userDetails;

      if(shouldJoin(["role"])){
        user.role = "user";
        
        const isAdmin = await GraphService.checkMemberGroup({
          userId: user._id,
          groupId: organization.adminsGroupId,
          organization,
        });
        if (isAdmin) {
          user.role = 'admin';
        } else {
          const isReader = await GraphService.checkMemberGroup({
            userId: user._id,
            groupId: organization.readersGroupId,
            organization,
          });
          if (isReader) {
            user.role = 'reader';
          }
        }
      }

      if(shouldJoin(["imgUrl"])){
        user.imgUrl = `${getProtocol()}${process.env.API_URL}/files/photo/${user._id}`;
      }

      usersWithDetails.push({
        ...user,
        firstName: givenName!,
        lastName: surname!,
        displayName: displayName!,
        email: mail || userPrincipalName!,
        jobTitle: jobTitle!,
      });

    };

    return usersWithDetails;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default users;
