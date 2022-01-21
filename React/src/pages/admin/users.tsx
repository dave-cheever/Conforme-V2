import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  Select,
  Text
} from "@chakra-ui/react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

import AdminTableHeader from "../../components/Admin/AdminTableHeader";
import AdminTableHeaderElement from "../../components/Admin/AdminTableHeaderElement";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import UserResponseCount from "../../components/UserResponseCount";
import useDevice from "../../hooks/useDevice";
import { ArrowDownIcon } from "../../icons";
import { IUser } from "../../interfaces/IUser";
import { upperFirst } from "lodash";
import { isPermitted } from "../../components/can";

const GET_USERS = gql`
  query {
    users {
      _id
      firstName
      lastName
      displayName
      role
      jobTitle
      lastLogin
      imgUrl
      defaultPage
      responsibleCount
      accountableCount
      contributorCount
      followerCount
    }
  }
`;


const UPDATE_USER = gql`
  mutation ($values: UpdateUserModifyInput!) {
    updateUser(updateUserModifyInput: $values) {
      _id
    }
  }
`;

const Users = () => {
  const device = useDevice();
  const { data, loading, refetch } = useQuery(GET_USERS);
  const [updateFunction] = useMutation(UPDATE_USER);
  const [loadingUsers, setLoadingUsers] = useState<string[]>([]);
  const [sortType, setSortType] = useState("displayName");
  const [sortOrder, setSortOrder] = useState(true);

  const getUsers = (usersArray: IUser[]) => {
    if (!usersArray) {
      return [];
    }
    return [...usersArray].sort((a, b) => a.displayName.localeCompare(b.displayName));
  }
  const [users, setUsers] = useState<IUser[]>(getUsers(data?.users));

  useEffect(() => {
    setUsers(getUsers(data?.users));
  }, [data]);

  useEffect(() => {
    if (sortOrder) {
      setUsers([...users].sort((a, b) => {
        return (a[sortType] || 0).toString().localeCompare((b[sortType] || 0).toString())
      }));
    }
    else {
      setUsers([...users].sort((a, b) => {
        return (b[sortType] || 0).toString().localeCompare((a[sortType] || 0).toString())
      }));
    }
  }, [sortType, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  const onHomePageChange = async (e, userId) => {
    setLoadingUsers(currentLoadingUsers => [...currentLoadingUsers, userId]);
    await updateFunction({ variables: { values: { _id: userId, defaultPage: e.target.value } } });
    await refetch();
    setLoadingUsers(currentLoadingUsers => currentLoadingUsers.filter(id => id !== userId));
  };

  const getDefaultPages = (userId) => {
    const pages = [{
      name: "Home Page",
      url: "/"
    }];
    const user = users.find(({ _id }) => _id === userId);

    if (isPermitted({ user, action: 'adminPanel' })) {
      pages.push({
        name: "Admin Page",
        url: "/admin/compliance-items"
      });
    }
    return pages;
  };

  const renderUserRow = (user: IUser, i: number) => (
    <Flex
      key={user._id}
      w='full'
      h='73px'
      flexShrink={0}
      bg='#FFFFFF'
      px="25px"
      mb="1px"
      fontSize="smm"
      alignItems='center'
      borderBottomRadius={(i === data?.users.length - 1) ? [0, 'lg'] : ''}
      boxShadow="sm"
    >
      <Flex w={["80%", "16%"]} >
        <Avatar
          borderColor='brand.active'
          rounded='full'
          name={user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `${user.displayName}`}
          size='sm'
          src={user.imgUrl}
          mr={3}
        />
        <Text lineHeight="32px" textOverflow="ellipsis" noOfLines={1} pr={3}>
          {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `${user.displayName}`}
        </Text>
      </Flex>
      {
        device !== "mobile" && <>
          <Box w='16%'>{user.jobTitle ? user.jobTitle : 'Not specified'}</Box>
          <Box w='16%'>
            {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
          </Box>
          <Flex w="16%" flexDir="column">
            {getDefaultPages(user._id).length === 1 ? (
              <Box>{getDefaultPages(user._id).find(({ url }) => url === user.defaultPage)?.name}</Box>
            ) : (
              loadingUsers.includes(user._id) ? (
                <Flex w="130px">
                  <Loader size='sm' />
                </Flex>
              ) : (
                <Select fontSize='smm'
                  onChange={(e) => onHomePageChange(e, user._id)}
                  variant='unstyled'
                  value={user.defaultPage}
                  w="130px"
                  icon={<ArrowDownIcon ml={3} />}
                >
                  {getDefaultPages(user._id).map((page) => <option key={page.url} value={page.url}>{page.name}</option>)}
                </Select>
              )
            )}
          </Flex>
        </>
      }
      <Flex w="20%" h="100%">
        <UserResponseCount userId={user._id} role="responsible" responseCount={user.responsibleCount} />
        <UserResponseCount userId={user._id} role="accountable" responseCount={user.accountableCount} />
        <UserResponseCount userId={user._id} role="contributor" responseCount={user.contributorCount} />
        <UserResponseCount userId={user._id} role="follower" responseCount={user.followerCount} />
      </Flex>
      <Flex w="calc(16% - 20px)" ml="20px" align='center'>
        {user?.lastLogin ? upperFirst(formatDistanceToNow(new Date(user?.lastLogin), { addSuffix: true })) : 'Never'}
      </Flex>
    </Flex >
  );

  return (
    <>
      <Header breadcrumbs={["Admin", "Users"]} mobileBreadcrumbs={["Users"]} />
      <Flex h='calc(100vh - 160px)' px={["25px", 0]} overflow="auto">
        <Box w='full' h={['calc(100% - 80px)', 'calc(100% - 35px)']} p={[0, "0 25px 30px 30px"]}>
          <AdminTableHeader>
            <AdminTableHeaderElement w={["80%", "16%"]} label="Name" onClick={() => { setSortType("displayName"); setSortOrder(!sortOrder); }} sortOrder={sortType === "displayName" && !sortOrder} showSortingIcon={sortType === "displayName"} />
            {
              device !== "mobile" &&
              <>
                <AdminTableHeaderElement w="16%" label="Job title" onClick={() => { setSortType("jobTitle"); setSortOrder(!sortOrder); }} sortOrder={sortType === "jobTitle" && !sortOrder} showSortingIcon={sortType === "jobTitle"} />
                <AdminTableHeaderElement w="16%" label="Role" onClick={() => { setSortType("role"); setSortOrder(!sortOrder); }} sortOrder={sortType === "role" && !sortOrder} showSortingIcon={sortType === "role"} />
                <AdminTableHeaderElement w="16%" label="Default page" onClick={() => { setSortType("defaultPage"); setSortOrder(!sortOrder); }} sortOrder={sortType === "defaultPage" && !sortOrder} showSortingIcon={sortType === "defaultPage"} />
              </>
            }
            <Flex w="20%">
              <AdminTableHeaderElement w="calc(25% - 13px)" ml="13px" label="R" tooltip="Responsible on number of responses" onClick={() => { setSortType("responsibleCount"); setSortOrder(!sortOrder); }} sortOrder={sortType === "responsibleCount" && !sortOrder} showSortingIcon={sortType === "responsibleCount"} />
              <AdminTableHeaderElement w="calc(25% - 13px)" ml="13px" label="A" tooltip="Accountable on number of responses" onClick={() => { setSortType("accountableCount"); setSortOrder(!sortOrder); }} sortOrder={sortType === "accountableCount" && !sortOrder} showSortingIcon={sortType === "accountableCount"} />
              <AdminTableHeaderElement w="calc(25% - 13px)" ml="13px" label="C" tooltip="Contributor on number of responses" onClick={() => { setSortType("contributorCount"); setSortOrder(!sortOrder); }} sortOrder={sortType === "contributorCount" && !sortOrder} showSortingIcon={sortType === "contributorCount"} />
              <AdminTableHeaderElement w="calc(25% - 13px)" ml="13px" label="F" tooltip="Follower on number of responses" onClick={() => { setSortType("followerCount"); setSortOrder(!sortOrder); }} sortOrder={sortType === "followerCount" && !sortOrder} showSortingIcon={sortType === "followerCount"} />
            </Flex>
            <AdminTableHeaderElement w="calc(16% - 20px)" ml="20px" label="Last login" onClick={() => { setSortType("lastLogin"); setSortOrder(!sortOrder); }} sortOrder={sortType === "lastLogin" && !sortOrder} showSortingIcon={sortType === "lastLogin"} />
          </AdminTableHeader>
          <Flex w='full' flexDir="column" h="full" bg="white" borderBottomRadius="10px" overflow="auto">
            {loading ? <Loader center={true} /> : users.map((user, i) => renderUserRow(user, i))}
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default Users;


export const userItemStyles = {
  userItem: {
    responseCountBg: "#F0F2F5"
  }
}
