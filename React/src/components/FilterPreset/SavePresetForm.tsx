import React from 'react';

import { Button, HStack, Input } from '@chakra-ui/react';

import { CrossIcon, SaveIcon } from '../../icons';

interface SavePresetFormProps {
  presetName: string;
  onPresetNameChange: (name: string) => void;
  onSave: () => void;
  onCancel: () => void;
  dataId: string;
}

const SavePresetForm: React.FC<SavePresetFormProps> = ({ presetName, onPresetNameChange, onSave, onCancel, dataId }) => (
  <HStack data-id="002338" spacing="8px">
    <Input
      _focus={{
        borderColor: '#CBD5E0',
        boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px rgba(16, 24, 40, 0.05)',
      }}
      border="1px solid #CBD5E0"
      borderRadius="6px"
      color="#A0AEC0"
      data-id={`${dataId}-preset-input`}
      fontSize="14px"
      h="32px"
      onChange={(e) => onPresetNameChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSave();
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
      minW="32px"
      onClick={(e) => {
        e.stopPropagation();
        onSave();
      }}
      p="0"
      variant="solid"
      w="32px"
    >
      <SaveIcon data-id="002340" color="white" h="12px" stroke="white" w="12px" />
    </Button>
  </HStack>
);

export default SavePresetForm;
