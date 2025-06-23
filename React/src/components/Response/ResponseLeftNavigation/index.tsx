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
    (<Flex
      bg="responseLeftNavigation.bg"
      color="responseLeftNavigation.color"
      data-id="6b45ffc76216"
      direction="column"
      display={['none', 'none', 'flex']}
      fontWeight="400"
      justifyContent="space-between"
      overflow="auto"
      px={6}
      w="240px">
      <Flex data-id="140f53bac576" flexDirection="column">
        <Box
          alignItems="center"
          cursor="pointer"
          data-id="3bd02a5cc1f9"
          display="flex"
          h="80px"
          minW="200px"
          onClick={() => navigateTo('/')}>
          <Icon as={Conforme} data-id="c6f9c652c7fc" h="35px" w="50px" />
          <Text
            color="navigationLeft.organizationNameFontColor"
            data-id="9f4d8594b408"
            fontSize="16px"
            fontWeight="bold"
            w="full">
            {showFiltersPanel ? getInitials(module?.name) : module?.name}
          </Text>
        </Box>
        <Flex
          align="center"
          color="responseLeftNavigation.goBackColor"
          cursor="pointer"
          data-id="65696d80008f"
          fontSize="14px"
          h="30px"
          mb="30px"
          onClick={() => navigateTo('/tracker-items')}>
          <ChevronRight data-id="8a8476e5125f" mr={2} transform="Rotate(180deg)" />
          Go Back
        </Flex>
        <Flex data-id="72838934130d" flexDirection="column" mb={2}>
          {navigationTabs.map(({ label, icon, url }) => (
            <ResponseLeftTabItem data-id="5d1f2d42cda0" icon={icon} key={url} label={label} url={url} />
          ))}
        </Flex>
        <Box
          data-id="e434ae05b36c"
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
          <Box data-id="3dfb5a10f729" h="50px">
            <Box color="responseLeftNavigation.color" data-id="229afdc1a7b7" fontSize="16px" opacity="64%">
              Item ID
            </Box>
            <Flex align="center" data-id="dc03023e06d7" fontSize="16px" minH="28px">
              <Flex data-id="52592d3a897d" mr={2}>{response?.trackerItem.reference}</Flex>
              <CopyToClipboard
                data-id="1034bd82bf20"
                onCopy={() =>
                  toast({
                    ...toastSuccess,
                    title: 'Item ID copied',
                    description: `${response?.trackerItem.reference} was copied to clipboard`,
                  })
                }
                text={response?.trackerItem.reference}>
                <Copy
                  _hover={{ opacity: 0.6, cursor: 'pointer' }}
                  color="responseLeftNavigation.copy"
                  data-id="b47fdce81ad1"
                  h="17px"
                  mt={1}
                  w="17px" />
              </CopyToClipboard>
            </Flex>
          </Box>
          <ResponseLeftItem
            data-id="3185333aa4dd"
            heading={capitalize(t('business unit'))}
            value={response?.businessUnit?.name || '-'} />
          <Box data-id="b48ef33e296c" h="50px" mt={2}>
            <Box color="responseLeftNavigation.color"  data-id="93f9449d0469" fontSize="16px" opacity="64%">
              Accountable
            </Box>
             <Flex align="center" data-id="5acf50dedfbd" fontSize="16px" minH="28px">
              <Avatar
                bg="responseLeftNavigation.avatar"
                color="white"
                data-id="afe3aba5cf64"
                mr={2}
                name={
                  accountable && accountable.firstName && accountable.lastName
                    ? `${accountable.firstName} ${accountable.lastName}`
                    : `${accountable?.displayName}`
                }
                size="xs"
                src={accountable && accountable.imgUrl} />
              <Flex data-id="9def953b4b06">
                {accountable && accountable.firstName && accountable.lastName
                  ? `${accountable.firstName} ${accountable.lastName}`
                  : `${accountable?.displayName || '-'}`}
              </Flex>
            </Flex>
          </Box>
          <Box data-id="f78dda737007" h="50px" mt={2}>
             <Box color="responseLeftNavigation.color"  data-id="1bf1c59d0f62" fontSize="16px" opacity="64%">
              Responsible
            </Box>
              <Flex align="center" data-id="f857574f8c38" fontSize="16px" minH="28px">
              <Avatar
                bg="responseLeftNavigation.avatar"
                color="white"
                data-id="8c4f46af73b7"
                mr={2}
                name={
                  responsible && responsible.firstName && responsible.lastName
                    ? `${responsible.firstName} ${responsible.lastName}`
                    : `${responsible?.displayName}`
                }
                size="xs"
                src={responsible && responsible.imgUrl} />
              <Flex data-id="4db276e28c1f">
                {responsible && responsible.firstName && responsible.lastName
                  ? `${responsible.firstName} ${responsible.lastName}`
                  : `${responsible?.displayName || '-'}`}
              </Flex>
            </Flex>
          </Box>
          <ResponseLeftItem
            data-id="246100e57fff"
            heading="Category"
            value={response?.trackerItem?.category?.name || '-'} />
          <ResponseLeftItem
            data-id="6165d2c5a730"
            heading="Regulatory body"
            value={response?.trackerItem?.regulatoryBody?.name || '-'} />
          <ResponseLeftItem
            data-id="ee352b2ef562"
            heading="Frequency"
            value={response?.trackerItem?.frequency || '-'} />
        </Box>
      </Flex>
    </Flex>)
  );
}

export default ResponseLeftNavigation;

export const responseLeftNavigationStyles = {
  responseLeftNavigation: {
    bg: '#110B30',
    goBackColor: '#818197',
    color: '#ffffff',
    building: '#2B3236',
    copy: '#FF9A00',
    avatar: '#462AC4',
    responseDetailActiveColor: '#F0F0F0',
  },
};
