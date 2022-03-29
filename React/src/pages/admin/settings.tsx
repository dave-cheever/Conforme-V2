import { useEffect, useState } from 'react';

import { CloseIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Image, useDisclosure } from '@chakra-ui/react';

import Header from '../../components/Header';
import Loader from '../../components/Loader';
import Defaults from '../../components/Settings/Defaults';
// import Notification from "../../components/Settings/Notification";
import EmailTemplates from '../../components/Settings/EmailTemplates';
import Tabs from '../../components/Settings/Tabs';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import SettingsProvider, {
  useSettingsContext,
} from '../../contexts/SettingsProvider';
import useDevice from '../../hooks/useDevice';
import { ISetting } from '../../interfaces/ISettings';

const Settings = () => {
  const { loading, activeTab } = useSettingsContext();
  const { setUsedFilters } = useFiltersContext();
  const [selectedTemplate, setSelectedTemplate] = useState<ISetting | null>(
    null,
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updateImage, setUpdateImage] = useState<number>(0);
  const device = useDevice();

  useEffect(() => {
    // remove the filter, as no needed on admin settings.
    setUsedFilters([]);
  }, []);

  const closeTemplatePreview = () => {
    setSelectedTemplate(null);
  };

  const renderSections = () => {
    switch (activeTab) {
      case 0:
        return <Defaults />;

      case 1:
        return (
          <EmailTemplates
            isOpen={isOpen}
            onClose={onClose}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            setUpdateImage={setUpdateImage}
            updateImage={updateImage}
          />
        );

      // case 2:
      //   return <Notification />;

      default:
        return null;
    }
  };

  return (
    <Box h="full" w="full">
      <Header
        breadcrumbs={['Admin', 'Other settings']}
        mobileBreadcrumbs={['Other settings']}
      />
      <Flex
        flexDirection="row"
        px="25px"
        w={['full', 'calc(100vw - 80px)', 'calc(100vw - 240px)']}
      >
        <Flex
          bg="white"
          borderRadius="20px"
          flexDirection="column"
          h={['full', 'calc( 100vh - 190px)', 'calc( 100vh - 170px)']}
          mb={['25px', '0px']}
          p={['25px 30px', '25px 30px']}
          w={
            activeTab === 1
              ? [
                  'full',
                  selectedTemplate ? 'fit-content' : 'full',
                  'fit-content',
                ]
              : 'full'
          }
        >
          {loading ? (
            <Loader center />
          ) : (
            <>
              <Tabs />
              <Flex h="full" mt="7" overflowY={['visible', 'auto']} w="full">
                {renderSections()}
              </Flex>
            </>
          )}
        </Flex>
        {activeTab === 1 && selectedTemplate && (
          <Flex
            bg="white"
            borderRadius={['0px', '20px']}
            flexDirection="column"
            h={['100vh', 'calc( 100vh - 190px)', 'calc( 100vh - 170px)']}
            left="0px"
            minW={['100vw', '100px', '440px']}
            ml={[0, 5]}
            p="25px 30px 25px 30px"
            position={['fixed', 'relative']}
            top="0px"
            zIndex={10}
          >
            <Flex align="center" justify="space-between" w="full">
              <Flex fontWeight="700">Template Preview</Flex>
              {device === 'mobile' ? (
                <CloseIcon onClick={closeTemplatePreview} />
              ) : (
                <Button
                  borderRadius="10px"
                  colorScheme="purpleHeart"
                  fontSize="11px"
                  fontWeight="700"
                  h="28px"
                  onClick={onOpen}
                  w="51px"
                >
                  Edit
                </Button>
              )}
            </Flex>
            <Flex bg="emailTemplates.bg" h="calc(100vh - 300px)" mt={10}>
              <Image
                fit="contain"
                h="full"
                src={`${process.env.REACT_APP_API_URL}/images/thumbnails/${selectedTemplate._id}.png?preventCache=${updateImage}`}
                w="full"
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
