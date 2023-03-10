import { useState } from 'react';

import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Flex,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from '@chakra-ui/react';

import { toastSuccess } from '../../bootstrap/config';
import { useAppContext } from '../../contexts/AppProvider';
import { TickIcon } from '../../icons';
import Loader from '../Loader';
import EmailEditor from './EmailEditor';
import EmailTemplate from './EmailTemplate';

const GET_EMAIL_TEMPLATES = gql`
  query ($type: String, $moduleId: ID) {
    settings(type: $type, moduleId: $moduleId) {
      _id
      name
      value
      label
      options
    }
  }
`;

const UPDATE_SETTINGS = gql`
  mutation ($settingsUpdate: SettingsUpdate!) {
    updateSetting(settingsUpdate: $settingsUpdate) {
      _id
      name
      value
      label
      options
    }
  }
`;

const GENERATE_EMAIL_TEMPLATE = gql`
  mutation ($thumbnailCreate: ThumbnailCreate!) {
    generateThumbnail(thumbnailCreate: $thumbnailCreate)
  }
`;

const EmailTemplates = ({ selectedTemplate, setSelectedTemplate, isOpen, onClose, updateImage, setUpdateImage }) => {
  const { module } = useAppContext();
  const { data: emailTemplates, loading } = useQuery(GET_EMAIL_TEMPLATES, { variables: { type: 'emailTemplate', moduleId: module?._id } });
  const [updateSetting, { loading: saveLoading }] = useMutation(UPDATE_SETTINGS);
  const [generateThumbnail] = useMutation(GENERATE_EMAIL_TEMPLATE);
  const [html, setHtml] = useState<string>();

  const toast = useToast();

  const saveTemplate = async () => {
    await updateSetting({
      variables: {
        settingsUpdate: {
          _id: selectedTemplate?._id,
          name: selectedTemplate?.name,
          value: html,
        },
      },
    });
    await generateThumbnail({
      variables: {
        thumbnailCreate: { _id: selectedTemplate?._id, html },
      },
    });
    setUpdateImage(updateImage + 1);
    toast({
      ...toastSuccess,
      description: 'Email template updated successfully',
    });
  };

  if (loading) {
    return (
      (<Flex data-id="e2a4553ce50e" h="full" w={['full', 'full', '550px']}>
        <Loader center data-id="89fb0a151abd" />
      </Flex>)
    );
  }

  return (
    (<Flex data-id="1aaea2a3b492" w="full">
      <Grid
        data-id="7facfff9d521"
        gap={7}
        h={['fit-content', 'fit-content', 'full']}
        templateColumns={['repeat(1, 1fr)', selectedTemplate ? 'repeat(1, 1fr)' : 'repeat(3, 1fr)', 'repeat(3, 1fr)']}
        w={['full', 'full', '550px']}>
        {emailTemplates?.settings?.length > 0 ? (
          emailTemplates?.settings?.map((template) => (
            <EmailTemplate
              active={selectedTemplate?._id === template?._id}
              data-id="a45ab48e4dd2"
              key={template?._id}
              setSelectedTemplate={setSelectedTemplate}
              template={template}
              updateImage={updateImage} />
          ))
        ) : (
          <Text data-id="904caf7d65cd">No email templates</Text>
        )}
      </Grid>
      <Modal data-id="8461da9cb554" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay data-id="a3f0d6985d05" />
        <ModalContent
          borderRadius="0px"
          data-id="592449725651"
          h="100vh"
          margin="0px"
          maxW="700px"
          position="fixed"
          right="0px"
          top="0px"
          w="full">
          <ModalHeader data-id="7ab75ada00de" fontSize="20px">Edit "{selectedTemplate?.label}” template</ModalHeader>
          <ModalCloseButton data-id="1430088ae33f" />
          <ModalBody bg="emailTemplates.bg" data-id="509dbd5fb8f2" p="0px">
            <EmailEditor
              data-id="1465e1cc9bd9"
              options={selectedTemplate?.options}
              setHtml={setHtml}
              value={selectedTemplate?.value} />
          </ModalBody>

          <ModalFooter data-id="17ebb13e63e3" mr="auto">
            <Button
              borderRadius="10px"
              colorScheme="purpleHeart"
              data-id="bca651d384d1"
              fontSize="14px"
              h="35px"
              isDisabled={html === selectedTemplate?.value}
              isLoading={saveLoading}
              leftIcon={<TickIcon data-id="3a13e3bedcab" mt={1} stroke="white" />}
              onClick={saveTemplate}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>)
  );
};

export default EmailTemplates;

export const emailTemplatesStyles = {
  emailTemplates: {
    bg: '#F0F2F5',
  },
};
