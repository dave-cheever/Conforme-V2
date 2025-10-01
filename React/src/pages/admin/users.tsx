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
          data-id="000587"
          label={
            <Flex align="center" data-id="000588" gap="1">
              <Text data-id="000589">R</Text>
              <Tooltip
                data-id="000590"
                hasArrow
                label="Responsible on number of responses">
                <InfoOutlineIcon
                  boxSize="2.5"
                  color="gray.500"
                  data-id="000591"
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
          data-id="000592"
          label={
            <Flex align="center" data-id="000593" gap="1">
              <Text data-id="000594">A</Text>
              <Tooltip
                data-id="000595"
                hasArrow
                label="Accountable on number of responses">
                <InfoOutlineIcon
                  boxSize="2.5"
                  color="gray.500"
                  data-id="000596"
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
          data-id="000597"
          label={
            <Flex align="center" data-id="000598" gap="1">
              <Text data-id="000599">C</Text>
              <Tooltip
                data-id="000600"
                hasArrow
                label="Contributor on number of responses">
                <InfoOutlineIcon
                  boxSize="2.5"
                  color="gray.500"
                  data-id="000601"
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
          data-id="000602"
          label={
            <Flex align="center" data-id="000603" gap="1">
              <Text data-id="000604">F</Text>
              <Tooltip data-id="000605" hasArrow label="Follower on number of responses">
                <InfoOutlineIcon
                  boxSize="2.5"
                  color="gray.500"
                  data-id="000606"
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
          data-id="000607"
          label={
            <Flex align="center" data-id="000608" gap="1">
              <Text data-id="000609">T</Text>
              <Tooltip
                data-id="000610"
                hasArrow
                label={`Total number of ${pluralize(t('audit'))}`}>
                <InfoOutlineIcon
                  boxSize="2.5"
                  color="gray.500"
                  data-id="000611"
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
          data-id="000612"
          label={
            <Flex align="center" data-id="000613" gap="1">
              <Text data-id="000614">C</Text>
              <Tooltip
                data-id="000615"
                hasArrow
                label={`Number of completed ${pluralize(t('audit'))}`}>
                <InfoOutlineIcon
                  boxSize="2.5"
                  color="gray.500"
                  data-id="000616"
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
          data-id="000617"
          label={
            <Flex align="center" data-id="000618" gap="1">
              <Text data-id="000619">U</Text>
              <Tooltip
                data-id="000620"
                hasArrow
                label={`Number of upcoming ${pluralize(t('audit'))}`}>
                <InfoOutlineIcon
                  boxSize="2.5"
                  color="gray.500"
                  data-id="000621"
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
          data-id="000622"
          label={
            <Flex align="center" data-id="000623" gap="1">
              <Text data-id="000624">M</Text>
              <Tooltip
                data-id="000625"
                hasArrow
                label={`Number of missed ${pluralize(t('audit'))}`}>
                <InfoOutlineIcon
                  boxSize="2.5"
                  color="gray.500"
                  data-id="000626"
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
          data-id="000627"
          responseCount={user.responsibleCount}
          // eslint-disable-next-line jsx-a11y/aria-role
          role="responsible"
          userId={user._id}
        />
        <UserResponseCount
          data-id="000628"
          responseCount={user.accountableCount}
          // eslint-disable-next-line jsx-a11y/aria-role
          role="accountable"
          userId={user._id}
        />
        <UserResponseCount
          data-id="000629"
          responseCount={user.contributorCount}
          // eslint-disable-next-line jsx-a11y/aria-role
          role="contributor"
          userId={user._id}
        />
        <UserResponseCount
          data-id="000630"
          responseCount={user.followerCount}
          // eslint-disable-next-line jsx-a11y/aria-role
          role="follower"
          userId={user._id}
        />
      </>
    ) : (
      <>
        <UserAuditsCount auditsCount={user.totalAuditsCount} data-id="000631" userId={user._id} />
        <UserAuditsCount auditsCount={user.completedAuditsCount} data-id="000632" status="completed" userId={user._id} />
        <UserAuditsCount auditsCount={user.upcomingAuditsCount} data-id="000633" status="upcoming" userId={user._id} />
        <UserAuditsCount auditsCount={user.missedAuditsCount} data-id="000634" status="missed" userId={user._id} />
      </>
    );

  const renderUserRow = (user: IUser, i: number) => {
    const rowBg = i % 2 === 0 ? 'white' : 'gray.50';
    return (
      <Flex
        _hover={{ bg: '#F5F7FA' }}
        alignItems="center"
        bg={rowBg}
        borderBottomColor="auditsList.headerBorderColor"
        borderBottomWidth="1px"
        color="auditsList.fontColor"
        cursor="pointer"
        data-id="000635"
        flexShrink={0}
        fontSize="14px"
        fontWeight="500"
        h="50px"
        key={user._id}
        px="10px"
        w="full"
      >
        <Flex data-id="000636" w={['60%', '16%']}>
          <Avatar
            borderColor="brand.active"
            data-id="000637"
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
          <Text data-id="000638" lineHeight="32px" noOfLines={1} pr={3} textOverflow="ellipsis">
            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `${user.displayName}`}
          </Text>
        </Flex>
        {device !== 'mobile' && (
          <>
            <Box data-id="000639" w="16%">
              {user.jobTitle ? user.jobTitle : 'Not specified'}
            </Box>
            <Box data-id="000640" w="16%">{`${user.role?.charAt(0).toUpperCase()}${user.role?.slice(1)}`}</Box>
            <Flex data-id="000641" flexDir="column" w="16%">
              {getDefaultPages(user._id).length === 1 ? (
                <Box data-id="000642">
                  {
                    getDefaultPages(user._id).find(
                      ({ url }) => url === (Array.isArray(user.defaultPage) ? user.defaultPage[0]?.path : 'N/A'),
                    )?.name
                  }
                </Box>
              ) : loadingUsers.includes(user._id) ? (
                <Flex data-id="000643" w="130px">
                  <Loader data-id="000644" size="sm" />
                </Flex>
              ) : (
                <Select
                  data-id="000645"
                  fontSize="14px"
                  icon={<ArrowDownIcon data-id="000646" h="10px" ml={1} w="10px" />}
                  onChange={(e) => onHomePageChange(e, user._id)}
                  value={user.defaultPage?.find((value) => value.name == module?.name)?.path}
                  variant="unstyled"
                  w="120px"
                >
                  {getDefaultPages(user._id).map((page) => (
                    <option data-id="000647" key={page.url} value={page.url}>
                      {page.name}
                    </option>
                  ))}
                </Select>
              )}
            </Flex>
          </>
        )}
        {device !== 'mobile' && (
          <Flex data-id="000648" h="100%" w="20%">
            {renderCounts(user)}
          </Flex>
        )}
        <Flex align="center" data-id="000649" ml="20px" w={['40%', 'calc(16% - 20px)']}>
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
      <Header breadcrumbs={['Admin', 'Users']} data-id="000650" mobileBreadcrumbs={['Users']} />
      <Flex
        bg="auditsList.bg"
        borderRadius="10px"
        data-id="000651"
        h="calc(100vh - 160px)"
        overflow="auto"
        p={['0', '0 25px 30px 30px']}
      >
        <Flex data-id="000652" h="full" px={['25px', 0]} w="full">
          <Box
          data-id="000653"
          h={['calc(100% - 160px)', 'calc(100% - 35px)']}
           w={['full', 'full', 'calc(100%)']}
        >
          <AdminTableHeader data-id="000654">
            <AdminTableHeaderElement
              data-id="000655"
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
                  data-id="000656"
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
                  data-id="000657"
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
                  data-id="000658"
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
              <Flex data-id="000659" w="20%">
                {renderCountHeaders()}
              </Flex>
            )}
            <AdminTableHeaderElement
              data-id="000660"
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
          <Box bg="auditsList.bg" border="1px solid #cbd5e0" borderBottomRadius="10px" data-id="000661" h="full" overflow="auto" w="full">
            {loading ? <Loader center data-id="000662" /> : users.map((user, i) => renderUserRow(user, i))}
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
