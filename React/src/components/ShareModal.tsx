import React, { useContext, useMemo, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

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
  useToast,
} from '@chakra-ui/react';

import { toastFailed, toastSuccess } from '../bootstrap/config';
import { useAppContext } from '../contexts/AppProvider';
import { ResponseContext } from '../contexts/ResponseProvider';
import { AddIcon, Copy, CrossIcon } from '../icons';

const ShareModal = () => {
  const toast = useToast();
  const { organizationConfig, module, user } = useAppContext();
  const { response, snapshot, isShareOpen, handleShareClose } =
    useContext(ResponseContext);
  const [mails, setMails] = useState<string[]>([]);
  const [mail, setMail] = useState<string>('');

  const getFullName = (user) => {
    const { firstName, lastName, displayName } = user;
    return firstName && lastName
      ? `${firstName} ${lastName}`
      : `${displayName}`;
  };

  const URL = `${process.env.REACT_APP_CLIENT_URL}/compliance-item/${response?._id
    }${snapshot ? `?snapshot=${snapshot}` : ''}`;

  const email = useMemo(
    () =>
      `mailto:${[...mails, mail].join(';')}?subject=${response?.complianceItem.name} - ${module?.name} - ${organizationConfig?.name}&body=Please click on this link to access the '${response?.complianceItem.name}' in ${module?.name}:%0A%0A${URL}%0A%0ACielo Costa`,
    [response, mail, mails, module, organizationConfig],
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

  const isSendDisabled = useMemo(
    () => mails.length === 0 && mail === '',
    [mails, mail],
  );

  const updateMail = (mail, index) => {
    const updatedMail = [...mails];
    updatedMail[index] = mail;
    // if mail is empty, remove
    if (mail === '') updatedMail.splice(index, 1);

    setMails(updatedMail);
  };

  return (
    <Modal
      isCentered
      isOpen={isShareOpen}
      onClose={handleShareClose}
      variant="shareModal"
    >
      <ModalContent rounded="20px" shadow="0px 0px 80px rgba(49, 50, 51, 0.25)">
        <ModalHeader color="shareModal.header" fontSize="smm" fontWeight="bold">
          Share item
        </ModalHeader>
        <ModalCloseButton color="#282F36" size="md" />
        <ModalBody pt="0">
          <Tabs variant="unstyled">
            <TabList>
              <Tab
                _selected={{
                  rounded: '10px',
                  color: 'shareModal.tab.selectedColor',
                  bg: 'shareModal.tab.selectedBg',
                }}
                color="shareModal.tab.unselectedColor"
                fontSize="smm"
                fontWeight="bold"
                h="30px"
              >
                Copy link
              </Tab>
              <Tab
                _selected={{
                  rounded: '10px',
                  color: 'shareModal.tab.selectedColor',
                  bg: 'shareModal.tab.selectedBg',
                }}
                color="shareModal.tab.unselectedColor"
                fontSize="smm"
                fontWeight="bold"
                h="30px"
              >
                Email
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel mt="20px" p="0">
                <Flex flexDir="column">
                  <CopyToClipboard
                    onCopy={() =>
                      toast({
                        ...toastSuccess,
                        title: 'Success',
                        description: 'Link copied to clipboard',
                      })
                    }
                    text={URL}
                  >
                    <Flex cursor="pointer" direction="column">
                      <InputGroup cursor="pointer" my="2">
                        <Input
                          _disabled={{ cursor: 'pointer' }}
                          borderColor="shareModal.border"
                          borderWidth="1px"
                          disabled
                          fontSize="smm"
                          h="40px"
                          rounded="10px"
                          value={URL}
                        />
                        <InputRightElement h="40px">
                          <Copy mr={2} stroke="shareModal.copyIcon" />
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
                    h="38px"
                    mb="14px"
                    mt="35px"
                    onClick={handleShareClose}
                    rounded="10px"
                    w="75px"
                  >
                    Done
                  </Button>
                </Flex>
              </TabPanel>
              <TabPanel mt="20px" p="0">
                <Flex flexDir="column">
                  {mails.map((m, index) => (
                    <InputGroup cursor="pointer" key={index} my="1">
                      <Input
                        borderColor="shareModal.border"
                        borderWidth="1px"
                        fontSize="smm"
                        h="40px"
                        onChange={(e) => updateMail(e.target.value, index)}
                        rounded="10px"
                        value={m}
                      />
                      <InputRightElement h="40px">
                        <CrossIcon
                          mr={2}
                          onClick={() => removeMail(m)}
                          stroke="shareModal.crossIcon"
                        />
                      </InputRightElement>
                    </InputGroup>
                  ))}
                  <InputGroup cursor="pointer" my="1">
                    <Input
                      borderColor="shareModal.border"
                      borderWidth="1px"
                      fontSize="smm"
                      h="40px"
                      onChange={(e) => setMail(e.target.value)}
                      rounded="10px"
                      type="email"
                      value={mail}
                    />
                    <InputRightElement h="40px">
                      <AddIcon
                        mr={2}
                        onClick={updateMails}
                        stroke="shareModal.addIcon"
                      />
                    </InputRightElement>
                  </InputGroup>

                  <Link
                    _hover={{}}
                    alignSelf="flex-end"
                    href={email}
                    isExternal
                  >
                    <Button
                      border="10px"
                      colorScheme="purpleHeart"
                      disabled={isSendDisabled}
                      h="38px"
                      mb="14px"
                      mt="35px"
                      rounded="10px"
                      w="75px"
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
