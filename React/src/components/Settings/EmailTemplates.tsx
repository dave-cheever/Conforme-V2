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
      <Flex data-id="030925-a8563a" h="full" w={['full', 'full', '550px']}>
        <Loader data-id="030925-09c2d9" center />
      </Flex>
    );
  }

  return (
    <Flex data-id="030925-8f3910" w="full">
      <Grid
        data-id="030925-cfdcb3"
        gap={7}
        h={['fit-content', 'fit-content', 'full']}
        templateColumns={['repeat(1, 1fr)', selectedTemplate ? 'repeat(1, 1fr)' : 'repeat(3, 1fr)', 'repeat(3, 1fr)']}
        w={['full', 'full', '550px']}>
        {emailTemplates?.settings?.length > 0 ? (
          emailTemplates?.settings?.map((template) => (
            <EmailTemplate
              data-id="030925-84cec7"
              active={selectedTemplate?._id === template?._id}
              key={template?._id}
              setSelectedTemplate={setSelectedTemplate}
              template={template}
              updateImage={updateImage} />
          ))
        ) : (
          <Text data-id="030925-0ddcc8">No email templates</Text>
        )}
      </Grid>
      <Modal data-id="030925-11350f" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay data-id="030925-500cf9" />
        <ModalContent
          data-id="030925-1577ec"
          borderRadius="0px"
          h="100vh"
          margin="0px"
          maxW="700px"
          position="fixed"
          right="0px"
          top="0px"
          w="full">
          <ModalHeader data-id="030925-905750" fontSize="20px">Edit "{selectedTemplate?.label}” template</ModalHeader>
          <ModalCloseButton data-id="030925-0ac1c0" />
          <ModalBody data-id="030925-9355e7" bg="emailTemplates.bg" p="0px">
            <EmailEditor
              data-id="030925-92a44b"
              options={selectedTemplate?.options}
              setHtml={setHtml}
              value={selectedTemplate?.value} />
          </ModalBody>

          <ModalFooter data-id="030925-fe5d82" mr="auto">
            <Button
              data-id="030925-8ee2eb"
              borderRadius="10px"
              colorScheme="purpleHeart"
              fontSize="14px"
              h="35px"
              isDisabled={html === selectedTemplate?.value}
              isLoading={saveLoading}
              leftIcon={<TickIcon data-id="030925-8bc8b9" mt={1} stroke="white" />}
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
