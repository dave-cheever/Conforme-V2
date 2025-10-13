import { useState } from 'react';

import { gql, useMutation, useQuery } from '@apollo/client';
import { ChevronDownIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Flex, Select, Text, Tooltip } from '@chakra-ui/react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { t } from 'i18next';
import { upperFirst } from 'lodash';
import pluralize from 'pluralize';

import { isPermitted } from '../../components/can';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import AvatarCell from '../../components/Table/Cells/AvatarCell';
import TextOrNumberCell from '../../components/Table/Cells/TextOrNumberCell';
import ListView, { ColumnConfig } from '../../components/Table/ListView';
import UserAuditsCount from '../../components/UserAuditsCount';
import UserResponseCount from '../../components/UserResponseCount';
import { useAppContext } from '../../contexts/AppProvider';
import useDevice from '../../hooks/useDevice';
import useNavigate from '../../hooks/useNavigate';
import useSort from '../../hooks/useSort';
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

  // Define columns for ListView
  const columns: ColumnConfig[] = [
    {
      label: 'Name',
      sortKey: 'displayName',
      width: '16%',
      dataId: 'users-col-name',
      render: (user: IUser) => <AvatarCell data-id="001217" users={user ? [user] : []} />,
    },
    {
      label: 'Job title',
      sortKey: 'jobTitle',
      width: '16%',
      dataId: 'users-col-jobTitle',
      disabled: device === 'mobile' || device === 'tablet',
      render: (user: IUser) => (
        <TextOrNumberCell data-id="002098" fallbackText="Not specified" text={user.jobTitle ? user.jobTitle : 'Not specified'} />
      ),
    },
    {
      label: 'Role',
      sortKey: 'role',
      width: '16%',
      dataId: 'users-col-role',
      disabled: device === 'mobile' || device === 'tablet',
      render: (user: IUser) => <TextOrNumberCell data-id="002099" text={`${user.role?.charAt(0).toUpperCase()}${user.role?.slice(1)}`} />,
    },
    {
      label: 'Default page',
      sortKey: 'defaultPage',
      width: '16%',
      dataId: 'users-col-defaultPage',
      disableSort: true,
      disabled: device === 'mobile' || device === 'tablet',
      render: (user: IUser) => {
        const renderDefaultPageCell = () => {
          if (getDefaultPages(user._id).length === 1) {
            return (
              <TextOrNumberCell
                data-id="002100"
                text={
                  getDefaultPages(user._id).find(({ url }) => url === (Array.isArray(user.defaultPage) ? user.defaultPage[0]?.path : 'N/A'))
                    ?.name
                }
              />
            );
          }

          if (loadingUsers.includes(user._id)) {
            return (
              <Flex data-id="001973" w="130px">
                <Loader data-id="000644" size="sm" />
              </Flex>
            );
          }

          return (
            <Select
              data-id="000645"
              fontSize="14px"
              fontWeight="500"
              icon={<ChevronDownIcon data-id="000646" h="10px" w="10px" />}
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
          );
        };

        return (
          <Flex data-id="001971" flexDir="column" w="full">
            {renderDefaultPageCell()}
          </Flex>
        );
      },
    },
    ...(module?.type === 'tracker'
      ? ([
          {
            label: (
              <Flex align="center" data-id="001974" gap="1">
                <Text data-id="001975">R</Text>
                <Tooltip data-id="001976" hasArrow label="Responsible on number of responses">
                  <InfoOutlineIcon boxSize="2.5" color="gray.500" data-id="001977" marginTop={-2} onClick={() => navigateTo('/help')} />
                </Tooltip>
              </Flex>
            ),
            sortKey: 'responsibleCount',
            width: '5%',
            dataId: 'users-col-responsible',
            disabled: device === 'mobile' || device === 'tablet',
            render: (user: IUser) => (
              <UserResponseCount data-id="000627" responseCount={user.responsibleCount} userId={user._id} userRole="responsible" />
            ),
          },
          {
            label: (
              <Flex align="center" data-id="001978" gap="1">
                <Text data-id="001979">A</Text>
                <Tooltip data-id="001980" hasArrow label="Accountable on number of responses">
                  <InfoOutlineIcon boxSize="2.5" color="gray.500" data-id="001981" marginTop={-2} onClick={() => navigateTo('/help')} />
                </Tooltip>
              </Flex>
            ),
            sortKey: 'accountableCount',
            width: '5%',
            dataId: 'users-col-accountable',
            disabled: device === 'mobile' || device === 'tablet',
            render: (user: IUser) => (
              <UserResponseCount data-id="000628" responseCount={user.accountableCount} userId={user._id} userRole="accountable" />
            ),
          },
          {
            label: (
              <Flex align="center" data-id="001982" gap="1">
                <Text data-id="001983">C</Text>
                <Tooltip data-id="001984" hasArrow label="Contributor on number of responses">
                  <InfoOutlineIcon boxSize="2.5" color="gray.500" data-id="001985" marginTop={-2} onClick={() => navigateTo('/help')} />
                </Tooltip>
              </Flex>
            ),
            sortKey: 'contributorCount',
            width: '5%',
            dataId: 'users-col-contributor',
            disabled: device === 'mobile' || device === 'tablet',
            render: (user: IUser) => (
              <UserResponseCount data-id="000629" responseCount={user.contributorCount} userId={user._id} userRole="contributor" />
            ),
          },
          {
            label: (
              <Flex align="center" data-id="001986" gap="1">
                <Text data-id="001987">F</Text>
                <Tooltip data-id="001988" hasArrow label="Follower on number of responses">
                  <InfoOutlineIcon boxSize="2.5" color="gray.500" data-id="001989" marginTop={-2} onClick={() => navigateTo('/help')} />
                </Tooltip>
              </Flex>
            ),
            sortKey: 'followerCount',
            width: '5%',
            dataId: 'users-col-follower',
            disabled: device === 'mobile' || device === 'tablet',
            render: (user: IUser) => (
              <UserResponseCount data-id="000630" responseCount={user.followerCount} userId={user._id} userRole="follower" />
            ),
          },
        ] as ColumnConfig[])
      : ([
          {
            label: (
              <Flex align="center" data-id="001990" gap="1">
                <Text data-id="001991">T</Text>
                <Tooltip data-id="001992" hasArrow label={`Total number of ${pluralize(t('audit'))}`}>
                  <InfoOutlineIcon boxSize="2.5" color="gray.500" data-id="001993" marginTop={-2} onClick={() => navigateTo('/help')} />
                </Tooltip>
              </Flex>
            ),
            sortKey: 'totalAuditsCount',
            width: '5%',
            dataId: 'users-col-totalAudits',
            disabled: device === 'mobile' || device === 'tablet',
            render: (user: IUser) => <UserAuditsCount auditsCount={user.totalAuditsCount} data-id="000631" userId={user._id} />,
          },
          {
            label: (
              <Flex align="center" data-id="001994" gap="1">
                <Text data-id="001995">C</Text>
                <Tooltip data-id="001996" hasArrow label={`Number of completed ${pluralize(t('audit'))}`}>
                  <InfoOutlineIcon boxSize="2.5" color="gray.500" data-id="001997" marginTop={-2} onClick={() => navigateTo('/help')} />
                </Tooltip>
              </Flex>
            ),
            sortKey: 'completedAuditsCount',
            width: '5%',
            dataId: 'users-col-completedAudits',
            disabled: device === 'mobile' || device === 'tablet',
            render: (user: IUser) => (
              <UserAuditsCount auditsCount={user.completedAuditsCount} data-id="000632" status="completed" userId={user._id} />
            ),
          },
          {
            label: (
              <Flex align="center" data-id="001998" gap="1">
                <Text data-id="001999">U</Text>
                <Tooltip data-id="002000" hasArrow label={`Number of upcoming ${pluralize(t('audit'))}`}>
                  <InfoOutlineIcon boxSize="2.5" color="gray.500" data-id="002001" marginTop={-2} onClick={() => navigateTo('/help')} />
                </Tooltip>
              </Flex>
            ),
            sortKey: 'upcomingAuditsCount',
            width: '5%',
            dataId: 'users-col-upcomingAudits',
            disabled: device === 'mobile' || device === 'tablet',
            render: (user: IUser) => (
              <UserAuditsCount auditsCount={user.upcomingAuditsCount} data-id="000633" status="upcoming" userId={user._id} />
            ),
          },
          {
            label: (
              <Flex align="center" data-id="002002" gap="1">
                <Text data-id="002003">M</Text>
                <Tooltip data-id="002004" hasArrow label={`Number of missed ${pluralize(t('audit'))}`}>
                  <InfoOutlineIcon boxSize="2.5" color="gray.500" data-id="002005" marginTop={-2} onClick={() => navigateTo('/help')} />
                </Tooltip>
              </Flex>
            ),
            sortKey: 'missedAuditsCount',
            width: '5%',
            dataId: 'users-col-missedAudits',
            disabled: device === 'mobile' || device === 'tablet',
            render: (user: IUser) => (
              <UserAuditsCount auditsCount={user.missedAuditsCount} data-id="000634" status="missed" userId={user._id} />
            ),
          },
        ] as ColumnConfig[])),
    {
      label: 'Last login',
      sortKey: 'lastLogin',
      width: '16%',
      ml: '20px',
      dataId: 'users-col-lastLogin',
      render: (user: IUser) => (
        <TextOrNumberCell
          data-id="002101"
          text={
            user?.lastLogin
              ? upperFirst(
                  formatDistanceToNow(new Date(user?.lastLogin), {
                    addSuffix: true,
                  }),
                )
              : 'Never'
          }
        />
      ),
    },
  ];

  return (
    <>
      <Header breadcrumbs={['Admin', 'Users']} data-id="000650" mobileBreadcrumbs={['Users']} />
      <Box bg="auditsList.bg" data-id="users-container" h="full" overflow="hidden">
        <Flex data-id="users-inner" h="full" px={['25px', 0]}>
          {loading ? (
            <Box bg="white" borderBottomRadius="10px" data-id="users-loader-box" h="full" w="full">
              <Loader center data-id="users-loader" />
            </Box>
          ) : (
            <ListView
              columns={columns}
              data={users}
              data-id="users-listview"
              dataType="users"
              onRowClick={() => {}}
              setSortOrder={setSortOrder}
              setSortType={setSortType}
              sortOrder={sortOrder}
              sortType={sortType}
            />
          )}
        </Flex>
      </Box>
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
