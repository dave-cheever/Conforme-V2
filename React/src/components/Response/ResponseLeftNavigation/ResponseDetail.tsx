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
      <Flex data-id="000913" mt={[0, 5]} onClick={toggle} position="relative">
        <Flex align="center" cursor="pointer" data-id="000914">
          <Flex
            align="center"
            bg={isOpen ? 'responseLeftTabItem.activeIconBg' : ''}
            borderRadius="8px"
            data-id="000915"
            h="30px"
            justify="center"
            w="30px">
            <Icon
              as={DetailIcon}
              color="#ffffff"
              data-id="000916" />
          </Flex>
          <ArrowRight
            color="responseLeftTabItem.textColor"
            data-id="000917"
            display={['none', 'block']}
            ml={1}
            mt={1} />
        </Flex>
      </Flex>
      <Modal data-id="000918" isOpen={isOpen} onClose={onClose}>
        <ModalContent
          borderRadius="10px"
          bottom="10px"
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
          data-id="000919"
          h="fit-content"
          left={['10px', '80px']}
          maxW={['calc(100% - 20px)', '315px']}
          position="absolute"
          top={['auto', '200px']}>
          <ModalBody data-id="000920" p="20px">
            <Flex data-id="000921" w="full">
              <Flex data-id="000922" flexDirection="column" w="50%">
                <Box data-id="000923" h="50px" mt={2}>
                  <Box data-id="000924" fontSize="11px" opacity={0.5}>
                    Item ID
                  </Box>
                  <Flex align="center" data-id="000925" fontSize="14px" minH="28px">
                    <Flex data-id="000926" mr={2}>{response?.trackerItem?.reference}</Flex>
                    <CopyToClipboard
                      data-id="000927"
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
                        data-id="000928"
                        h="17px"
                        mt={1}
                        w="17px" />
                    </CopyToClipboard>
                  </Flex>
                </Box>
                <ResponseLeftItem
                  data-id="000929"
                  heading={capitalize(t('business unit'))}
                  value={response?.businessUnit?.name || '-'} />
                <Box data-id="000930" h="50px" mt={1}>
                  <Box data-id="000931" fontSize="11px" opacity={0.5}>
                    Responsible
                  </Box>
                  <Flex align="center" data-id="000932" fontSize="14px" minH="28px">
                    <Avatar
                        bg="responseLeftNavigation.avatar"
                        color="white"
                        data-id="000933"
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
                    <Flex data-id="000934" mr={2}>
                      {accountable && accountable.firstName && accountable.lastName
                        ? `${accountable.firstName} ${accountable.lastName}`
                        : `${accountable?.displayName || '-'}`}
                    </Flex>
                  </Flex>
                </Box>

                <Box data-id="000935" h="50px" mt={1}>
                  <Box data-id="000936" fontSize="11px" opacity={0.5}>
                    Accountableee
                  </Box>
                  <Flex align="center" data-id="000937" fontSize="14px" minH="28px">
                    <Avatar
                      bg="responseLeftNavigation.avatar"
                      color="white"
                      data-id="000938"
                      mr={2}
                      name={
                        responsible && responsible.firstName && responsible.lastName
                          ? `${responsible.firstName} ${responsible.lastName}`
                          : `${responsible?.displayName}`
                      }
                      size="xs"
                      src={responsible && responsible.imgUrl} />
                    <Flex data-id="000939" mr={2}>
                      {responsible && responsible.firstName && responsible.lastName
                        ? `${responsible.firstName} ${responsible.lastName}`
                        : `${responsible?.displayName || '-'}`}
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
              <Flex data-id="000940" flexDirection="column" w="50%">
                <ResponseLeftItem
                  data-id="000941"
                  heading="Category"
                  value={response.trackerItem?.category?.name || '-'} />
                <ResponseLeftItem
                  data-id="000942"
                  heading="Regulatory body"
                  value={response.trackerItem?.regulatoryBody?.name || '-'} />
                <ResponseLeftItem
                  data-id="000943"
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
