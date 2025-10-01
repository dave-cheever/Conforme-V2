import { useEffect, useMemo, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { gql, useLazyQuery } from '@apollo/client';
import { Alert, AlertIcon, Box, Flex, Modal, ModalOverlay, Stack, Text, useMediaQuery } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import AdminTableHeader from '../../components/Admin/AdminTableHeader';
import AdminTableHeaderElement from '../../components/Admin/AdminTableHeaderElement';
import CloneTrackerItemModal from '../../components/AdminTrackerItemModal/CloneTrackerItemModal';
import DeleteTrackerItemModal from '../../components/AdminTrackerItemModal/DeleteTrackerItemModal';
import TrackerItemModal from '../../components/AdminTrackerItemModal/TrackerItemModal';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import { useAdminContext } from '../../contexts/AdminProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import TrackerItemModalProvider, { useTrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import useDevice from '../../hooks/useDevice';
import { Copy, Trashcan } from '../../icons';
import { AdminModalState } from '../../interfaces/IAdminContext';
import { ITrackerItem } from '../../interfaces/ITrackerItem';

const InfiniteScrollComponent = InfiniteScroll as unknown as React.FC<any>;

const GET_TRACKER_ITEMS = gql`
  query ($trackerItemsQueryInput: TrackerItemsQueryInput, $pagination: PaginationInput) {
    trackerItems(trackerItemsQueryInput: $trackerItemsQueryInput, pagination: $pagination) {
      trackerItems {
        _id
        name
        description
        businessUnitsIds
        frequency
        dueDate
        dueDateCalculation
        dueDateEditable
        published
        evidenceItems
        allowAttachments
        questions {
          type
          name
          description
          value
          required
          outdated
          requiredAnswer
          notApplicable
          options {
            label
            value
          }
        }
        locationsIds
        categoryId
        category {
          name
        }
        regulatoryBodyId
        regulatoryBody {
          name
        }
      }
      total
    }
  }
`;

function TrackerItemsAdmin() {
  const device = useDevice();
  const { filtersValues, setUsedFilters, setShowFiltersPanel } = useFiltersContext();
  const { adminModalState, setAdminModalState } = useAdminContext();
  const { trackerItem, reset } = useTrackerItemModalContext();
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [trackerItems, setTrackerItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [sortType, setSortType] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortedTrackerItems, setSortedTrackerItems] = useState<any[]>([]);
  const filtersRef = useRef({});
  const sortRef = useRef({ sortType: 'name', sortOrder: 'asc' });
  const prevFilters = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUsedFilters(['trackerItemsIds', 'categoriesIds', 'locationsIds', 'businessUnitsIds', 'regulatoryBodiesIds']);
    return () => {
      setShowFiltersPanel(false);
      setUsedFilters([]);
    };
  }, []);

  const parsedFilters = useMemo(
    () =>
      Object.entries(filtersValues).reduce((acc, [key, value]) => {
        if (
          !value.value ||
          (Array.isArray(value.value) && value.value.length === 0) ||
          (key === 'usersIds' &&
            value.value.responsibleIds?.length === 0 &&
            value.value.accountableIds?.length === 0 &&
            value.value.contributorIds?.length === 0 &&
            value.value.followerIds?.length === 0)
        )
          return acc;
        return {
          ...acc,
          [key]: value.value,
        };
      }, {}),
    [filtersValues],
  );

  const [fetchTrackerItems, { loading, data, refetch }] = useLazyQuery(GET_TRACKER_ITEMS, {
    fetchPolicy: 'network-only',
    onError: (err) => {
      setError(err.message || 'Failed to load tracker items.');
    },
  });

  useEffect(() => {
    setUsedFilters(['trackerItemsIds', 'categoriesIds', 'locationsIds', 'businessUnitsIds', 'regulatoryBodiesIds']);
    const isSame = JSON.stringify(parsedFilters) === JSON.stringify(prevFilters.current);
    if (isSame) return;

    prevFilters.current = parsedFilters;
    setPage(1);
    setAllLoaded(false);
    setTrackerItems([]);
    setError(null);
    filtersRef.current = parsedFilters;
    sortRef.current = { sortType, sortOrder };

    fetchTrackerItems({
      variables: {
        trackerItemsQueryInput: parsedFilters,
        pagination: {
          limit: pageSize,
          offset: 0,
          sortBy: sortType,
          sortDirection: sortOrder,
        },
      },
    });

    return () => {
      setUsedFilters([]);
    };
  }, [parsedFilters, sortType, sortOrder]);

  useEffect(() => {
    if (data && data.trackerItems) {
      if (page === 1) setTrackerItems(data.trackerItems.trackerItems);
      else setTrackerItems((prev) => [...prev, ...data.trackerItems.trackerItems]);

      setTotal(data.trackerItems.total);
      setAllLoaded(
        data.trackerItems.trackerItems.length === 0 ||
          trackerItems.length + data.trackerItems.trackerItems.length >= data.trackerItems.total,
      );
      setIsLoadingMore(false);
    }
  }, [data]);

  // Infinite scroll loadMore function
  const loadMore = (page: number) => {
    if (isLoadingMore || allLoaded) return;
    setIsLoadingMore(true);
    setError(null);
    fetchTrackerItems({
      variables: {
        trackerItemsQueryInput: filtersRef.current,
        pagination: {
          limit: pageSize,
          offset: (page - 1) * pageSize,
          sortBy: sortRef.current.sortType,
          sortDirection: sortRef.current.sortOrder,
        },
      },
    });
    setPage(page);
  };

  useEffect(() => {
    if (adminModalState === 'closed') reset();
  }, [adminModalState]);

  const openModal = (action: AdminModalState, trackerItem: ITrackerItem) => {
    setAdminModalState(action);
    reset(
      {
        _id: trackerItem._id,
        name: trackerItem.name,
        description: trackerItem.description,
        categoryId: trackerItem.categoryId,
        regulatoryBodyId: trackerItem.regulatoryBodyId,
        dueDate: trackerItem.dueDate,
        frequency: trackerItem.frequency,
        dueDateCalculation: trackerItem.dueDateCalculation,
        dueDateEditable: trackerItem.dueDateEditable,
        businessUnitsIds: trackerItem.businessUnitsIds,
        locationsIds: trackerItem.locationsIds,
        evidenceItems: trackerItem.evidenceItems,
        allowAttachments: trackerItem.allowAttachments,
        questions: (trackerItem.questions || []).map((question) => ({
          type: question.type,
          name: question.name,
          description: question.description,
          value: question.value,
          required: question.required,
          requiredAnswer: question.requiredAnswer,
          notApplicable: question.notApplicable,
          options: question.options!.map((option: { label: string; value: string }) => ({ label: option.label, value: option.value })),
        })),
        published: trackerItem.published,
      },
      5,
    );
  };

  useEffect(() => {
    // Sort the currently loaded trackerItems in the frontend
    if (!trackerItems) return;
    const sorted = [...trackerItems].sort((a, b) => {
      let aValue;
      let bValue;
      if (sortType === 'regulatoryBody') {
        aValue = a.regulatoryBody?.name?.toString() || '';
        bValue = b.regulatoryBody?.name?.toString() || '';
      } else {
        aValue = a[sortType]?.toString() || '';
        bValue = b[sortType]?.toString() || '';
      }
      if (sortOrder === 'asc') return aValue.localeCompare(bValue);

      return bValue.localeCompare(aValue);
    });
    setSortedTrackerItems(sorted);
  }, [sortType, sortOrder, trackerItems]);

  const handleListRefresh = () => {
    setPage(1);
    setAllLoaded(false);
    setTrackerItems([]);
    fetchTrackerItems({
      variables: {
        trackerItemsQueryInput: filtersRef.current,
        pagination: {
          limit: pageSize,
          offset: 0,
          sortBy: sortRef.current.sortType,
          sortDirection: sortRef.current.sortOrder,
        },
      },
    });
  };

  return (
    <>
      <Modal
        blockScrollOnMount={false}
        data-id="000518"
        isOpen={adminModalState !== 'closed'}
        key={trackerItem._id}
        onClose={() => {}}
        returnFocusOnClose={false}
        scrollBehavior="inside"
        size={device === 'desktop' || device === 'tablet' || adminModalState === 'delete' ? '2xl' : 'full'}
        variant={adminModalState === 'delete' ? 'deleteModal' : 'conformeModal'}
      >
        <ModalOverlay data-id="000519" />
        {adminModalState === 'delete' ? (
          <DeleteTrackerItemModal data-id="000520" onItemDeleted={handleListRefresh} refetch={refetch} />
        ) : adminModalState === 'clone' ? (
          <CloneTrackerItemModal data-id="000521" refetch={refetch} />
        ) : (
          <TrackerItemModal data-id="000522" onItemAdded={handleListRefresh} refetch={refetch} />
        )}
      </Modal>
      <Header
        breadcrumbs={['Admin', pluralize(t('tracker item'))]}
        data-id="000523"
        mobileBreadcrumbs={[pluralize(t('tracker item'))]}
        pageLabel={capitalize(t('tracker item'))}
      />
      <Box data-id="000524" h={['full', 'calc(100vh - 200px)']} overflow="auto" p="0 25px 30px 30px">
        <Box border="1px solid #CBD5E0" data-id="000525" h="100%" overflow="hidden" w="100%">
          <AdminTableHeader data-id="000526">
            <AdminTableHeaderElement
              data-id="000527"
              label={capitalize(t('tracker item'))}
              onClick={() => {
                setSortType('name');
                setSortOrder(sortOrder === 'asc' && sortType === 'name' ? 'desc' : 'asc');
              }}
              showSortingIcon={sortType === 'name'}
              sortOrder={sortType === 'name' ? sortOrder : undefined}
              w="calc(100% / 4)"
            />
            {device !== 'mobile' && (
              <>
                <AdminTableHeaderElement
                  data-id="000528"
                  label="Frequency"
                  onClick={() => {
                    setSortType('frequency');
                    setSortOrder(sortOrder === 'asc' && sortType === 'frequency' ? 'desc' : 'asc');
                  }}
                  showSortingIcon={sortType === 'frequency'}
                  sortOrder={sortType === 'frequency' ? sortOrder : undefined}
                  w="calc(100% / 4)"
                />
                <AdminTableHeaderElement
                  data-id="000529"
                  label="Regulatory body"
                  onClick={() => {
                    setSortType('regulatoryBody');
                    setSortOrder(sortOrder === 'asc' && sortType === 'regulatoryBody' ? 'desc' : 'asc');
                  }}
                  showSortingIcon={sortType === 'regulatoryBody'}
                  sortOrder={sortType === 'regulatoryBody' ? sortOrder : undefined}
                  w="calc(100% / 4)"
                />
                <Box color="gray.500" data-id="000530" textAlign="right" w="calc(100% / 4)">
                  Actions
                </Box>
              </>
            )}
          </AdminTableHeader>
          {error && (
            <Alert data-id="000531" mb={4} status="error">
              <AlertIcon data-id="000532" />
              {error}
            </Alert>
          )}
          <Stack
            bg="white"
            borderBottomRadius="20px"
            data-id="000533"
            gap="0px"
            h={error ? 'calc(100% - 100px)' : 'calc(100% - 60px)'}
            overflow="auto"
          >
            <InfiniteScrollComponent
              data-id="000534"
              hasMore={!loading && trackerItems.length < total}
              loadMore={loadMore}
              pageStart={1}
              useWindow={false}
            >
              {sortedTrackerItems.map((trackerItem, index) => (
                <Flex
                  _hover={{ bg: '#F5F7FA' }}
                  align="center"
                  bg={index % 2 === 0 ? 'white' : 'gray.50'}
                  borderBottom="1px solid"
                  borderColor="gray.200"
                  cursor="pointer"
                  data-id="000535"
                  fontSize="14px"
                  h="60px"
                  key={trackerItem._id}
                  onClick={() => openModal('edit', trackerItem)}
                  px="10px"
                  py="10px"
                  w="full"
                >
                  <Flex data-id="000536" direction="column" w="calc(100% / 4)">
                    <Text data-id="000537" noOfLines={1}>
                      {trackerItem.name || `Unnamed ${t('tracker item')}`}
                    </Text>
                    <Flex align="center" data-id="000538" mt="1">
                      <Text color="gray.500" data-id="000539" fontSize="11px">
                        {trackerItem.category?.name}
                      </Text>
                      {!isMobile && !trackerItem.published && (
                        <Box bg="gray.600" borderRadius="md" color="white" data-id="000540" fontSize="11px" ml={2} px={2} py={1}>
                          Draft
                        </Box>
                      )}
                    </Flex>
                  </Flex>
                  <Text data-id="000541" w="calc(100% / 4)">
                    {trackerItem.frequency}
                  </Text>
                  <Text data-id="000542" w="calc(100% / 4)">
                    {trackerItem.regulatoryBody?.name || '-'}
                  </Text>
                  <Flex data-id="000543" gap={4} justify="flex-end" w="calc(100% / 4)">
                    <Copy
                      _hover={{ stroke: '#FFFFFF' }}
                      cursor="pointer"
                      data-id="000544"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal('clone', trackerItem);
                      }}
                      stroke="#282F36"
                    />
                    <Trashcan
                      _hover={{ stroke: '#FFFFFF' }}
                      cursor="pointer"
                      data-id="000545"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal('delete', trackerItem);
                      }}
                      stroke="#282F36"
                    />
                  </Flex>
                </Flex>
              ))}
              {loading && <Loader center data-id="000546" h="60px" key="infinite-loader" />}
            </InfiniteScrollComponent>
            {allLoaded && trackerItems.length === 0 && !loading && (
              <Text color="gray.500" data-id="000547" py={8} textAlign="center">
                No tracker items found.
              </Text>
            )}
          </Stack>
        </Box>
      </Box>
    </>
  );
}

function TrackerItemsAdminWithContext(props) {
  return (
    <TrackerItemModalProvider data-id="000548" {...props}>
      <TrackerItemsAdmin data-id="000549" />
    </TrackerItemModalProvider>
  );
}

export default TrackerItemsAdminWithContext;

export const trackerItemsAdminWithContextStyles = {
  trackerItemsAdminWithContext: {
    stroke: '#282F36',
    binStroke: '#282F36',
    strokeHover: '#FFFFFF',
    labelColor: '#818197',
  },
};
