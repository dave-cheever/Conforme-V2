import React, { useCallback, useEffect, useState } from 'react';
import { Box, Flex, Tooltip, Icon, Input, Avatar } from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import { CloseIcon } from '@chakra-ui/icons';

import { IFieldComponent } from '../Field';
import { IUser } from '../../interfaces/IUser';
// import { UsersService } from '../../services';
import Loader from '../Loader';

const PeoplePicker = ({ name, label, showDot, tooltip, disabled, value, error, touched, onChange, onBlur, options, placeholder }: IFieldComponent) => {
  const [showResults, setShowResults] = useState<Boolean>(false);
  const [searchText, setSearchText] = useState('');
  const [resultsLoading, setResultsLoading] = useState<Boolean>(false);
  const [users, setUsers] = useState<IUser[]>([]);

  const getUsers = useCallback(debounce(async (searchText: string) => {
    setResultsLoading(true);
    // const users = await UsersService.getFromAAD(searchText);
    setResultsLoading(false);
    setUsers(users);
  }, 300), []);

  useEffect(() => {
    getUsers(searchText);
  }, [searchText]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderDot = () => {
    if (!showDot) {
      return <Box w="50px" />;
    }
    return <Box flexShrink={0} w='14px' h='14px' mr={1} bg={error ? 'red.500' : 'green.500'} rounded='full' />;
  };

  const renderError = () => {
    if (!error || !touched) {
      return null;
    }
    return <Box fontSize={14} ml={1} color='red.500'>{error}</Box>;
  };

  const renderToolTip = () => {
    return (<Tooltip hasArrow aria-label={tooltip || ''} label={tooltip} placement="right"><Icon name="info" mb={1} h="14px" /></Tooltip>);
  };

  const renderPerson = (person) => (
    <Flex
      key={person.email}
      onClick={() => {
        setShowResults(false);
        setSearchText('');
        onChange({ target: { name, value: person } });
      }}
      w='full'
      h='65px'
      fontWeight='400'
      rounded='md'
      align='center'
      justify='space-between'
      color='brand.darkGrey'
      role='group'
      _hover={{ cursor: 'pointer', bg: '#F2F2F2' }}
    >
      <Flex align='center'>
        <Avatar color='brand.darkGrey' borderColor='F2F2F2' borderWidth={1} bg='#ffffff' name={person.firstName && person.lastName ? `${person.firstName} ${person.lastName}` : `${person.displayName}` } src={person.imgUrl} size='sm' mx={4} />
        <Flex direction='column'>
          <Flex>{person.firstName && person.lastName ? `${person.firstName} ${person.lastName}` : `${person.displayName}` }</Flex>
          <Flex fontSize='12px' opacity='0.6'>{person.jobTitle}</Flex>
        </Flex>
      </Flex>
    </Flex>
  );

  return (
    <Box id={name}>
      {(label || showDot) && <Flex pt={2} pb={2} align='center' justify="space-between">
        <Box color="gray.600" fontWeight="bold" px={2} bg="#ffffff" fontSize={14} position="relative" left="15px" top="18px" zIndex={2}>
          {tooltip && renderToolTip()}
        </Box>
        {renderDot()}
      </Flex>}
      <Box>
        <Input
          _focus={{ color: 'brand.darkGrey' }}
          _hover={{}}
          borderWidth='2px'
          borderColor={error && touched ? 'brand.primary' : 'brand.borderColor'}
          h='55px'
          pt='10px'
          mb={0}
          zIndex={2}
          value={value ? `${value.firstName && value.lastName ? `${value.firstName} ${value.lastName}` : `${value.displayName}` }` : searchText}
          onChange={e => setSearchText(e.target.value)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          onFocus={() => setShowResults(true)}
        />
        <Flex justify='space-between'>
          <Box ml={4} position='relative' top='-50px' fontSize='11px' fontWeight='700' color={error && touched ? 'brand.primary' : 'gray.600'}>
            Owner
          </Box>
          {value &&
            <CloseIcon
              onClick={() => onChange({ target: { name, value: null } })}
              cursor='pointer'
              _hover={{ color: '#FC5960' }}
              zIndex={3}
              color='brand.darkGrey'
              position='relative'
              top='-35px' mr={5}
            />
          }
        </Flex>
        {showResults && (
          <Flex position='relative' top='-15px' direction='column' boxShadow='lg' rounded='lg'>
            {resultsLoading ? (
              <Box p={4}>
                <Loader size='sm' />
              </Box>
            ) : (
                users.length > 0 ? (
                  users.map(renderPerson)
                ) : (
                  <Flex align='center' fontStyle='italic' pl={5} h='35px'>No results found</Flex>
                )
            )}
          </Flex>
        )}
      </Box>
      {renderError()}
    </Box>
  );
};

export default PeoplePicker;
