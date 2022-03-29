import { gql, useQuery } from '@apollo/client';

const USERS = gql`
  query {
    session {
      sessionExpiration
    }
  }
`;

const useSession = () => {
  const { refetch } = useQuery(USERS);
  return refetch;
};

export default useSession;
