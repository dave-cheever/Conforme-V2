import React from "react";
import { Flex, Box } from "@chakra-ui/layout";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  Icon,
  Avatar,
  useToast,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
} from "@chakra-ui/react";

import { toastSuccess } from "../../../bootstrap/config";
import { DetailIcon, ArrowRight, Copy } from "../../../icons";
import ResponseLeftItem from "../ResponseLeftItem";

const ResponseDetail = ({ response }) => {
  const toast = useToast();
  const {onOpen, isOpen, onClose} = useDisclosure();

  const toggle = () => {
    if(isOpen){
      return onClose();
    }else{
      onOpen();
    }
  }

  return (
    <>
    <Flex mt={[0,5]} onClick={toggle} position="relative">
      <Flex align="center" cursor="pointer">
        <Flex
          w="30px"
          h="30px"
          bg={isOpen ? "responseLeftNavigation.responseDetailActiveColor":"responseLeftTabItem.iconBg"}
          borderRadius="8px"
          align="center"
          justify="center"
        >
          <Icon as={DetailIcon} color="responseLeftTabItem.iconColor" />
        </Flex>
        <ArrowRight display={["none","block"]} color="responseLeftTabItem.textColor" mt={1} ml={1} />
      </Flex>
    </Flex>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent maxW={["calc(100% - 20px)","315px"]} boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)" borderRadius="10px" position="absolute" h="fit-content" left={["10px","80px"]} top={["auto","200px"]} bottom="10px">
        <ModalBody p="20px">
        <Flex w="full">
            <Flex w="50%" flexDirection="column">
              <Box h="50px" mt={2}>
                <Box opacity={0.5} fontSize="11px">
                  Item ID
                </Box>
                <Flex align="center" fontSize="14px" minH="28px">
                  <Flex mr={2}>{response?.complianceItem?.reference}</Flex>
                  <CopyToClipboard
                    text={response?.complianceItem?.reference}
                    onCopy={() =>
                      toast({
                        ...toastSuccess,
                        title: "Item ID copied",
                        description: `${response?.complianceItem?.reference} was copied to clipboard`,
                      })
                    }
                  >
                    <Copy
                      color="responseLeftNavigation.copy"
                      mt={1}
                      h="17px"
                      w="17px"
                      _hover={{ opacity: 0.6, cursor: "pointer" }}
                    />
                  </CopyToClipboard>
                </Flex>
              </Box>
              <ResponseLeftItem
                heading="Business unit"
                value={response?.businessUnit?.name || "-"}
              />
              <Box h="50px" mt={1}>
                <Box opacity={0.5} fontSize="11px">
                  Responsible
                </Box>
                <Flex align="center" fontSize="14px" minH="28px">
                  <Avatar
                    color="white"
                    bg="responseLeftNavigation.avatar"
                    name={
                      response.owner?.firstName && response.owner?.lastName
                        ? `${response.owner?.firstName} ${response.owner?.lastName}`
                        : `${response.owner?.displayName}`
                    }
                    src={response.owner?.imgUrl}
                    size="xs"
                    mr={2}
                  />
                  <Flex mr={2}>
                    {response.owner?.firstName && response.owner?.lastName
                      ? `${response.owner?.firstName} ${response.owner?.lastName}`
                      : `${response.owner?.displayName || "-"}`}
                  </Flex>
                </Flex>
              </Box>
            </Flex>
            <Flex w="50%" flexDirection="column">
              <ResponseLeftItem
                  heading="Category"
                  value={response.complianceItem?.category?.name || "-"}
                />
              <ResponseLeftItem
                heading="Regulatory body"
                value={response.complianceItem?.regulatoryBody?.name || "-"}
              />
              <ResponseLeftItem
                heading="Frequency"
                value={response.complianceItem?.frequency || "-"}
              />
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
    </>
  );
};

export default ResponseDetail;
