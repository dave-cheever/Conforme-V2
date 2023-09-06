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
        return <Defaults data-id="1a3890eb5fd0" />;

      case 1:
        return (
          (<EmailTemplates
            data-id="ea27c3287ab0"
            isOpen={isOpen}
            onClose={onClose}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            setUpdateImage={setUpdateImage}
            updateImage={updateImage} />)
        );

      default:
        return null;
    }
  };

  return (
    (<Box data-id="331e5f374b17" h="full" w="full">
      <Header
        breadcrumbs={['Admin', 'Other settings']}
        data-id="06af38227662"
        mobileBreadcrumbs={['Other settings']} />
      <Flex
        data-id="5ed9fd8324ef"
        flexDirection="row"
        h={['calc(100% - 160px)', 'calc(100% - 35px)']}
        px="25px"
        w={['full', 'calc(100vw - 80px)', 'calc(100vw - 240px)']}>
        <Flex
          bg="white"
          borderRadius="20px"
          data-id="bd815a1ca832"
          flexDirection="column"
          h={['full', 'calc( 100vh - 190px)', 'calc( 100vh - 170px)']}
          mb={['25px', '0px']}
          p={['25px 30px', '25px 30px']}
          w={activeTab === 1 ? ['full', selectedTemplate ? 'fit-content' : 'full', 'fit-content'] : 'full'}>
          {loading ? (
            <Loader center data-id="b2cd55f6dbb4" />
          ) : (
            <>
              <Tabs data-id="e7e9617f8af1" />
              <Flex
                data-id="4ce9e50cb78e"
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
            data-id="e14e5b066ac0"
            flexDirection="column"
            h={['100vh', 'calc( 100vh - 190px)', 'calc( 100vh - 170px)']}
            left="0px"
            minW={['100vw', '100px', '440px']}
            ml={[0, 5]}
            p="25px 30px 25px 30px"
            position={['fixed', 'relative']}
            top="0px"
            zIndex={10}>
            <Flex align="center" data-id="c4afbdbce4e9" justify="space-between" w="full">
              <Flex data-id="1031a75f850a" fontWeight="700">Template Preview</Flex>
              {device === 'mobile' ? (
                <CloseIcon data-id="dc71818e2864" onClick={closeTemplatePreview} />
              ) : (
                <Button
                  borderRadius="10px"
                  colorScheme="purpleHeart"
                  data-id="ecf941e5a6ce"
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
              data-id="9747b30cb01f"
              h="calc(100vh - 300px)"
              mt={10}>
              <Image
                data-id="33642c8cc727"
                fit="contain"
                h="full"
                src={`${process.env.REACT_APP_API_URL}/images/thumbnails/${selectedTemplate._id}.png?preventCache=${updateImage}`}
                w="full" />
            </Flex>
          </Flex>
        )}
      </Flex>
    </Box>)
  );
}

function SettingsWithContext(props) {
  return <SettingsProvider data-id="d092ac29f472" {...props}>
    <Settings data-id="0bb73c35c5b7" />
  </SettingsProvider>
}

export default SettingsWithContext;
