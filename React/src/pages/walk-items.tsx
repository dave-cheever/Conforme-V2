import { useCallback, useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';

import { gql, useQuery } from '@apollo/client';
import { Button, Flex, Grid, Menu, MenuButton, MenuItem, MenuList, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';

import Header from '../components/Header';
import Icon from '../components/Icon';
import Loader from '../components/Loader';
import WalkItemsList from '../components/WalkItems/WalkItemsList';
import WalkItemSquare from '../components/WalkItems/WalkItemSquare';
import { useAppContext } from '../contexts/AppProvider';
import useDevice from '../hooks/useDevice';
import { ChevronRight, ExportIcon, GridIcon, ListIcon } from '../icons';

const GET_ANSWERS = gql`
  query {
    answers {
      _id
      question {
        question
        questionsCategoryId
        questionsCategory {
          name
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
      }
      status
      actions {
        scope {
          _id
        }
        _id
      }
      metatags {
        addedAt
        addedBy
        updatedAt
      }
    }
    questionsCategories {
      _id
      name
    }
  }
`;

const WalkItems = () => {
  const { user } = useAppContext();
  const device = useDevice();
  const { data, loading, error, refetch } = useQuery(GET_ANSWERS);
  const panels = useMemo(() => [{ _id: 'all', name: 'All' }, ...(data?.questionsCategories ?? [])], [data?.questionsCategories]);
  const [selectedPanel, setSelectedPanel] = useState(0);
  const answers = useMemo(
    () =>
      selectedPanel === 0
        ? data?.answers
        : data?.answers.filter((answer) => answer?.question?.questionsCategoryId === panels[selectedPanel]?._id),
    [data, selectedPanel],
  );

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
        area: answer?.area?.name || 'Virtual',
      })),
    [JSON.stringify(data?.actions)],
  );

  return (
    <>
      <Header breadcrumbs={['Walk Items']} mobileBreadcrumbs={['Walk Items']}>
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
                  <Flex align="center" mr="1">
                    <Icon boxSize="18px" icon={viewMode} stroke="currentColor" />
                  </Flex>
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
      </Header>
      <Flex h={['calc(100vh - 210px)', 'calc(100vh - 150px)']} overflow="auto" pt="3">
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
                        display={['grid', 'flex', 'flex']}
                        flexWrap="wrap"
                        gap={6}
                        h="fit-content"
                        pb={[0, 8]}
                        pt="3"
                        px={4}
                        templateColumns={['repeat(1, 1fr)', '', '']}
                        w="full"
                      >
                        {answers.map((answer) => (
                          <WalkItemSquare answer={answer} key={answer._id} />
                        ))}
                      </Grid>
                    )}
                    {viewMode === 'list' && <WalkItemsList answers={answers} refetchAnswers={refetch}></WalkItemsList>}
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
