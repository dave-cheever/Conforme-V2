import { useState } from 'react';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Avatar, Box, Flex, Select, Text } from '@chakra-ui/react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { t } from 'i18next';
import { upperFirst } from 'lodash';
import pluralize from 'pluralize';

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
      totalAuditsCount
      completedAuditsCount
      upcomingAuditsCount
      missedAuditsCount
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
  const { sortedData: users, sortOrder, sortType, setSortOrder, setSortType } = useSort(data?.users ?? [], 'displayName');

  const onHomePageChange = async (e, userId) => {
    setLoadingUsers((currentLoadingUsers) => [...currentLoadingUsers, userId]);
    await updateFunction({
      variables: { values: { _id: userId, defaultPage: e.target.value } },
    });
    await refetch();
    setLoadingUsers((currentLoadingUsers) => currentLoadingUsers.filter((id) => id !== userId));
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
        url: module?.type === 'tracker' ? '/admin/tracker-items' : '/audits',
      });
    }
    return pages;
  };

  const renderCountHeaders = () =>
    module?.type === 'tracker' ? (
      <>
        <AdminTableHeaderElement
          data-id="816f54127346"
          label="R"
          ml="13px"
          onClick={() => {
            setSortType('responsibleCount');
            setSortOrder(sortOrder === 'asc' && sortType === 'responsibleCount' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'responsibleCount'}
          sortOrder={sortType === 'responsibleCount' ? sortOrder : undefined}
          tooltip="Responsible on number of responses"
          w="calc(25% - 13px)" />
        <AdminTableHeaderElement
          data-id="ae67569ac89c"
          label="A"
          ml="13px"
          onClick={() => {
            setSortType('accountableCount');
            setSortOrder(sortOrder === 'asc' && sortType === 'accountableCount' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'accountableCount'}
          sortOrder={sortType === 'accountableCount' ? sortOrder : undefined}
          tooltip="Accountable on number of responses"
          w="calc(25% - 13px)" />
        <AdminTableHeaderElement
          data-id="7eefc7a20c98"
          label="C"
          ml="13px"
          onClick={() => {
            setSortType('contributorCount');
            setSortOrder(sortOrder === 'asc' && sortType === 'contributorCount' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'contributorCount'}
          sortOrder={sortType === 'contributorCount' ? sortOrder : undefined}
          tooltip="Contributor on number of responses"
          w="calc(25% - 13px)" />
        <AdminTableHeaderElement
          data-id="38060c94261b"
          label="F"
          ml="13px"
          onClick={() => {
            setSortType('followerCount');
            setSortOrder(sortOrder === 'asc' && sortType === 'followerCount' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'followerCount'}
          sortOrder={sortType === 'followerCount' ? sortOrder : undefined}
          tooltip="Follower on number of responses"
          w="calc(25% - 13px)" />
      </>
    ) : (
      <>
        <AdminTableHeaderElement
          data-id="e756e05b6f34"
          label="T"
          ml="13px"
          onClick={() => {
            setSortType('totalAuditsCount');
            setSortOrder(sortOrder === 'asc' && sortType === 'totalAuditsCount' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'totalAuditsCount'}
          sortOrder={sortType === 'totalAuditsCount' ? sortOrder : undefined}
          tooltip={`Total number of ${pluralize(t('audit'))}`}
          w="calc(25% - 13px)" />
        <AdminTableHeaderElement
          data-id="3d691d6ab0b1"
          label="C"
          ml="13px"
          onClick={() => {
            setSortType('completedAuditsCount');
            setSortOrder(sortOrder === 'asc' && sortType === 'completedAuditsCount' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'completedAuditsCount'}
          sortOrder={sortType === 'completedAuditsCount' ? sortOrder : undefined}
          tooltip={`Number of completed ${pluralize(t('audit'))}`}
          w="calc(25% - 13px)" />
        <AdminTableHeaderElement
          data-id="e7c41813879a"
          label="U"
          ml="13px"
          onClick={() => {
            setSortType('upcomingAuditsCount');
            setSortOrder(sortOrder === 'asc' && sortType === 'upcomingAuditsCount' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'upcomingAuditsCount'}
          sortOrder={sortType === 'upcomingAuditsCount' ? sortOrder : undefined}
          tooltip={`Number of upcoming ${pluralize(t('audit'))}`}
          w="calc(25% - 13px)" />
        <AdminTableHeaderElement
          data-id="3eaecbcd7b51"
          label="M"
          ml="13px"
          onClick={() => {
            setSortType('missedAuditsCount');
            setSortOrder(sortOrder === 'asc' && sortType === 'missedAuditsCount' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'missedAuditsCount'}
          sortOrder={sortType === 'missedAuditsCount' ? sortOrder : undefined}
          tooltip={`Number of missed ${pluralize(t('audit'))}`}
          w="calc(25% - 13px)" />
      </>
    );

  const renderCounts = (user: IUser) =>
    module?.type === 'tracker' ? (
      <>
        <UserResponseCount
          data-id="7dc7d7829d3b"
          responseCount={user.responsibleCount}
          // eslint-disable-next-line jsx-a11y/aria-role
          role="responsible"
          userId={user._id} />
        <UserResponseCount
          data-id="4d832f239723"
          responseCount={user.accountableCount}
          // eslint-disable-next-line jsx-a11y/aria-role
          role="accountable"
          userId={user._id} />
        <UserResponseCount
          data-id="80cae009aaa6"
          responseCount={user.contributorCount}
          // eslint-disable-next-line jsx-a11y/aria-role
          role="contributor"
          userId={user._id} />
        <UserResponseCount
          data-id="de3e47004a21"
          responseCount={user.followerCount}
          // eslint-disable-next-line jsx-a11y/aria-role
          role="follower"
          userId={user._id} />
      </>
    ) : (
      <>
        <UserAuditsCount
          auditsCount={user.totalAuditsCount}
          data-id="6bf7d4a1c513"
          userId={user._id} />
        <UserAuditsCount
          auditsCount={user.completedAuditsCount}
          data-id="b51bc5e0d27c"
          status="completed"
          userId={user._id} />
        <UserAuditsCount
          auditsCount={user.upcomingAuditsCount}
          data-id="bd665a6218dc"
          status="upcoming"
          userId={user._id} />
        <UserAuditsCount
          auditsCount={user.missedAuditsCount}
          data-id="c8dfa16df76d"
          status="missed"
          userId={user._id} />
      </>
    );

  const renderUserRow = (user: IUser, i: number) => (
    <Flex
      alignItems="center"
      bg="#FFFFFF"
      borderBottomRadius={i === data?.users.length - 1 ? [0, 'lg'] : ''}
      boxShadow="sm"
      data-id="246eb1efe836"
      flexShrink={0}
      fontSize="smm"
      h="73px"
      key={user._id}
      mb="1px"
      px="25px"
      w="full">
      <Flex data-id="c22d9407defe" w={['60%', '16%']}>
        <Avatar
          borderColor="brand.active"
          data-id="192faa91d5b5"
          mr={3}
          name={user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `${user.displayName}`}
          rounded="full"
          size="sm"
          src={user.imgUrl} />
        <Text
          data-id="de1f5f7f86ed"
          lineHeight="32px"
          noOfLines={1}
          pr={3}
          textOverflow="ellipsis">
          {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `${user.displayName}`}
        </Text>
      </Flex>
      {device !== 'mobile' && (
        <>
          <Box data-id="fd0475afcc93" w="16%">{user.jobTitle ? user.jobTitle : 'Not specified'}</Box>
          <Box data-id="ab4ef3862b03" w="16%">{user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}</Box>
          <Flex data-id="8f0afdfdd223" flexDir="column" w="16%">
            {getDefaultPages(user._id).length === 1 ? (
              <Box data-id="db4de0041d43">{getDefaultPages(user._id).find(({ url }) => url === user.defaultPage)?.name}</Box>
            ) : loadingUsers.includes(user._id) ? (
              <Flex data-id="fb8ef86f4542" w="130px">
                <Loader data-id="94999430ea63" size="sm" />
              </Flex>
            ) : (
              <Select
                data-id="e7aea8b47276"
                fontSize="smm"
                icon={<ArrowDownIcon data-id="265a8477f9a0" ml={3} />}
                onChange={(e) => onHomePageChange(e, user._id)}
                value={user.defaultPage}
                variant="unstyled"
                w="130px">
                {getDefaultPages(user._id).map((page) => (
                  <option data-id="970f8a391c50" key={page.url} value={page.url}>
                    {page.name}
                  </option>
                ))}
              </Select>
            )}
          </Flex>
        </>
      )}
      {device !== 'mobile' && (
        <Flex data-id="7f9dbf52c072" h="100%" w="20%">
          {renderCounts(user)}
        </Flex>
      )}
      <Flex
        align="center"
        data-id="697af222a4a8"
        ml="20px"
        w={['40%', 'calc(16% - 20px)']}>
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

  return (<>
    <Header
      breadcrumbs={['Admin', 'Users']}
      data-id="c938e2500b46"
      mobileBreadcrumbs={['Users']} />
    <Flex
      data-id="3557cac5f756"
      h="calc(100vh - 160px)"
      overflow="auto"
      px={['25px', 0]}>
      <Box
        data-id="b039112968ee"
        h={['calc(100% - 160px)', 'calc(100% - 35px)']}
        p={[0, '0 25px 30px 30px']}
        w="full">
        <AdminTableHeader data-id="3350252466f2">
          <AdminTableHeaderElement
            data-id="bf4bde40a93b"
            label="Name"
            onClick={() => {
              setSortType('displayName');
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'displayName'}
            sortOrder={sortType === 'displayName' ? sortOrder : undefined}
            w={['60%', '16%']} />
          {device !== 'mobile' && (
            <>
              <AdminTableHeaderElement
                data-id="44887e874a38"
                label="Job title"
                onClick={() => {
                  setSortType('jobTitle');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
                showSortingIcon={sortType === 'jobTitle'}
                sortOrder={sortType === 'jobTitle' ? sortOrder : undefined}
                w="16%" />
              <AdminTableHeaderElement
                data-id="d1f933e1286b"
                label="Role"
                onClick={() => {
                  setSortType('role');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
                showSortingIcon={sortType === 'role'}
                sortOrder={sortType === 'role' ? sortOrder : undefined}
                w="16%" />
              <AdminTableHeaderElement
                data-id="16a52098a7bd"
                label="Default page"
                onClick={() => {
                  setSortType('defaultPage');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
                showSortingIcon={sortType === 'defaultPage'}
                sortOrder={sortType === 'defaultPage' ? sortOrder : undefined}
                w="16%" />
            </>
          )}
          {device !== 'mobile' && <Flex data-id="a9a0c8fec433" w="20%">{renderCountHeaders()}</Flex>}
          <AdminTableHeaderElement
            data-id="6804bd5d7bbe"
            label="Last login"
            ml="20px"
            onClick={() => {
              setSortType('lastLogin');
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'lastLogin'}
            sortOrder={sortType === 'lastLogin' ? sortOrder : undefined}
            w={['40%', 'calc(16% - 20px)']} />
        </AdminTableHeader>
        <Flex
          bg="white"
          borderBottomRadius="10px"
          data-id="e22951ab0519"
          flexDir="column"
          h="full"
          overflow="auto"
          w="full">
          {loading ? <Loader center data-id="2cafeec1cd87" /> : users.map((user, i) => renderUserRow(user, i))}
        </Flex>
      </Box>
    </Flex>
  </>);
};

export default Users;

export const userItemStyles = {
  userItem: {
    responseCountBg: '#F0F2F5',
    iconColor: '#282F36',
  },
};
