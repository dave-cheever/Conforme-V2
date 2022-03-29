import React from 'react';
import { Controller } from 'react-hook-form';
import { Mention, MentionsInput } from 'react-mentions';

import { Avatar, Flex, Text } from '@chakra-ui/react';

import { useResponseContext } from '../../contexts/ResponseProvider';
import useValidate from '../../hooks/useValidate';
import { SendMessageIcon } from '../../icons';
import { IField } from '../../interfaces/IField';
import { TDefinedValidations } from '../../interfaces/TValidations';

interface IMessageInput extends IField {
  placeholder?: string;
  variant?: string;
  onAction: () => void;
}

const definedValidations: TDefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) return `${label} cannot be empty`;
  },
  maxLength: (label, validationValue, value = '') => {
    if (value.length < validationValue)
      return `${label} can be maximum ${validationValue} characters length`;
  },
};

const MessageInput = ({
  control,
  name,
  label,
  placeholder = '',
  validations = {},
  disabled = false,
  onAction,
}: IMessageInput) => {
  const validate = useValidate(label || name, validations, definedValidations);
  const { users } = useResponseContext();

  const onKeyDown = (e) => {
    if (e.shiftKey && e.key === 'Enter') {
      // This should change the line
      return;
    }

    if (e.key === 'Enter') onAction();
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const { onChange, onBlur, value } = field;

        return (
          <Flex
            align="center"
            borderRadius="10px"
            mb="25px"
            position="relative"
            w="full"
          >
            <MentionsInput
              allowSpaceInQuery
              allowSuggestionsAboveCursor
              className="mentions"
              disabled={disabled}
              onBlur={onBlur}
              onChange={onChange}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              value={value}
            >
              <Mention
                className="mentions__mention"
                data={users}
                markup="@@@(__display__)[__id__]"
                renderSuggestion={(highlightedDisplay) => (
                  <Flex
                    __hover={{ color: 'mentionListItem.hoverColor' }}
                    color="mentionListItem.color"
                    fontSize="14px"
                    pl="13px"
                    py="10px"
                    w="full"
                  >
                    <Avatar name={highlightedDisplay?.displayName} size="xs" />
                    <Text ml={3} noOfLines={1} textOverflow="ellipsis">
                      {highlightedDisplay?.displayName}
                    </Text>
                  </Flex>
                )}
                spellCheck={false}
                trigger="@"
              />
            </MentionsInput>
            <Flex position="absolute" right="10px">
              <SendMessageIcon
                cursor={disabled ? 'not-allowed' : 'pointer'}
                onClick={onAction}
              />
            </Flex>
          </Flex>
        );
      }}
      rules={{ validate }}
    />
  );
};

export default MessageInput;

export const messageInputStyles = {
  messageInput: {
    textInput: {
      font: '#777777',
      bg: '#FFFFFF',
      labelFont: {
        normal: '#818197',
        error: '#E53E3E',
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
      placeholder: '#CBCCCD',
      error: '#E53E3E',
    },
  },
};
