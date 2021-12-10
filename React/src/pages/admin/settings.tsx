import { useEffect, useState } from "react";
import { Box, Button, Flex, useDisclosure, Image } from "@chakra-ui/react";

import Header from "../../components/Header";
import SettingsProvider, {
  useSettingsContext,
} from "../../contexts/SettingsProvider";
import Defaults from "../../components/Settings/Defaults";
import Loader from "../../components/Loader";
import Notification from "../../components/Settings/Notification";
import EmailTemplates from "../../components/Settings/EmailTemplates";
import { useFiltersContext } from "../../contexts/FiltersProvider";
import { ISetting } from "../../interfaces/ISettings";
import Tabs from "../../components/Settings/Tabs";
import useDevice from "../../hooks/useDevice";
import { CloseIcon } from "@chakra-ui/icons";

const Settings = () => {
  const { loading, activeTab } = useSettingsContext();
  const { setUsedFilters } = useFiltersContext();
  const [selectedTemplate, setSelectedTemplate] = useState<ISetting | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updateImage, setUpdateImage] = useState<number>(0);
  const device = useDevice();

  useEffect(() => {
    //remove the filter, as no needed on admin settings.
    setUsedFilters([]);
    // eslint-disable-next-line
  }, []);

  const closeTemplatePreview = () =>{
    setSelectedTemplate(null);
  }

  const renderSections = () => {
    switch (activeTab) {
      case 0:
        return <Defaults />;

      case 1:
        return (
          <EmailTemplates
            updateImage={updateImage}
            setUpdateImage={setUpdateImage}
            isOpen={isOpen}
            onClose={onClose}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
          />
        );

      case 2:
        return <Notification />;

      default:
        return null;
    }
  };

  return (
    <Box w="full" h="full">
      <Header
        breadcrumbs={["Admin", "Other settings"]}
        mobileBreadcrumbs={["Other settings"]}
      />
      <Flex
        flexDirection="row"
        w={["full", "calc(100vw - 80px)", "calc(100vw - 240px)"]}
        px="25px"
      >
        <Flex
          bg="white"
          w={activeTab === 1 ? ["full","fit-content"] : "full"}
          h={["calc( 100vh - 220px)","calc( 100vh - 190px)","calc( 100vh - 170px)",]}
          borderRadius="20px"
          p={["25px 30px","25px 30px"]}
          flexDirection="column"
        >
          {loading ? (
            <Loader center={true} />
          ) : (
            <>
              <Tabs />
              <Flex mt="7" h="full" overflowY="auto" w="full">
                {renderSections()}
              </Flex>
            </>
          )}
        </Flex>
        {activeTab === 1 && selectedTemplate && (
          <Flex
            p="25px 30px 25px 30px"
            flexDirection="column"
            minW={["100vw", "390px", "440px"]}
            borderRadius={["0px","10px"]}
            ml={[0,5]}
            bg="white"
            h={["100vh","calc( 100vh - 190px)","calc( 100vh - 170px)"]}
            position={["fixed","relative"]}
            zIndex={10}
            top="0px"
            left="0px"
          >
            <Flex align="center" w="full" justify="space-between">
              <Flex fontWeight="700">Template Preview</Flex>
              {device === "mobile" ? <CloseIcon onClick={closeTemplatePreview}/>:<Button
                colorScheme="purpleHeart"
                h="28px"
                w="51px"
                borderRadius="10px"
                fontSize="11px"
                fontWeight="700"
                onClick={onOpen}
              >
                Edit
              </Button>}
            </Flex>
            <Flex h="calc(100vh - 300px)" mt={10} bg="emailTemplates.bg">
              <Image
                fit="contain"
                src={`${process.env.REACT_APP_API_URL}/images/thumbnails/${selectedTemplate._id}.png?preventCache=${updateImage}`}
                w="full"
                h="full"
              />
            </Flex>
          </Flex>
        )}
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