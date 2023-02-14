import { useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useHistory, useLocation } from 'react-router-dom';

import { gql, useQuery } from '@apollo/client';
import { Button, Flex, Grid, Modal, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useDisclosure } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize, isEmpty } from 'lodash';
import pluralize from 'pluralize';

import ChangeViewButton from '../components/ChangeViewButton';
import Header from '../components/Header';
import Loader from '../components/Loader';
import SortButton from '../components/SortButton';
import WalkItemDeleteModal from '../components/WalkItems/WalkItemDeleteModal';
import WalkItemModal from '../components/WalkItems/WalkItemModal';
import WalkItemsList from '../components/WalkItems/WalkItemsList';
import WalkItemSquare from '../components/WalkItems/WalkItemSquare';
import { useAdminContext } from '../contexts/AdminProvider';
import { useAppContext } from '../contexts/AppProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';
import useSort from '../hooks/useSort';
import { ExportIcon } from '../icons';
import { IAnswer } from '../interfaces/IAnswer';
import { TViewMode } from '../interfaces/TViewMode';

const GET_ANSWERS = gql`
  query ($answerQuery: AnswerQuery) {
    answers(answerQuery: $answerQuery) {
      _id
      questionId
      question {
        _id
        question
        questionsCategoryId
        questionsCategory {
          name
          useStatus
          notBlockedAfterCompletion
          options {
            name
            value
          }
        }
        category {
          name
        }
        scope {
          _id
        }
      }
      addedBy {
        displayName
        imgUrl
      }
      businessUnit {
        _id
        name
      }
      scope {
        type
        _id
      }
      audit {
        _id
        reference
        walkType
        location {
          _id
          name
        }
        businessUnitId
        businessUnit {
          _id
          name
        }
        auditType {
          businessUnitScope
        }
        status
        auditorId
        auditor {
          displayName
        }
        participantsIds
        metatags {
          addedAt
        }
      }
      status
      options
      attachments {
        id
        name
        addedAt
        thumbnail
      }
      actions {
        _id
        title
        dueDate
        assigneeId
        scope {
          _id
        }
        metatags {
          removedAt
        }
      }
      creator {
        displayName
        imgUrl
      }
      metatags {
        addedAt
        addedBy
        updatedAt
      }
    }
    auditTypes {
      _id
      questionsCategories {
        _id
        name
      }
    }
  }
`;

const WalkItems = () => {
  const {
    isOpen: isDeleteQuestionModalOpen,
    onOpen: handleDeleteQuestionModalOpen,
    onClose: handleDeleteQuestionModalClose,
  } = useDisclosure();
  const { filtersValues, setUsedFilters, setFilters, setShowFiltersPanel, walkItemFiltersValue, setWalkItemFiltersValue, usedFilters } =
    useFiltersContext();
  const { user } = useAppContext();
  const { adminModalState, setAdminModalState } = useAdminContext();
  const device = useDevice();
  const { data, loading, error, refetch } = useQuery(GET_ANSWERS);
  const panels = useMemo(
    () => [
      { _id: 'all', name: 'All' },
      ...(data?.auditTypes ?? []).reduce((acc, auditType) => [...acc, ...(auditType.questionsCategories ?? [])], []),
    ],
    [data?.auditTypes],
  );
  const [selectedPanel, setSelectedPanel] = useState(0);
  const [filteredAnswers, setFilteredAnswers] = useState<IAnswer[]>([]);
  const {
    sortedData: sortedAnswers,
    sortOrder,
    sortType,
    setSortType,
    setSortOrder,
  } = useSort(filteredAnswers, 'metatags.addedAt', 'desc');
  const sortBy = [
    { label: 'Type', key: 'question.questionsCategory.name' },
    { label: 'Description', key: 'question.question' },
    { label: 'Status', key: 'status' },
    { label: capitalize(t('location')), key: 'location.name' },
    { label: capitalize(t('business unit')), key: 'businessUnit.name' },
    { label: '# of actions', key: 'actions.length' },
    { label: 'Added by', key: 'addedBy.displayName' },
    { label: 'Date added', key: 'metatags.addedAt' },
  ];
  const [viewMode, setViewMode] = useState<TViewMode>('grid');
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const allowedFilters = useMemo(
    () => ['questionsCategoriesIds', 'businessUnitsIds', 'usersIds', 'locationsIds', 'status', 'createdDate'],
    [],
  );

  const closeModal = () => {
    // If id is in URL params, clean it
    if (queryParams.has('id')) {
      queryParams.delete('id');
      history.replace({
        search: queryParams.toString(),
      });
    }
    setAdminModalState('closed');
  };

  useEffect(() => {
    setUsedFilters(allowedFilters);
    return () => {
      setShowFiltersPanel(false);
      setAdminModalState('closed');
    };
  }, []);

  // Set pre-defined filters
  useEffect(() => {
    if (walkItemFiltersValue && !isEmpty(walkItemFiltersValue) && !isEmpty(filtersValues) && !isEmpty(usedFilters)) {
      // Delay setting filters by 100ms to make sure that other useEffects finished and filters won't be cleared
      const delayFilters = setTimeout(() => {
        setFilters(Object.entries(walkItemFiltersValue).reduce((acc, [key, value]) => ({ ...acc, [key]: value.value }), {}));
        setWalkItemFiltersValue({});
        clearTimeout(delayFilters);
      }, 100);
    }
  }, [filtersValues, usedFilters, setWalkItemFiltersValue, walkItemFiltersValue, setFilters]);

  useEffect(() => {
    setFilters({
      questionsCategoriesIds: panels[selectedPanel]._id !== 'all' ? [panels[selectedPanel]._id] : null,
    });
  }, [selectedPanel]);

  useEffect(() => {
    // Parse filters to format expected by GraphQL Query
    const parsedFilters: any = Object.entries(filtersValues).reduce((acc, filter) => {
      if (!filter || !filter[1] || !allowedFilters.includes(filter[0])) return { ...acc };

      const [key, value] = filter;

      if (
        !value.value ||
        (Array.isArray(value.value) && value.value.length === 0) ||
        (key === 'usersIds' && value.value?.addedByIds?.length === 0)
      )
        return acc;

      return {
        ...acc,
        [key]: value?.value,
      };
    }, {});

    if (parsedFilters) {
      refetch({
        answerQuery: {
          ...parsedFilters,
          questionsCategoriesIds:
            panels[selectedPanel]._id !== 'all' ? [panels[selectedPanel]._id] : parsedFilters?.questionsCategoriesIds ?? [],
        },
      });
    }
  }, [filtersValues]);

  const [selectedWalkItem, setSelectedWalkItem] = useState<IAnswer>();
  const handleOpenModal = (answer: IAnswer) => {
    setSelectedWalkItem(answer);
    setAdminModalState('edit');
  };

  useEffect(() => {
    if (data && data?.answers && !error) {
      const items = [...data?.answers];

      setFilteredAnswers(items);
      if (queryParams.has('id')) {
        const walkItem = items.find(({ _id }) => _id === queryParams.get('id'));
        handleOpenModal(walkItem);
      }
    }
  }, [data?.answers, user]);

  const csvHeaders = [
    { label: '_id', key: '_id' },
    { label: 'Type', key: 'question.questionsCategory.name' },
    { label: 'Description', key: 'question.question' },
    { label: capitalize(t('business unit')), key: 'businessUnit' },
    { label: 'Number of actions', key: 'numberOfActions' },
    { label: 'Status', key: 'status' },
    { label: 'Added by', key: 'addedBy.displayName' },
  ];

  const csvData = useMemo(
    () =>
      (data?.answers ?? []).map(({ typename, metatags, ...answer }) => ({
        ...answer,
        numberOfActions: answer?.actions?.length,
        businessUnit: answer?.audit?.businessUnit?.name || 'Virtual',
      })),
    [JSON.stringify(filteredAnswers)],
  );

  return (
    <>
      <WalkItemDeleteModal
        answer={selectedWalkItem ?? ({} as IAnswer)}
        isOpen={isDeleteQuestionModalOpen}
        onClose={handleDeleteQuestionModalClose}
        refetchAnswers={refetch}
      />
      <Modal
        isOpen={adminModalState !== 'closed'}
        onClose={closeModal}
        size={device === 'desktop' || device === 'tablet' ? 'md' : 'full'}
        variant="adminModal"
      >
        <WalkItemModal
          closeModal={closeModal}
          handleDeleteQuestionModalOpen={handleDeleteQuestionModalOpen}
          refetch={refetch}
          walkItem={selectedWalkItem}
        />
      </Modal>
      <Header breadcrumbs={[capitalize(pluralize(t('question')))]} mobileBreadcrumbs={[capitalize(pluralize(t('question')))]}>
        <ChangeViewButton setViewMode={setViewMode} viewMode={viewMode} views={['grid', 'list']} />
        {device !== 'mobile' && (
          <>
            <CSVLink data={csvData} filename="walk-items.csv" headers={csvHeaders} target="_blank">
              <Button
                _hover={{
                  bg: 'reasponseHeader.buttonLightBgHover',
                  color: 'reasponseHeader.buttonLightColorHover',
                  cursor: 'pointer',
                  '&:hover svg path': { stroke: 'white' },
                }}
                bg="white"
                borderRadius="10px"
                display="none"
                ml="15px"
                rightIcon={<ExportIcon height="15px" width="15px" />}
              >
                <Text fontSize="smm" fontWeight="bold">
                  Export
                </Text>
              </Button>
            </CSVLink>
          </>
        )}
        <SortButton
          ml={[0, '15px']}
          setSortOrder={setSortOrder}
          setSortType={setSortType}
          sortBy={sortBy}
          sortOrder={sortOrder}
          sortType={sortType}
        />
      </Header>
      <Flex h={['calc(100vh - 80px)', 'full']} overflow="auto">
        {/* eslint-disable */}
        {error ? (
          <Text>{error.message}</Text>
        ) : loading ? (
          <Loader center={true} />
        ) : (
          <>
            <Tabs defaultIndex={selectedPanel} onChange={(index) => setSelectedPanel(index)} variant="unstyled" w="full">
              <TabList px={[4, 8]} flexWrap={['wrap', 'initial']}>
                {panels?.map((panel) => (
                  <Tab
                    key={panel._id}
                    _selected={{
                      bg: 'walkItems.tabBg',
                      color: 'walkItems.tabColor',
                    }}
                    borderRadius="10px"
                    fontSize="smm"
                    fontWeight="bold"
                    mr={[1, 2]}
                    ml={[1, 0]}
                    my={[1, 0]}
                    w={['calc(50% - .5rem)', 'auto', 'auto']}
                  >
                    {panel.name}
                  </Tab>
                ))}
              </TabList>
              <TabPanels>
                {panels?.map((panel) => (
                  <TabPanel key={panel._id} p={[4, viewMode === 'list' ? 6 : 2]} ml={[0, '10px']}>
                    {viewMode === 'grid' && (
                      <Grid
                        display={['grid', 'grid', 'flex']}
                        flexWrap="wrap"
                        gap={[4, 4, 6]}
                        h="fit-content"
                        pb={[14, 8]}
                        pt="3"
                        px={[0, 4]}
                        templateColumns={['repeat(auto-fill, minmax(250px, 1fr))', '']}
                        w="full"
                      >
                        {sortedAnswers.map((answer) => (
                          <WalkItemSquare answer={answer} editAnswer={handleOpenModal} key={answer._id} />
                        ))}
                      </Grid>
                    )}
                    {viewMode === 'list' && (
                      <WalkItemsList
                        answers={sortedAnswers}
                        editAnswer={handleOpenModal}
                        refetchAnswers={refetch}
                        setSortOrder={setSortOrder}
                        setSortType={setSortType}
                        sortOrder={sortOrder}
                        sortType={sortType}
                      />
                    )}
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </>
        )}
        {/* eslint-enable */}
      </Flex>
    </>
  );
};

export default WalkItems;

export const walkItemsStyles = {
  walkItems: {
    header: {
      menuButtonBg: 'white',
      rightIcon: '#9A9EA1',
      menuItemFocus: '#462AC4',
      menuItemFontSelected: '#462AC4',
      menuItemFont: '#9A9EA1',
    },
    tabBg: '#1E1836',
    tabColor: '#FFFFFF',
  },
};
