import React, { useCallback, useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

import { gql, useQuery } from '@apollo/client';
import { InfoOutlineIcon, SearchIcon } from '@chakra-ui/icons';
import { Box, Flex, Icon, Input, InputGroup, InputLeftElement, InputRightElement, Text, Tooltip } from '@chakra-ui/react';

import useDevice from '../../hooks/useDevice';
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
  showAsDropdown?: boolean;
}

const SEARCH_USERS = gql`
  query ($searchQuery: SearchUserQuery) {
    searchUsers(searchQuery: $searchQuery) {
      _id
      firstName
      lastName
      displayName
      email
      jobTitle
    }
  }
`;

const definedValidations: TDefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) return `${label} cannot be empty`;
  },
};

const UserData = ({
  name,
  user,
  setShowResults,
  setSearchedInputValue,
  onChange,
}: {
  name: string;
  user: IUser;
  setShowResults: (x: boolean) => void;
  setSearchedInputValue: (x: string) => void;
  onChange: (x: any) => void;
}) => (
  <Flex
    _hover={{
      cursor: 'pointer',
      bg: 'peoplePicker.hover.bg',
    }}
    align="center"
    color="peoplePicker.font"
    data-id="0962aa9002ea"
    fontWeight="400"
    h="auto"
    justify="space-between"
    mb={1}
    mt="10px"
    onClick={() => {
      setShowResults(false);
      setSearchedInputValue(user.displayName);
      onChange({ target: { name, value: user._id } });
    }}
    px={3}
    py={1}
    role="group"
    w="full"
    wordBreak="break-word">
    <Flex data-id="3313c5d0e6bc" direction="column" ml={2}>
      <Text color="black" data-id="386706826faf" fontSize="smm" fontWeight="semibold">
        {user?.displayName} - {user.jobTitle || 'No job title'}
      </Text>
      <Box
        data-id="1fbdea6839b1"
        fontSize="sm"
        overflow="hidden"
        position="relative"
        textOverflow="ellipsis">
        {user?.email}
      </Box>
    </Flex>
  </Flex>
);

const PeoplePicker = ({
  control,
  name,
  label,
  placeholder = '',
  tooltip = '',
  validations = {},
  disabled = false,
  required,
  showAsDropdown = true,
}: IPeoplePicker) => {
  const [showResults, setShowResults] = useState<boolean>(false);
  const [searchText, setSearchText] = useState('');
  const [searchedInputValue, setSearchedInputValue] = useState('');
  const [users, setUsers] = useState<IUser[]>([]);
  const [pickerActive, setPickerActive] = useState(false);
  const { data, loading, refetch } = useQuery(SEARCH_USERS, {
    variables: { searchQuery: { searchText } },
  });
  const validate = useValidate(label || name, validations, definedValidations);
  const device = useDevice();

  const togglePickerActive = useCallback(() => device === 'mobile' && setPickerActive((prv) => !prv), [device]);

  useEffect(() => {
    if (data) setUsers([...data.searchUsers]);
    else setUsers([]);
  }, [data]);

  useEffect(() => {
    refetch();
  }, [refetch, searchText]);

  return (
    (<Controller
      control={control}
      data-id="c39b5565573c"
      name={name}
      render={({ field, fieldState }) => {
        const { onChange, value } = field;
        const { error } = fieldState;

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (value && !searchText) {
            // User is selected but is not in text input - set default value
            setSearchText(value);
          } else {
            const user = users.find((user) => user._id === value);
            if (user) {
              setSearchedInputValue(user.displayName);
              setSearchText(user.displayName);
            }
          }
        }, [value, JSON.stringify(users.map(({ _id }) => _id))]);

        return (
          (<Box
            bg={pickerActive ? '#ffffff' : 'none'}
            data-id="d3edcf8a3c64"
            h={pickerActive ? '100vh' : 'auto'}
            id={name}
            inset={0}
            mt="none"
            onClick={togglePickerActive}
            p={pickerActive ? 4 : 0}
            position={pickerActive ? 'absolute' : 'relative'}
            w="full"
            zIndex={pickerActive ? '999' : 'auto'}>
            {label && (
              <Flex
                align="center"
                data-id="48efb80c6f8c"
                justify="space-between"
                mb="none"
                pb={1}
                pt={2}>
                <Box
                  color={error ? 'peoplePicker.labelFont.error' : 'peoplePicker.labelFont.normal'}
                  data-id="5b2363588f41"
                  fontSize={11}
                  fontWeight="bold"
                  left="none"
                  position="static"
                  zIndex={2}>
                  {label}
                  {required && (
                    <Asterisk
                      data-id="ad0cc35708f8"
                      fill="questionListElement.iconAsterisk"
                      h="9px"
                      mb="8px"
                      ml="5px"
                      stroke="questionListElement.iconAsterisk"
                      w="9px" />
                  )}{' '}
                  {tooltip && (
                    <Tooltip data-id="46f1d3281e95" hasArrow label={tooltip} placement="top">
                      <Icon data-id="c61354d32129" h="14px" mb={1} name="info" />
                    </Tooltip>
                  )}
                </Box>
              </Flex>
            )}
            <InputGroup data-id="36ef97e9f476">
              <Input
                _active={{
                  bg: disabled ? 'peoplePicker.disabled.bg' : 'peoplePicker.activeBg',
                }}
                _focus={{
                  borderColor: error ? 'peoplePicker.border.focus.error' : 'peoplePicker.border.focus.normal',
                }}
                _placeholder={{ color: 'peoplePicker.placeholder' }}
                bg={disabled ? 'peoplePicker.disabled.bg' : 'peoplePicker.bg'}
                borderColor={disabled ? 'peoplePicker.disabled.border' : error ? 'peoplePicker.border.error' : 'peoplePicker.border.normal'}
                borderRadius="8px"
                borderWidth="1px"
                color="peoplePicker.font"
                data-id="658b86e4e0d8"
                disabled={disabled}
                fontSize="smm"
                h="40px"
                mb={0}
                onBlur={() => !disabled && setTimeout(() => setShowResults(false), 200)}
                onChange={(e) => {
                  if (disabled) return;

                  setTimeout(() => setSearchText(e.target.value), 1000);
                  setSearchedInputValue(e.target.value);
                  onChange({ target: { name, value: '' } });
                }}
                onFocus={() => !disabled && setShowResults(true)}
                placeholder={placeholder}
                value={searchedInputValue}
                zIndex={2} />
              {!showAsDropdown && (
                <InputLeftElement data-id="b228f16ae6c6" zIndex={50}>
                  <SearchIcon data-id="adf55e988107" fill="peoplePicker.searchIcon" />
                </InputLeftElement>
              )}

              {!disabled && showAsDropdown && (
                <InputRightElement
                  cursor="pointer"
                  data-id="2f878e179d11"
                  onClick={() => setShowResults(!showResults)}>
                  <ChevronRight
                    data-id="2a0ea79eec09"
                    stroke="peoplePicker.icon"
                    transform="rotate(90deg)" />
                </InputRightElement>
              )}
            </InputGroup>
            {showResults && (
              <Flex
                bg="peoplePicker.bg"
                boxShadow="lg"
                data-id="14dda49a508e"
                direction="column"
                maxH="48vh"
                overflowY="auto"
                position="absolute"
                rounded="lg"
                w="full"
                zIndex={10}>
                {loading ? (
                  <Flex
                    align="center"
                    data-id="d63003efa775"
                    fontStyle="italic"
                    h="50px"
                    justifyContent={showAsDropdown ? 'center' : ''}
                    px={3}
                    w="full">
                    <Box data-id="d01a2bf274b8" mr={3} w="40px">
                      <Loader data-id="d3dc5c413e69" size="md" />
                    </Box>
                    {!showAsDropdown && 'Searching...'}
                  </Flex>
                ) : users.length > 0 ? (
                  !showAsDropdown ? (
                    searchText &&
                    users.map((user) => (
                      <UserData
                        data-id="5106641256e6"
                        key={user._id}
                        name={name}
                        onChange={onChange}
                        setSearchedInputValue={setSearchedInputValue}
                        setShowResults={setShowResults}
                        user={user} />
                    ))
                  ) : (
                    users.map((user) => (
                      <UserData
                        data-id="a3164ec6157b"
                        key={user._id}
                        name={name}
                        onChange={onChange}
                        setSearchedInputValue={setSearchedInputValue}
                        setShowResults={setShowResults}
                        user={user} />
                    ))
                  )
                ) : !showAsDropdown ? (
                  searchText && (
                    <Flex align="center" data-id="dd84c5405cb5" fontStyle="italic" h="35px" pl={5}>
                      No results found
                    </Flex>
                  )
                ) : (
                  <Flex align="center" data-id="cb050620d4c6" fontStyle="italic" h="35px" pl={5}>
                    No results found
                  </Flex>
                )}
              </Flex>
            )}
            {error && (
              <Box
                color="peoplePicker.error"
                data-id="9159bce661db"
                fontSize="smm"
                mt={1}
                pl={3}>
                {error.message}
              </Box>
            )}
            {tooltip && (
              <Flex align="center" color="peoplePicker.tooltip" data-id="3c60fe54e56e" mt={3}>
                <InfoOutlineIcon data-id="db50976e69c8" />
                <Box data-id="fffac3533382" fontSize="11px" ml={2}>
                  {tooltip}
                </Box>
              </Flex>
            )}
          </Box>)
        );
      }}
      rules={{ validate }} />)
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
    placeholder: '#CBCCCD',
    error: '#E53E3E',
    tooltip: '#9A9EA1',
    searchIcon: '#434B4F',
  },
};
