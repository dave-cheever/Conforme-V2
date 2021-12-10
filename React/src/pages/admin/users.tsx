import { gql, useMutation, useQuery } from "@apollo/client";
import { 
  Avatar, 
  Box,
  Flex,  
  Select,  
  Text
} from "@chakra-ui/react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { defaultPages } from "../../bootstrap/config";
import AdminTableHeader from "../../components/Admin/AdminTableHeader";
import AdminTableHeaderElement from "../../components/Admin/AdminTableHeaderElement";

import Header from "../../components/Header";
import Loader from "../../components/Loader";
import useDevice from "../../hooks/useDevice";
import {  ArrowDownIcon } from "../../icons";
import { IUser } from "../../interfaces/IUser";

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
  const {data, loading, refetch} = useQuery(GET_USERS);
  const [updateFunction] = useMutation(UPDATE_USER);

  const onHomePageChange = async(e, userId) => {
    await updateFunction({variables: { values: { _id: userId, defaultPage: e.target.value } }});
    refetch();
  }
  
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
      <Flex w={["80%", "20%"]} >
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
        <Box w='20%'>{user.jobTitle ? user.jobTitle : 'Not specified'}</Box>
        <Box w='20%'>
          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
        </Box>
        <Flex w="20%" flexDir="column">
          <Select fontSize='smm'
            onChange={(e) => onHomePageChange(e, user?._id)} 
            variant='unstyled' 
            placeholder='select page' 
            value={user.defaultPage} 
            w="fit-content" 
            icon={<ArrowDownIcon ml={3}/>}
            >
            {defaultPages.map((page) => <option key={page.url} value={page.url}>{page.name}</option>)}
          </Select>
        </Flex>
        </>
      }
      <Flex w='20%' align='center'>
        {formatDistanceToNow(new Date(user?.lastLogin),{ addSuffix: true })}
      </Flex>
    </Flex>
  );

  return (
    <>
      <Header breadcrumbs={["Admin", "Users"]} />
      <Flex h='calc(100vh - 160px)' px={["25px", 0]}>
        <Box w='full' h={['calc(100% - 170px)', 'calc(100% - 35px)']} p={[0, "0 25px 30px 30px"]}>
          <AdminTableHeader>
            <AdminTableHeaderElement w={["80%", "20%"]} label="Name" />
            {
              device !== "mobile" &&
              <>
                <AdminTableHeaderElement w="20%" label="Job title" />
                <AdminTableHeaderElement w="20%" label="Role" />
                <AdminTableHeaderElement w="20%" label="Default page" />
              </>
            }
            <AdminTableHeaderElement w="20%" label="Last login" />
          </AdminTableHeader>
          <Flex w='full' flexDir="column" h="full" bg="white" borderBottomRadius="10px" overflow="auto">
            {loading? <Loader center={true}/>:data?.users?.map((user, i) => renderUserRow(user, i))}
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default Users;
