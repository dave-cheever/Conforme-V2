import { useState } from 'react';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Avatar, Box, Flex, Select, Text } from '@chakra-ui/react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { upperFirst } from 'lodash';

import AdminTableHeader from '../../components/Admin/AdminTableHeader';
import AdminTableHeaderElement from '../../components/Admin/AdminTableHeaderElement';
import { isPermitted } from '../../components/can';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import UserAuditsCount from '../../components/UserAuditsCount';
import UserResponseCount from '../../components/UserResponseCount';
import { useAppContext } from '../../contexts/AppProvider';
import useDevice from '../../hooks/useDevice';
import useSort from '../../hooks/useSort';
import { ArrowDownIcon } from '../../icons';
import { IUser } from '../../interfaces/IUser';

const GET_USERS = gql`
  query {
    users {
      _id
      firstName
      lastName
      displayName
      email
      role
      jobTitle
      lastLogin
      imgUrl
      defaultPage
      responsibleCount
      accountableCount
      contributorCount
      followerCount
      completedAuditsCount
      upcomingAuditsCount
      overdueAuditsCount
      totalAuditsCount
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
  const { module } = useAppContext();
  const device = useDevice();
  const { data, loading, refetch } = useQuery(GET_USERS);
  const [updateFunction] = useMutation(UPDATE_USER);
  const [loadingUsers, setLoadingUsers] = useState<string[]>([]);
  const {
    sortedData: users,
    sortOrder,
    sortType,
    setSortOrder,
    setSortType,
  } = useSort(data?.users ?? [], 'displayName');

  const onHomePageChange = async (e, userId) => {
    setLoadingUsers((currentLoadingUsers) => [...currentLoadingUsers, userId]);
    await updateFunction({
      variables: { values: { _id: userId, defaultPage: e.target.value } },
    });
    await refetch();
    setLoadingUsers((currentLoadingUsers) =>
      currentLoadingUsers.filter((id) => id !== userId),
    );
  };

  const getDefaultPages = (userId) => {
    const pages = [
      {
        name: 'Home Page',
        url: '/',
      },
    ];
    const user = users.find(({ _id }) => _id === userId);

    if (isPermitted({ user, action: 'adminPanel' })) {
      pages.push({
        name: 'Admin Page',
        url: module?.type === 'tracker' ? '/admin/compliance-items' : '/audits',
      });
    }
    return pages;
  };

  const renderCountHeaders = () =>
    module?.type === 'tracker' ? (
      <>
        <AdminTableHeaderElement
          label="R"
          ml="13px"
          onClick={() => {
            setSortType('responsibleCount');
            setSortOrder(!sortOrder);
          }}
          showSortingIcon={sortType === 'responsibleCount'}
          sortOrder={sortType === 'responsibleCount' && !sortOrder}
          tooltip="Responsible on number of responses"
          w="calc(25% - 13px)"
        />
        <AdminTableHeaderElement
          label="A"
          ml="13px"
          onClick={() => {
            setSortType('accountableCount');
            setSortOrder(!sortOrder);
          }}
          showSortingIcon={sortType === 'accountableCount'}
          sortOrder={sortType === 'accountableCount' && !sortOrder}
          tooltip="Accountable on number of responses"
          w="calc(25% - 13px)"
        />
        <AdminTableHeaderElement
          label="C"
          ml="13px"
          onClick={() => {
            setSortType('contributorCount');
            setSortOrder(!sortOrder);
          }}
          showSortingIcon={sortType === 'contributorCount'}
          sortOrder={sortType === 'contributorCount' && !sortOrder}
          tooltip="Contributor on number of responses"
          w="calc(25% - 13px)"
        />
        <AdminTableHeaderElement
          label="F"
          ml="13px"
          onClick={() => {
            setSortType('followerCount');
            setSortOrder(!sortOrder);
          }}
          showSortingIcon={sortType === 'followerCount'}
          sortOrder={sortType === 'followerCount' && !sortOrder}
          tooltip="Follower on number of responses"
          w="calc(25% - 13px)"
        />
      </>
    ) : (
      <>
        <AdminTableHeaderElement
          label="T"
          ml="13px"
          onClick={() => {
            setSortType('totalAuditsCount');
            setSortOrder(!sortOrder);
          }}
          showSortingIcon={sortType === 'totalAuditsCount'}
          sortOrder={sortType === 'totalAuditsCount' && !sortOrder}
          tooltip="Total number of audits"
          w="calc(25% - 13px)"
        />
        <AdminTableHeaderElement
          label="C"
          ml="13px"
          onClick={() => {
            setSortType('completedAuditsCount');
            setSortOrder(!sortOrder);
          }}
          showSortingIcon={sortType === 'completedAuditsCount'}
          sortOrder={sortType === 'completedAuditsCount' && !sortOrder}
          tooltip="Number of completed audits"
          w="calc(25% - 13px)"
        />
        <AdminTableHeaderElement
          label="U"
          ml="13px"
          onClick={() => {
            setSortType('upcomingAuditsCount');
            setSortOrder(!sortOrder);
          }}
          showSortingIcon={sortType === 'upcomingAuditsCount'}
          sortOrder={sortType === 'upcomingAuditsCount' && !sortOrder}
          tooltip="Number of upcoming audits"
          w="calc(25% - 13px)"
        />
        <AdminTableHeaderElement
          label="M"
          ml="13px"
          onClick={() => {
            setSortType('overdueAuditsCount');
            setSortOrder(!sortOrder);
          }}
          showSortingIcon={sortType === 'overdueAuditsCount'}
          sortOrder={sortType === 'overdueAuditsCount' && !sortOrder}
          tooltip="Number of overdue audits"
          w="calc(25% - 13px)"
        />
      </>
    );

  const renderCounts = (user: IUser) =>
    module?.type === 'tracker' ? (
      <>
        <UserResponseCount
          responseCount={user.responsibleCount}
          // eslint-disable-next-line jsx-a11y/aria-role
          role="responsible"
          userId={user._id}
        />
        <UserResponseCount
          responseCount={user.accountableCount}
          // eslint-disable-next-line jsx-a11y/aria-role
          role="accountable"
          userId={user._id}
        />
        <UserResponseCount
          responseCount={user.contributorCount}
          // eslint-disable-next-line jsx-a11y/aria-role
          role="contributor"
          userId={user._id}
        />
        <UserResponseCount
          responseCount={user.followerCount}
          // eslint-disable-next-line jsx-a11y/aria-role
          role="follower"
          userId={user._id}
        />
      </>
    ) : (
      <>
        <UserAuditsCount
          auditsCount={user.totalAuditsCount}
          userId={user._id}
        />
        <UserAuditsCount
          auditsCount={user.completedAuditsCount}
          status="completed"
          userId={user._id}
        />
        <UserAuditsCount
          auditsCount={user.upcomingAuditsCount}
          userId={user._id}
        />
        <UserAuditsCount
          auditsCount={user.overdueAuditsCount}
          userId={user._id}
        />
      </>
    );

  const renderUserRow = (user: IUser, i: number) => (
    <Flex
      alignItems="center"
      bg="#FFFFFF"
      borderBottomRadius={i === data?.users.length - 1 ? [0, 'lg'] : ''}
      boxShadow="sm"
      flexShrink={0}
      fontSize="smm"
      h="73px"
      key={user._id}
      mb="1px"
      px="25px"
      w="full"
    >
      <Flex w={['80%', '16%']}>
        <Avatar
          borderColor="brand.active"
          mr={3}
          name={
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : `${user.displayName}`
          }
          rounded="full"
          size="sm"
          src={user.imgUrl}
        />
        <Text lineHeight="32px" noOfLines={1} pr={3} textOverflow="ellipsis">
          {user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : `${user.displayName}`}
        </Text>
      </Flex>
      {device !== 'mobile' && (
        <>
          <Box w="16%">{user.jobTitle ? user.jobTitle : 'Not specified'}</Box>
          <Box w="16%">
            {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
          </Box>
          <Flex flexDir="column" w="16%">
            {getDefaultPages(user._id).length === 1 ? (
              <Box>
                {
                  getDefaultPages(user._id).find(
                    ({ url }) => url === user.defaultPage,
                  )?.name
                }
              </Box>
            ) : loadingUsers.includes(user._id) ? (
              <Flex w="130px">
                <Loader size="sm" />
              </Flex>
            ) : (
              <Select
                fontSize="smm"
                icon={<ArrowDownIcon ml={3} />}
                onChange={(e) => onHomePageChange(e, user._id)}
                value={user.defaultPage}
                variant="unstyled"
                w="130px"
              >
                {getDefaultPages(user._id).map((page) => (
                  <option key={page.url} value={page.url}>
                    {page.name}
                  </option>
                ))}
              </Select>
            )}
          </Flex>
        </>
      )}
      <Flex h="100%" w="20%">
        {renderCounts(user)}
      </Flex>
      <Flex align="center" ml="20px" w="calc(16% - 20px)">
        {user?.lastLogin
          ? upperFirst(
              formatDistanceToNow(new Date(user?.lastLogin), {
                addSuffix: true,
              }),
            )
          : 'Never'}
      </Flex>
    </Flex>
  );

  return (
    <>
      <Header breadcrumbs={['Admin', 'Users']} mobileBreadcrumbs={['Users']} />
      <Flex h="calc(100vh - 160px)" overflow="auto" px={['25px', 0]}>
        <Box
          h={['calc(100% - 80px)', 'calc(100% - 35px)']}
          p={[0, '0 25px 30px 30px']}
          w="full"
        >
          <AdminTableHeader>
            <AdminTableHeaderElement
              label="Name"
              onClick={() => {
                setSortType('displayName');
                setSortOrder(!sortOrder);
              }}
              showSortingIcon={sortType === 'displayName'}
              sortOrder={sortType === 'displayName' && !sortOrder}
              w={['80%', '16%']}
            />
            {device !== 'mobile' && (
              <>
                <AdminTableHeaderElement
                  label="Job title"
                  onClick={() => {
                    setSortType('jobTitle');
                    setSortOrder(!sortOrder);
                  }}
                  showSortingIcon={sortType === 'jobTitle'}
                  sortOrder={sortType === 'jobTitle' && !sortOrder}
                  w="16%"
                />
                <AdminTableHeaderElement
                  label="Role"
                  onClick={() => {
                    setSortType('role');
                    setSortOrder(!sortOrder);
                  }}
                  showSortingIcon={sortType === 'role'}
                  sortOrder={sortType === 'role' && !sortOrder}
                  w="16%"
                />
                <AdminTableHeaderElement
                  label="Default page"
                  onClick={() => {
                    setSortType('defaultPage');
                    setSortOrder(!sortOrder);
                  }}
                  showSortingIcon={sortType === 'defaultPage'}
                  sortOrder={sortType === 'defaultPage' && !sortOrder}
                  w="16%"
                />
              </>
            )}
            <Flex w="20%">{renderCountHeaders()}</Flex>
            <AdminTableHeaderElement
              label="Last login"
              ml="20px"
              onClick={() => {
                setSortType('lastLogin');
                setSortOrder(!sortOrder);
              }}
              showSortingIcon={sortType === 'lastLogin'}
              sortOrder={sortType === 'lastLogin' && !sortOrder}
              w="calc(16% - 20px)"
            />
          </AdminTableHeader>
          <Flex
            bg="white"
            borderBottomRadius="10px"
            flexDir="column"
            h="full"
            overflow="auto"
            w="full"
          >
            {loading ? (
              <Loader center />
            ) : (
              users.map((user, i) => renderUserRow(user, i))
            )}
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default Users;

export const userItemStyles = {
  userItem: {
    responseCountBg: '#F0F2F5',
    iconColor: '#282F36',
  },
};
