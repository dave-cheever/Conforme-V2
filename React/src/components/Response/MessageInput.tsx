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
    (<Controller
      control={control}
      data-id="f76f9c68f0f7"
      name={name}
      render={({ field }) => {
        const { onChange, onBlur, value } = field;

        return (
          (<Flex
            align="center"
            borderRadius="10px"
            data-id="66fb8f01f63f"
            mb="25px"
            position="relative"
            w="full">
            <MentionsInput
              allowSpaceInQuery
              allowSuggestionsAboveCursor
              autoComplete="off"
              className="mentions"
              data-id="04d385f60464"
              disabled={disabled}
              inputRef={mentionRef}
              onBlur={onBlur}
              onChange={onChange}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              value={value}>
              <Mention
                appendSpaceOnAdd
                className="mentions__mention"
                data={chatParticipants}
                data-id="761d4a65cf89"
                renderSuggestion={(highlightedDisplay) => (
                  <Flex
                    color="mentionListItem.color"
                    data-id="8be5694219c9"
                    fontSize="14px"
                    pl="13px"
                    py="10px"
                    w="full">
                    <Avatar data-id="a68c3369dd6e" name={highlightedDisplay?.displayName} size="xs" />
                    <Text data-id="e11e566ab0a9" ml={3} noOfLines={1} textOverflow="ellipsis">
                      {highlightedDisplay?.displayName}
                    </Text>
                  </Flex>
                )}
                spellCheck={false}
                trigger="@" />
            </MentionsInput>
            <Flex data-id="78ff3a16d85d" position="absolute" right="10px">
              <SendMessageIcon
                cursor={disabled ? 'not-allowed' : 'pointer'}
                data-id="553c0b35af27"
                onClick={onAction} />
            </Flex>
          </Flex>)
        );
      }}
      rules={{ validate }} />)
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
