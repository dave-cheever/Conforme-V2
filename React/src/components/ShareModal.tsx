import React, { useMemo, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import {
  Box,
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
  useToast,
} from '@chakra-ui/react';

import { toastFailed, toastSuccess } from '../bootstrap/config';
import { useAppContext } from '../contexts/AppProvider';
import { useShareContext } from '../contexts/ShareProvider';
import { AddIcon, Copy, CrossIcon } from '../icons';

function ShareModal() {
  const toast = useToast();
  const { isShareOpen, handleShareClose, shareItemUrl, shareItemName } = useShareContext();
  const { organizationConfig, module, user } = useAppContext();
  const [mails, setMails] = useState<string[]>([]);
  const [mail, setMail] = useState<string>('');

  const URL = useMemo(() => `${process.env.REACT_APP_CLIENT_URL}/${module?.path}/${shareItemUrl}`, [shareItemUrl]);

  const email = useMemo(
    () => {
      const subject = `${user?.displayName} is sharing ${shareItemName} - ${module?.name} - ${organizationConfig?.name}`;
      const body = `Please click on this link to access the '${shareItemName}' in ${module?.name}:
      
      ${URL}
      
      ${organizationConfig?.name}`;
      return `mailto:${[...mails, mail].join(';')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }, [shareItemName, mail, mails, module, organizationConfig],
  );

  const updateMails = () => {
    if (mail === '') {
      return toast({
        ...toastFailed,
        title: 'Error',
        description: 'Email cannot be empty',
      });
    }
    setMails([...mails, mail]);
    setMail('');
  };

  const removeMail = (mail) => {
    const removedMails = [...mails].filter((m) => m !== mail);
    setMails(removedMails);
  };

  const isSendDisabled = useMemo(() => mails.length === 0 && mail === '', [mails, mail]);

  const updateMail = (mail, index) => {
    const updatedMail = [...mails];
    updatedMail[index] = mail;
    // if mail is empty, remove
    if (mail === '') updatedMail.splice(index, 1);

    setMails(updatedMail);
  };

  return (
    <Modal
        data-id="030925-8d4f25"
        isCentered
        isOpen={isShareOpen}
        onClose={handleShareClose}
        variant="shareModal">
      <ModalContent
        data-id="030925-a46610"
        rounded="20px"
        shadow="0px 0px 80px rgba(49, 50, 51, 0.25)">
        <ModalHeader
          color="shareModal.header"
          data-id="030925-92e12a"
          fontSize="smm"
          fontWeight="bold">
          Share item
        </ModalHeader>
        <ModalCloseButton color="#282F36" data-id="030925-30f491" size="md" />
        <ModalBody data-id="030925-5fc0d6" pt="0">
          <Tabs data-id="030925-54ce18" variant="unstyled">
            <TabList data-id="030925-eb5718">
              <Tab
                _selected={{
                  rounded: '10px',
                  color: 'shareModal.tab.selectedColor',
                  bg: 'shareModal.tab.selectedBg',
                }}
                color="shareModal.tab.unselectedColor"
                data-id="030925-95829b"
                fontSize="smm"
                fontWeight="bold"
                h="30px">
                Copy link
              </Tab>
              <Tab
                _selected={{
                  rounded: '10px',
                  color: 'shareModal.tab.selectedColor',
                  bg: 'shareModal.tab.selectedBg',
                }}
                color="shareModal.tab.unselectedColor"
                data-id="030925-b1c986"
                fontSize="smm"
                fontWeight="bold"
                h="30px">
                Email
              </Tab>
            </TabList>
            <Box data-id="030925-be9f7d" fontSize="sm" mt={4}>
              You need to add people as a participant to enable the user to see it.
            </Box>
            <TabPanels data-id="030925-939b24">
              <TabPanel data-id="030925-202f05" mt={3} p={0}>
                <Flex data-id="030925-15c027" flexDir="column">
                  <CopyToClipboard
                    data-id="030925-b0355f"
                    onCopy={() =>
                      toast({
                        ...toastSuccess,
                        title: 'Success',
                        description: 'Link copied to clipboard',
                      })
                    }
                    text={URL}>
                    <Flex cursor="pointer" data-id="030925-849f07" direction="column">
                      <InputGroup cursor="pointer" data-id="030925-e68cda" my="2">
                        <Input
                          _disabled={{ cursor: 'pointer' }}
                          borderColor="shareModal.border"
                          borderWidth="1px"
                          data-id="030925-499b14"
                          disabled
                          fontSize="smm"
                          h="40px"
                          rounded="10px"
                          value={URL} />
                        <InputRightElement data-id="030925-234d25" h="40px">
                          <Copy data-id="030925-472e5f" mr={2} stroke="shareModal.copyIcon" />
                        </InputRightElement>
                      </InputGroup>
                    </Flex>
                  </CopyToClipboard>
                  <Button
                    _hover={{ opacity: '0.8' }}
                    alignSelf="flex-end"
                    bg="shareModal.button.copy"
                    border="10px"
                    color="shareModal.button.copyColor"
                    data-id="030925-e04874"
                    h="38px"
                    mb="14px"
                    mt="35px"
                    onClick={handleShareClose}
                    rounded="10px"
                    w="75px">
                    Done
                  </Button>
                </Flex>
              </TabPanel>
              <TabPanel data-id="030925-fe8a2a" mt={3} p={0}>
                <Flex data-id="030925-764dae" flexDir="column">
                  {mails.map((m, index) => (
                    <InputGroup cursor="pointer" data-id="030925-b0d21a" key={index} my="1">
                      <Input
                        borderColor="shareModal.border"
                        borderWidth="1px"
                        data-id="030925-98dd18"
                        fontSize="smm"
                        h="40px"
                        onChange={(e) => updateMail(e.target.value, index)}
                        rounded="10px"
                        value={m} />
                      <InputRightElement data-id="030925-9e9767" h="40px">
                        <CrossIcon
                          data-id="030925-d8a49f"
                          mr={2}
                          onClick={() => removeMail(m)}
                          stroke="shareModal.crossIcon" />
                      </InputRightElement>
                    </InputGroup>
                  ))}
                  <InputGroup cursor="pointer" data-id="030925-6f00e8" my="1">
                    <Input
                      borderColor="shareModal.border"
                      borderWidth="1px"
                      data-id="030925-37565e"
                      fontSize="smm"
                      h="40px"
                      onChange={(e) => setMail(e.target.value)}
                      rounded="10px"
                      type="email"
                      value={mail} />
                    <InputRightElement data-id="030925-12a96b" h="40px">
                      <AddIcon
                        data-id="030925-16dd3a"
                        mr={2}
                        onClick={updateMails}
                        stroke="shareModal.addIcon" />
                    </InputRightElement>
                  </InputGroup>

                  <Link
                    _hover={{}}
                    alignSelf="flex-end"
                    data-id="030925-484243"
                    href={email}
                    isExternal>
                    <Button
                      border="10px"
                      colorScheme="purpleHeart"
                      data-id="030925-46ff59"
                      disabled={isSendDisabled}
                      h="38px"
                      mb="14px"
                      mt="35px"
                      rounded="10px"
                      w="75px">
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
}

export default ShareModal;

export const shareModalStyles = {
  shareModal: {
    header: '#313233',
    border: '#cdcdd5',
    copyIcon: '#462AC4',
    addIcon: '#282F36',
    crossIcon: '#E93C44',
    button: {
      copy: '#462AC4',
      copyColor: '#FFFFFF',
      email: '#462AC4',
      emailColor: '#FFFFFF',
    },
    tab: {
      selectedBg: '#282F36',
      selectedColor: '#FFFFFF',
      unselectedColor: '#818197',
    },
  },
};
