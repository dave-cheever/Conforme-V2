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

function EmailTemplates({ selectedTemplate, setSelectedTemplate, isOpen, onClose, updateImage, setUpdateImage }) {
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
      <Flex data-id="000475" h="full" w={['full', 'full', '550px']}>
        <Loader data-id="000476" center />
      </Flex>
    );
  }

  return (
    <Flex data-id="000477" w="full">
      <Grid
        data-id="000478"
        gap={7}
        h={['fit-content', 'fit-content', 'full']}
        templateColumns={['repeat(1, 1fr)', selectedTemplate ? 'repeat(1, 1fr)' : 'repeat(3, 1fr)', 'repeat(3, 1fr)']}
        w={['full', 'full', '550px']}>
        {emailTemplates?.settings?.length > 0 ? (
          emailTemplates?.settings?.map((template) => (
            <EmailTemplate
              data-id="000479"
              active={selectedTemplate?._id === template?._id}
              key={template?._id}
              setSelectedTemplate={setSelectedTemplate}
              template={template}
              updateImage={updateImage} />
          ))
        ) : (
          <Text data-id="000480">No email templates</Text>
        )}
      </Grid>
      <Modal data-id="000481" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay data-id="000482" />
        <ModalContent
          data-id="000483"
          borderRadius="0px"
          h="100vh"
          margin="0px"
          maxW="700px"
          position="fixed"
          right="0px"
          top="0px"
          w="full">
          <ModalHeader data-id="000484" fontSize="20px">Edit "{selectedTemplate?.label}” template</ModalHeader>
          <ModalCloseButton data-id="000485" />
          <ModalBody data-id="000486" bg="emailTemplates.bg" p="0px">
            <EmailEditor
              data-id="000487"
              options={selectedTemplate?.options}
              setHtml={setHtml}
              value={selectedTemplate?.value} />
          </ModalBody>

          <ModalFooter data-id="000488" mr="auto">
            <Button
              data-id="000489"
              borderRadius="10px"
              colorScheme="purpleHeart"
              fontSize="14px"
              h="35px"
              isDisabled={html === selectedTemplate?.value}
              isLoading={saveLoading}
              leftIcon={<TickIcon data-id="000490" mt={1} stroke="white" />}
              onClick={saveTemplate}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default EmailTemplates;

export const emailTemplatesStyles = {
  emailTemplates: {
    bg: '#F0F2F5',
  },
};
