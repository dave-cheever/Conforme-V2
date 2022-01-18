import React, { useEffect, useState } from 'react';
import { Box, Flex, Input, Tooltip, Icon, InputGroup, InputRightElement } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { gql, useQuery } from "@apollo/client";

import { Controller } from 'react-hook-form';
import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { DefinedValidations } from '../../interfaces/Validations';
import Loader from '../Loader';
import { IUser } from '../../interfaces/IUser';
import { ChevronRight } from '../../icons';

interface IPeoplePicker extends IField {
  placeholder?: string;
  variant?: string;
  help?: string;
}

const SEARCH_USERS = gql`
  query ($searchQuery: SearchQuery) {
    searchUsers(searchQuery: $searchQuery) {
      _id
      firstName
      lastName
      displayName
    }
  }
`;

const definedValidations: DefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) {
      return `${label} cannot be empty`;
    }
  },
};

const PeoplePicker = ({ control, name, label, placeholder = '', tooltip = '', variant, validations = {}, disabled = false, help = '' }: IPeoplePicker) => {
  const [showResults, setShowResults] = useState<Boolean>(false);
  const [searchText, setSearchText] = useState('');
  const [searchedInputValue, setSearchedInputValue] = useState('')
  const [users, setUsers] = useState<IUser[]>([]);
  const { data, loading, refetch } = useQuery(SEARCH_USERS, { variables: { searchQuery: { searchText } } });
  const validate = useValidate(label || name, validations, definedValidations);

  useEffect(() => {
    if (data) {
      setUsers(
        [...data.searchUsers]
      );
    } else {
      setUsers([]);
    }
  }, [data]);

  useEffect(() => {
    refetch()
  }, [refetch, searchText]);

  return (
    <Controller
      name={name}
      control={control}
      rules={{ validate }}
      render={({ field, fieldState, formState }) => {
        const { onChange, value } = field;
        const { error } = fieldState;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (value) {
            const user = users.find(user => user._id === value)
            if (user) setSearchedInputValue(user.displayName)
          }
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [value, users])
        return (
          <Box w='full' id={name} mt='none'>
            <Box>
              {label && (
                <Flex pt={2} pb={2} align='center' justify="space-between" mb='none'>
                  <Box
                    color={error ? "peoplePicker.labelFont.error" : "peoplePicker.labelFont.normal"}
                    fontWeight="bold"
                    fontSize={11}
                    position="static"
                    left='none'
                    zIndex={2}
                  >
                    {label}
                    {' '}
                    {tooltip && <Tooltip hasArrow label={tooltip} placement="top"><Icon name="info" mb={1} h="14px" /></Tooltip>}
                  </Box>
                </Flex>
              )}
              <InputGroup>
                <Input
                  _active={{ bg: disabled ? "peoplePicker.disabled.bg" : "peoplePicker.activeBg" }}
                  _focus={{ borderColor: error ? "peoplePicker.border.focus.error" : "peoplePicker.border.focus.normal" }}
                  fontSize="smm"
                  borderRadius="8px"
                  borderWidth="1px"
                  color="peoplePicker.font"
                  bg="peoplePicker.bg"
                  borderColor={error ? "peoplePicker.border.error" : "peoplePicker.border.normal"}
                  h="40px"
                  mb={0}
                  zIndex={2}
                  value={searchedInputValue}
                  onChange={e => {
                    setTimeout(() => setSearchText(e.target.value), 1000)
                    setSearchedInputValue(e.target.value)
                    onChange({ target: { name, value: '' } })
                  }}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                  onFocus={() => setShowResults(true)}
                  placeholder={placeholder}
                  _placeholder={{ color: 'peoplePicker.placeholder' }}
                />
                <InputRightElement
                  cursor="pointer"
                  onClick={() => setShowResults(!showResults)}
                  children={<ChevronRight stroke="peoplePicker.icon" transform="rotate(90deg)" />}
                />
              </InputGroup>
              {showResults && (
                <Flex
                  position='absolute'
                  bg="peoplePicker.bg"
                  direction='column'
                  boxShadow='lg'
                  rounded='lg'
                  zIndex={1}
                  maxH="20%"
                  overflowY="auto"
                  w={["calc(100% - 50px)", "calc(100% - 175px)"]}
                >
                  {loading ? (
                    <Box p={4}>
                      <Loader size='sm' />
                    </Box>
                  ) : (
                    users.length > 0 ? (
                      users.map(user => {
                        return (
                          <Flex
                            key={user._id}
                            onClick={() => {
                              setShowResults(false);
                              setSearchText('');
                              setSearchedInputValue(user.displayName)
                              onChange({ target: { name, value: user._id } });
                            }}
                            pl={3}
                            w='full'
                            h='30px'
                            fontWeight='400'
                            rounded='md'
                            align='center'
                            justify='space-between'
                            color='peoplePicker.font'
                            role='group'
                            _hover={{ cursor: 'pointer', bg: 'peoplePicker.hover.bg' }}
                          >
                            <Flex direction='column'>
                              <Flex>{user.displayName}</Flex>
                            </Flex>
                          </Flex>
                        )
                      })
                    ) : (
                      <Flex align='center' fontStyle='italic' pl={5} h='35px'>No results found</Flex>
                    )
                  )}
                </Flex>
              )}
              {error && <Box fontSize="smm" pl={3} mt={1} color='peoplePicker.error' >{error.message}</Box>}
              {tooltip &&
                <Flex color='peoplePicker.tooltip' align='center' mt={3}>
                  <InfoOutlineIcon />
                  <Box fontSize="11px" ml={2}>{tooltip}</Box>
                </Flex>}
            </Box>
          </Box>
        )
      }}
    />
  );
};

export default PeoplePicker;

export const peoplePickerStyles = {
  peoplePicker: {
    font: '#777777',
    bg: '#FFFFFF',
    labelFont: {
      normal: '#818197',
      error: '#E53E3E',
    },
    hover: {
      bg: "#F2F2F2"
    },
    border: {
      normal: '#CBCCCD',
      error: '#E53E3E',
      focus: {
        normal: '#777777',
        error: '#E53E3E',
      },
    },
    activeBg: '#EEEEEE',
    disabled: {
      font: '#2B3236',
      border: '#EEEEEE',
      bg: '#f7f7f7',
    },
    icon: '#282F36',
    placeholder: '#282F36',
    error: '#E53E3E',
    tooltip: "#9A9EA1"
  }
}
