import { useCallback, useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

import { gql, useQuery } from '@apollo/client';
import { InfoOutlineIcon, SearchIcon } from '@chakra-ui/icons';
import { Avatar, Box, Flex, Icon, Input, InputGroup, InputLeftElement, InputRightElement, Text, Tooltip } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import useDevice from '../../hooks/useDevice';
import useValidate from '../../hooks/useValidate';
import { Asterisk, ChevronRight, Trashcan } from '../../icons';
import { IField } from '../../interfaces/IField';
import { IUser } from '../../interfaces/IUser';
import { TDefinedValidations } from '../../interfaces/TValidations';
import { formatEmail } from '../../utils/helpers';
import { runtimeEnv } from '../../utils/runtime-env';
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
      userId
      firstName
      lastName
      displayName
      email
      jobTitle
      imgUrl
    }
  }
`;

const definedValidations: TDefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) return `${label} cannot be empty`;
  },
};

function UserData({
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
}) {
  return (
    <Flex
      _hover={{
        cursor: 'pointer',
        bg: 'peoplePicker.hover.bg',
      }}
      align="center"
      color="peoplePicker.font"
      data-id="000276"
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
      wordBreak="break-word"
    >
      <Flex align="center" data-id="000277">
        {user.imgUrl && (
          <Avatar
            data-id="000278"
            name={user.displayName?.replace(/\s*\(.*?\)\s*/g, '')} 
            size="xs"
            src={`${runtimeEnv.apiUrl()}/files/photo/${user._id}`}
          />
        )}
        <Flex data-id="000279" direction="column" ml={3}>
          <Text color="black" data-id="000280" fontSize="smm" fontWeight="semibold">
            {user?.displayName} {user.jobTitle ? ` - ${user.jobTitle}` : ''}
          </Text>
          <Box
            data-id="000281"
            fontSize="sm"
            overflow="hidden"
            textOverflow="ellipsis">
            {formatEmail(user?.email)}
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}

function PeoplePicker({
  control,
  name,
  label,
  placeholder = '',
  tooltip = '',
  validations = {},
  disabled = false,
  required,
  showAsDropdown = true,
}: IPeoplePicker) {
  const [showResults, setShowResults] = useState<boolean>(false);
  const [searchText, setSearchText] = useState('');
  const [searchedInputValue, setSearchedInputValue] = useState('');
  const [users, setUsers] = useState<IUser[]>([]);
  const [pickerActive, setPickerActive] = useState(false);
  const { organizationConfig } = useAppContext();
  const { data, loading, refetch } = useQuery(SEARCH_USERS, {
    variables: { searchQuery: { searchText, organization: organizationConfig?._id } },
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
    <Controller
      control={control}
      data-id="000282"
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
          <Box
            bg={pickerActive ? '#ffffff' : 'none'}
            data-id="000283"
            h={pickerActive ? '100vh' : 'auto'}
            id={name}
            inset={0}
            mt="none"
            onClick={togglePickerActive}
            p={pickerActive ? 4 : 0}
            position={pickerActive ? 'absolute' : 'relative'}
            w="full"
            zIndex={pickerActive ? '999' : 'auto'}
          >
            {label && (
              <Flex align="center" data-id="000284" justify="space-between" mb="none" pb={1} pt={2}>
                <Box
                  color={error ? 'peoplePicker.labelFont.error' : 'peoplePicker.labelFont.normal'}
                  data-id="000285"
                  fontSize="16px"
                  fontWeight="500"
                  lineHeight="100%"
                  left="none"
                  position="static"
                  zIndex={2}
                >
                  {label}
                  {required && (
                    <Asterisk
                      data-id="000286"
                      fill="questionListElement.iconAsterisk"
                      h="9px"
                      mb="8px"
                      ml="5px"
                      stroke="questionListElement.iconAsterisk"
                      w="9px"
                    />
                  )}{' '}
                  {tooltip && (
                    <Tooltip data-id="000287" hasArrow label={tooltip} placement="top">
                      <Icon data-id="000288" h="14px" mb={1} name="info" />
                    </Tooltip>
                  )}
                </Box>
              </Flex>
            )}
            <InputGroup data-id="000289">
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
                data-id="000290"
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
                pr={14}
                value={searchedInputValue}
                zIndex={2}
              />
              {!showAsDropdown && (
                <InputLeftElement data-id="000291" zIndex={50}>
                  <SearchIcon data-id="000292" fill="peoplePicker.searchIcon" />
                </InputLeftElement>
              )}

              {!disabled && showAsDropdown && (
                <InputRightElement cursor="pointer" data-id="000293" w={value ? 14 : 8}>
                  {value && (
                    <Trashcan
                      data-id="000294"
                      onClick={() => {
                        setSearchText('');
                        setSearchedInputValue('');
                        onChange({ target: { name, value: '' } });
                      }}
                      stroke="peoplePicker.icon"
                      w={6}
                    />
                  )}
                  <ChevronRight
                    data-id="000295"
                    onClick={() => setShowResults(!showResults)}
                    stroke="peoplePicker.icon"
                    transform="rotate(90deg)"
                    w={6}
                  />
                </InputRightElement>
              )}
            </InputGroup>
            {showResults && (
              <Flex
                bg="peoplePicker.bg"
                boxShadow="lg"
                data-id="000296"
                direction="column"
                maxH="48vh"
                overflowY="auto"
                position="absolute"
                rounded="lg"
                w="full"
                zIndex={10}
              >
                {loading ? (
                  <Flex
                    align="center"
                    data-id="000297"
                    fontStyle="italic"
                    h="50px"
                    justifyContent={showAsDropdown ? 'center' : ''}
                    px={3}
                    w="full"
                  >
                    <Box data-id="000298" mr={3} w="40px">
                      <Loader data-id="000299" size="md" />
                    </Box>
                    {!showAsDropdown && 'Searching...'}
                  </Flex>
                ) : users.length > 0 ? (
                  !showAsDropdown ? (
                    searchText &&
                    users.map((user) => (
                      <UserData
                        data-id="000300"
                        key={user._id}
                        name={name}
                        onChange={onChange}
                        setSearchedInputValue={setSearchedInputValue}
                        setShowResults={setShowResults}
                        user={user}
                      />
                    ))
                  ) : (
                    users.map((user) => (
                      <UserData
                        data-id="000301"
                        key={user._id}
                        name={name}
                        onChange={onChange}
                        setSearchedInputValue={setSearchedInputValue}
                        setShowResults={setShowResults}
                        user={user}
                      />
                    ))
                  )
                ) : !showAsDropdown ? (
                  searchText && (
                    <Flex align="center" data-id="000302" fontStyle="italic" h="35px" pl={5}>
                      No results found
                    </Flex>
                  )
                ) : (
                  <Flex align="center" data-id="000303" fontStyle="italic" h="35px" pl={5}>
                    No results found
                  </Flex>
                )}
              </Flex>
            )}
            {error && (
              <Box color="peoplePicker.error" data-id="000304" fontSize="smm" mt={1} pl={3}>
                {error.message}
              </Box>
            )}
            {tooltip && (
              <Flex align="center" color="peoplePicker.tooltip" data-id="000305" mt={3}>
                <InfoOutlineIcon data-id="000306" />
                <Box data-id="000307" fontSize="11px" ml={2}>
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
}

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
