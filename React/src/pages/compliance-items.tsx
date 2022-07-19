import { useEffect, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Flex, Grid, Text } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize, isEmpty } from 'lodash';
import pluralize from 'pluralize';

import ChangeViewButton from '../components/ChangeViewButton';
import ComplianceItemsGroup from '../components/ComplianceItem/ComplianceItemsGroup';
import ComplianceItemsList from '../components/ComplianceItem/ComplianceItemsList';
import ComplianceItemSquare from '../components/ComplianceItem/ComplianceItemSquare';
import Header from '../components/Header';
import Loader from '../components/Loader';
import SortButton from '../components/SortButton';
import { useAppContext } from '../contexts/AppProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';
import useResponseUtils from '../hooks/useResponseUtils';
import useSort from '../hooks/useSort';
import { IResponse } from '../interfaces/IResponse';
import { TViewMode } from '../interfaces/TViewMode';

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
      questions {
        type
        value
        required
        requiredAnswer
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
        imgUrl
        role
      }
      metatags {
        addedBy
      }
    }
  }
`;

const ComplianceItems = () => {
  const { module } = useAppContext();
  const {
    filtersValues,
    setUsedFilters,
    setFilters,
    setResponsesStatusesCounts,
    setShowFiltersPanel,
    responseFiltersValue,
    setResponseFiltersValue,
    setDefaultFilters,
    usedFilters,
  } = useFiltersContext();
  const [filteredResponses, setFilteredResponses] = useState<IResponse[]>([]);
  const { getRenewalStatus, getStatus } = useResponseUtils();
  const { sortedData: sortedResponses, sortOrder, sortType, setSortType, setSortOrder } = useSort(filteredResponses, 'nextRenewalDate');
  const sortBy = [
    { label: 'Item name', key: 'complianceItem.name' },
    { label: 'Due for renewal', key: 'nextRenewalDate' },
    { label: 'Compliant', key: 'status' },
    { label: 'Regulatory body', key: 'complianceItem.regulatoryBody.name' },
    { label: 'Responsible', key: 'responsible.displayName' },
    { label: capitalize(t('businessUnit')), key: 'businessUnit.name' },
  ];
  const [viewMode, setViewMode] = useState<TViewMode>('grid');

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
    return () => {
      setShowFiltersPanel(false);
      setUsedFilters([]);
    };
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

  // Set default filters
  useEffect(() => {
    if (!isEmpty(module?.defaultFilters?.responses)) {
      /**
       * Convert filters from
       *
       * {
       *  filterName: ["filterValue"]
       * }
       *
       * to
       *
       * {
       *  filterName: {
       *    value: ["filterValue"]
       *  }
       * }
       */
      const defaultFilters = Object.entries(module!.defaultFilters.responses!).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: {
            value,
          },
        }),
        {},
      );
      setDefaultFilters(Object.entries(module!.defaultFilters.responses!).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}));
      setResponseFiltersValue((curr) => ({ ...curr, ...defaultFilters }));
    }
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
        (typeof value.value === 'object' && Object.keys(value.value).length === 0) ||
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

  return (
    <>
      <Header breadcrumbs={[pluralize(t('complianceItem'))]} mobileBreadcrumbs={[pluralize(t('complianceItem'))]}>
        {device !== 'mobile' && (
          <>
            <ChangeViewButton setViewMode={setViewMode} viewMode={viewMode} views={['grid', 'list', 'group']} />
            <SortButton setSortOrder={setSortOrder} setSortType={setSortType} sortBy={sortBy} sortOrder={sortOrder} sortType={sortType} />
          </>
        )}
      </Header>
      <Flex h={['calc(100vh - 210px)', 'calc(100vh - 150px)']} overflow="auto">
        {error ? (
          <Text>{error.message}</Text>
        ) : loading ? (
          <Loader center />
        ) : (
          <>
            {viewMode === 'grid' && (
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
                {sortedResponses.length > 0 ? (
                  sortedResponses.map((response) => <ComplianceItemSquare key={response._id} response={response} />)
                ) : (
                  <Flex fontSize="18px" fontStyle="italic" h="full" w="full">
                    No {pluralize(t('complianceItem'))} found
                  </Flex>
                )}
              </Grid>
            )}
            {viewMode === 'list' && (
              <ComplianceItemsList
                responses={sortedResponses}
                setSortOrder={setSortOrder}
                setSortType={setSortType}
                sortOrder={sortOrder}
                sortType={sortType}
              />
            )}
            {viewMode === 'group' && <ComplianceItemsGroup responses={sortedResponses} />}
          </>
        )}
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
