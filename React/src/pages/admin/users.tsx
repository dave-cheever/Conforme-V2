import { useState } from 'react';

import { gql, useMutation, useQuery } from '@apollo/client';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Avatar, Box, Flex, Select, Text, Tooltip } from '@chakra-ui/react';
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
import useNavigate from '../../hooks/useNavigate';
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
      defaultPage {
        name
        path
      }
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

function Users() {
  const { module } = useAppContext();
  const device = useDevice();
  const { navigateTo } = useNavigate();
  const { data, loading, refetch } = useQuery(GET_USERS);
  const [updateFunction] = useMutation(UPDATE_USER);
  const [loadingUsers, setLoadingUsers] = useState<string[]>([]);
  const { sortedData: users, sortOrder, sortType, setSortOrder, setSortType } = useSort(data?.users ?? [], 'displayName');

  const onHomePageChange = async (e, userId) => {
    setLoadingUsers((currentLoadingUsers) => [...currentLoadingUsers, userId]);
    await updateFunction({
      variables: { values: { _id: userId, defaultPage: [{ name: module?.name, path: e.target.value }] } },
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
        url: module?.type === 'tracker' ? `/${module?.path}/admin/tracker-items` : `/${module?.path}/admin/audit-types`,
      });
    }
    return pages;
  };

  const renderCountHeaders = () =>
    module?.type === 'tracker' ? (
      <>
        <AdminTableHeaderElement
          data-id="030925-0d2edb"
          label={
            <Flex data-id="030925-be8ccb" align="center" gap="1">
              <Text data-id="030925-15d84c">R</Text>
              <Tooltip
                data-id="030925-5ae133"
                hasArrow
                label="Responsible on number of responses">
                <InfoOutlineIcon
                  data-id="030925-00817c"
                  boxSize="2.5"
                  color="gray.500"
                  marginTop={-2}
                  onClick={() => {
                    navigateTo('/help');
                  }} />
              </Tooltip>
            </Flex>
          }
          ml="13px"
          onClick={() => {
            setSortType('responsibleCount');
            setSortOrder(sortOrder === 'asc' && sortType === 'responsibleCount' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'responsibleCount'}
          sortOrder={sortType === 'responsibleCount' ? sortOrder : undefined}
          w="calc(25% - 13px)"
        />
        <AdminTableHeaderElement
          data-id="030925-209167"
          label={
            <Flex data-id="030925-d1f565" align="center" gap="1">
              <Text data-id="030925-41acd3">A</Text>
              <Tooltip
                data-id="030925-a9bf46"
                hasArrow
                label="Accountable on number of responses">
                <InfoOutlineIcon
                  data-id="030925-2d0b39"
                  boxSize="2.5"
                  color="gray.500"
                  marginTop={-2}
                  onClick={() => {
                    navigateTo('/help');
                  }} />
              </Tooltip>
            </Flex>
          }
          ml="13px"
          onClick={() => {
            setSortType('accountableCount');
            setSortOrder(sortOrder === 'asc' && sortType === 'accountableCount' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'accountableCount'}
          sortOrder={sortType === 'accountableCount' ? sortOrder : undefined}
          w="calc(25% - 13px)"
        />
        <AdminTableHeaderElement
          data-id="030925-ea1fe8"
          label={
            <Flex data-id="030925-f63e76" align="center" gap="1">
              <Text data-id="030925-e96f83">C</Text>
              <Tooltip
                data-id="030925-c2b597"
                hasArrow
                label="Contributor on number of responses">
                <InfoOutlineIcon
                  data-id="030925-193ed7"
                  boxSize="2.5"
                  color="gray.500"
                  marginTop={-2}
                  onClick={() => {
                    navigateTo('/help');
                  }} />
              </Tooltip>
            </Flex>
          }
          ml="13px"
          onClick={() => {
            setSortType('contributorCount');
            setSortOrder(sortOrder === 'asc' && sortType === 'contributorCount' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'contributorCount'}
          sortOrder={sortType === 'contributorCount' ? sortOrder : undefined}
          w="calc(25% - 13px)"
        />
        <AdminTableHeaderElement
          data-id="030925-ab5e8b"
          label={
            <Flex data-id="030925-cc252f" align="center" gap="1">
              <Text data-id="030925-1d9e2a">F</Text>
              <Tooltip data-id="030925-9c0f1c" hasArrow label="Follower on number of responses">
                <InfoOutlineIcon
                  data-id="030925-ea77df"
                  boxSize="2.5"
                  color="gray.500"
                  marginTop={-2}
                  onClick={() => {
                    navigateTo('/help');
                  }} />
              </Tooltip>
            </Flex>
          }
          ml="13px"
          onClick={() => {
            setSortType('followerCount');
            setSortOrder(sortOrder === 'asc' && sortType === 'followerCount' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'followerCount'}
          sortOrder={sortType === 'followerCount' ? sortOrder : undefined}
          w="calc(25% - 13px)"
        />
      </>
    ) : (
      <>
        <AdminTableHeaderElement
          data-id="030925-7031e6"
          label={
            <Flex data-id="030925-8f0851" align="center" gap="1">
              <Text data-id="030925-4a1413">T</Text>
              <Tooltip
                data-id="030925-ce4875"
                hasArrow
                label={`Total number of ${pluralize(t('audit'))}`}>
                <InfoOutlineIcon
                  data-id="030925-4d83d9"
                  boxSize="2.5"
                  color="gray.500"
                  marginTop={-2}
                  onClick={() => {
                    navigateTo('/help');
                  }} />
              </Tooltip>
            </Flex>
          }
          ml="13px"
          onClick={() => {
            setSortType('totalAuditsCount');
            setSortOrder(sortOrder === 'asc' && sortType === 'totalAuditsCount' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'totalAuditsCount'}
          sortOrder={sortType === 'totalAuditsCount' ? sortOrder : undefined}
          w="calc(25% - 13px)"
        />
        <AdminTableHeaderElement
          data-id="030925-a83104"
          label={
            <Flex data-id="030925-f622ff" align="center" gap="1">
              <Text data-id="030925-0f594d">C</Text>
              <Tooltip
                data-id="030925-af8dc5"
                hasArrow
                label={`Number of completed ${pluralize(t('audit'))}`}>
                <InfoOutlineIcon
                  data-id="030925-996c38"
                  boxSize="2.5"
                  color="gray.500"
                  marginTop={-2}
                  onClick={() => {
                    navigateTo('/help');
                  }} />
              </Tooltip>
            </Flex>
          }
          ml="13px"
          onClick={() => {
            setSortType('completedAuditsCount');
            setSortOrder(sortOrder === 'asc' && sortType === 'completedAuditsCount' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'completedAuditsCount'}
          sortOrder={sortType === 'completedAuditsCount' ? sortOrder : undefined}
          w="calc(25% - 13px)"
        />
        <AdminTableHeaderElement
          data-id="030925-bcfa9f"
          label={
            <Flex data-id="030925-416d10" align="center" gap="1">
              <Text data-id="030925-a34b94">U</Text>
              <Tooltip
                data-id="030925-be192e"
                hasArrow
                label={`Number of upcoming ${pluralize(t('audit'))}`}>
                <InfoOutlineIcon
                  data-id="030925-422b79"
                  boxSize="2.5"
                  color="gray.500"
                  marginTop={-2}
                  onClick={() => {
                    navigateTo('/help');
                  }} />
              </Tooltip>
            </Flex>
          }
          ml="13px"
          onClick={() => {
            setSortType('upcomingAuditsCount');
            setSortOrder(sortOrder === 'asc' && sortType === 'upcomingAuditsCount' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'upcomingAuditsCount'}
          sortOrder={sortType === 'upcomingAuditsCount' ? sortOrder : undefined}
          w="calc(25% - 13px)"
        />
        <AdminTableHeaderElement
          data-id="030925-e17e19"
          label={
            <Flex data-id="030925-411a81" align="center" gap="1">
              <Text data-id="030925-f7a715">M</Text>
              <Tooltip
                data-id="030925-2a678d"
                hasArrow
                label={`Number of missed ${pluralize(t('audit'))}`}>
                <InfoOutlineIcon
                  data-id="030925-194d9e"
                  boxSize="2.5"
                  color="gray.500"
                  marginTop={-2}
                  onClick={() => {
                    navigateTo('/help');
                  }} />
              </Tooltip>
            </Flex>
          }
          ml="13px"
          onClick={() => {
            setSortType('missedAuditsCount');
            setSortOrder(sortOrder === 'asc' && sortType === 'missedAuditsCount' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'missedAuditsCount'}
          sortOrder={sortType === 'missedAuditsCount' ? sortOrder : undefined}
          w="calc(25% - 13px)"
        />
      </>
    );

  const renderCounts = (user: IUser) =>
    module?.type === 'tracker' ? (
      <>
        <UserResponseCount
          data-id="030925-35c07c"
          responseCount={user.responsibleCount}
          // eslint-disable-next-line jsx-a11y/aria-role
          role="responsible"
          userId={user._id}
        />
        <UserResponseCount
          data-id="030925-516b12"
          responseCount={user.accountableCount}
          // eslint-disable-next-line jsx-a11y/aria-role
          role="accountable"
          userId={user._id}
        />
        <UserResponseCount
          data-id="030925-cd89b3"
          responseCount={user.contributorCount}
          // eslint-disable-next-line jsx-a11y/aria-role
          role="contributor"
          userId={user._id}
        />
        <UserResponseCount
          data-id="030925-d071fd"
          responseCount={user.followerCount}
          // eslint-disable-next-line jsx-a11y/aria-role
          role="follower"
          userId={user._id}
        />
      </>
    ) : (
      <>
        <UserAuditsCount data-id="030925-d4d82a" auditsCount={user.totalAuditsCount} userId={user._id} />
        <UserAuditsCount data-id="030925-125159" auditsCount={user.completedAuditsCount} status="completed" userId={user._id} />
        <UserAuditsCount data-id="030925-82e1cd" auditsCount={user.upcomingAuditsCount} status="upcoming" userId={user._id} />
        <UserAuditsCount data-id="030925-4a2706" auditsCount={user.missedAuditsCount} status="missed" userId={user._id} />
      </>
    );

  const renderUserRow = (user: IUser, i: number) => {
    const rowBg = i % 2 === 0 ? 'white' : 'gray.50';
    return (
      <Flex
        data-id="030925-727fd7"
        _hover={{ bg: '#F5F7FA' }}
        alignItems="center"
        bg={rowBg}
        borderBottomColor="auditsList.headerBorderColor"
        borderBottomWidth="1px"
        color="auditsList.fontColor"
        cursor="pointer"
        flexShrink={0}
        fontSize="14px"
        fontWeight="500"
        h="50px"
        key={user._id}
        px="10px"
        w="full"
      >
        <Flex data-id="030925-9ff998" w={['60%', '16%']}>
          <Avatar
            data-id="030925-605c2d"
            borderColor="brand.active"
            mr={3}
            name={
              (user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.displayName
              )?.replace(/\s*\(.*?\)\s*/g, '')
            }
            rounded="full"
            size="sm"
            src={user.imgUrl}
          />
          <Text data-id="030925-3d4921" lineHeight="32px" noOfLines={1} pr={3} textOverflow="ellipsis">
            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `${user.displayName}`}
          </Text>
        </Flex>
        {device !== 'mobile' && (
          <>
            <Box data-id="030925-3053a3" w="16%">
              {user.jobTitle ? user.jobTitle : 'Not specified'}
            </Box>
            <Box data-id="030925-07feb6" w="16%">{`${user.role?.charAt(0).toUpperCase()}${user.role?.slice(1)}`}</Box>
            <Flex data-id="030925-dc2dad" flexDir="column" w="16%">
              {getDefaultPages(user._id).length === 1 ? (
                <Box data-id="030925-86790d">
                  {
                    getDefaultPages(user._id).find(
                      ({ url }) => url === (Array.isArray(user.defaultPage) ? user.defaultPage[0]?.path : 'N/A'),
                    )?.name
                  }
                </Box>
              ) : loadingUsers.includes(user._id) ? (
                <Flex data-id="030925-ce6764" w="130px">
                  <Loader data-id="030925-1ff569" size="sm" />
                </Flex>
              ) : (
                <Select
                  data-id="030925-1daf01"
                  fontSize="14px"
                  icon={<ArrowDownIcon data-id="030925-02199c" h="10px" ml={1} w="10px" />}
                  onChange={(e) => onHomePageChange(e, user._id)}
                  value={user.defaultPage?.find((value) => value.name == module?.name)?.path}
                  variant="unstyled"
                  w="120px"
                >
                  {getDefaultPages(user._id).map((page) => (
                    <option data-id="030925-a17a4b" key={page.url} value={page.url}>
                      {page.name}
                    </option>
                  ))}
                </Select>
              )}
            </Flex>
          </>
        )}
        {device !== 'mobile' && (
          <Flex data-id="030925-a4de86" h="100%" w="20%">
            {renderCounts(user)}
          </Flex>
        )}
        <Flex data-id="030925-78d42c" align="center" ml="20px" w={['40%', 'calc(16% - 20px)']}>
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
  };

  return (
    <>
      <Header data-id="030925-ad049d" breadcrumbs={['Admin', 'Users']} mobileBreadcrumbs={['Users']} />
      <Flex
        data-id="030925-007b42"
        bg="auditsList.bg"
        borderRadius="10px"
        h="calc(100vh - 160px)"
        overflow="auto"
        p={['0', '0 25px 30px 30px']}
      >
        <Flex data-id="030925-fbb8f9" h="full" px={['25px', 0]} w="full">
          <Box
          data-id="030925-56c397"
          h={['calc(100% - 160px)', 'calc(100% - 35px)']}
           w={['full', 'full', 'calc(100%)']}
        >
          <AdminTableHeader data-id="030925-cc7df4">
            <AdminTableHeaderElement
              data-id="030925-228679"
              label="Name"
              onClick={() => {
                setSortType('displayName');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              showSortingIcon={sortType === 'displayName'}
              sortOrder={sortType === 'displayName' ? sortOrder : undefined}
              w={['60%', '16%']}
            />
            {device !== 'mobile' && (
              <>
                <AdminTableHeaderElement
                  data-id="030925-fab791"
                  label="Job title"
                  onClick={() => {
                    setSortType('jobTitle');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  showSortingIcon={sortType === 'jobTitle'}
                  sortOrder={sortType === 'jobTitle' ? sortOrder : undefined}
                  w="16%"
                />
                <AdminTableHeaderElement
                  data-id="030925-d44f6c"
                  label="Role"
                  onClick={() => {
                    setSortType('role');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  showSortingIcon={sortType === 'role'}
                  sortOrder={sortType === 'role' ? sortOrder : undefined}
                  w="16%"
                />
                <AdminTableHeaderElement
                  data-id="030925-e5dbe5"
                  label="Default page"
                  onClick={() => {
                    setSortType('defaultPage');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  showSortingIcon={sortType === 'defaultPage'}
                  sortOrder={sortType === 'defaultPage' ? sortOrder : undefined}
                  w="16%"
                />
              </>
            )}
            {device !== 'mobile' && (
              <Flex data-id="030925-b45308" w="20%">
                {renderCountHeaders()}
              </Flex>
            )}
            <AdminTableHeaderElement
              data-id="030925-d76989"
              label="Last login"
              ml="20px"
              onClick={() => {
                setSortType('lastLogin');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              showSortingIcon={sortType === 'lastLogin'}
              sortOrder={sortType === 'lastLogin' ? sortOrder : undefined}
              w={['40%', 'calc(16% - 20px)']}
            />
          </AdminTableHeader>
          <Box data-id="030925-cdf2f8" bg="auditsList.bg" border="1px solid #cbd5e0" borderBottomRadius="10px" h="full" overflow="auto" w="full">
            {loading ? <Loader data-id="030925-365fa5" center /> : users.map((user, i) => renderUserRow(user, i))}
          </Box>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}

export default Users;

export const userItemStyles = {
  userItem: {
    responseCountBg: '#F0F2F5',
    iconColor: '#282F36',
  },
};
