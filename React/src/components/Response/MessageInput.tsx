import { useMemo, useRef } from 'react';
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

  // Transform data to the format expected by react-mentions
  const mentionData = useMemo(() => {
    if (!chatParticipants || !Array.isArray(chatParticipants)) return [];

    const filteredParticipants = chatParticipants.filter((participant) => {
      if (!participant?._id) return false;
      if (!participant.displayName || typeof participant.displayName !== 'string' || participant.displayName.trim() === '') return false;
      return true;
    });

    // Transform to the format expected by react-mentions: { id, display }
    const transformedData = filteredParticipants.map((participant) => {
      const transformed = {
        id: String(participant._id), // Ensure id is a string
        display: String(participant.displayName).trim(), // Ensure display is a string and trimmed
      };
      return transformed;
    });

    return transformedData;
  }, [chatParticipants]);
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
      control={control}
      data-id="000323"
      name={name}
      render={({ field }) => {
        const { onChange, onBlur, value } = field;

        return (
          <Flex align="center" borderRadius="10px" data-id="000324" mb="25px" mx="auto" position="relative" w="90%">
            <MentionsInput
              allowSpaceInQuery
              allowSuggestionsAboveCursor
              autoComplete="off"
              className="mentions"
              data-id="000325"
              disabled={disabled}
              inputRef={mentionRef}
              onBlur={onBlur}
              onChange={onChange}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              value={value}
            >
              <Mention
                appendSpaceOnAdd
                className="mentions__mention"
                data={mentionData || []}
                data-id="000326"
                displayTransform={(id, display) => `@${display}`}
                renderSuggestion={(highlightedDisplay) => {
                  // Additional safety check for the suggestion
                  if (!highlightedDisplay?.display) return null;
                  return (
                    <Flex color="mentionListItem.color" data-id="000327" fontSize="14px" pl="13px" py="10px" w="full">
                      <Avatar data-id="000328" name={highlightedDisplay.display.replace(/\s*\(.*?\)\s*/g, '')} size="xs" />
                      <Text data-id="000329" ml={3} noOfLines={1} textOverflow="ellipsis">
                        {highlightedDisplay.display}
                      </Text>
                    </Flex>
                  );
                }}
                spellCheck={false}
                trigger="@"
              />
            </MentionsInput>
            <Flex data-id="000330" position="absolute" right="10px">
              <SendMessageIcon cursor={disabled ? 'not-allowed' : 'pointer'} data-id="000331" onClick={onAction} />
            </Flex>
          </Flex>
        );
      }}
      rules={{ validate }}
    />
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
