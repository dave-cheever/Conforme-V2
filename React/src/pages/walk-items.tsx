import { useCallback, useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';

import { gql, useQuery } from '@apollo/client';
import {
  Button,
  Flex,
  Grid,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalOverlay,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize, isEmpty } from 'lodash';
import pluralize from 'pluralize';

import Header from '../components/Header';
import Icon from '../components/Icon';
import Loader from '../components/Loader';
import SortButton from '../components/SortButton';
import WalkItemModal from '../components/WalkItems/WalkItemModal';
import WalkItemsList from '../components/WalkItems/WalkItemsList';
import WalkItemSquare from '../components/WalkItems/WalkItemSquare';
import { useAdminContext } from '../contexts/AdminProvider';
import { useAppContext } from '../contexts/AppProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';
import useSort from '../hooks/useSort';
import { ChevronRight, ExportIcon, GridIcon, ListIcon } from '../icons';
import { IAnswer } from '../interfaces/IAnswer';

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
          }
        }
        scope {
          _id
        }
      }
      addedBy {
        displayName
        imgUrl
      }
      scope {
        type
        _id
      }
      audit {
        _id
        area {
          name
        }
        status
        auditorId
        participantsIds
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
  const { sortedData: sortedAnswers, sortOrder, sortType, setSortType, setSortOrder } = useSort(filteredAnswers);
  const sortBy = [
    { label: 'Type', key: 'question.questionsCategory.name' },
    { label: 'Description', key: 'question.question' },
    { label: capitalize(t('area')), key: 'audit.area.name' },
    { label: '# of actions', key: 'actions.length' },
    { label: 'Added by', key: 'addedBy.displayName' },
    { label: 'Date added', key: 'metatags.addedAt' },
  ];

  useEffect(() => {
    setUsedFilters(['questionsCategoriesIds', 'areasIds', 'usersIds', 'sitesIds', 'status']);
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
      questionsCategoriesIds: panels[selectedPanel]._id !== 'all' ? [panels[selectedPanel]._id] : undefined,
    });
  }, [selectedPanel]);

  useEffect(() => {
    // Parse filters to format expected by GraphQL Query
    const parsedFilters: any = Object.entries(filtersValues).reduce((acc, filter) => {
      if (!filter || !filter[1]) return { ...acc };

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

  useEffect(() => {
    if (data && data?.answers && !error) {
      const items = [...data?.answers];

      setFilteredAnswers(items);
    }
  }, [data?.answers, user]);

  const [selectedWalkItem, setSelectedWalkItem] = useState<IAnswer>();

  const handleOpenModal = (answer: IAnswer) => {
    setSelectedWalkItem(answer);
    setAdminModalState('edit');
  };

  const initialViewMode = useMemo(() => {
    const savedView = localStorage.getItem('viewMode');
    if (savedView && (savedView === 'grid' || savedView === 'list')) return savedView;

    return 'list';
  }, [user]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);

  useEffect(() => {
    if (device === 'mobile') setViewMode('grid');
  }, [device]);

  const changeViewMode = useCallback((_viewMode: 'grid' | 'list') => {
    setViewMode(_viewMode);
    localStorage.setItem('viewMode', _viewMode);
  }, []);

  const csvHeaders = [
    { label: '_id', key: '_id' },
    { label: 'Type', key: 'question.questionsCategory.name' },
    { label: 'Description', key: 'question.question' },
    { label: 'Area', key: 'area' },
    { label: 'Number of actions', key: 'numberOfActions' },
    { label: 'Status', key: 'status' },
    { label: 'Added by', key: 'addedBy.displayName' },
  ];

  const csvData = useMemo(
    () =>
      (data?.answers ?? []).map(({ typename, metatags, ...answer }) => ({
        ...answer,
        numberOfActions: answer?.actions?.length,
        area: answer?.audit?.area?.name || 'Virtual',
      })),
    [JSON.stringify(filteredAnswers)],
  );

  return (
    <>
      <Modal
        isOpen={adminModalState !== 'closed'}
        onClose={() => setAdminModalState('closed')}
        size={device === 'desktop' || device === 'tablet' ? 'md' : 'full'}
        variant="adminModal"
      >
        <ModalOverlay />
        <WalkItemModal refetch={refetch} walkItem={selectedWalkItem} />
      </Modal>
      <Header breadcrumbs={[capitalize(pluralize(t('question')))]} mobileBreadcrumbs={[capitalize(pluralize(t('question')))]}>
        {device !== 'mobile' && (
          <>
            <Menu autoSelect={false}>
              {
                // @ts-ignore: Issue inside ChakraUI
                // eslint-disable-next-line react/jsx-no-undef
                <MenuButton
                  _active={{}}
                  _hover={{}}
                  as={Button}
                  bg="walkItems.header.menuButtonBg"
                  fontSize="14px"
                  fontWeight="700"
                  h="40px"
                  ml={['15px', '0']}
                  rightIcon={<ChevronRight color="walkItems.header.rightIcon" h="12px" mt="3px" transform="rotate(90deg)" w="12px" />}
                  rounded="10px"
                >
                  <Stack direction="row" spacing={2}>
                    <Icon boxSize="18px" icon={viewMode} stroke="currentColor" />
                    <Text fontSize="smm" fontWeight="semi_medium">
                      Change view
                    </Text>
                  </Stack>
                </MenuButton>
              }
              <MenuList border="none" rounded="lg" w="100px" zIndex={2}>
                <MenuItem
                  _focus={{ color: 'actions.header.menuItemFocus' }}
                  color={viewMode === 'grid' ? 'walkItems.header.menuItemFontSelected' : 'walkItems.header.menuItemFont'}
                  fontSize="14px"
                  onClick={() => changeViewMode('grid')}
                >
                  <GridIcon mr={3} stroke="currentColor" />
                  Card
                </MenuItem>
                <MenuItem
                  _focus={{ color: 'walkItems.header.menuItemFocus' }}
                  color={viewMode === 'list' ? 'walkItems.header.menuItemFontSelected' : 'walkItems.header.menuItemFont'}
                  fontSize="14px"
                  onClick={() => changeViewMode('list')}
                >
                  <ListIcon mr={3} stroke="currentColor" />
                  List
                </MenuItem>
              </MenuList>
            </Menu>
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
            <SortButton setSortOrder={setSortOrder} setSortType={setSortType} sortBy={sortBy} sortOrder={sortOrder} sortType={sortType} />
          </>
        )}
      </Header>
      <Flex h={['calc(100vh - 210px)', '100vh']} overflow="auto">
        {/* eslint-disable */}
        {error ? (
          <Text>{error.message}</Text>
        ) : loading ? (
          <Loader center={true} />
        ) : (
          <>
            <Tabs defaultIndex={selectedPanel} onChange={(index) => setSelectedPanel(index)} variant="unstyled" w="full">
              <TabList px={[4, 8]}>
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
                  >
                    {panel.name}
                  </Tab>
                ))}
              </TabList>
              <TabPanels>
                {panels?.map((panel) => (
                  <TabPanel key={panel._id}>
                    {viewMode === 'grid' && (
                      <Grid
                        display={['grid', 'grid', 'flex']}
                        flexWrap="wrap"
                        gap={[4, 4, 6]}
                        h="fit-content"
                        pb={[0, 8]}
                        pt="3"
                        px={4}
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
