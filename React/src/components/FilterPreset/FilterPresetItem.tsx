import React from 'react';

import { Button, Flex, Text } from '@chakra-ui/react';

import { Trashcan } from '../../icons';

interface FilterPresetItemProps {
  readonly preset: {
    _id: string;
    name: string;
  };
  readonly index: number;
  readonly onPresetClick: (presetId: string) => void;
  readonly onDeletePreset: (presetId: string, e: React.MouseEvent) => void;
  readonly dataId: string;
}

function FilterPresetItem({ preset, index, onPresetClick, onDeletePreset, dataId }: FilterPresetItemProps) {
  return (
    <Flex
      _hover={{ bg: 'gray.50' }}
      align="center"
      borderRadius="6px"
      cursor="pointer"
      data-id={`${dataId}-preset-${index}`}
      h="36px"
      justify="space-between"
      onClick={(e) => {
        e.stopPropagation();
        onPresetClick(preset._id);
      }}
      px="0"
      py="8px"
    >
      <Text color="#344054" data-id="002321" flex="1" fontSize="14px" fontWeight="500" pl={2}>
        {preset.name}
      </Text>
      <Button
        _hover={{ bg: 'gray.100' }}
        bg="transparent"
        borderRadius="4px"
        data-id={`${dataId}-delete-${index}`}
        h="24px"
        minW="24px"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDeletePreset(preset._id, e);
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        p="0"
        variant="ghost"
        w="24px"
      >
        <Trashcan color="#A0AEC0" data-id="002322" h="14px" stroke="#667085" w="14px" />
      </Button>
    </Flex>
  );
}

export default FilterPresetItem;
