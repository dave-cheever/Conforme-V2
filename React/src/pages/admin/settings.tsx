import { useState } from 'react';

import { CloseIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Image, useDisclosure } from '@chakra-ui/react';

import Header from '../../components/Header';
import Loader from '../../components/Loader';
import Defaults from '../../components/Settings/Defaults';
import EmailTemplates from '../../components/Settings/EmailTemplates';
import Tabs from '../../components/Settings/Tabs';
import SettingsProvider, { useSettingsContext } from '../../contexts/SettingsProvider';
import useDevice from '../../hooks/useDevice';
import { ISetting } from '../../interfaces/ISettings';

function Settings() {
  const { loading, activeTab } = useSettingsContext();
  const [selectedTemplate, setSelectedTemplate] = useState<ISetting | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updateImage, setUpdateImage] = useState<number>(0);
  const device = useDevice();

  const closeTemplatePreview = () => {
    setSelectedTemplate(null);
  };

  const renderSections = () => {
    switch (activeTab) {
      case 0:
        return <Defaults data-id="030925-5fa7c5" />;

      case 1:
        return (
          <EmailTemplates
              data-id="030925-28cc76"
              isOpen={isOpen}
              onClose={onClose}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              setUpdateImage={setUpdateImage}
              updateImage={updateImage} />
        );

      default:
        return null;
    }
  };

  return (
    <Box data-id="030925-35e736" h="full" w="full">
      <Header
        data-id="030925-7396eb"
        breadcrumbs={['Admin', 'Other settings']}
        mobileBreadcrumbs={['Other settings']} />
      <Flex
        data-id="030925-53ed11"
        flexDirection="row"
        h={['calc(100% - 160px)', 'calc(100% - 85px)']}
        px="25px"
        w="full">
        <Flex
          data-id="030925-6928d4"
          bg="white"
          borderRadius="20px"
          flexDirection="column"
          h={['full', 'calc( 100vh - 190px)', 'calc( 100vh - 170px)']}
          mb={['25px', '0px']}
          p={['25px 30px', '25px 30px']}
          w={activeTab === 1 ? ['full', selectedTemplate ? 'fit-content' : 'full', 'fit-content'] : 'full'}>
          {loading ? (
            <Loader data-id="030925-6b438b" center />
          ) : (
            <>
              <Tabs data-id="030925-e90226" />
              <Flex
                data-id="030925-ded770"
                h="full"
                mt="7"
                overflowY={['visible', 'auto']}
                w="full">
                {renderSections()}
              </Flex>
            </>
          )}
        </Flex>
        {activeTab === 1 && selectedTemplate && (
          <Flex
            data-id="030925-d96d0a"
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
            zIndex={10}>
            <Flex data-id="030925-060b50" align="center" justify="space-between" w="full">
              <Flex data-id="030925-422f61" fontWeight="700">Template Preview</Flex>
              {device === 'mobile' ? (
                <CloseIcon data-id="030925-48cd92" onClick={closeTemplatePreview} />
              ) : (
                <Button
                  data-id="030925-a49db9"
                  borderRadius="10px"
                  colorScheme="purpleHeart"
                  fontSize="11px"
                  fontWeight="700"
                  h="28px"
                  onClick={onOpen}
                  w="51px">
                  Edit
                </Button>
              )}
            </Flex>
            <Flex
              data-id="030925-d4eedf"
              bg="emailTemplates.bg"
              h="calc(100vh - 300px)"
              mt={10}>
              <Image
                data-id="030925-4d1e02"
                fit="contain"
                h="full"
                src={`${process.env.REACT_APP_API_URL}/images/thumbnails/${selectedTemplate._id}.png?preventCache=${updateImage}`}
                w="full" />
            </Flex>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}

function SettingsWithContext(props) {
  return (
    <SettingsProvider data-id="030925-899021" {...props}>
      <Settings data-id="030925-3f5a60" />
    </SettingsProvider>
  );
}

export default SettingsWithContext;
