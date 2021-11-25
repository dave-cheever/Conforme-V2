import {
  Box,
  Flex,
} from "@chakra-ui/react";

import Header from "../../components/Header";
import TabItem from "../../components/Settings/TabItem";
import { settingsTabs } from "../../bootstrap/config";
import SettingsProvider, { useSettingsContext } from "../../contexts/SettingsProvider";
import Defaults from "../../components/Settings/Defaults";
import Loader from "../../components/Loader";
import Notification from "../../components/Settings/Notification";
import EmailTemplates from "../../components/Settings/EmailTemplates";

const Settings = () => {
  const {
    loading,
    activeTab,
    setActiveTab
  } = useSettingsContext();

  const renderSections = () => {
    switch (activeTab) {
      case 0:
        return <Defaults/>;

      case 1:
        return <EmailTemplates/>;

      case 2:
        return <Notification/>;
    
      default:
        return null;
    }
  }

  return (
    <Box w="full" h="full">
      <Header
        breadcrumbs={["Admin", "Other settings"]}
        hideBreadcrumbsOnMobile
      />
      <Flex flexDirection="column" w="full" px="30px" h="calc( 100vh - 150px)" overflow="none">
        <Flex bg="white" w={activeTab !== 1 ? "full" : "fit-content"} h="full" overflow="auto" borderRadius="20px" p="25px 30px" flexDirection="column">
          {loading ? <Loader center={true}/>: 
          <><Flex w="full">
            {settingsTabs.map(({label, index}) => <TabItem 
            key={index} setActiveTab={setActiveTab}
            index={index} 
            active={index===activeTab} label={label}/>)}
          </Flex>
          <Flex mt="7">
            {renderSections()}
          </Flex>
          </>}
        </Flex>
      </Flex> 
    </Box>
  );
};

const SettingsWithContext = (props) => (
  <SettingsProvider {...props}>
    <Settings />
  </SettingsProvider>
);

export default SettingsWithContext;
