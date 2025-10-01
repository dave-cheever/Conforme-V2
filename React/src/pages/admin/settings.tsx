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
import { runtimeEnv } from '../../utils/runtime-env';

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
        return <Defaults data-id="000569" />;

      case 1:
        return (
          <EmailTemplates
              data-id="000570"
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
    <Box data-id="000571" h="full" w="full">
      <Header
        breadcrumbs={['Admin', 'Other settings']}
        data-id="000572"
        mobileBreadcrumbs={['Other settings']} />
      <Flex
        data-id="000573"
        flexDirection="row"
        h={['calc(100% - 160px)', 'calc(100% - 85px)']}
        px="25px"
        w="full">
        <Flex
          bg="white"
          borderRadius="20px"
          data-id="000574"
          flexDirection="column"
          h={['full', 'calc( 100vh - 190px)', 'calc( 100vh - 170px)']}
          mb={['25px', '0px']}
          p={['25px 30px', '25px 30px']}
          w={activeTab === 1 ? ['full', selectedTemplate ? 'fit-content' : 'full', 'fit-content'] : 'full'}>
          {loading ? (
            <Loader center data-id="000575" />
          ) : (
            <>
              <Tabs data-id="000576" />
              <Flex
                data-id="000577"
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
            bg="white"
            borderRadius={['0px', '20px']}
            data-id="000578"
            flexDirection="column"
            h={['100vh', 'calc( 100vh - 190px)', 'calc( 100vh - 170px)']}
            left="0px"
            minW={['100vw', '100px', '440px']}
            ml={[0, 5]}
            p="25px 30px 25px 30px"
            position={['fixed', 'relative']}
            top="0px"
            zIndex={10}>
            <Flex align="center" data-id="000579" justify="space-between" w="full">
              <Flex data-id="000580" fontWeight="700">Template Preview</Flex>
              {device === 'mobile' ? (
                <CloseIcon data-id="000581" onClick={closeTemplatePreview} />
              ) : (
                <Button
                  borderRadius="10px"
                  colorScheme="purpleHeart"
                  data-id="000582"
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
              bg="emailTemplates.bg"
              data-id="000583"
              h="calc(100vh - 300px)"
              mt={10}>
              <Image
                data-id="000584"
                fit="contain"
                h="full"
                src={`${runtimeEnv.apiUrl()}/images/thumbnails/${selectedTemplate._id}.png?preventCache=${updateImage}`}
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
    <SettingsProvider data-id="000585" {...props}>
      <Settings data-id="000586" />
    </SettingsProvider>
  );
}

export default SettingsWithContext;
