import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import {
  Avatar,
  Box,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import { toastSuccess } from '../../../bootstrap/config';
import { ArrowRight, Copy, DetailIcon } from '../../../icons';
import ResponseLeftItem from '../ResponseLeftItem';

const ResponseDetail = ({ response }) => {
  const toast = useToast();
  const { onOpen, isOpen, onClose } = useDisclosure();

  const toggle = () => {
    if (isOpen) return onClose();

    onOpen();
  };

  if (!response) return null;

  return (
    <>
      <Flex mt={[0, 5]} onClick={toggle} position="relative">
        <Flex align="center" cursor="pointer">
          <Flex
            align="center"
            bg={
              isOpen
                ? 'responseLeftNavigation.responseDetailActiveColor'
                : 'responseLeftTabItem.iconBg'
            }
            borderRadius="8px"
            h="30px"
            justify="center"
            w="30px"
          >
            <Icon as={DetailIcon} color="responseLeftTabItem.iconColor" />
          </Flex>
          <ArrowRight
            color="responseLeftTabItem.textColor"
            display={['none', 'block']}
            ml={1}
            mt={1}
          />
        </Flex>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent
          borderRadius="10px"
          bottom="10px"
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
          h="fit-content"
          left={['10px', '80px']}
          maxW={['calc(100% - 20px)', '315px']}
          position="absolute"
          top={['auto', '200px']}
        >
          <ModalBody p="20px">
            <Flex w="full">
              <Flex flexDirection="column" w="50%">
                <Box h="50px" mt={2}>
                  <Box fontSize="11px" opacity={0.5}>
                    Item ID
                  </Box>
                  <Flex align="center" fontSize="14px" minH="28px">
                    <Flex mr={2}>{response?.complianceItem?.reference}</Flex>
                    <CopyToClipboard
                      onCopy={() =>
                        toast({
                          ...toastSuccess,
                          title: 'Item ID copied',
                          description: `${response?.complianceItem?.reference} was copied to clipboard`,
                        })
                      }
                      text={response?.complianceItem?.reference}
                    >
                      <Copy
                        _hover={{ opacity: 0.6, cursor: 'pointer' }}
                        color="responseLeftNavigation.copy"
                        h="17px"
                        mt={1}
                        w="17px"
                      />
                    </CopyToClipboard>
                  </Flex>
                </Box>
                <ResponseLeftItem
                  heading="Business unit"
                  value={response?.businessUnit?.name || '-'}
                />
                <Box h="50px" mt={1}>
                  <Box fontSize="11px" opacity={0.5}>
                    Responsible
                  </Box>
                  <Flex align="center" fontSize="14px" minH="28px">
                    <Avatar
                      bg="responseLeftNavigation.avatar"
                      color="white"
                      mr={2}
                      name={
                        response.owner?.firstName && response.owner?.lastName
                          ? `${response.owner?.firstName} ${response.owner?.lastName}`
                          : `${response.owner?.displayName}`
                      }
                      size="xs"
                      src={response.owner?.imgUrl}
                    />
                    <Flex mr={2}>
                      {response.owner?.firstName && response.owner?.lastName
                        ? `${response.owner?.firstName} ${response.owner?.lastName}`
                        : `${response.owner?.displayName || '-'}`}
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
              <Flex flexDirection="column" w="50%">
                <ResponseLeftItem
                  heading="Category"
                  value={response.complianceItem?.category?.name || '-'}
                />
                <ResponseLeftItem
                  heading="Regulatory body"
                  value={response.complianceItem?.regulatoryBody?.name || '-'}
                />
                <ResponseLeftItem
                  heading="Frequency"
                  value={response.complianceItem?.frequency || '-'}
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
