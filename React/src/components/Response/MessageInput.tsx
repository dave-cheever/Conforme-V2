import React from 'react';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';

import { Controller } from 'react-hook-form';
import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { DefinedValidations } from '../../interfaces/Validations';
import { SendMessageIcon } from '../../icons';

interface IMessageInput extends IField {
  placeholder?: string;
  variant?: string;
  onAction: () => void
}

const definedValidations: DefinedValidations = {
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
  return (
    <Controller
      name={name}
      control={control}
      rules={{ validate }}
      render={({ field }) => {
        const { onChange, onBlur, value } = field;
        return (
          <InputGroup mt="5px">
            <Input
              borderRadius="8px"
              borderWidth="1px"
              pt='none'
              h="40px"
              type="text"
              fontSize="smm"
              color="messageInput.textInput.font"
              bg="messageInput.textInput.bg"
              name={name}
              value={value}
              borderColor={"messageInput.textInput.border.normal"}
              _active={{ bg: disabled ? "messageInput.textInput.disabled.bg" : "messageInput.textInput.activeBg" }}
              _focus={{ borderColor: "messageInput.textInput.border.focus.normal" }}
              _hover={{ cursor: "auto" }}
              onChange={onChange}
              onBlur={onBlur}
              isDisabled={disabled}
              cursor="pointer"
              _disabled={{
                bg: "messageInput.textInput.disabled.bg",
                color: "messageInput.textInput.disabled.font",
                borderColor: "messageInput.textInput.disabled.border",
                cursor: "not-allowed",
              }}
              maxLength={validations && validations.forceMaxLength ? validations.maxLength as number : undefined}
              placeholder={placeholder}
              _placeholder={{ fontSize: "smm", color: 'messageInput.textInput.placeholder' }}
              onKeyDown={(e) => e.key === 'Enter' && onAction()}
            />
            <InputRightElement children={<SendMessageIcon />} onClick={() => onAction()} cursor="pointer" />
          </InputGroup>
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

