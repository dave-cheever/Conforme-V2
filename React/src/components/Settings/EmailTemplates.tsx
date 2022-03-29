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
  useToast,
} from '@chakra-ui/react';

import { toastSuccess } from '../../bootstrap/config';
import { TickIcon } from '../../icons';
import Loader from '../Loader';
import EmailEditor from './EmailEditor';
import EmailTemplate from './EmailTemplate';

const GET_EMAIL_TEMPLATES = gql`
  query {
    settings(type: "emailTemplate") {
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

const EmailTemplates = ({
  selectedTemplate,
  setSelectedTemplate,
  isOpen,
  onClose,
  updateImage,
  setUpdateImage,
}) => {
  const { data: emailTemplates, loading } = useQuery(GET_EMAIL_TEMPLATES);
  const [updateSetting, { loading: saveLoading }] =
    useMutation(UPDATE_SETTINGS);
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
      <Flex h="full" w={['full', 'full', '550px']}>
        <Loader center />
      </Flex>
    );
  }

  return (
    <Flex w="full">
      <Grid
        gap={7}
        h={['fit-content', 'fit-content', 'full']}
        templateColumns={[
          'repeat(1, 1fr)',
          selectedTemplate ? 'repeat(1, 1fr)' : 'repeat(3, 1fr)',
          'repeat(3, 1fr)',
        ]}
        w={['full', 'full', '550px']}
      >
        {emailTemplates?.settings?.map((template) => (
          <EmailTemplate
            active={selectedTemplate?._id === template?._id}
            key={template?._id}
            setSelectedTemplate={setSelectedTemplate}
            template={template}
            updateImage={updateImage}
          />
        ))}
      </Grid>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          borderRadius="0px"
          h="100vh"
          margin="0px"
          maxW="700px"
          position="fixed"
          right="0px"
          top="0px"
          w="full"
        >
          <ModalHeader fontSize="20px">
            Edit "{selectedTemplate?.label}” template
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody bg="emailTemplates.bg" p="0px">
            <EmailEditor
              options={selectedTemplate?.options}
              setHtml={setHtml}
              value={selectedTemplate?.value}
            />
          </ModalBody>

          <ModalFooter mr="auto">
            <Button
              borderRadius="10px"
              colorScheme="purpleHeart"
              fontSize="14px"
              h="35px"
              isDisabled={html === selectedTemplate?.value}
              isLoading={saveLoading}
              leftIcon={<TickIcon mt={1} stroke="white" />}
              onClick={saveTemplate}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default EmailTemplates;

export const emailTemplatesStyles = {
  emailTemplates: {
    bg: '#F0F2F5',
  },
};
