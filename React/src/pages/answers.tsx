import { useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useLocation, useNavigate } from 'react-router-dom';

import { gql, useQuery } from '@apollo/client';
import { Button, Flex, Grid, Modal, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Tooltip, useDisclosure } from '@chakra-ui/react';
import { format } from 'date-fns';
import { t } from 'i18next';
import { capitalize, isEmpty } from 'lodash';
import pluralize from 'pluralize';

import AnswerDeleteModal from '../components/Answers/AnswerDeleteModal';
import AnswerModal from '../components/Answers/AnswerModal';
import AnswerSquare from '../components/Answers/AnswerSquare';
import ChangeViewButton from '../components/ChangeViewButton';
import Header from '../components/Header';
import Loader from '../components/Loader';
import SortButton from '../components/SortButton';
import AvatarCell from '../components/Table/Cells/AvatarCell';
import ListView, { ColumnConfig } from '../components/Table/ListView';
import { useAdminContext } from '../contexts/AdminProvider';
import { useAppContext } from '../contexts/AppProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';
import useSort from '../hooks/useSort';
import { ExportIcon } from '../icons';
import { IAnswer } from '../interfaces/IAnswer';
import { TViewMode } from '../interfaces/TViewMode';

const CSVLinkComponent = CSVLink as unknown as React.FC<any>;

// Types for testing
export interface Category {
  _id: string;
  name: string;
}

export interface AuditType {
  _id: string;
  questionsCategories: Category[] | null | undefined;
}

// Extracted functions for testing
export const flatMapCategories = (auditTypes: AuditType[] | null | undefined): Category[] => (auditTypes ?? []).flatMap((auditType) => auditType.questionsCategories ?? []);

export const dedupeCategories = (categories: Category[]): Map<string, Category> => {
  const uniqueCategoriesMap = new Map<string, Category>();
  for (const category of categories) {
    if (!uniqueCategoriesMap.has(category._id)) 
      uniqueCategoriesMap.set(category._id, category);
    
  }
  return uniqueCategoriesMap;
};

export const buildPanels = (auditTypes: AuditType[] | null | undefined) => {
  const allCategories = flatMapCategories(auditTypes);
  const uniqueCategoriesMap = dedupeCategories(allCategories);
  return [{ _id: 'all', name: 'All' }, ...Array.from(uniqueCategoriesMap.values())];
};

export const categoryIdsForPanel = (
  panels: Category[],
  selectedPanelIndex: number,
  parsedFilters?: { questionsCategoriesIds?: string[] },
) => {
  if (panels[selectedPanelIndex]._id === 'all') 
    return parsedFilters?.questionsCategoriesIds ?? [];
  
  return [panels[selectedPanelIndex]._id];
};

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
  const panels = useMemo(() => buildPanels(data?.auditTypes), [data?.auditTypes]);

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

  const columns: ColumnConfig[] = [
    {
      label: 'Type',
      sortKey: 'question.questionsCategory.name',
      width: '11%',
      dataId: '000020',
      render: (answer: IAnswer) => (
        <Tooltip data-id="001844" label={answer?.question?.questionsCategory?.name}>
          <Flex
            data-id="001845"
            align="flex-start"
            color="auditsList.fontColor"
            fontSize="14px"
            fontWeight="500"
            lineHeight="18px"
            noOfLines={1}
            textOverflow="ellipsis">
            {answer?.question?.questionsCategory?.name}
          </Flex>
        </Tooltip>
      ),
    },
    {
      label: 'Description',
      sortKey: 'question.question',
      width: '13%',
      dataId: '000021',
      render: (answer: IAnswer) => (
        <Tooltip data-id="001846" label={answer?.question?.question}>
          <Flex
            data-id="001847"
            align="flex-start"
            color="auditsList.fontColor"
            fontSize="14px"
            fontWeight="500"
            lineHeight="18px"
            noOfLines={1}
            textOverflow="ellipsis">
            {answer?.question?.question ?? 'No description'}
          </Flex>
        </Tooltip>
      ),
    },
    {
      label: 'Status',
      sortKey: 'status',
      width: '7%',
      dataId: '000022',
      render: (answer: IAnswer) => (
        <Flex
          data-id="001848"
          align="flex-start"
          color="auditsList.fontColor"
          fontSize="14px"
          fontWeight="500"
          lineHeight="18px"
          noOfLines={1}
          textOverflow="ellipsis">
          {answer?.question?.questionsCategory?.useStatus ? capitalize(answer?.status) : '-'}
        </Flex>
      ),
    },
    {
      label: capitalize(t('location')),
      sortKey: 'audit.location.name',
      width: '14%',
      dataId: '000023',
      render: (answer: IAnswer) => (
        <Tooltip data-id="001849" label={answer?.audit?.location?.name}>
          <Flex
            data-id="001850"
            align="flex-start"
            color="auditsList.fontColor"
            fontSize="14px"
            fontWeight="500"
            lineHeight="18px"
            noOfLines={1}
            textOverflow="ellipsis">
            {answer?.audit?.location?.name ?? '-'}
          </Flex>
        </Tooltip>
      ),
    },
    {
      label: capitalize(t('business unit')),
      sortKey: 'businessUnit.name',
      width: '10%',
      dataId: '000024',
      render: (answer: IAnswer) => (
        <Tooltip
          data-id="001851"
          label={
            answer?.audit?.auditType?.businessUnitScope === 'audit'
              ? answer?.audit?.businessUnit?.name ?? '-'
              : answer?.businessUnit?.name ?? '-'
          }>
          <Flex
            data-id="001852"
            align="flex-start"
            color="auditsList.fontColor"
            fontSize="14px"
            fontWeight="500"
            lineHeight="18px"
            noOfLines={1}
            textOverflow="ellipsis">
            {answer?.audit?.auditType?.businessUnitScope === 'audit'
              ? answer?.audit?.businessUnit?.name ?? '-'
              : answer?.businessUnit?.name ?? '-'}
          </Flex>
        </Tooltip>
      ),
    },
    {
      label: '# of actions',
      sortKey: 'actions.length',
      width: '10%',
      dataId: '000025',
      render: (answer: IAnswer) => (
        <Flex
          data-id="001853"
          align="flex-start"
          color="auditsList.fontColor"
          fontSize="14px"
          fontWeight="500"
          lineHeight="18px"
          noOfLines={1}
          textOverflow="ellipsis">
          {answer?.actions?.length}
        </Flex>
      ),
    },
    {
      label: 'Added by',
      sortKey: 'addedBy.displayName',
      width: '18%',
      dataId: '000026',
      render: (answer: IAnswer) => (
        <Tooltip data-id="001854" label={answer.addedBy?.displayName}>
          <AvatarCell data-id="001855" users={answer.addedBy ? [answer.addedBy] : []} />
        </Tooltip>
      ),
    },
    {
      label: 'Date added',
      sortKey: 'metatags.addedAt',
      width: '10%',
      dataId: '000027',
      render: (answer: IAnswer) => (
        <Tooltip
          data-id="001856"
          label={answer?.metatags?.addedAt && format(new Date(answer?.metatags.addedAt), 'd MMM yyyy')}>
          <Flex
            data-id="001857"
            color="auditsList.fontColor"
            fontSize="14px"
            fontWeight="500"
            opacity="1"
            pr={1}>
            {answer?.metatags?.addedAt ? (
              format(new Date(answer?.metatags.addedAt), 'd MMM yyyy')
            ) : (
              <Flex data-id="001858" fontStyle="italic" pr={1}>
                No added date
              </Flex>
            )}
          </Flex>
        </Tooltip>
      ),
    },
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
    const parsedFilters: any = Object.entries(filtersValues).reduce((acc, entry) => {
      const [key, wrapped] = entry;
      if (!wrapped || !allowedFilters.includes(key)) return acc;

      const val = wrapped.value;

      // Normalize usersIds specifically for Answers API: only allow addedByIds
      if (key === 'usersIds') {
        if (!val || typeof val !== 'object') return acc;
        const addedByIds = Array.isArray(val.addedByIds) ? val.addedByIds : [];
        if (addedByIds.length === 0) return acc;
        return { ...acc, usersIds: { addedByIds } };
      }

      if (!val || (Array.isArray(val) && val.length === 0)) return acc;
      return { ...acc, [key]: val };
    }, {} as any);

    if (parsedFilters) {
      refetch({
        answerQuery: {
          ...parsedFilters,
          questionsCategoriesIds:
            panels[selectedPanel]._id === 'all' ? (parsedFilters?.questionsCategoriesIds ?? []) : [panels[selectedPanel]._id],
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
        answer={selectedAnswer ?? ({} as IAnswer)}
        data-id="000266"
        isOpen={isDeleteQuestionModalOpen}
        onClose={handleDeleteQuestionModalClose}
        refetchAnswers={refetch}
      />
      <Modal
        data-id="000267"
        isOpen={adminModalState !== 'closed'}
        onClose={closeModal}
        size={device === 'desktop' || device === 'tablet' ? 'md' : 'full'}
        variant="adminModal"
      >
        <AnswerModal
          answer={selectedAnswer}
          closeModal={closeModal}
          data-id="000268"
          handleDeleteQuestionModalOpen={handleDeleteQuestionModalOpen}
          refetch={refetch}
        />
      </Modal>
      <Header breadcrumbs={[capitalize(pluralize(t('answer')))]} data-id="000269" mobileBreadcrumbs={[capitalize(pluralize(t('answer')))]}>
        <ChangeViewButton data-id="000270" setViewMode={setViewMode} viewMode={viewMode} views={['grid', 'list']} />
        {device !== 'mobile' && (
          <CSVLinkComponent data={csvData} data-id="000271" filename="answers.csv" headers={csvHeaders} target="_blank">
            <Button
              _hover={{
                bg: 'reasponseHeader.buttonLightBgHover',
                color: 'reasponseHeader.buttonLightColorHover',
                cursor: 'pointer',
                '&:hover svg path': { stroke: 'white' },
              }}
              bg="white"
              borderRadius="10px"
              data-id="000272"
              display="none"
              ml="15px"
              rightIcon={<ExportIcon data-id="000273" height="15px" width="15px" />}
            >
              <Text data-id="000274" fontSize="smm" fontWeight="bold">
                Export
              </Text>
            </Button>
          </CSVLinkComponent>
        )}
        <SortButton
          data-id="000275"
          ml={[0, '15px']}
          setSortOrder={setSortOrder}
          setSortType={setSortType}
          sortBy={sortBy}
          sortOrder={sortOrder}
          sortType={sortType}
        />
      </Header>
      <Flex data-id="000276" h={['calc(100vh - 80px)', 'full']} overflow="hidden">
        {/* eslint-disable */}
        {error ? (
          <Text data-id="000277">{error.message}</Text>
        ) : loading ? (
          <Loader data-id="000278" center={true} />
        ) : (
            <Tabs data-id="000279" defaultIndex={selectedPanel} onChange={(index) => setSelectedPanel(index)} variant="unstyled" w="full" overflow="hidden" display="flex" flexDir="column" h="full" minH={0}>
              <TabList data-id="000280" px={[4, 8]} flexWrap={['wrap', 'initial']} flexShrink={0} pb={2}>
                {panels?.map((panel) => (
                  <Tab
                    data-id="000281"
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
                    w={['calc(50% - .5rem)', 'auto', 'auto']}
                  >
                    {panel.name}
                  </Tab>
                ))}
              </TabList>
              <TabPanels data-id="000282" overflow="hidden" h="full" flex={1} minH={0}>
                {panels?.map((panel) => (
                  <TabPanel data-id="000283" key={panel._id} py={[4, viewMode === 'list' ? 0 : 2]} px={0} h="full" overflow="hidden">
                    {viewMode === 'grid' && (
                      <Grid
                        data-id="000284"
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
                        {sortedAnswers.length > 0 ? (
                          sortedAnswers.map((answer) => (
                            <AnswerSquare data-id="000285" answer={answer} editAnswer={handleOpenModal} key={answer._id} />
                          ))
                        ) : (
                          <Flex data-id="000286" fontSize="18px" fontStyle="italic" h="full" w="full">
                            No {t('question')}s found
                          </Flex>
                        )}
                      </Grid>
                    )}
                    {viewMode === 'list' && (
                        <ListView
                          data-id="000287"
                          data={sortedAnswers}
                          columns={columns}
                          dataType="answers"
                          sortOrder={sortOrder}
                          sortType={sortType}
                          setSortOrder={setSortOrder}
                          setSortType={setSortType}
                          onRowClick={handleOpenModal}
                        />
                    )}
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
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
