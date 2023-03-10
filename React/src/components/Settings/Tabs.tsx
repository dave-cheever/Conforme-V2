import React from 'react';

import { Button, Flex, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';

import { settingsTabs } from '../../bootstrap/config';
import { useSettingsContext } from '../../contexts/SettingsProvider';
import useDevice from '../../hooks/useDevice';
import { ArrowDownIcon } from '../../icons';
import TabItem from './TabItem';

const Tabs = () => {
  const { activeTab, setActiveTab } = useSettingsContext();
  const device = useDevice();

  if (activeTab === 1 && device === 'tablet') {
    return (
      (<Menu data-id="8180aefca39f">
        <MenuButton
          as={Button}
          bg="settingsTabItem.tabItemBg"
          borderRadius="10px"
          data-id="9daf86b72d29"
          fontSize="14px"
          h="40px"
          maxW="24vw"
          rightIcon={<ArrowDownIcon data-id="c72623a47bc9" />}
          w="full">
          Email templates
        </MenuButton>
        <MenuList
          borderWidth="0px"
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
          data-id="763966763088">
          {settingsTabs.map(({ label, index }) => (
            <MenuItem data-id="ccee5772d130" key={index} onClick={() => setActiveTab(index)}>
              {label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>)
    );
  }

  return (
    (<Flex data-id="3435a33e0630" w="full">
      {settingsTabs.map(({ label, index }) => (
        <TabItem
          active={index === activeTab}
          data-id="762558580445"
          index={index}
          key={index}
          label={label}
          setActiveTab={setActiveTab} />
      ))}
    </Flex>)
  );
};

export default Tabs;
