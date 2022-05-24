import { useEffect, useState } from 'react';

import {
  Flex,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';

import FilterButton from '../../components/FilterButton';
import Header from '../../components/Header';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import useDevice from '../../hooks/useDevice';
import AuditsInsights from './audits';

const Insights = () => {
  const device = useDevice();
  const { setUsedFilters, setShowFiltersPanel } = useFiltersContext();
  const panels = [
    { _id: 'walks', name: 'Walks', component: <AuditsInsights /> },
    { _id: 'hazards', name: 'Hazards', component: <Flex>Hazards</Flex> },
    {
      _id: 'behaviours',
      name: 'Positive Safety Behaviours',
      component: <Flex>Behaviours</Flex>,
    },
    { _id: 'actions', name: 'Actions', component: <Flex>Actions</Flex> },
  ];
  const [selectedPanel, setSelectedPanel] = useState(0);

  useEffect(() => {
    setUsedFilters(['walkType', 'status', 'sitesIds', 'areasIds', 'usersIds']);
    return () => setShowFiltersPanel(false);
  }, []);

  return (
    <>
      <Header breadcrumbs={['Insights']} mobileBreadcrumbs={['Insights']}>
        {device === 'mobile' && <FilterButton insightsFilter />}
      </Header>

      <Flex direction="column" pt="3" px={[4, 8]}>
        {device === 'tablet' && (
          <Flex mb={[2, 4]}>
            <Spacer />
            <FilterButton insightsFilter />
          </Flex>
        )}
        <Tabs
          defaultIndex={selectedPanel}
          onChange={(index) => setSelectedPanel(index)}
          variant="unstyled"
          w="full"
        >
          <TabList>
            {panels?.map((panel) => (
              <Tab
                _selected={{
                  bg: 'insights.tabBg',
                  color: 'insights.tabColor',
                }}
                borderRadius="10px"
                fontSize="smm"
                fontWeight="bold"
                key={panel._id}
                mr={[1, 2]}
              >
                {panel.name}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {panels?.map((panel) => (
              <TabPanel key={panel._id} px={0}>
                {panel.component}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Flex>
    </>
  );
};

export default Insights;

export const insightsStyles = {
  insights: {
    header: {
      menuButtonBg: 'white',
      rightIcon: '#9A9EA1',
      menuItemFocus: '#462AC4',
      menuItemFontSelected: '#462AC4',
      menuItemFont: '#9A9EA1',
    },
    tabBg: '#1E1836',
    tabColor: '#FFFFFF',
    secondaryText: '#787486',
  },
};
