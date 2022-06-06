import { useCallback, useEffect, useMemo, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Button, Flex, Grid, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { isEmpty } from 'lodash';

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

const ComplianceItems = () => {
  const { user } = useAppContext();
  const {
    filtersValues,
    setUsedFilters,
    setFilters,
    setResponsesStatusesCounts,
    setShowFiltersPanel,
    responseFiltersValue,
    setResponseFiltersValue,
    usedFilters,
  } = useFiltersContext();
  const [filteredResponses, setFilteredResponses] = useState<IResponse[]>([]);
  const { getRenewalStatus, getStatus } = useResponseUtils();

  const { data, loading, error, refetch } = useQuery(GET_RESPONSES);
  const device = useDevice();

  useEffect(() => {
    setUsedFilters([
      'complianceItemsIds',
      'categoriesIds',
      'usersIds',
      'locationsIds',
      'businessUnitsIds',
      'itemStatus',
      'regulatoryBodiesIds',
      'dueDate',
    ]);
    return () => setShowFiltersPanel(false);
  }, []);

  useEffect(() => {
    if (responseFiltersValue && !isEmpty(responseFiltersValue) && !isEmpty(filtersValues) && !isEmpty(usedFilters)) {
      // Delay setting filters by 100ms to make sure that other useEffects finished and filters won't be cleared
      const delayFilters = setTimeout(() => {
        setFilters(Object.entries(responseFiltersValue).reduce((acc, [key, value]) => ({ ...acc, [key]: value.value }), {}));
        setResponseFiltersValue({});
        clearTimeout(delayFilters);
      }, 100);
    }
  }, [filtersValues, usedFilters, setResponseFiltersValue, responseFiltersValue, setFilters]);

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
    if (savedView && (savedView === 'Grid' || savedView === 'List' || savedView === 'Group')) return savedView;

    if (user?.role === 'admin') return 'List';

    return 'Grid';
  }, [user]);

  const [viewMode, setViewMode] = useState<'Grid' | 'List' | 'Group'>(initialViewMode);

  // use Memo not working for hook, used this for mobile
  useEffect(() => {
    if (device === 'mobile') setViewMode('Grid');
  }, [device]);

  const viewIcon = useMemo(
    () => ({
      Grid: <GridIcon boxSize="18px" stroke="currentColor" />,
      List: <ListIcon boxSize="18px" stroke="currentColor" />,
      Group: <GroupIcon boxSize="18px" stroke="currentColor" />,
    }),
    [],
  );

  // Filter responses (server side)
  useEffect(() => {
    // Parse filters to format expected by GraphQL Query
    const parsedFilters = Object.entries(filtersValues).reduce((acc, filter) => {
      if (!filter || !filter[1]) return { ...acc };

      const [key, value] = filter;

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
    }, {});
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
      if (filtersValues?.itemStatus?.value && filtersValues?.itemStatus?.value?.length! > 0) {
        const statusFilteredResults: IResponse[] = [];
        for (const filter of filtersValues?.itemStatus?.value!) {
          if (['notStarted', 'inProgress', 'completed', 'comingUp', 'missed'].includes(filter))
            statusFilteredResults.push(...items.filter((response) => getRenewalStatus(response) === filter));
          else if (['compliant', 'nonCompliant'].includes(filter))
            statusFilteredResults.push(...items.filter((response) => getStatus(response) === filter));
          else if (filter === 'noDueDate') statusFilteredResults.push(...items.filter((response) => response.daysToDueDate === null));
        }
        items = Array.from(new Set(statusFilteredResults.flat()));
      }
      setFilteredResponses(items);
    }
  }, [data?.responses, filtersValues.itemStatus?.value]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeViewMode = useCallback((_viewMode: 'Grid' | 'List' | 'Group') => {
    setViewMode(_viewMode);
    localStorage.setItem('viewMode', _viewMode);
  }, []);

  return (
    <>
      <Header breadcrumbs={['Compliance items']} mobileBreadcrumbs={['Compliance items']}>
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
                rightIcon={<ChevronRight color="complianceItems.header.rightIcon" h="12px" mt="3px" transform="rotate(90deg)" w="12px" />}
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
                color={viewMode === 'Grid' ? 'complianceItems.header.menuItemFontSelected' : 'complianceItems.header.menuItemFont'}
                fontSize="14px"
                onClick={() => changeViewMode('Grid')}
              >
                <GridIcon mr={3} stroke="currentColor" />
                Card
              </MenuItem>
              <MenuItem
                _focus={{ color: 'complianceItems.header.menuItemFocus' }}
                color={viewMode === 'List' ? 'complianceItems.header.menuItemFontSelected' : 'complianceItems.header.menuItemFont'}
                fontSize="14px"
                onClick={() => changeViewMode('List')}
              >
                <ListIcon mr={3} stroke="currentColor" />
                List
              </MenuItem>
              <MenuItem
                _focus={{ color: 'complianceItems.header.menuItemFocus' }}
                color={viewMode === 'Group' ? 'complianceItems.header.menuItemFontSelected' : 'complianceItems.header.menuItemFont'}
                fontSize="14px"
                onClick={() => changeViewMode('Group')}
              >
                <GroupIcon mr={3} stroke="currentColor" />
                Group
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Header>
      <Flex h={['calc(100vh - 210px)', 'calc(100vh - 150px)']} overflow="auto">
        {/* eslint-disable */}
        {error ? (
          <Text>{error.message}</Text>
        ) : loading ? (
          <Loader center={true} />
        ) : (
          <>
            {viewMode === 'Grid' && (
              <Grid
                templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', '']}
                display={['grid', 'grid', 'flex']}
                flexWrap="wrap"
                h="fit-content"
                gap={6}
                w="full"
                pb={[0, 8]}
                px={[4, 8]}
                pt="3"
              >
                {filteredResponses.length > 0 ? (
                  [...filteredResponses]
                    ?.sort((a, b) => {
                      if (a['nextRenewalDate'] === null) {
                        return 1;
                      } else if (b['nextRenewalDate'] === null) {
                        return -1;
                      }
                      return a['nextRenewalDate'] && b['nextRenewalDate']
                        ? a['nextRenewalDate'].toString().localeCompare(b.nextRenewalDate.toString())
                        : 0;
                    })
                    ?.map((response) => <ComplianceItemSquare key={response._id} response={response} />)
                ) : (
                  <Flex fontSize="18px" fontStyle="italic" h="full" w="full">
                    No compliance items found
                  </Flex>
                )}
              </Grid>
            )}
            {viewMode === 'List' && <ComplianceItemsList responses={filteredResponses} />}
            {viewMode === 'Group' && <ComplianceItemsGroup responses={filteredResponses} />}
          </>
        )}
        {/* eslint-enable */}
      </Flex>
    </>
  );
};

export default ComplianceItems;

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
