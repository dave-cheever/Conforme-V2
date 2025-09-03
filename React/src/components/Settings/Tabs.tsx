import React from 'react';

import { Button, Flex, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';

import { settingsTabs } from '../../bootstrap/config';
import { useSettingsContext } from '../../contexts/SettingsProvider';
import useDevice from '../../hooks/useDevice';
import { ArrowDownIcon } from '../../icons';
import TabItem from './TabItem';

function Tabs() {
  const { activeTab, setActiveTab } = useSettingsContext();
  const device = useDevice();

  if (activeTab === 1 && device === 'tablet') {
    return (
      <Menu data-id="030925-1d2fd7">
        <MenuButton
          data-id="030925-d0663a"
          as={Button}
          bg="settingsTabItem.tabItemBg"
          borderRadius="10px"
          fontSize="14px"
          h="40px"
          maxW="24vw"
          rightIcon={<ArrowDownIcon data-id="030925-75aa5a" />}
          w="full">
          Email templates
        </MenuButton>
        <MenuList
          data-id="030925-ef7e9f"
          borderWidth="0px"
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)">
          {settingsTabs.map(({ label, index }) => (
            <MenuItem data-id="030925-cbe1f7" key={index} onClick={() => setActiveTab(index)}>
              {label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    );
  }

  return (
    <Flex data-id="030925-2bea7a" w="full">
      {settingsTabs.map(({ label, index }) => (
        <TabItem
          data-id="030925-4b37f7"
          active={index === activeTab}
          index={index}
          key={index}
          label={label}
          setActiveTab={setActiveTab} />
      ))}
    </Flex>
  );
}

export default Tabs;
