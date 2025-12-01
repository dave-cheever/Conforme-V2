import React from 'react';

import { Button, HStack, Input, Spinner, Text, VStack } from '@chakra-ui/react';
import { CrossIcon, SaveIcon } from '../../icons';
import { MAX_PRESET_NAME_LENGTH } from '../../bootstrap/config';

interface SavePresetFormProps {
  readonly presetName: string;
  readonly onPresetNameChange: (name: string) => void;
  readonly onSave: () => void;
  readonly onCancel: () => void;
  readonly dataId: string;
  readonly isSaving: boolean;
}


function SavePresetForm({ presetName, dataId, isSaving, onPresetNameChange, onSave, onCancel }: SavePresetFormProps) {
  const isOverLimit = presetName.length > MAX_PRESET_NAME_LENGTH;

  return (
    <VStack align="stretch" data-id="002338" spacing="4px" w="100%">
      <HStack data-id="003085" spacing="8px">
        <Input
          _focus={{
            borderColor: isOverLimit ? '#E53E3E' : '#CBD5E0',
            boxShadow: isOverLimit
              ? '0px 1px 2px 0px rgba(229, 62, 62, 0.05), 0px 0px 0px 4px rgba(229, 62, 62, 0.05)'
              : '0px 1px 2px 0px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px rgba(16, 24, 40, 0.05)',
          }}
          border={`1px solid ${isOverLimit ? '#E53E3E' : '#CBD5E0'}`}
          borderRadius="6px"
          data-id={`${dataId}-preset-input`}
          fontSize="14px"
          h="32px"
          isInvalid={isOverLimit}
          onChange={(e) => onPresetNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isOverLimit) onSave();
            else if (e.key === 'Escape') onCancel();
          }}
          placeholder="Preset name"
          value={presetName}
        />
        <Button
          _hover={{ bg: 'gray.50' }}
          bg="transparent"
          border="1px solid #CBD5E0"
          borderRadius="6px"
          data-id={`${dataId}-clear-button`}
          h="32px"
          minW="32px"
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          p="0"
          variant="outline"
          w="32px"
        >
          <CrossIcon data-id="002339" h="10px" w="10px" />
        </Button>
        <Button
          _hover={{ opacity: 0.9 }}
          bg="#0068A3"
          borderRadius="6px"
          data-id={`${dataId}-confirm-save-button`}
          h="32px"
          isDisabled={isOverLimit}
          minW="32px"
          onClick={(e) => {
            e.stopPropagation();
            if (!isOverLimit) {
              onSave();
            }
          }}
          opacity={isOverLimit ? 0.5 : 1}
          p="0"
          variant="solid"
          w="32px"
          isLoading={isSaving}
          spinner={<Spinner data-id="003345" color="white" size='sm' />}
        >
          <SaveIcon color="white" data-id="002340" h="12px" stroke="white" w="12px" />
        </Button>
      </HStack>
      {isOverLimit && (
        <Text data-id="003086" color="#E53E3E" fontSize="12px" mt="4px">
          Preset name must be {MAX_PRESET_NAME_LENGTH} characters or less ({presetName.length}/{MAX_PRESET_NAME_LENGTH})
        </Text>
      )}
    </VStack>
  );
}

export default SavePresetForm;
