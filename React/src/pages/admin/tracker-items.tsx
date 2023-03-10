import React, { useEffect, useMemo, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Box, Flex, Modal, ModalOverlay, Spacer, Stack, Text } from '@chakra-ui/react';
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

const TrackerItemsAdmin = () => {
  const device = useDevice();
  const { filtersValues, setUsedFilters, setShowFiltersPanel } = useFiltersContext();
  const { adminModalState, setAdminModalState } = useAdminContext();
  const { data, loading, refetch } = useQuery(GET_TRACKER_ITEMS);
  const { trackerItem, reset } = useTrackerItemModalContext();
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
      mobileBreadcrumbs={[pluralize(t('tracker item'))]} />
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
            w={['80%', 'calc(100% / 4)']} />
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
              <Flex data-id="a8f7e2c1d5b3" w="calc(100% / 4)">
                <Spacer data-id="0ae489c6d93e" />
                <Text color="trackerItemsAdminWithContext.labelColor" data-id="6a8af8364ff2">Actions</Text>
              </Flex>
            </>
          )}
        </AdminTableHeader>
        <Stack
          bg="white"
          borderBottomRadius="20px"
          data-id="7fa63e0fa928"
          h="100%"
          overflow="auto">
          {loading ? (
            <Loader center data-id="44737a8930ae" />
          ) : (
            sortedData.map((trackerItem) => (
              <Flex
                align="center"
                bg="adminTrackerItems.element.bg"
                borderBottom="1px solid"
                borderColor="adminTableHeader.border"
                color="adminTrackerItems.element.font"
                cursor="pointer"
                data-id="96461dd538df"
                flexShrink={0}
                fontSize="14px"
                h="73px"
                key={trackerItem._id}
                mt="0px"
                px="25px"
                w="full"
                zIndex={4}>
                <Flex
                  data-id="686b0b610452"
                  flexDirection="column"
                  fontWeight="semi_medium"
                  onClick={() => openModal('edit', trackerItem)}
                  pr={2}
                  w={['80%', 'calc(100% / 4)']}>
                  <Box data-id="eb014d3ce91b" fontSize="smm">
                    {trackerItem.name ? (
                      <Text data-id="5b25881b9d07" isTruncated>{trackerItem.name}</Text>
                    ) : (
                      <Text
                        color="adminTrackerItems.element.unnamed"
                        data-id="cf52a494ddef"
                        fontStyle="italic">
                        Unnamed {t('tracker item')}
                      </Text>
                    )}
                  </Box>
                  <Flex alignItems="center" data-id="2843cf36a78d">
                    <Box
                      color="adminTrackerItems.element.category"
                      data-id="00e0982d1771"
                      fontSize="11px"
                      lineHeight="25px">
                      {trackerItem.category?.name}
                    </Box>
                    {!trackerItem.published && (
                      <Box
                        bg="#818197"
                        borderRadius="7px"
                        color="#FFFFFF"
                        data-id="4f9590acbd31"
                        fontSize="11px"
                        ml={trackerItem.category ? 2 : 0}
                        p="3px 9px">
                        Draft
                      </Box>
                    )}
                  </Flex>
                </Flex>
                {device !== 'mobile' && (
                  <>
                    <Box
                      data-id="ba5dc06f000b"
                      onClick={() => openModal('edit', trackerItem)}
                      w="calc(100% / 4)">
                      {trackerItem.frequency}{' '}
                    </Box>
                    <Box
                      data-id="76980342e80b"
                      onClick={() => openModal('edit', trackerItem)}
                      w="calc(100% / 4)">
                      {trackerItem.regulatoryBody?.name}
                    </Box>
                  </>
                )}
                <Box data-id="b27b1fc74638" textAlign="end" w="calc(100% / 4)" zIndex={5}>
                  <Copy
                    _hover={{
                      color: 'trackerItemsAdminWithContext.strokeHover',
                      opacity: 0.7,
                      cursor: 'pointer',
                    }}
                    data-id="e4be5197a6fd"
                    fill="transparent"
                    fontSize="15px"
                    onClick={() => {
                      openModal('clone', trackerItem);
                    }}
                    stroke="trackerItemsAdminWithContext.stroke" />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Trashcan
                    _hover={{
                      color: 'trackerItemsAdminWithContext.strokeHover',
                      opacity: 0.7,
                      cursor: 'pointer',
                    }}
                    data-id="e2e34b6cf144"
                    fill="transparent"
                    fontSize="15px"
                    onClick={() => {
                      openModal('delete', trackerItem);
                    }}
                    stroke="trackerItemsAdminWithContext.binStroke" />
                </Box>
              </Flex>
            ))
          )}
        </Stack>
      </Box>
    </Box>
  </>);
};

const TrackerItemsAdminWithContext = (props) => (
  <TrackerItemModalProvider data-id="4cb9ee2d83d9" {...props}>
    <TrackerItemsAdmin data-id="84e9258ca419" />
  </TrackerItemModalProvider>
);

export default TrackerItemsAdminWithContext;

export const trackerItemsAdminWithContextStyles = {
  trackerItemsAdminWithContext: {
    stroke: '#282F36',
    binStroke: '#282F36',
    strokeHover: '#FFFFFF',
    labelColor: '#818197',
  },
};
