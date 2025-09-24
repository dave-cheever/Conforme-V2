import { useMemo } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Avatar, AvatarProps } from '@chakra-ui/react';

import { IUser } from '../interfaces/IUser';

const GET_USER = gql`
  query ($userQueryInput: UserQueryInput) {
    usersById(userQueryInput: $userQueryInput) {
      _id
      displayName
      imgUrl
    }
  }
`;

function UserAvatar({
  userId,
  callback, // function that can be called to return details of user
  ...props
}: AvatarProps & {
  userId: string;
  callback?: (userDetails: IUser) => void;
}) {
  const { data } = useQuery(GET_USER, {
    variables: {
      userQueryInput: { usersIds: [userId] },
    },
  });
  const user = useMemo(() => {
    const userDetails = (data?.usersById || [])[0];
    if (callback) callback(userDetails);
    return userDetails;
  }, [JSON.stringify(data)]);

  return <Avatar data-id="000506" {...props} name={user?.displayName?.replace(/\s*\(.*?\)\s*/g, '')} src={user?.imgUrl} />;
}

export default UserAvatar;
