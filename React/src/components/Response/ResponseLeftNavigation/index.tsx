import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { gql, useQuery } from '@apollo/client';
import { Avatar, Box, Flex, Icon, Text, useToast } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import { navigationTabs, toastSuccess } from '../../../bootstrap/config';
import { useAppContext } from '../../../contexts/AppProvider';
import { useFiltersContext } from '../../../contexts/FiltersProvider';
import { useResponseContext } from '../../../contexts/ResponseProvider';
import useNavigate from '../../../hooks/useNavigate';
import { ChevronRight, Conforme, Copy } from '../../../icons';
import { IUser } from '../../../interfaces/IUser';
import { getInitials } from '../../../utils/helpers';
import ResponseLeftItem from '../ResponseLeftItem';
import ResponseLeftTabItem from '../ResponseLeftTabItem';

const GET_USERS_BY_ID_FROM_DB = gql`
  query ($responsibleQuery: UserQueryInput, $accountableQuery: UserQueryInput) {
    responsible: usersByIdFromDb(userQueryInput: $responsibleQuery) {
      _id
      firstName
      lastName
      displayName
      imgUrl
    }
    accountable: usersByIdFromDb(userQueryInput: $accountableQuery) {
      _id
      firstName
      lastName
      displayName
      imgUrl
    }
  }
`;

function ResponseLeftNavigation() {
  const { navigateTo } = useNavigate();
  const toast = useToast();
  const { module } = useAppContext();

  const { showFiltersPanel } = useFiltersContext();

  const { response } = useResponseContext();
  const { data: { accountable: responseAccountable, responsible: responseResponsible } = [] } = useQuery(GET_USERS_BY_ID_FROM_DB, {
    variables: {
      accountableQuery: { usersIds: response?.accountableId || [] },
      responsibleQuery: { usersIds: response?.responsibleId || [] },
    },
  });

  const accountable: IUser = responseAccountable && responseAccountable?.length !== 0 && responseAccountable[0];

  const responsible: IUser = responseResponsible && responseResponsible?.length !== 0 && responseResponsible[0];

  return (
    <Flex
        data-id="030925-853722"
        bg="responseLeftNavigation.bg"
        color="responseLeftNavigation.color"
        direction="column"
        display={['none', 'none', 'flex']}
        fontWeight="400"
        justifyContent="space-between"
        overflow="auto"
        px={6}
        w="280px">
      <Flex data-id="030925-515acb" flexDirection="column">
        <Box
          data-id="030925-f55ec5"
          alignItems="center"
          cursor="pointer"
          display="flex"
          h="80px"
          minW="200px"
          onClick={() => navigateTo('/')}>
          <Icon data-id="030925-b066f7" as={Conforme} h="35px" w="50px" />
          <Text
            data-id="030925-e9ae85"
            color="navigationLeft.organizationNameFontColor"
            fontSize="16px"
            fontWeight="bold"
            w="full">
            {showFiltersPanel ? getInitials(module?.name) : module?.name}
          </Text>
        </Box>
        <Flex
          data-id="030925-48661d"
          align="center"
          color="responseLeftNavigation.goBackColor"
          cursor="pointer"
          fontSize="14px"
          h="30px"
          mb="30px"
          onClick={() => navigateTo('/tracker-items')}>
          <ChevronRight data-id="030925-147221" mr={2} transform="Rotate(180deg)" />
          Go Back
        </Flex>
        <Flex data-id="030925-243860" flexDirection="column" mb={2}>
          {navigationTabs.map(({ label, icon, url }) => (
            <ResponseLeftTabItem data-id="030925-920b0f" icon={icon} key={url} label={label} url={url} />
          ))}
        </Flex>
        <Box
          data-id="030925-0a47d1"
          h="calc(100vh - 376px)"
          mb="5px"
          overflow="auto"
          sx={{
            '&::-webkit-scrollbar': {
              backgroundColor: 'responseChat.scrollBar.bg',
              width: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'responseChat.scrollBar.color',
            },
          }}>
          <Box data-id="030925-e3760c" h="50px">
            <Box data-id="030925-522ff9" color="responseLeftNavigation.color" fontSize="16px" opacity="64%">
              Item ID
            </Box>
            <Flex data-id="030925-a8945a" align="center" fontSize="16px" minH="28px">
              <Flex data-id="030925-93baeb" mr={2}>{response?.trackerItem.reference}</Flex>
              <CopyToClipboard
                data-id="030925-8f4568"
                onCopy={() =>
                  toast({
                    ...toastSuccess,
                    title: 'Item ID copied',
                    description: `${response?.trackerItem.reference} was copied to clipboard`,
                  })
                }
                text={response?.trackerItem.reference}>
                <Copy
                  data-id="030925-078158"
                  _hover={{ opacity: 0.6, cursor: 'pointer' }}
                  color="responseLeftNavigation.copy"
                  h="17px"
                  mt={1}
                  w="17px" />
              </CopyToClipboard>
            </Flex>
          </Box>
          <ResponseLeftItem
            data-id="030925-897ee0"
            heading={capitalize(t('business unit'))}
            value={response?.businessUnit?.name || '-'} />
          <Box data-id="030925-aff763" h="50px" mt={2}>
            <Box data-id="030925-b1bb0d"  color="responseLeftNavigation.color" fontSize="16px" opacity="64%">
              Accountable
            </Box>
             <Flex data-id="030925-089ec0" align="center" fontSize="16px" minH="28px">
              <Avatar
                data-id="030925-3a6507"
                bg="responseLeftNavigation.avatar"
                color="white"
                mr={2}
                name={
                  accountable && accountable.firstName && accountable.lastName
                    ? `${accountable.firstName} ${accountable.lastName}`
                    : `${accountable?.displayName}`
                }
                size="xs"
                src={accountable && accountable.imgUrl} />
              <Flex data-id="030925-c5d0fc" fontSize="14px" lineHeight="1.05">
                {accountable && accountable.firstName && accountable.lastName
                  ? `${accountable.firstName} ${accountable.lastName}`
                  : `${accountable?.displayName || '-'}`}
              </Flex>
            </Flex>
          </Box>
          <Box data-id="030925-e603da" h="50px" mt={2}>
             <Box data-id="030925-547810"  color="responseLeftNavigation.color" fontSize="16px" opacity="64%">
              Responsible
            </Box>
              <Flex data-id="030925-37fad2" align="center" fontSize="16px" minH="28px">
              <Avatar
                data-id="030925-29ca60"
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
              <Flex data-id="030925-7260f7" fontSize="14px" lineHeight="1.05">
                {responsible && responsible.firstName && responsible.lastName
                  ? `${responsible.firstName} ${responsible.lastName}`
                  : `${responsible?.displayName || '-'}`}
              </Flex>
            </Flex>
          </Box>
          <ResponseLeftItem
            data-id="030925-a44262"
            heading="Category"
            value={response?.trackerItem?.category?.name || '-'} />
          <ResponseLeftItem
            data-id="030925-8ff94a"
            heading="Regulatory body"
            value={response?.trackerItem?.regulatoryBody?.name || '-'} />
          <ResponseLeftItem
            data-id="030925-95d7a1"
            heading="Frequency"
            value={response?.trackerItem?.frequency || '-'} />
        </Box>
      </Flex>
    </Flex>
  );
}

export default ResponseLeftNavigation;

export const responseLeftNavigationStyles = {
  responseLeftNavigation: {
    bg: '#110B30',
    goBackColor: '#fff',
    color: '#ffffff',
    building: '#2B3236',
    copy: '#FF9A00',
    avatar: '#462AC4',
    responseDetailActiveColor: '#F0F0F0',
  },
};
