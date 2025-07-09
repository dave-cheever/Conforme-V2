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

  return (<>
    <Flex data-id="eae3bdb121dc" mt={[0, 5]} onClick={toggle} position="relative">
      <Flex align="center" cursor="pointer" data-id="ecbcaaee6fb0">
        <Flex
          align="center"
          bg={isOpen ? 'responseLeftTabItem.activeIconBg' : ''}
          borderRadius="8px"
          data-id="3ddefce48728"
          h="30px"
          justify="center"
          w="30px">
          <Icon
            as={DetailIcon}
            color="#ffffff"
            data-id="8f96be6c83ab" />
        </Flex>
        <ArrowRight
          color="responseLeftTabItem.textColor"
          data-id="58206fae1331"
          display={['none', 'block']}
          ml={1}
          mt={1} />
      </Flex>
    </Flex>
    <Modal data-id="104e6c3f63b9" isOpen={isOpen} onClose={onClose}>
      <ModalContent
        borderRadius="10px"
        bottom="10px"
        boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
        data-id="ef6a85b3200e"
        h="fit-content"
        left={['10px', '80px']}
        maxW={['calc(100% - 20px)', '315px']}
        position="absolute"
        top={['auto', '200px']}>
        <ModalBody data-id="9f7953de21fc" p="20px">
          <Flex data-id="6a6da31581b9" w="full">
            <Flex data-id="068e467c2c39" flexDirection="column" w="50%">
              <Box data-id="a3799aae38d9" h="50px" mt={2}>
                <Box data-id="d2c5b9d9a0f1" fontSize="11px" opacity={0.5}>
                  Item ID
                </Box>
                <Flex align="center" data-id="6a7bc7fe53fd" fontSize="14px" minH="28px">
                  <Flex data-id="07600cb399b6" mr={2}>{response?.trackerItem?.reference}</Flex>
                  <CopyToClipboard
                    data-id="9f1f3e837d46"
                    onCopy={() =>
                      toast({
                        ...toastSuccess,
                        title: 'Item ID copied',
                        description: `${response?.trackerItem?.reference} was copied to clipboard`,
                      })
                    }
                    text={response?.trackerItem?.reference}>
                    <Copy
                      _hover={{ opacity: 0.6, cursor: 'pointer' }}
                      color="responseLeftNavigation.copy"
                      data-id="d8033e46a6af"
                      h="17px"
                      mt={1}
                      w="17px" />
                  </CopyToClipboard>
                </Flex>
              </Box>
              <ResponseLeftItem
                data-id="3881297351a7"
                heading={capitalize(t('business unit'))}
                value={response?.businessUnit?.name || '-'} />
              <Box data-id="e68e7c6cec6d" h="50px" mt={1}>
                <Box data-id="98b6daf1f3db" fontSize="11px" opacity={0.5}>
                  Responsible
                </Box>
                <Flex align="center" data-id="32f7676d04f7" fontSize="14px" minH="28px">
                  <Avatar
                      bg="responseLeftNavigation.avatar"
                      color="white"
                      data-id="7dc18869afe3"
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
                  <Flex data-id="b2b81150b3c1" mr={2}>
                    {accountable && accountable.firstName && accountable.lastName
                      ? `${accountable.firstName} ${accountable.lastName}`
                      : `${accountable?.displayName || '-'}`}
                  </Flex>
                </Flex>
              </Box>

              <Box data-id="e68e7c6cec6d" h="50px" mt={1}>
                <Box data-id="98b6daf1f3db" fontSize="11px" opacity={0.5}>
                  Accountableee
                </Box>
                <Flex align="center" data-id="32f7676d04f7" fontSize="14px" minH="28px">
                  <Avatar
                    bg="responseLeftNavigation.avatar"
                    color="white"
                    data-id="7dc18869afe3"
                    mr={2}
                    name={
                      responsible && responsible.firstName && responsible.lastName
                        ? `${responsible.firstName} ${responsible.lastName}`
                        : `${responsible?.displayName}`
                    }
                    size="xs"
                    src={responsible && responsible.imgUrl} />
                  <Flex data-id="b2b81150b3c1" mr={2}>
                    {responsible && responsible.firstName && responsible.lastName
                      ? `${responsible.firstName} ${responsible.lastName}`
                      : `${responsible?.displayName || '-'}`}
                  </Flex>
                </Flex>
              </Box>
            </Flex>
            <Flex data-id="558b0793c7c8" flexDirection="column" w="50%">
              <ResponseLeftItem
                data-id="ef71e0a6ebaf"
                heading="Category"
                value={response.trackerItem?.category?.name || '-'} />
              <ResponseLeftItem
                data-id="eca91e817376"
                heading="Regulatory body"
                value={response.trackerItem?.regulatoryBody?.name || '-'} />
              <ResponseLeftItem
                data-id="001bf6f559ff"
                heading="Frequency"
                value={response.trackerItem?.frequency || '-'} />
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  </>);
}

export default ResponseDetail;
