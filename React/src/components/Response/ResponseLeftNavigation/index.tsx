import { gql, useQuery } from '@apollo/client';
import { Box, Divider, Flex, Text } from '@chakra-ui/react';

import { navigationTabs } from '../../../bootstrap/config';
import { useResponseContext } from '../../../contexts/ResponseProvider';
import useNavigate from '../../../hooks/useNavigate';
import ModuleSwitcher from '../../ModuleSwitcher';
import NavigationPoweredBy from '../../NavigationLeft/NavigationPoweredBy';
import ResponseLeftTabItem from '../ResponseLeftTabItem';
import BackArrowIcon from '../../../icons/BackArrowIcon';
import LogoIcon from '../../../icons/LogoIcon';

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

interface ResponseLeftNavigationProps {
  readonly enforceDesktop?: boolean;
  readonly setDrawerOpen?: (open: boolean) => void;
}

function ResponseLeftNavigation({ enforceDesktop, setDrawerOpen }: ResponseLeftNavigationProps) {
  const { navigateTo } = useNavigate();

  const { response } = useResponseContext();
  
  // Query for users data (currently unused but may be needed for future features)
  useQuery(GET_USERS_BY_ID_FROM_DB, {
    variables: {
      accountableQuery: { usersIds: response?.accountableId || [] },
      responsibleQuery: { usersIds: response?.responsibleId || [] },
    },
    skip: !response?.accountableId?.length && !response?.responsibleId?.length,
  });

  return (
    <Flex
      bg="responseLeftNavigation.bg"
      color="responseLeftNavigation.color"
      data-id="000883"
      direction="column"
      display={['none', 'none', 'flex']}
      fontWeight="400"
      justifyContent="space-between"
      overflow={enforceDesktop ? "visible" : "auto"}
      w="280px">
      <Flex
        data-id="000884" flexDirection="column" overflow="visible" h={'100%'}>
        <Box
          alignItems="center"
          cursor="pointer"
          data-id="000545"
          display="flex"
          h="fit-content"
          justifyContent="center"
          px={'16px'}
          py={'10px'}
          overflow="visible"
          position={'relative'}
        >
          {
            enforceDesktop === true &&
            <Box
              data-id="002843"
              w='26px'
              h='26px'
              borderRadius='6px'
              bg='#112C59'
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              position={'absolute'}
              top={0}
              bottom={0}
              my={'auto'}
              right={'-10px'}
              zIndex={1000000000}
              _hover={{ bg: '#16456F' }}
              _active={{ bg: '#1F5A85' }}
              cursor='pointer'
              onClick={() => {
                if (setDrawerOpen) {
                  setDrawerOpen(false);
                }
              }}
            >
              <Box data-id="002844" transform="scaleX(-1)">
                <LogoIcon data-id="002905" color='white' boxSize='12px' />
              </Box>
            </Box>
          }
          <ModuleSwitcher enforceDesktop={enforceDesktop} data-id="002832" />
        </Box>
        <Divider data-id="002833" color={'#3E4F6C'} />
        <Box
          data-id="002991"
          display={'flex'}
          h={'100%'}
          flexDirection={'column'}
          justifyContent={'space-between'}
          alignItems={'space-between'}
          gap={6}>
        <Flex h={'100%'} data-id="002834" flexDirection="column" px="14px">
          <Flex
            align="center"
            color="responseLeftNavigation.goBackColor"
            cursor="pointer"
            data-id="000888"
            fontSize="14px"
            h="30px"
            mb="25px"
            mt="18px"
            gap="10px"
            onClick={() => navigateTo('/dashboard')}
            px="8px"
            py="6px"
            borderRadius="6px"
          >
            <Box
              data-id="002835"
              transition="all 0.2s ease-out"
              _hover={{
                bg: 'rgba(255, 255, 255, 0.22)',
                cursor: 'pointer'
              }}
              bg={'#152A4D'}
              borderRadius={'8px'}
              width={'34px'}
              alignItems={'center'}
              justifyContent={'center'}
              display={'flex'}
              height={'34px'}>
              <BackArrowIcon data-id="000889" />
            </Box>
            <Flex data-id="002836" display={'flex'} flexDirection={'column'}>
              <Text data-id="002837" fontSize="14px">Location</Text>
              <Text data-id="002838" fontSize="12px" color={'#9EA7B8'}>Tracker Item Detail</Text>
            </Flex>
          </Flex>
          <Flex data-id="000890" flexDirection="column" mb={2}>
            {navigationTabs.map(({ label, icon, url }) => (
              <ResponseLeftTabItem enforceDesktop={enforceDesktop} data-id="000891" icon={icon} key={url} label={label} url={url} />
            ))}
          </Flex>

          {/* COMMENTED OUT AS WE NEED TO MOVE THIS OUT FROM THE RESPONSE LEFT NAVIGATION */}
          {/* <Box
            data-id="000892"
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
            <Box data-id="000893" h="50px">
              <Box color="responseLeftNavigation.color" data-id="000894" fontSize="16px" opacity="64%">
                Item ID
              </Box>
              <Flex align="center" data-id="000895" fontSize="16px" minH="28px">
                <Flex data-id="000896" mr={2}>{response?.trackerItem.reference}</Flex>
                <CopyToClipboard
                  data-id="000897"
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
                    data-id="000898"
                    h="17px"
                    mt={1}
                    w="17px" />
                </CopyToClipboard>
              </Flex>
            </Box>
            <ResponseLeftItem
              data-id="000899"
              heading={capitalize(t('business unit'))}
              value={response?.businessUnit?.name || '-'} />
            <Box data-id="000900" h="50px" mt={2}>
              <Box color="responseLeftNavigation.color" data-id="000901" fontSize="16px" opacity="64%">
                Accountable
              </Box>
              <Flex align="center" data-id="000902" fontSize="16px" minH="28px">
                <Avatar
                  bg="responseLeftNavigation.avatar"
                  color="white"
                  data-id="000903"
                  mr={2}
                  name={
                    accountable && accountable.firstName && accountable.lastName
                      ? `${accountable.firstName} ${accountable.lastName}`
                      : `${accountable?.displayName}`
                  }
                  size="xs"
                  src={accountable && accountable.imgUrl} />
                <Flex data-id="000904" fontSize="14px" lineHeight="1.05">
                  {accountable && accountable.firstName && accountable.lastName
                    ? `${accountable.firstName} ${accountable.lastName}`
                    : `${accountable?.displayName || '-'}`}
                </Flex>
              </Flex>
            </Box>
            <Box data-id="000905" h="50px" mt={2}>
              <Box color="responseLeftNavigation.color" data-id="000906" fontSize="16px" opacity="64%">
                Responsible
              </Box>
              <Flex align="center" data-id="000907" fontSize="16px" minH="28px">
                <Avatar
                  bg="responseLeftNavigation.avatar"
                  color="white"
                  data-id="000908"
                  mr={2}
                  name={
                    responsible && responsible.firstName && responsible.lastName
                      ? `${responsible.firstName} ${responsible.lastName}`
                      : `${responsible?.displayName}`
                  }
                  size="xs"
                  src={responsible && responsible.imgUrl} />
                <Flex data-id="000909" fontSize="14px" lineHeight="1.05">
                  {responsible && responsible.firstName && responsible.lastName
                    ? `${responsible.firstName} ${responsible.lastName}`
                    : `${responsible?.displayName || '-'}`}
                </Flex>
              </Flex>
            </Box>
            <ResponseLeftItem
              data-id="000910"
              heading="Category"
              value={response?.trackerItem?.category?.name || '-'} />
            <ResponseLeftItem
              data-id="000911"
              heading="Regulatory body"
              value={response?.trackerItem?.regulatoryBody?.name || '-'} />
            <ResponseLeftItem
              data-id="000912"
              heading="Frequency"
              value={response?.trackerItem?.frequency || '-'} />
          </Box> */}
        </Flex>
        <NavigationPoweredBy enforceDesktop={enforceDesktop} data-id="002839" />

        </Box>
      </Flex>
    </Flex>
  );
}

export default ResponseLeftNavigation;

export const responseLeftNavigationStyles = {
  responseLeftNavigation: {
    bg: '#01173E',
    goBackColor: '#fff',
    color: '#ffffff',
    building: '#2B3236',
    copy: '#FF9A00',
    avatar: '#462AC4',
    responseDetailActiveColor: '#F0F0F0',
  },
};
