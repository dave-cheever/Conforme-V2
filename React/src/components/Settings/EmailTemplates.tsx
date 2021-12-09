import {
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { gql, useMutation, useQuery } from "@apollo/client";

import EmailTemplate from "./EmailTemplate";
import { useState } from "react";
import EmailEditor from "./EmailEditor";
import Loader from "../Loader";
import { ISetting } from "../../interfaces/ISetting";
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

const EmailTemplates = () => {
  const { data: emailTemplates, loading } = useQuery(GET_EMAIL_TEMPLATES);
  const [updateSetting, { loading: saveLoading }] = useMutation(UPDATE_SETTINGS);
  const [generateThumbnail] = useMutation(GENERATE_EMAIL_TEMPLATE);
  const [selectedTemplate, setSelectedTemplate] = useState<ISetting>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [html, setHtml] = useState<string>();
  const [updateImage, setUpdateImage] = useState<number>(0);

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
      <Flex w="550px" h="full" flexWrap="wrap">
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
      </Flex>
      {selectedTemplate && (
        <Flex
          p="25px 30px 25px 30px"
          flexDirection="column"
          position="absolute"
          left="890px"
          top="152px"
          w="440px"
          bg="white"
          borderRadius="10px"
          h="calc(100vh - 160px)"
          flexWrap="wrap"
          ml={3}
        >
          <Flex align="center" w="full" justify="space-between">
            <Flex fontWeight="700">Template Preview</Flex>
            <Button
              colorScheme="purpleHeart"
              h="28px"
              w="51px"
              borderRadius="10px"
              fontSize="11px"
              fontWeight="700"
              onClick={onOpen}
            >
              Edit
            </Button>
          </Flex>
          <Flex
            w="380px"
            h="calc(100vh - 300px)"
            mt={10}
            bg="emailTemplates.bg"
          >
            <Image
              fit="contain"
              src={`${process.env.REACT_APP_API_URL}/images/thumbnails/${selectedTemplate._id}.png?preventCache=${updateImage}`}
              w="full"
              h="full"
            />
          </Flex>
        </Flex>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          h="100vh"
          maxW="700px"
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
