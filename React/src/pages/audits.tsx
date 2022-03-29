import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { gql, useQuery } from '@apollo/client';
import {
  Button,
  Flex,
  Grid,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';

import ComplianceItemsGroup from '../components/ComplianceItem/ComplianceItemsGroup';
import ComplianceItemsList from '../components/ComplianceItem/ComplianceItemsList';
import ComplianceItemSquare from '../components/ComplianceItem/ComplianceItemSquare';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { useAppContext } from '../contexts/AppProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';
import useResponseUtils from '../hooks/useResponseUtils';
import { ChevronRight, GridIcon, GroupIcon, ListIcon } from '../icons';
import { IResponse } from '../interfaces/IResponse';

const GET_RESPONSES = gql`
  query Responses($responsesQuery: ResponsesQuery) {
    responses(responsesQuery: $responsesQuery) {
      _id
      nextRenewalDate
      status
      responsibleId
      daysToDueDate
      evidence {
        name
        uploaded {
          id
          name
          addedAt
          thumbnail
          path
        }
        outdated
      }
      complianceItem {
        name
        frequency
        category {
          name
        }
        regulatoryBody {
          name
        }
      }
      businessUnit {
        name
        imgUrl
      }
      responsible {
        displayName
      }
      metatags {
        addedBy
      }
    }
  }
`;

const Audits = () => {
  const { user } = useAppContext();
  const {
    filtersValues,
    setFilters,
    setResponsesStatusesCounts,
    setShowFiltersPanel,
  } = useFiltersContext();
  const [filteredResponses, setFilteredResponses] = useState<IResponse[]>([]);
  const { getRenewalStatus, getStatus } = useResponseUtils();

  const { data, loading, error, refetch } = useQuery(GET_RESPONSES, {
    skip: true,
  });
  const device = useDevice();
  const location = useLocation();

  useEffect(() => {
    // setUsedFilters([]);
    if (location.state && typeof location.state === 'object') {
      setFilters(location.state);
      window.history.replaceState(null, '');
    }
    return () => setShowFiltersPanel(false);
  }, []);

  useEffect(() => {
    const responsesStatusesCounts = {
      nonCompliant: 0,
      compliant: 0,
      comingUp: 0,
    };
    data?.responses.forEach((response) => {
      const status = getStatus(response);
      if (status === 'compliant') responsesStatusesCounts.compliant += 1;
      else responsesStatusesCounts.nonCompliant += 1;

      const renewalStatus = getRenewalStatus(response);
      if (renewalStatus === 'comingUp') responsesStatusesCounts.comingUp += 1;
    });
    setResponsesStatusesCounts(responsesStatusesCounts);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const initialViewMode = useMemo(() => {
    const savedView = localStorage.getItem('viewMode');
    if (
      savedView &&
      (savedView === 'Grid' || savedView === 'List' || savedView === 'Group')
    )
      return savedView;

    if (user?.role === 'admin') return 'List';

    return 'Grid';
  }, [user]);

  const [viewMode, setViewMode] = useState<'Grid' | 'List' | 'Group'>(
    initialViewMode,
  );

  // use Memo not working for hook, used this for mobile
  useEffect(() => {
    if (device === 'mobile') setViewMode('Grid');
  }, [device]);

  const viewIcon = useMemo(
    () => ({
      Grid: <GridIcon boxSize="18px" />,
      List: <ListIcon boxSize="18px" />,
      Group: <GroupIcon boxSize="18px" />,
    }),
    [],
  );

  // Filter responses (server side)
  useEffect(() => {
    // Parse filters to format expected by GraphQL Query
    const parsedFilters = Object.entries(filtersValues).reduce(
      (acc, [key, value]) => {
        if (key === 'itemStatus') {
          // itemStatus is client side filter
          return acc;
        }
        if (
          !value.value ||
          (Array.isArray(value.value) && value.value.length === 0) ||
          (key === 'usersIds' &&
            value.value.responsibleIds.length === 0 &&
            value.value.accountableIds.length === 0 &&
            value.value.contributorIds.length === 0 &&
            value.value.followerIds.length === 0)
        )
          return acc;

        return {
          ...acc,
          [key]: value.value,
        };
      },
      {},
    );
    refetch({ responsesQuery: parsedFilters });
  }, [filtersValues]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter responses by status (client side)
  useEffect(() => {
    if (data?.responses?.length === 0 && !error) {
      setFilteredResponses(data?.responses);
      return;
    }

    if (data && data?.responses?.length !== 0 && !error) {
      let items = [...data?.responses];
      if (
        filtersValues.itemStatus?.value &&
        filtersValues.itemStatus?.value?.length > 0
      ) {
        const statusFilteredResults: IResponse[] = [];
        for (const filter of filtersValues.itemStatus?.value) {
          if (
            [
              'notStarted',
              'inProgress',
              'completed',
              'comingUp',
              'overdue',
            ].includes(filter)
          ) {
            statusFilteredResults.push(
              ...items.filter(
                (response) => getRenewalStatus(response) === filter,
              ),
            );
          } else if (['compliant', 'nonCompliant'].includes(filter)) {
            statusFilteredResults.push(
              ...items.filter((response) => getStatus(response) === filter),
            );
          } else if (filter === 'noDueDate') {
            statusFilteredResults.push(
              ...items.filter((response) => response.daysToDueDate === null),
            );
          }
        }
        items = Array.from(new Set(statusFilteredResults.flat()));
      }
      setFilteredResponses(items);
    }
  }, [data?.responses, filtersValues.itemStatus?.value]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeViewMode = useCallback((viewMode: 'Grid' | 'List' | 'Group') => {
    setViewMode(viewMode);
    localStorage.setItem('viewMode', viewMode);
  }, []);

  return (
    <>
      <Header breadcrumbs={['Audits']} mobileBreadcrumbs={['Audits']}>
        {device !== 'mobile' && (
          <Menu autoSelect={false}>
            {
              // @ts-ignore: Issue inside ChakraUI
              <MenuButton
                _active={{}}
                _hover={{}}
                as={Button}
                bg="complianceItems.header.menuButtonBg"
                fontSize="14px"
                fontWeight="700"
                h="40px"
                ml={['15px', '0']}
                rightIcon={
                  <ChevronRight
                    color="complianceItems.header.rightIcon"
                    h="12px"
                    mt="3px"
                    transform="rotate(90deg)"
                    w="12px"
                  />
                }
                rounded="10px"
              >
                <Flex align="center" mr="1">
                  {viewIcon[viewMode]}
                </Flex>
              </MenuButton>
            }
            <MenuList border="none" rounded="lg" w="100px" zIndex={2}>
              <MenuItem
                _focus={{ color: 'complianceItems.header.menuItemFocus' }}
                color={
                  viewMode === 'Grid'
                    ? 'complianceItems.header.menuItemFontSelected'
                    : 'complianceItems.header.menuItemFont'
                }
                fontSize="14px"
                onClick={() => changeViewMode('Grid')}
              >
                <GridIcon mr={3} />
                Card
              </MenuItem>
              <MenuItem
                _focus={{ color: 'complianceItems.header.menuItemFocus' }}
                color={
                  viewMode === 'List'
                    ? 'complianceItems.header.menuItemFontSelected'
                    : 'complianceItems.header.menuItemFont'
                }
                fontSize="14px"
                onClick={() => changeViewMode('List')}
              >
                <ListIcon mr={3} />
                List
              </MenuItem>
              <MenuItem
                _focus={{ color: 'complianceItems.header.menuItemFocus' }}
                color={
                  viewMode === 'Group'
                    ? 'complianceItems.header.menuItemFontSelected'
                    : 'complianceItems.header.menuItemFont'
                }
                fontSize="14px"
                onClick={() => changeViewMode('Group')}
              >
                <GroupIcon mr={3} />
                Group
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Header>
      <Flex h={['calc(100vh - 210px)', 'calc(100vh - 150px)']} overflow="auto">
        {error ? (
          <Text>{error.message}</Text>
        ) : loading ? (
          <Loader center />
        ) : (
          <>
            {viewMode === 'Grid' && (
              <Grid
                display={['grid', 'grid', 'flex']}
                flexWrap="wrap"
                gap={6}
                h="fit-content"
                pb={[0, 8]}
                pt="3"
                px={[4, 8]}
                templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', '']}
                w="full"
              >
                {filteredResponses.length > 0 ? (
                  [...filteredResponses]
                    ?.sort((a, b) => {
                      if (a.nextRenewalDate === null) return 1;

                      if (b.nextRenewalDate === null) return -1;

                      return a.nextRenewalDate && b.nextRenewalDate
                        ? a.nextRenewalDate
                            .toString()
                            .localeCompare(b.nextRenewalDate.toString())
                        : 0;
                    })
                    ?.map((response) => (
                      <ComplianceItemSquare
                        key={response._id}
                        response={response}
                      />
                    ))
                ) : (
                  <Flex fontSize="18px" fontStyle="italic" h="full" w="full">
                    No audits found
                  </Flex>
                )}
              </Grid>
            )}
            {viewMode === 'List' && (
              <ComplianceItemsList responses={filteredResponses} />
            )}
            {viewMode === 'Group' && (
              <ComplianceItemsGroup responses={filteredResponses} />
            )}
          </>
        )}
      </Flex>
    </>
  );
};

export default Audits;

export const complianceItemStyles = {
  complianceItems: {
    header: {
      menuButtonBg: 'white',
      rightIcon: '#9A9EA1',
      menuItemFocus: '#462AC4',
      menuItemFontSelected: '#462AC4',
      menuItemFont: '#9A9EA1',
    },
  },
};
