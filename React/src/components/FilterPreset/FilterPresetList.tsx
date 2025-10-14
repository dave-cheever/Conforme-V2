import React from 'react';

import { Box, Text, VStack } from '@chakra-ui/react';

import FilterPresetItem from './FilterPresetItem';

interface FilterPreset {
  _id: string;
  name: string;
  filters: Record<string, any>;
  moduleId: string;
  moduleType: string;
  pageName: string;
  userId: string;
  metadata: {
    modulePath: string;
    fullPath: string;
    usedFilters: string[];
  };
  metatags: {
    addedBy: string;
    addedAt: string;
    updatedBy: string;
    updatedAt: string;
  };
}

interface FilterPresetListProps {
  readonly presets: FilterPreset[];
  readonly loading: boolean;
  readonly onPresetClick: (presetId: string) => void;
  readonly onDeletePreset: (presetId: string, e: React.MouseEvent) => void;
  readonly dataId: string;
}

function FilterPresetList({ presets, loading, onPresetClick, onDeletePreset, dataId }: FilterPresetListProps) {
  return (
    <Box
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#CBD5E0',
          borderRadius: '2px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#A0AEC0',
        },
      }}
      data-id="002323"
      maxH="200px"
      overflowY="auto"
      pb="12px"
      pt="5px"
      px="16px"
    >
      <VStack align="stretch" data-id="002324" spacing={0}>
        {(() => {
          if (loading) {
            return (
              <Text color="gray.500" data-id="002325" fontSize="14px" py="20px" textAlign="center">
                Loading presets...
              </Text>
            );
          }

          if (presets.length > 0) {
            return presets.map((preset, index) => (
              <FilterPresetItem
                data-id="002326"
                dataId={dataId}
                index={index}
                key={preset._id}
                onDeletePreset={onDeletePreset}
                onPresetClick={onPresetClick}
                preset={preset}
              />
            ));
          }

          return (
            <Text color="gray.500" data-id="002327" fontSize="14px" py="20px" textAlign="center">
              No filter presets saved yet
            </Text>
          );
        })()}
      </VStack>
    </Box>
  );
}

export default FilterPresetList;
