import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

import { gql, useQuery } from '@apollo/client';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Tooltip,
} from '@chakra-ui/react';

import useValidate from '../../hooks/useValidate';
import { Asterisk, ChevronRight } from '../../icons';
import { IField } from '../../interfaces/IField';
import { IUser } from '../../interfaces/IUser';
import { TDefinedValidations } from '../../interfaces/TValidations';
import Loader from '../Loader';

interface IPeoplePicker extends IField {
  placeholder?: string;
  variant?: string;
  help?: string;
  required?: boolean;
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

const definedValidations: TDefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) return `${label} cannot be empty`;
  },
};

const PeoplePicker = ({
  control,
  name,
  label,
  placeholder = '',
  tooltip = '',
  validations = {},
  disabled = false,
  required,
}: IPeoplePicker) => {
  const [showResults, setShowResults] = useState<boolean>(false);
  const [searchText, setSearchText] = useState('');
  const [searchedInputValue, setSearchedInputValue] = useState('');
  const [users, setUsers] = useState<IUser[]>([]);
  const { data, loading, refetch } = useQuery(SEARCH_USERS, {
    variables: { searchQuery: { searchText } },
  });
  const validate = useValidate(label || name, validations, definedValidations);

  useEffect(() => {
    if (data) setUsers([...data.searchUsers]);
    else setUsers([]);
  }, [data]);

  useEffect(() => {
    refetch();
  }, [refetch, searchText]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const { onChange, value } = field;
        const { error } = fieldState;

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (value) {
            const user = users.find((user) => user._id === value);
            if (user) setSearchedInputValue(user.displayName);
          }
        }, [value, users]);

        return (
          <Box id={name} mt="none" position="relative" w="full">
            {label && (
              <Flex
                align="center"
                justify="space-between"
                mb="none"
                pb={1}
                pt={2}
              >
                <Box
                  color={
                    error
                      ? 'peoplePicker.labelFont.error'
                      : 'peoplePicker.labelFont.normal'
                  }
                  fontSize={11}
                  fontWeight="bold"
                  left="none"
                  position="static"
                  zIndex={2}
                >
                  {label}
                  {required && (
                    <Asterisk
                      fill="questionListElement.iconAsterisk"
                      h="9px"
                      mb="8px"
                      ml="5px"
                      stroke="questionListElement.iconAsterisk"
                      w="9px"
                    />
                  )}{' '}
                  {tooltip && (
                    <Tooltip hasArrow label={tooltip} placement="top">
                      <Icon h="14px" mb={1} name="info" />
                    </Tooltip>
                  )}
                </Box>
              </Flex>
            )}
            <InputGroup>
              <Input
                _active={{
                  bg: disabled
                    ? 'peoplePicker.disabled.bg'
                    : 'peoplePicker.activeBg',
                }}
                _focus={{
                  borderColor: error
                    ? 'peoplePicker.border.focus.error'
                    : 'peoplePicker.border.focus.normal',
                }}
                _placeholder={{ color: 'peoplePicker.placeholder' }}
                bg="peoplePicker.bg"
                borderColor={
                  error
                    ? 'peoplePicker.border.error'
                    : 'peoplePicker.border.normal'
                }
                borderRadius="8px"
                borderWidth="1px"
                color="peoplePicker.font"
                fontSize="smm"
                h="40px"
                mb={0}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                onChange={(e) => {
                  setTimeout(() => setSearchText(e.target.value), 1000);
                  setSearchedInputValue(e.target.value);
                  onChange({ target: { name, value: '' } });
                }}
                onFocus={() => setShowResults(true)}
                placeholder={placeholder}
                value={searchedInputValue}
                zIndex={2}
              />
              <InputRightElement
                cursor="pointer"
                onClick={() => setShowResults(!showResults)}
              >
                <ChevronRight
                  stroke="peoplePicker.icon"
                  transform="rotate(90deg)"
                />
              </InputRightElement>
            </InputGroup>
            {showResults && (
              <Flex
                bg="peoplePicker.bg"
                boxShadow="lg"
                direction="column"
                maxH="50vh"
                overflowY="auto"
                position="absolute"
                rounded="lg"
                w="full"
                zIndex={10}
              >
                {loading ? (
                  <Box p={4}>
                    <Loader size="sm" />
                  </Box>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <Flex
                      _hover={{
                        cursor: 'pointer',
                        bg: 'peoplePicker.hover.bg',
                      }}
                      align="center"
                      color="peoplePicker.font"
                      fontWeight="400"
                      h="30px"
                      justify="space-between"
                      key={user._id}
                      onClick={() => {
                        setShowResults(false);
                        setSearchText('');
                        setSearchedInputValue(user.displayName);
                        onChange({ target: { name, value: user._id } });
                      }}
                      pl={3}
                      role="group"
                      rounded="md"
                      w="full"
                    >
                      <Flex direction="column">
                        <Flex>{user.displayName}</Flex>
                      </Flex>
                    </Flex>
                  ))
                ) : (
                  <Flex align="center" fontStyle="italic" h="35px" pl={5}>
                    No results found
                  </Flex>
                )}
              </Flex>
            )}
            {error && (
              <Box color="peoplePicker.error" fontSize="smm" mt={1} pl={3}>
                {error.message}
              </Box>
            )}
            {tooltip && (
              <Flex align="center" color="peoplePicker.tooltip" mt={3}>
                <InfoOutlineIcon />
                <Box fontSize="11px" ml={2}>
                  {tooltip}
                </Box>
              </Flex>
            )}
          </Box>
        );
      }}
      rules={{ validate }}
    />
  );
};

export default PeoplePicker;

export const peoplePickerStyles = {
  peoplePicker: {
    font: '#777777',
    bg: '#FFFFFF',
    labelFont: {
      normal: '#2B3236',
      error: '#E53E3E',
    },
    hover: {
      bg: '#F2F2F2',
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
    tooltip: '#9A9EA1',
  },
};
