import React from 'react';
import { Flex, Avatar, Text } from '@chakra-ui/react';
import { Mention, MentionsInput } from "react-mentions";
import { Controller } from 'react-hook-form';

import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { TDefinedValidations } from '../../interfaces/TValidations';
import { SendMessageIcon } from '../../icons';
import { useResponseContext } from '../../contexts/ResponseProvider';

interface IMessageInput extends IField {
  placeholder?: string;
  variant?: string;
  onAction: () => void
}

const definedValidations: TDefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) {
      return `${label} cannot be empty`;
    }
  },
  maxLength: (label, validationValue, value = '') => {
    if (value.length < validationValue) {
      return `${label} can be maximum ${validationValue} characters length`;
    }
  },
};

const MessageInput = ({ control, name, label, placeholder = '', validations = {}, disabled = false, onAction }: IMessageInput) => {
  const validate = useValidate(label || name, validations, definedValidations);
  const { users } = useResponseContext();

  const onKeyDown = (e) => {
    if (e.shiftKey && e.key === "Enter") {
      //This should change the line
      return;
    }

    if (e.key === "Enter") {
      onAction();
    }
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={{ validate }}
      render={({ field }) => {
        const { onChange, onBlur, value } = field;

        return (
          <Flex w="full" align="center" position="relative" borderRadius="10px" mb="25px">
            <MentionsInput
              disabled={disabled}
              allowSpaceInQuery={true}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              className="mentions"
              allowSuggestionsAboveCursor={true}
              value={value}
              onChange={onChange}>
              <Mention
                markup="@@@(__display__)[__id__]"
                spellCheck={false}
                trigger="@"
                data={users}
                className="mentions__mention"
                renderSuggestion={(
                  highlightedDisplay,
                ) => {
                  return (
                    <Flex w="full" pl="13px" py="10px" color="mentionListItem.color" fontSize="14px" __hover={{ color: "mentionListItem.hoverColor" }}>
                      <Avatar size="xs" name={highlightedDisplay?.displayName} />
                      <Text ml={3} noOfLines={1} textOverflow="ellipsis">{highlightedDisplay?.displayName}</Text>
                    </Flex>
                  );
                }}
              />
            </MentionsInput>
            <Flex position="absolute" right="10px"><SendMessageIcon cursor={disabled ? "not-allowed" : "pointer"} onClick={onAction} /></Flex>
          </Flex>
        );
      }}
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
    }
  }
}