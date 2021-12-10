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
} from "@chakra-ui/react";
import { gql, useMutation, useQuery } from "@apollo/client";

import EmailTemplate from "./EmailTemplate";
import { useState } from "react";
import EmailEditor from "./EmailEditor";
import Loader from "../Loader";
import { TickIcon } from "../../icons";
import { toastSuccess } from "../../bootstrap/config";

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

const EmailTemplates = ({selectedTemplate,setSelectedTemplate, isOpen, onClose, updateImage, setUpdateImage}) => {
  const { data: emailTemplates, loading } = useQuery(GET_EMAIL_TEMPLATES);
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
      description: "Email template updated successfully",
    });
  };

  return (
    <Flex w="full">
      <Grid w={["full","240px","550px"]} bg="white" h={["fit-content","fit-content","full"]} templateColumns={["repeat(1, 1fr)","repeat(1, 1fr)","repeat(3, 1fr)"]} gap={5}>
        {loading && <Loader center={true} />}
        {emailTemplates?.settings?.map((template) => (
          <EmailTemplate
            active={selectedTemplate?._id === template?._id}
            setSelectedTemplate={setSelectedTemplate}
            key={template?._id}
            template={template}
            updateImage={updateImage}
          />
        ))}
      </Grid>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          h="100vh"
          maxW="700px"
          w="full"
          borderRadius="0px"
          position="fixed"
          right="0px"
          top="0px"
          margin="0px"
        >
          <ModalHeader fontSize="20px">
            Edit "{selectedTemplate?.label}” template
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody bg="emailTemplates.bg" p="0px">
            <EmailEditor
              setHtml={setHtml}
              value={selectedTemplate?.value}
              options={selectedTemplate?.options}
            />
          </ModalBody>

          <ModalFooter mr="auto">
            <Button
              isLoading={saveLoading}
              isDisabled={html === selectedTemplate?.value}
              colorScheme="purpleHeart"
              fontSize="14px"
              borderRadius="10px"
              leftIcon={<TickIcon stroke="white" mt={1} />}
              h="35px"
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
    bg: "#F0F2F5",
  },
};
