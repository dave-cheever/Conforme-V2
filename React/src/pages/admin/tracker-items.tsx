import { useEffect, useMemo, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Box, Flex, Modal, ModalOverlay, Stack, Text, useMediaQuery } from '@chakra-ui/react';
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

const GET_TRACKER_ITEMS = gql`
  query ($trackerItemsQueryInput: TrackerItemsQueryInput) {
    trackerItems(trackerItemsQueryInput: $trackerItemsQueryInput) {
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
  }
`;

function TrackerItemsAdmin() {
  const device = useDevice();
  const { filtersValues, setUsedFilters, setShowFiltersPanel } = useFiltersContext();
  const { adminModalState, setAdminModalState } = useAdminContext();
  const { data, loading, refetch } = useQuery(GET_TRACKER_ITEMS);
  const { trackerItem, reset } = useTrackerItemModalContext();
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const trackerItems = useMemo(() => [...(data?.trackerItems || [])].sort((a, b) => a.name.localeCompare(b.name)), [data]);
  const [sortType, setSortType] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortedData, setSortedData] = useState<any>([]);

  useEffect(() => {
    setUsedFilters(['trackerItemsIds', 'categoriesIds', 'locationsIds', 'businessUnitsIds', 'regulatoryBodiesIds']);
    return () => {
      setShowFiltersPanel(false);
      setUsedFilters([]);
    };
  }, []);

  useEffect(() => {
    setSortedData([...trackerItems].sort((a, b) => a.name.localeCompare(b.name)));
  }, [trackerItems]);

  useEffect(() => {
    const parsedFilters = Object.entries(filtersValues).reduce((acc, [key, value]) => {
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
    }, {});
    refetch({ trackerItemsQueryInput: parsedFilters });
  }, [filtersValues]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (sortOrder === 'asc') {
      setSortedData(
        [...trackerItems].sort((a, b) => {
          if (sortType === 'regulatoryBody') return a.regulatoryBody?.name.toString().localeCompare(b.regulatoryBody?.name.toString());

          return a[sortType].localeCompare(b[sortType]);
        }),
      );
    } else {
      setSortedData(
        [...trackerItems].sort((a, b) => {
          if (sortType === 'regulatoryBody') return b.regulatoryBody?.name.toString().localeCompare(a.regulatoryBody?.name.toString());

          return b[sortType].localeCompare(a[sortType]);
        }),
      );
    }
  }, [sortType, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (adminModalState === 'closed') reset();
  }, [adminModalState]); // eslint-disable-line react-hooks/exhaustive-deps

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

  return (<>
    <Modal
      blockScrollOnMount={false}
      data-id="f0d3a72b6d59"
      isOpen={adminModalState !== 'closed'}
      key={trackerItem._id}
      onClose={() => { }}
      scrollBehavior="inside"
      size={device === 'desktop' || device === 'tablet' || adminModalState === 'delete' ? '2xl' : 'full'}
      variant={adminModalState === 'delete' ? 'deleteModal' : 'conformeModal'}>
      <ModalOverlay data-id="2745e073445d" />
      {adminModalState === 'delete' ? (
        <DeleteTrackerItemModal data-id="5e7ec7a2d405" refetch={refetch} />
      ) : adminModalState === 'clone' ? (
        <CloneTrackerItemModal data-id="d0ef61d19e94" refetch={refetch} />
      ) : (
        <TrackerItemModal data-id="1bab993c353f" refetch={refetch} />
      )}
    </Modal>
    <Header
      breadcrumbs={['Admin', pluralize(t('tracker item'))]}
      data-id="23a21c064eaf"
      mobileBreadcrumbs={[pluralize(t('tracker item'))]}
      pageLabel={capitalize(t('tracker item'))} />
    <Box
      data-id="994cf98f6802"
      h={['full', 'calc(100vh - 160px)']}
      overflow="auto"
      p="0 25px 30px 30px">
      <Box
        data-id="1c71f4a3ff6f"
        h={['calc(100% - 160px)', 'calc(100% - 35px)']}
        w="100%">
        <AdminTableHeader data-id="0253915db4ee">
          <AdminTableHeaderElement
            data-id="17600bfc110f"
            label={capitalize(t('tracker item'))}
            onClick={() => {
              setSortType('name');
              setSortOrder(sortOrder === 'asc' && sortType === 'name' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'name'}
            sortOrder={sortType === 'name' ? sortOrder : undefined}
            w="calc(100% / 4)"/>
          {device !== 'mobile' && (
            <>
              <AdminTableHeaderElement
                data-id="2234aacf671f"
                label="Frequency"
                onClick={() => {
                  setSortType('frequency');
                  setSortOrder(sortOrder === 'asc' && sortType === 'frequency' ? 'desc' : 'asc');
                }}
                showSortingIcon={sortType === 'frequency'}
                sortOrder={sortType === 'frequency' ? sortOrder : undefined}
                w="calc(100% / 4)" />
              <AdminTableHeaderElement
                data-id="5a0d0ac062bb"
                label="Regulatory body"
                onClick={() => {
                  setSortType('regulatoryBody');
                  setSortOrder(sortOrder === 'asc' && sortType === 'regulatoryBody' ? 'desc' : 'asc');
                }}
                showSortingIcon={sortType === 'regulatoryBody'}
                sortOrder={sortType === 'regulatoryBody' ? sortOrder : undefined}
                w="calc(100% / 4)" />
              <Box color="gray.500" data-id="a8f7e2c1d5b3" textAlign="right" w="calc(100% / 4)">
              Actions
              </Box>
            </>
          )}
        </AdminTableHeader>

        <Stack
          bg="white"
          border="1px solid #E2E8F0"
          borderBottomRadius="20px"
          data-id="7fa63e0fa928"
          gap="0px"
          h="100%"
          overflow="auto">
          {loading ? (
            <Loader center data-id="44737a8930ae" />
          ) : (
          sortedData.map((trackerItem, index) => (
            <Flex
                 _hover={{ bg: '#F5F7FA' }}
                align="center"
                bg={index % 2 === 0 ? 'white' : 'gray.50'}
                borderBottom="1px solid"
                borderColor="gray.200"
                cursor="pointer"
                data-id="96461dd538df"
                fontSize="14px"
                h="73px"
                key={trackerItem._id}
                onClick={() => openModal('edit', trackerItem)}
                px="10px"
                py="10px"
                w="full">
              <Flex
                data-id="686b0b610452"
                direction="column"
                w="calc(100% / 4)">
                <Text data-id="5b25881b9d07" noOfLines={1}>{trackerItem.name || `Unnamed ${t('tracker item')}`}</Text>
                  <Flex align="center" mt="1">
                      <Text color="gray.500" fontSize="11px">{trackerItem.category?.name}</Text>
                      {!isMobile && !trackerItem.published && (
                        <Box bg="gray.600" borderRadius="md" color="white" fontSize="11px" ml={2} px={2} py={1}>Draft</Box>
                      )}
                    </Flex>
                  </Flex>

                  <Text w="calc(100% / 4)">{trackerItem.frequency}</Text>

                  <Text w="calc(100% / 4)">{trackerItem.regulatoryBody?.name || '-'}</Text>

                  <Flex gap={4} justify="flex-end" w="calc(100% / 4)">
                    <Copy
                      _hover={{ stroke: '#FFFFFF' }}
                      cursor="pointer"
                      onClick={(e) => {
                      e.stopPropagation();
                        openModal('clone', trackerItem);
                      }}
                      stroke="#282F36"/>
                  <Trashcan
                    _hover={{ stroke: '#FFFFFF' }}
                      cursor="pointer"
                    onClick={(e) => {e.stopPropagation();
                      openModal('delete', trackerItem);
                    }}
                    stroke="#282F36"/>
                </Flex>
              </Flex>
            ))
          )}
        </Stack>
      </Box>
    </Box>
  </>);
}

function TrackerItemsAdminWithContext(props) {
  return <TrackerItemModalProvider data-id="4cb9ee2d83d9" {...props}>
    <TrackerItemsAdmin data-id="84e9258ca419" />
  </TrackerItemModalProvider>
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
