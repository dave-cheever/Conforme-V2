import { useRef } from 'react';
import { Controller } from 'react-hook-form';
import { Mention, MentionsInput } from 'react-mentions';

import { Avatar, Flex, Text } from '@chakra-ui/react';

import { useChatContext } from '../../contexts/ChatProvider';
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
    if (value.length < validationValue) return `${label} can be maximum ${validationValue} characters length`;
  },
};

function MessageInput({ control, name, label, placeholder = '', validations = {}, disabled = false, onAction }: IMessageInput) {
  const validate = useValidate(label || name, validations, definedValidations);
  const { chatParticipants } = useChatContext();
  const mentionRef = useRef<HTMLInputElement>(null);
  const onKeyDown = (e) => {
    if (e.shiftKey && e.key === 'Enter') {
      // This should change the line
      return;
    }

    if (e.key === 'Enter') {
      // prevent default behaviour
      e.preventDefault();
      onAction();
    }
  };

  return (
    <Controller
        data-id="030925-2bc856"
        control={control}
        name={name}
        render={({ field }) => {
          const { onChange, onBlur, value } = field;

          return (
            <Flex
                data-id="030925-bd234b"
                align="center"
                borderRadius="10px"
                mb="25px"
                mx="auto"
                position="relative"
                w="90%">
              <MentionsInput
                data-id="030925-1df6f0"
                allowSpaceInQuery
                allowSuggestionsAboveCursor
                autoComplete="off"
                className="mentions"
                disabled={disabled}
                inputRef={mentionRef}
                onBlur={onBlur}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                value={value}>
                <Mention
                  data-id="030925-7f1281"
                  appendSpaceOnAdd
                  className="mentions__mention"
                  data={chatParticipants}
                  renderSuggestion={(highlightedDisplay) => (
                    <Flex
                      data-id="030925-014460"
                      color="mentionListItem.color"
                      fontSize="14px"
                      pl="13px"
                      py="10px"
                      w="full">
                      <Avatar data-id="030925-be861b" name={highlightedDisplay?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}   size="xs" />
                      <Text data-id="030925-5c2a29" ml={3} noOfLines={1} textOverflow="ellipsis">
                        {highlightedDisplay?.displayName}
                      </Text>
                    </Flex>
                  )}
                  spellCheck={false}
                  trigger="@" />
              </MentionsInput>
              <Flex data-id="030925-945f45" position="absolute" right="10px">
                <SendMessageIcon
                  data-id="030925-1973e2"
                  cursor={disabled ? 'not-allowed' : 'pointer'}
                  onClick={onAction} />
              </Flex>
            </Flex>
          );
        }}
        rules={{ validate }} />
  );
}

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
