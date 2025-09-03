import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { gql, useQuery } from '@apollo/client';
import { Avatar, Box, Flex, Icon, Modal, ModalBody, ModalContent, useDisclosure, useToast } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import { toastSuccess } from '../../../bootstrap/config';
import { ArrowRight, Copy, DetailIcon } from '../../../icons';
import { IUser } from '../../../interfaces/IUser';
import ResponseLeftItem from '../ResponseLeftItem';

function ResponseDetail({ response }) {

  const GET_USERS_BY_ID = gql`
  query ($responsibleQuery: UserQueryInput, $accountableQuery: UserQueryInput) {
    responsible: usersById(userQueryInput: $responsibleQuery) {
      _id
      firstName
      lastName
      displayName
      imgUrl
    }
    accountable: usersById(userQueryInput: $accountableQuery) {
      _id
      firstName
      lastName
      displayName
      imgUrl
    }
  }
`;

  const { data: { accountable: responseAccountable, responsible: responseResponsible } = [] } = useQuery(GET_USERS_BY_ID, {
    variables: {
      accountableQuery: { usersIds: response?.accountableId || [] },
      responsibleQuery: { usersIds: response?.responsibleId || [] },
    },
  });

  const accountable: IUser = responseAccountable && responseAccountable?.length !== 0 && responseAccountable[0];

  const responsible: IUser = responseResponsible && responseResponsible?.length !== 0 && responseResponsible[0];

  const toast = useToast();
  const { onOpen, isOpen, onClose } = useDisclosure();

  const toggle = () => {
    if (isOpen) return onClose();

    onOpen();
  };

  if (!response) return null;

  return (
    <>
      <Flex data-id="030925-55bce9" mt={[0, 5]} onClick={toggle} position="relative">
        <Flex data-id="030925-5a412e" align="center" cursor="pointer">
          <Flex
            data-id="030925-113495"
            align="center"
            bg={isOpen ? 'responseLeftTabItem.activeIconBg' : ''}
            borderRadius="8px"
            h="30px"
            justify="center"
            w="30px">
            <Icon
              data-id="030925-d66e79"
              as={DetailIcon}
              color="#ffffff" />
          </Flex>
          <ArrowRight
            data-id="030925-ec3496"
            color="responseLeftTabItem.textColor"
            display={['none', 'block']}
            ml={1}
            mt={1} />
        </Flex>
      </Flex>
      <Modal data-id="030925-909ab2" isOpen={isOpen} onClose={onClose}>
        <ModalContent
          data-id="030925-de4ce8"
          borderRadius="10px"
          bottom="10px"
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
          h="fit-content"
          left={['10px', '80px']}
          maxW={['calc(100% - 20px)', '315px']}
          position="absolute"
          top={['auto', '200px']}>
          <ModalBody data-id="030925-e3b4f2" p="20px">
            <Flex data-id="030925-ea6182" w="full">
              <Flex data-id="030925-71350e" flexDirection="column" w="50%">
                <Box data-id="030925-3109ac" h="50px" mt={2}>
                  <Box data-id="030925-8a18f0" fontSize="11px" opacity={0.5}>
                    Item ID
                  </Box>
                  <Flex data-id="030925-05d62d" align="center" fontSize="14px" minH="28px">
                    <Flex data-id="030925-4e4018" mr={2}>{response?.trackerItem?.reference}</Flex>
                    <CopyToClipboard
                      data-id="030925-8d74e5"
                      onCopy={() =>
                        toast({
                          ...toastSuccess,
                          title: 'Item ID copied',
                          description: `${response?.trackerItem?.reference} was copied to clipboard`,
                        })
                      }
                      text={response?.trackerItem?.reference}>
                      <Copy
                        data-id="030925-739ce9"
                        _hover={{ opacity: 0.6, cursor: 'pointer' }}
                        color="responseLeftNavigation.copy"
                        h="17px"
                        mt={1}
                        w="17px" />
                    </CopyToClipboard>
                  </Flex>
                </Box>
                <ResponseLeftItem
                  data-id="030925-a704d1"
                  heading={capitalize(t('business unit'))}
                  value={response?.businessUnit?.name || '-'} />
                <Box data-id="030925-055b67" h="50px" mt={1}>
                  <Box data-id="030925-e07022" fontSize="11px" opacity={0.5}>
                    Responsible
                  </Box>
                  <Flex data-id="030925-7f494c" align="center" fontSize="14px" minH="28px">
                    <Avatar
                        data-id="030925-1fe54d"
                        bg="responseLeftNavigation.avatar"
                        color="white"
                        mr={2}
                        name={
                          (
                            accountable && accountable.firstName && accountable.lastName
                              ? `${accountable.firstName} ${accountable.lastName}`
                              : `${accountable?.displayName}`
                          )?.replace(/\s*\(.*?\)\s*/g, '')
                        }
                        size="xs"
                        src={accountable && accountable.imgUrl}
                      />
                    <Flex data-id="030925-dd53a7" mr={2}>
                      {accountable && accountable.firstName && accountable.lastName
                        ? `${accountable.firstName} ${accountable.lastName}`
                        : `${accountable?.displayName || '-'}`}
                    </Flex>
                  </Flex>
                </Box>

                <Box data-id="030925-171903" h="50px" mt={1}>
                  <Box data-id="030925-23d2e8" fontSize="11px" opacity={0.5}>
                    Accountableee
                  </Box>
                  <Flex data-id="030925-eea8e3" align="center" fontSize="14px" minH="28px">
                    <Avatar
                      data-id="030925-ca9fdd"
                      bg="responseLeftNavigation.avatar"
                      color="white"
                      mr={2}
                      name={
                        responsible && responsible.firstName && responsible.lastName
                          ? `${responsible.firstName} ${responsible.lastName}`
                          : `${responsible?.displayName}`
                      }
                      size="xs"
                      src={responsible && responsible.imgUrl} />
                    <Flex data-id="030925-0ddce3" mr={2}>
                      {responsible && responsible.firstName && responsible.lastName
                        ? `${responsible.firstName} ${responsible.lastName}`
                        : `${responsible?.displayName || '-'}`}
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
              <Flex data-id="030925-de34dd" flexDirection="column" w="50%">
                <ResponseLeftItem
                  data-id="030925-5d8766"
                  heading="Category"
                  value={response.trackerItem?.category?.name || '-'} />
                <ResponseLeftItem
                  data-id="030925-b3ffdc"
                  heading="Regulatory body"
                  value={response.trackerItem?.regulatoryBody?.name || '-'} />
                <ResponseLeftItem
                  data-id="030925-0566af"
                  heading="Frequency"
                  value={response.trackerItem?.frequency || '-'} />
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ResponseDetail;
