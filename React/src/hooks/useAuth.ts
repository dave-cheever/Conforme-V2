import { gql, useQuery } from "@apollo/client";
import { useContext, useEffect } from "react";
import { IStore, store } from "../bootstrap/store";

const USERS = gql`
  query {
    session {
      user {
        _id
        firstName
        lastName
        displayName
        email
        jobTitle
        role
        imgUrl
        defaultPage
      }
      sessionExpiration
    }
  }
`;

const useAuth = () => {
  const { loading, data, refetch } = useQuery(USERS);
  const { dispatch }: IStore = useContext(store);

  useEffect(() => {
    dispatch({ type: 'setUser', payload: data?.session.user || null });
  }, [data?.session.user, dispatch]);

  return {
    loading,
    sessionExpiration: data?.session.sessionExpiration,
    refetch,
  };
};

export default useAuth;
