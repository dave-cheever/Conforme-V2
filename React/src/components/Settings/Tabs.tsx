import React from 'react';

import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';

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
      <Menu>
        <MenuButton
          as={Button}
          bg="settingsTabItem.tabItemBg"
          borderRadius="10px"
          fontSize="14px"
          h="40px"
          maxW="24vw"
          rightIcon={<ArrowDownIcon />}
          w="full"
        >
          Email templates
        </MenuButton>
        <MenuList
          borderWidth="0px"
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
        >
          {settingsTabs.map(({ label, index }) => (
            <MenuItem key={index} onClick={() => setActiveTab(index)}>
              {label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    );
  }

  return (
    <Flex w="full">
      {settingsTabs.map(({ label, index }) => (
        <TabItem
          active={index === activeTab}
          index={index}
          key={index}
          label={label}
          setActiveTab={setActiveTab}
        />
      ))}
    </Flex>
  );
};

export default Tabs;
