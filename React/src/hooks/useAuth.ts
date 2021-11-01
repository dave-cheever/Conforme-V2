import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { useAppContext } from "../contexts/AppProvider";

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
    }
  }
`;

const useAuth = () => {
  const { loading, data, error } = useQuery(USERS);
  const { setUser } = useAppContext();
  
  useEffect(() => {
    if (data) {
      setUser(data.session.user);
    }
  }, [data?.session.user]); // eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(() => {
    if (error?.message) {
      setUser(null);
    }
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  return loading;
};

export default useAuth;
