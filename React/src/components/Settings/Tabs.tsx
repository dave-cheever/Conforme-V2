import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Button,
} from "@chakra-ui/react";

import { settingsTabs } from "../../bootstrap/config";
import TabItem from "./TabItem";
import { useSettingsContext } from "../../contexts/SettingsProvider";
import { ArrowDownIcon } from "../../icons";
import useDevice from "../../hooks/useDevice";

const Tabs = () => {
  const { activeTab, setActiveTab } = useSettingsContext();
  const device = useDevice();

  if (activeTab === 1 && device === "tablet") {
    return (
      <Menu>
        <MenuButton
          bg="settingsTabItem.tabItemBg"
          h="40px"
          borderRadius="10px"
          maxW="24vw"
          as={Button}
          rightIcon={<ArrowDownIcon />}
          fontSize="14px"
          w="full"
        >
          Email templates
        </MenuButton>
        <MenuList
          borderWidth="0px"
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
        >
          {settingsTabs.map(({label, index}) => (
            <MenuItem
              key={index}
              onClick={() => setActiveTab(index)}
            >
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
          key={index}
          setActiveTab={setActiveTab}
          index={index}
          active={index === activeTab}
          label={label}
        />
      ))}
    </Flex>
  );
};

export default Tabs;
