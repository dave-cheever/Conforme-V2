import { useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useLocation, useNavigate } from 'react-router-dom';

import { gql, useQuery } from '@apollo/client';
import { Button, Flex, Grid, Modal, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useDisclosure } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize, isEmpty } from 'lodash';
import pluralize from 'pluralize';

import AnswerDeleteModal from '../components/Answers/AnswerDeleteModal';
import AnswerModal from '../components/Answers/AnswerModal';
import AnswersList from '../components/Answers/AnswersList';
import AnswerSquare from '../components/Answers/AnswerSquare';
import ChangeViewButton from '../components/ChangeViewButton';
import Header from '../components/Header';
import Loader from '../components/Loader';
import SortButton from '../components/SortButton';
import { useAdminContext } from '../contexts/AdminProvider';
import { useAppContext } from '../contexts/AppProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';
import useSort from '../hooks/useSort';
import { ExportIcon } from '../icons';
import { IAnswer } from '../interfaces/IAnswer';
import { TViewMode } from '../interfaces/TViewMode';

const CSVLinkComponent = CSVLink as unknown as React.FC<any>;

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
            setting
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

function Answers() {
  const {
    isOpen: isDeleteQuestionModalOpen,
    onOpen: handleDeleteQuestionModalOpen,
    onClose: handleDeleteQuestionModalClose,
  } = useDisclosure();
  const { filtersValues, setUsedFilters, setFilters, setShowFiltersPanel, answerFiltersValue, setAnswerFiltersValue, usedFilters } =
    useFiltersContext();
  const { user } = useAppContext();
  const { adminModalState, setAdminModalState } = useAdminContext();
  const device = useDevice();
  const { data, loading, error, refetch } = useQuery(GET_ANSWERS);
  const panels = useMemo(() => {
    const allCategories = (data?.auditTypes ?? []).flatMap(
      (auditType) => auditType.questionsCategories ?? [],
    );

    const uniqueCategoriesMap = new Map();
    for (const category of allCategories) {
      if (!uniqueCategoriesMap.has(category._id)) 
        uniqueCategoriesMap.set(category._id, category);
      
    }

    return [{ _id: 'all', name: 'All' }, ...Array.from(uniqueCategoriesMap.values())];
  }, [data?.auditTypes]);

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
    { label: capitalize(t('location')), key: 'audit.location.name' },
    { label: capitalize(t('business unit')), key: 'businessUnit.name' },
    { label: '# of actions', key: 'actions.length' },
    { label: 'Added by', key: 'addedBy.displayName' },
    { label: 'Date added', key: 'metatags.addedAt' },
  ];
  const [viewMode, setViewMode] = useState<TViewMode>('grid');
  const navigate = useNavigate();
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
      navigate({
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
    if (answerFiltersValue && !isEmpty(answerFiltersValue) && !isEmpty(filtersValues) && !isEmpty(usedFilters)) {
      // Delay setting filters by 100ms to make sure that other useEffects finished and filters won't be cleared
      const delayFilters = setTimeout(() => {
        setFilters(Object.entries(answerFiltersValue).reduce((acc, [key, value]) => ({ ...acc, [key]: value.value }), {}));
        setAnswerFiltersValue({});
        clearTimeout(delayFilters);
      }, 100);
    }
  }, [filtersValues, usedFilters, setAnswerFiltersValue, answerFiltersValue, setFilters]);

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

  const [selectedAnswer, setSelectedAnswer] = useState<IAnswer>();
  const handleOpenModal = (answer: IAnswer) => {
    setSelectedAnswer(answer);
    setAdminModalState('edit');
  };

  useEffect(() => {
    if (data && data?.answers && !error) {
      const items = [...(data?.answers || [])];

      setFilteredAnswers(items);
      if (queryParams.has('id')) {
        const answer = items.find(({ _id }) => _id === queryParams.get('id'));
        handleOpenModal(answer);
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
      <AnswerDeleteModal
        data-id="030925-4cc64e"
        answer={selectedAnswer ?? ({} as IAnswer)}
        isOpen={isDeleteQuestionModalOpen}
        onClose={handleDeleteQuestionModalClose}
        refetchAnswers={refetch} />
      <Modal
        data-id="030925-4bf887"
        isOpen={adminModalState !== 'closed'}
        onClose={closeModal}
        size={device === 'desktop' || device === 'tablet' ? 'md' : 'full'}
        variant="adminModal">
        <AnswerModal
          data-id="030925-f6ff02"
          answer={selectedAnswer}
          closeModal={closeModal}
          handleDeleteQuestionModalOpen={handleDeleteQuestionModalOpen}
          refetch={refetch} />
      </Modal>
      <Header
        data-id="030925-854b98"
        breadcrumbs={[capitalize(pluralize(t('question')))]}
        mobileBreadcrumbs={[capitalize(pluralize(t('question')))]}>
        <ChangeViewButton
          data-id="030925-3eddd7"
          setViewMode={setViewMode}
          viewMode={viewMode}
          views={['grid', 'list']} />
        {device !== 'mobile' && (
          <CSVLinkComponent
            data-id="030925-58e43a"
            data={csvData}
            filename="answers.csv"
            headers={csvHeaders}
            target="_blank">
            <Button
              data-id="030925-2668d5"
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
              rightIcon={<ExportIcon data-id="030925-d8ee1b" height="15px" width="15px" />}>
              <Text data-id="030925-9c065f" fontSize="smm" fontWeight="bold">
                Export
              </Text>
            </Button>
          </CSVLinkComponent>
        )}
        <SortButton
          data-id="030925-7dcdf5"
          ml={[0, '15px']}
          setSortOrder={setSortOrder}
          setSortType={setSortType}
          sortBy={sortBy}
          sortOrder={sortOrder}
          sortType={sortType} />

      </Header>
      <Flex data-id="030925-a1a71d" h={['calc(100vh - 80px)', 'full']} overflow="auto">
        {/* eslint-disable */}
        {error ? (
          <Text data-id="030925-c64257">{error.message}</Text>
        ) : loading ? (
          <Loader data-id="030925-44211b" center={true} />
        ) : (
          <>
            <Tabs
              data-id="030925-532749"
              defaultIndex={selectedPanel}
              onChange={(index) => setSelectedPanel(index)}
              variant="unstyled"
              w="full">
              <TabList data-id="030925-3eaab4" px={[4, 8]} flexWrap={['wrap', 'initial']}>
                {panels?.map((panel) => (
                  <Tab
                    data-id="030925-446401"
                    key={panel._id}
                    _selected={{
                      bg: 'answers.tabBg',
                      color: 'answers.tabColor',
                    }}
                    borderRadius="10px"
                    fontSize="14px"
                    fontWeight="600"
                     _hover={{
                      opacity: 0.8,
                    }}
                    mr={[1, 2]}
                    ml={[1, 0]}
                    my={[1, 0]}
                    w={['calc(50% - .5rem)', 'auto', 'auto']}>
                    {panel.name}
                  </Tab>
                ))}
              </TabList>
              <TabPanels data-id="030925-6f64a5">
                {panels?.map((panel) => (
                  <TabPanel
                    data-id="030925-92b53a"
                    key={panel._id}
                    p={[4, viewMode === 'list' ? 6 : 2]}
                    ml={[0, '10px']}>
                    {viewMode === 'grid' && (
                      <Grid
                        data-id="030925-246c65"
                        display={['grid', 'grid', 'flex']}
                        flexWrap="wrap"
                        gap={[4, 4, 6]}
                        h="fit-content"
                        pb={[14, 8]}
                        pt="3"
                        px={[0, 4]}
                        templateColumns={['repeat(auto-fill, minmax(250px, 1fr))', '']}
                        w="full">
                          {sortedAnswers.length > 0 ? (
                            sortedAnswers.map((answer) => (
                              <AnswerSquare
                                data-id="030925-607285"
                                answer={answer}
                                editAnswer={handleOpenModal}
                                key={answer._id}
                              />
                            ))
                          ) : (
                            <Flex
                              data-id="030925-4ce694"
                              fontSize="18px"
                              fontStyle="italic"
                              h="full"
                              w="full">
                              No {t('question')}s found
                            </Flex>
                          )}
                      </Grid>
                    )}
                    {viewMode === 'list' && (
                      <AnswersList
                        data-id="030925-ca510b"
                        answers={sortedAnswers}
                        editAnswer={handleOpenModal}
                        refetchAnswers={refetch}
                        setSortOrder={setSortOrder}
                        setSortType={setSortType}
                        sortOrder={sortOrder}
                        sortType={sortType} />
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
}

export default Answers;

export const answersStyles = {
  answers: {
    header: {
      menuButtonBg: 'white',
      rightIcon: '#9A9EA1',
      menuItemFocus: '#462AC4',
      menuItemFontSelected: '#462AC4',
      menuItemFont: '#9A9EA1',
    },
    tabBg: '#462AC4',
    tabColor: '#FFFFFF',
  },
};
