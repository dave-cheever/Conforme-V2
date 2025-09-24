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
import { runtimeEnv } from '../utils/runtime-env';

function ShareModal() {
  const toast = useToast();
  const { isShareOpen, handleShareClose, shareItemUrl, shareItemName } = useShareContext();
  const { organizationConfig, module, user } = useAppContext();
  const [mails, setMails] = useState<string[]>([]);
  const [mail, setMail] = useState<string>('');

  const URL = useMemo(() => `${runtimeEnv.clientUrl()}/${module?.path}/${shareItemUrl}`, [shareItemUrl]);

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
        data-id="000389"
        isCentered
        isOpen={isShareOpen}
        onClose={handleShareClose}
        variant="shareModal">
      <ModalContent
        data-id="000390"
        rounded="20px"
        shadow="0px 0px 80px rgba(49, 50, 51, 0.25)">
        <ModalHeader
          data-id="000391"
          color="shareModal.header"
          fontSize="smm"
          fontWeight="bold">
          Share item
        </ModalHeader>
        <ModalCloseButton data-id="000392" color="#282F36" size="md" />
        <ModalBody data-id="000393" pt="0">
          <Tabs data-id="000394" variant="unstyled">
            <TabList data-id="000395">
              <Tab
                data-id="000396"
                _selected={{
                  rounded: '10px',
                  color: 'shareModal.tab.selectedColor',
                  bg: 'shareModal.tab.selectedBg',
                }}
                color="shareModal.tab.unselectedColor"
                fontSize="smm"
                fontWeight="bold"
                h="30px">
                Copy link
              </Tab>
              <Tab
                data-id="000397"
                _selected={{
                  rounded: '10px',
                  color: 'shareModal.tab.selectedColor',
                  bg: 'shareModal.tab.selectedBg',
                }}
                color="shareModal.tab.unselectedColor"
                fontSize="smm"
                fontWeight="bold"
                h="30px">
                Email
              </Tab>
            </TabList>
            <Box data-id="000398" fontSize="sm" mt={4}>
              You need to add people as a participant to enable the user to see it.
            </Box>
            <TabPanels data-id="000399">
              <TabPanel data-id="000400" mt={3} p={0}>
                <Flex data-id="000401" flexDir="column">
                  <CopyToClipboard
                    data-id="000402"
                    onCopy={() =>
                      toast({
                        ...toastSuccess,
                        title: 'Success',
                        description: 'Link copied to clipboard',
                      })
                    }
                    text={URL}>
                    <Flex data-id="000403" cursor="pointer" direction="column">
                      <InputGroup data-id="000404" cursor="pointer" my="2">
                        <Input
                          data-id="000405"
                          _disabled={{ cursor: 'pointer' }}
                          borderColor="shareModal.border"
                          borderWidth="1px"
                          disabled
                          fontSize="smm"
                          h="40px"
                          rounded="10px"
                          value={URL} />
                        <InputRightElement data-id="000406" h="40px">
                          <Copy data-id="000407" mr={2} stroke="shareModal.copyIcon" />
                        </InputRightElement>
                      </InputGroup>
                    </Flex>
                  </CopyToClipboard>
                  <Button
                    data-id="000408"
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
                    w="75px">
                    Done
                  </Button>
                </Flex>
              </TabPanel>
              <TabPanel data-id="000409" mt={3} p={0}>
                <Flex data-id="000410" flexDir="column">
                  {mails.map((m, index) => (
                    <InputGroup data-id="000411" cursor="pointer" key={index} my="1">
                      <Input
                        data-id="000412"
                        borderColor="shareModal.border"
                        borderWidth="1px"
                        fontSize="smm"
                        h="40px"
                        onChange={(e) => updateMail(e.target.value, index)}
                        rounded="10px"
                        value={m} />
                      <InputRightElement data-id="000413" h="40px">
                        <CrossIcon
                          data-id="000414"
                          mr={2}
                          onClick={() => removeMail(m)}
                          stroke="shareModal.crossIcon" />
                      </InputRightElement>
                    </InputGroup>
                  ))}
                  <InputGroup data-id="000415" cursor="pointer" my="1">
                    <Input
                      data-id="000416"
                      borderColor="shareModal.border"
                      borderWidth="1px"
                      fontSize="smm"
                      h="40px"
                      onChange={(e) => setMail(e.target.value)}
                      rounded="10px"
                      type="email"
                      value={mail} />
                    <InputRightElement data-id="000417" h="40px">
                      <AddIcon
                        data-id="000418"
                        mr={2}
                        onClick={updateMails}
                        stroke="shareModal.addIcon" />
                    </InputRightElement>
                  </InputGroup>

                  <Link
                    data-id="000419"
                    _hover={{}}
                    alignSelf="flex-end"
                    href={email}
                    isExternal>
                    <Button
                      data-id="000420"
                      border="10px"
                      colorScheme="purpleHeart"
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
