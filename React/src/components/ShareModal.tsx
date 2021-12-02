import React, { useState, useContext, useMemo } from "react";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast
} from "@chakra-ui/react";
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { toastSuccess } from "../bootstrap/config";
import { ResponseContext } from "../contexts/ResponseProvider";
import { useAppContext } from "../contexts/AppProvider";
import { Copy } from "../icons";

const ShareModal = () => {
  const toast = useToast();
  const { user } = useAppContext();
  const { response, isShareOpen, handleShareClose } = useContext(ResponseContext);
  const [mailTo, setMailTo] = useState<string>();

  const getFullName = (user) => {
    const { firstName, lastName, displayName } = user;
    return firstName && lastName ? `${firstName} ${lastName}` : `${displayName}`;
  };

  const email = useMemo(() => 
  `mailto:${mailTo}?subject=${getFullName(user)} has shared
  ${response?.complianceItem.name} with you&body=${getFullName(user)} has shared compliance item
  '${response?.complianceItem.name}' with you. You can view it at the following
  link:%0A%0A${process.env.REACT_APP_CLIENT_URL}/compliance-item/${response?._id}%0A%0ACielo Costa`
  // eslint-disable-next-line 
  , [response, mailTo]);

  return (
    <Modal variant="shareModal" isOpen={isShareOpen} onClose={handleShareClose} isCentered>
      <ModalContent rounded='20px' shadow="0px 0px 80px rgba(49, 50, 51, 0.25)">
        <ModalHeader color="shareModal.header" fontSize="smm" fontWeight="bold">Share item</ModalHeader>
        <ModalCloseButton size='md' color="#282F36" />
        <ModalBody pt="0">
          <Tabs variant='unstyled'>
            <TabList>
              <Tab 
                h="30px"
                fontSize="smm" 
                fontWeight="bold" 
                color="shareModal.tab.unselectedColor" 
                _selected={{ rounded: '10px', color: 'shareModal.tab.selectedColor', bg: 'shareModal.tab.selectedBg' }}
              >
                Copy link
              </Tab>
              <Tab 
                h="30px"
                fontSize="smm" 
                fontWeight="bold" 
                color="shareModal.tab.unselectedColor" 
                _selected={{ rounded: '10px', color: 'shareModal.tab.selectedColor', bg: 'shareModal.tab.selectedBg' }}
              >
                Email
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel p="0" mt="20px">
                <Flex flexDir="column">
                  <CopyToClipboard
                    text={`${process.env.REACT_APP_CLIENT_URL}/compliance-item/${response?._id}`}
                    onCopy={() => toast({
                      ...toastSuccess,
                      title: 'Success',
                      description: 'Link copied to clipboard'
                    })
                    }>
                    <Flex cursor='pointer' direction='column'>
                      <InputGroup cursor='pointer'>
                        <Input 
                          disabled
                          _disabled={{ cursor: 'pointer' }} 
                          h='40px' 
                          borderColor='shareModal.border' 
                          fontSize="smm"
                          borderWidth='1px' 
                          rounded="10px"
                          value={`${process.env.REACT_APP_CLIENT_URL}/compliance-item/${response?._id}`} 
                        />
                        <InputRightElement h='40px'><Copy stroke="shareModal.copyIcon" mr={2} /></InputRightElement>
                      </InputGroup>
                    </Flex>
                  </CopyToClipboard>
                  <Button 
                    w='75px' 
                    h='38px' 
                    mt="35px" 
                    mb="14px"
                    rounded="10px"
                    alignSelf="flex-end" 
                    _hover={{ opacity: '0.8' }} 
                    bg='shareModal.button.copy' 
                    color='shareModal.button.copyColor' 
                    border='10px' 
                    onClick={handleShareClose}
                  >
                    Done
                  </Button>
                </Flex>
              </TabPanel>
              <TabPanel p="0" mt="20px">
                <Flex flexDir="column">
                  <Input 
                    h='40px' 
                    fontSize="smm" 
                    borderColor='shareModal.border' 
                    borderWidth='1px' 
                    rounded="10px" 
                    onChange={(e) => setMailTo(e.target.value)} 
                  />
                  <Link alignSelf="flex-end" _hover={{}} disabled={!mailTo} href={email} isExternal>
                    <Button 
                      h='38px' 
                      w='75px' 
                      mt="35px" 
                      mb="14px"
                      rounded="10px"
                      bg='shareModal.button.email' 
                      color='shareModal.button.emailColor' 
                      disabled={!mailTo} 
                      _hover={{ opacity: '0.8' }} 
                      border='10px'
                    >
                      Send
                    </Button>
                  </Link>
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ShareModal;

export const shareModalStyles = {
  shareModal: {
    header: "#313233",
    border: "#cdcdd5",
    copyIcon: "#462AC4",
    button: {
      copy: "#462AC4",
      copyColor: "#FFFFFF",
      email: "#462AC4",
      emailColor: "#FFFFFF"
    },
    tab: {
      selectedBg: "#282F36",
      selectedColor: "#FFFFFF",
      unselectedColor: "#818197"
    }
  }
};
