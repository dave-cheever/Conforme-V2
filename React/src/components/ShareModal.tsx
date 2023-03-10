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

const ShareModal = () => {
  const toast = useToast();
  const { isShareOpen, handleShareClose, shareItemUrl, shareItemName } = useShareContext();
  const { organizationConfig, module, user } = useAppContext();
  const [mails, setMails] = useState<string[]>([]);
  const [mail, setMail] = useState<string>('');

  const URL = useMemo(() => `${process.env.REACT_APP_CLIENT_URL}/${module?.path}/${shareItemUrl}`, [shareItemUrl]);

  const email = useMemo(
    () =>
      `mailto:${[...mails, mail].join(';')}?subject=${user?.displayName} is sharing ${shareItemName} - ${module?.name} - ${
        organizationConfig?.name
      }&body=Please click on this link to access the '${shareItemName}' in ${module?.name}:%0A%0A${URL}%0A%0A${organizationConfig?.name}`,
    [shareItemName, mail, mails, module, organizationConfig],
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
    (<Modal
      data-id="fc1890888096"
      isCentered
      isOpen={isShareOpen}
      onClose={handleShareClose}
      variant="shareModal">
      <ModalContent
        data-id="0984d3bfc42b"
        rounded="20px"
        shadow="0px 0px 80px rgba(49, 50, 51, 0.25)">
        <ModalHeader
          color="shareModal.header"
          data-id="21074bc947c2"
          fontSize="smm"
          fontWeight="bold">
          Share item
        </ModalHeader>
        <ModalCloseButton color="#282F36" data-id="42a8fc99fad2" size="md" />
        <ModalBody data-id="56f92b26578a" pt="0">
          <Tabs data-id="910472f94248" variant="unstyled">
            <TabList data-id="34acc6b64d2c">
              <Tab
                _selected={{
                  rounded: '10px',
                  color: 'shareModal.tab.selectedColor',
                  bg: 'shareModal.tab.selectedBg',
                }}
                color="shareModal.tab.unselectedColor"
                data-id="69b66549c12f"
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
                data-id="b7307602753d"
                fontSize="smm"
                fontWeight="bold"
                h="30px">
                Email
              </Tab>
            </TabList>
            <Box data-id="876df0b7f693" fontSize="sm" mt={4}>
              You need to add people as a participant to enable the user to see it.
            </Box>
            <TabPanels data-id="8fcfaeb22f7d">
              <TabPanel data-id="6612f52fa4a3" mt={3} p={0}>
                <Flex data-id="027a1024161a" flexDir="column">
                  <CopyToClipboard
                    data-id="3bdf49c4d703"
                    onCopy={() =>
                      toast({
                        ...toastSuccess,
                        title: 'Success',
                        description: 'Link copied to clipboard',
                      })
                    }
                    text={URL}>
                    <Flex cursor="pointer" data-id="5660d55109aa" direction="column">
                      <InputGroup cursor="pointer" data-id="bd77b29daeac" my="2">
                        <Input
                          _disabled={{ cursor: 'pointer' }}
                          borderColor="shareModal.border"
                          borderWidth="1px"
                          data-id="3cb133a61d8f"
                          disabled
                          fontSize="smm"
                          h="40px"
                          rounded="10px"
                          value={URL} />
                        <InputRightElement data-id="39286d6a7bf4" h="40px">
                          <Copy data-id="e0829a62a5b8" mr={2} stroke="shareModal.copyIcon" />
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
                    data-id="7d9fd7891bfb"
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
              <TabPanel data-id="15ef898824fe" mt={3} p={0}>
                <Flex data-id="13a385cda338" flexDir="column">
                  {mails.map((m, index) => (
                    <InputGroup cursor="pointer" data-id="cee26b4c795f" key={index} my="1">
                      <Input
                        borderColor="shareModal.border"
                        borderWidth="1px"
                        data-id="3454128d97f1"
                        fontSize="smm"
                        h="40px"
                        onChange={(e) => updateMail(e.target.value, index)}
                        rounded="10px"
                        value={m} />
                      <InputRightElement data-id="7ef645c2875c" h="40px">
                        <CrossIcon
                          data-id="91cb936c1fe8"
                          mr={2}
                          onClick={() => removeMail(m)}
                          stroke="shareModal.crossIcon" />
                      </InputRightElement>
                    </InputGroup>
                  ))}
                  <InputGroup cursor="pointer" data-id="e00df9ce1c37" my="1">
                    <Input
                      borderColor="shareModal.border"
                      borderWidth="1px"
                      data-id="017b31b8117d"
                      fontSize="smm"
                      h="40px"
                      onChange={(e) => setMail(e.target.value)}
                      rounded="10px"
                      type="email"
                      value={mail} />
                    <InputRightElement data-id="e3f9f0f566eb" h="40px">
                      <AddIcon
                        data-id="492185d7dda1"
                        mr={2}
                        onClick={updateMails}
                        stroke="shareModal.addIcon" />
                    </InputRightElement>
                  </InputGroup>

                  <Link
                    _hover={{}}
                    alignSelf="flex-end"
                    data-id="b8232c5a1d82"
                    href={email}
                    isExternal>
                    <Button
                      border="10px"
                      colorScheme="purpleHeart"
                      data-id="5df5ac748d31"
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
    </Modal>)
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
