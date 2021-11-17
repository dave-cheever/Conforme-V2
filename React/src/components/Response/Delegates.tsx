import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Input,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
// import debounce from 'lodash.debounce';
import { IUser } from '../../interfaces/IUser';
import { useAppContext } from '../../contexts/AppProvider';
import Can, { isPermitted } from '../can';
import Loader from '../Loader';
import { gql, useMutation, useQuery } from '@apollo/client';

const SEARCH_USERS = gql`
  query ($searchQueryInput: SearchQueryInput) {
    searchUsers(searchQueryInput: $searchQueryInput) {
      _id
      firstName
      lastName
      displayName
    }
  }
`;

const GET_USERS_BY_ID = gql`
  query ($userQueryInput: UserQueryInput) {
    usersById(userQueryInput: $userQueryInput) {
      _id
      firstName
      lastName
      displayName
    }
  }
`;

const ADD_DELEGATE = gql`
  mutation ($responseDelegateModifyInput: ResponseDelegateModifyInput!) {
    addDelegate(responseDelegateModifyInput: $responseDelegateModifyInput) {
      _id
    }
  }
`;

const REMOVE_DELEGATE = gql`
  mutation ($responseDelegateModifyInput: ResponseDelegateModifyInput!) {
    removeDelegate(responseDelegateModifyInput: $responseDelegateModifyInput)
  }
`;

const Delegates = ({ response, refetchResponse }) => {
  const { user: sessionUser } = useAppContext();
  const maxDelegates = 2;
  // const maxDelegates = settings?.find(({ name }) => name === 'maxDelegates').value;
  const [viewUserSearch, setViewUserSearch] = useState<boolean>(false);
  const [userSearchResults, setUserSearchResults] = useState<IUser[]>([]);
  const [showClearSearch, setShowClearSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const {data, loading, refetch} = useQuery(SEARCH_USERS, {variables: {searchQueryInput: {searchText: searchQuery}}});
  const {data:{usersById} = []} = useQuery(GET_USERS_BY_ID, {variables: {userQueryInput: {usersIds: response.delegateIds}}});
  const [addDelegate] = useMutation(ADD_DELEGATE);
  const [removeDelegate] = useMutation(REMOVE_DELEGATE);

  useEffect(() => {
    refetch();    
    if (data?.searchUsers && searchQuery) {
      const filteredUsers = data.searchUsers.filter(({ _id }) => _id !== response?.businessUnit?.ownerId && !response.delegateIds.includes(_id));
      
      setUserSearchResults(filteredUsers);
    } else {
      setUserSearchResults([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, data])

  // const removeDelegate = (removedId) => {
  //   const delegates = response?.delegates?.filter(({ id }) => id !== removedId) || [];
  //   const delegateIds = response.delegateIds?.filter((id) => id !== removedId) || [];
  //   setResponse({
  //     ...response,
  //     delegates,
  //     delegateIds
  //   });
  //   updateResponse('delegateIds', delegateIds);
  // };

  const renderDelegate = (user, newUser?) => (
    <Flex
      key={user._id}
      onClick={async () => {
        if (newUser) {
          await addDelegate({ variables: { responseDelegateModifyInput: {_id: response._id, delegateId: user._id} } });
          refetchResponse();
          setSearchQuery('');
          setUserSearchResults([]);
          setViewUserSearch(false);
        } else {
          if (isPermitted({ user: sessionUser, data: { response }, action: 'responses.delegateEdit'})) {
            await removeDelegate({ variables: { responseDelegateModifyInput: {_id: response._id, delegateId: user._id} } });
            refetchResponse();
            setViewUserSearch(false);
          }
        };
      }}
      w='full'
      h='65px'
      fontWeight='400'
      bg={newUser ? '' : '#F2F2F2'}
      rounded='md'
      mb={newUser ? '' : 2}
      maxWidth='400px'
      align='center'
      justify='space-between'
      color='response.delegates.fontColor'
      role='group'
      // _hover={newUser ? { cursor: 'pointer', bg: '#F2F2F2' } : isPermitted({ user: sessionUser, data: { response }, action: 'responses.delegateEdit'}) && { cursor: 'pointer', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.18)', bg: '#FFFFFF' }}
    >
      <Flex align='center'>
        <Avatar color='response.delegates.avatar' borderColor='F2F2F2' borderWidth={1} bg='#ffffff' name={user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `${user.displayName}` } src={user.imgUrl} size='sm' mx={4} />
        <Flex direction='column'>
          <Flex>{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `${user.displayName}` } {user.role}</Flex>
          <Flex fontSize='12px' opacity='0.6'>{user.jobTitle}</Flex>
        </Flex>
      </Flex>
      {newUser ? <CheckIcon color='green' mr={5} display='none' _groupHover={{ display: 'inline-block' }} /> :
        isPermitted({ user: sessionUser, data: { response }, action: 'responses.delegateEdit'}) && <CloseIcon color='#FC5960' mr={5} display='none' _groupHover={{ display: 'inline-block' }} />}
    </Flex>
  );

  return (
    <>
      <Box mb={2}>Delegates</Box>
      {response.delegateIds?.map((delegate) => {
        const filteredUser = usersById?.find(({ _id }) => _id === delegate );
        if (filteredUser){
          return renderDelegate(filteredUser);
        } else {
          return null;
        }
      })}

      <Can
        action='responses.delegateEdit'
        data={{ response }}
        yes={() => (response?.delegateIds?.length < maxDelegates ? viewUserSearch ?
          <Button onClick={() => {
            setViewUserSearch(false);
            setUserSearchResults([]);
          }}
            mt={1}
            mb={3}
            rounded='lg'
            fontWeight='500'
            h='27px'
            fontSize='12px'
            bg='#F2F2F2'
            color='response.delegates.button'
            _hover={{ opacity: 0.7 }}
          >
            Cancel
          </Button>
          : <Button onClick={() => {
            setViewUserSearch(true);
          }}
            mt={1}
            mb={3}
            rounded='lg'
            fontWeight='500'
            h='27px'
            fontSize='12px'
            bg='response.delegates.addButton'
            color='#FFFFFF'
            _hover={{ opacity: 0.7 }}
          >
            {response.delegateIds?.length === 0 ? 'Add a delegate' : 'Add another'}
          </Button> : <></>)}
      />

      {(response.delegateIds?.length < maxDelegates && viewUserSearch) &&
        <Box maxWidth='400px'>
          <Input
            _focus={{ color: 'response.delegates.inputFocusFont' }}
            _hover={{}}
            borderWidth='2px'
            borderColor='#F2F2F2'
            h='55px'
            pt='10px'
            mb={0}
            zIndex={2}
            value={searchQuery}
            onChange={({ target: { value } }) => {
              setSearchQuery(value);
              // getUsers(value);
              if (value) {
                setShowClearSearch(true);
              } else {
                setShowClearSearch(false);
              }
            }}
          />
          <Flex justify='space-between'>
            <Box ml={4} position='relative' top='-50px' fontSize='11px' fontWeight='700'>
              Search users
            </Box>
            {showClearSearch && <CloseIcon onClick={() => {
              setUserSearchResults([]);
              setSearchQuery('');
              setShowClearSearch(false);
            }}
              cursor='pointer'
              _hover={{ color: '#FC5960' }}
              zIndex={3}
              color='brand.darkGrey'
              position='relative'
              top='-35px' mr={5}
            />}
          </Flex>
          <Flex position='relative' top='-15px' direction='column' boxShadow='lg' rounded='lg'>{loading ? <Flex w='full' h='50px' px={3} fontStyle='italic' align='center'><Box w='40px' mr={3}><Loader size='md' /></Box>Searching...</Flex> : userSearchResults.length > 0 ?
            userSearchResults.map((user) => (renderDelegate(user, true))) : searchQuery && <Flex align='center' fontStyle='italic' pl={5} maxWidth='400px' h='50px'>No results found</Flex>}
          </Flex>
        </Box>}
    </>
  )
};

export default Delegates;
