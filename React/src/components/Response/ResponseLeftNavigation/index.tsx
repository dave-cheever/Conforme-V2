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

const ResponseLeftNavigation = () => {
  const { navigateTo } = useNavigate();
  const toast = useToast();
  const { module } = useAppContext();

  const { showFiltersPanel } = useFiltersContext();

  const { response } = useResponseContext();
  const { data: { accountable: responseAccountable, responsible: responseResponsible } = [] } = useQuery(GET_USERS_BY_ID, {
    variables: {
      accountableQuery: { usersIds: response?.accountableId || [] },
      responsibleQuery: { usersIds: response?.responsibleId || [] },
    },
  });

  const accountable: IUser = responseAccountable && responseAccountable?.length !== 0 && responseAccountable[0];

  const responsible: IUser = responseResponsible && responseResponsible?.length !== 0 && responseResponsible[0];

  return (
    <Flex
      bg="responseLeftNavigation.bg"
      color="responseLeftNavigation.color"
      direction="column"
      display={['none', 'none', 'flex']}
      fontWeight="400"
      justifyContent="space-between"
      overflow="auto"
      px={6}
      w="240px"
    >
      <Flex flexDirection="column">
        <Box alignItems="center" cursor="pointer" display="flex" h="80px" onClick={() => navigateTo('/')}>
          <Text color="navigationLeft.organizationNameFontColor" fontSize="16px" fontWeight="bold" w="full">
            {showFiltersPanel ? getInitials(module?.name) : module?.name}
          </Text>
        </Box>
        <Flex
          align="center"
          color="responseLeftNavigation.goBackColor"
          cursor="pointer"
          fontSize="14px"
          h="30px"
          mb="30px"
          onClick={() => navigateTo('/compliance-items')}
        >
          <ChevronRight mr={2} transform="Rotate(180deg)" />
          Go Back
        </Flex>
        <Flex flexDirection="column" mb={2}>
          {navigationTabs.map(({ label, icon, url }) => (
            <ResponseLeftTabItem icon={icon} key={url} label={label} url={url} />
          ))}
        </Flex>
        <Box h="50px">
          <Box fontSize="11px" opacity={0.5}>
            Item ID
          </Box>
          <Flex align="center" fontSize="14px" minH="28px">
            <Flex mr={2}>{response?.complianceItem.reference}</Flex>
            <CopyToClipboard
              onCopy={() =>
                toast({
                  ...toastSuccess,
                  title: 'Item ID copied',
                  description: `${response?.complianceItem.reference} was copied to clipboard`,
                })
              }
              text={response?.complianceItem.reference}
            >
              <Copy _hover={{ opacity: 0.6, cursor: 'pointer' }} color="responseLeftNavigation.copy" h="17px" mt={1} w="17px" />
            </CopyToClipboard>
          </Flex>
        </Box>
        <ResponseLeftItem heading={capitalize(t('businessUnit'))} value={response?.businessUnit?.name || '-'} />
        <Box h="50px" mt={2}>
          <Box fontSize="11px" opacity={0.5}>
            Accountable
          </Box>
          <Flex align="center" fontSize="14px" minH="28px">
            <Avatar
              bg="responseLeftNavigation.avatar"
              color="white"
              mr={2}
              name={
                accountable && accountable.firstName && accountable.lastName
                  ? `${accountable.firstName} ${accountable.lastName}`
                  : `${accountable?.displayName}`
              }
              size="xs"
              src={accountable && accountable.imgUrl}
            />
            <Flex mr={2}>
              {accountable && accountable.firstName && accountable.lastName
                ? `${accountable.firstName} ${accountable.lastName}`
                : `${accountable?.displayName || '-'}`}
            </Flex>
          </Flex>
        </Box>
        <Box h="50px" mt={2}>
          <Box fontSize="11px" opacity={0.5}>
            Responsible
          </Box>
          <Flex align="center" fontSize="14px" minH="28px">
            <Avatar
              bg="responseLeftNavigation.avatar"
              color="white"
              mr={2}
              name={
                responsible && responsible.firstName && responsible.lastName
                  ? `${responsible.firstName} ${responsible.lastName}`
                  : `${responsible?.displayName}`
              }
              size="xs"
              src={responsible && responsible.imgUrl}
            />
            <Flex mr={2}>
              {responsible && responsible.firstName && responsible.lastName
                ? `${responsible.firstName} ${responsible.lastName}`
                : `${responsible?.displayName || '-'}`}
            </Flex>
          </Flex>
        </Box>
        <ResponseLeftItem heading="Category" value={response?.complianceItem?.category?.name || '-'} />
        <ResponseLeftItem heading="Regulatory body" value={response?.complianceItem?.regulatoryBody?.name || '-'} />
        <ResponseLeftItem heading="Frequency" value={response?.complianceItem?.frequency || '-'} />
      </Flex>
      <Flex>
        <Icon as={Conforme} h="35px" mb="20px" w="103px" />
      </Flex>
    </Flex>
  );
};

export default ResponseLeftNavigation;

export const responseLeftNavigationStyles = {
  responseLeftNavigation: {
    bg: '#E5E5E5',
    goBackColor: '#818197',
    color: '#282F36',
    building: '#2B3236',
    copy: '#FF9A00',
    avatar: '#462AC4',
    responseDetailActiveColor: '#F0F0F0',
  },
};
