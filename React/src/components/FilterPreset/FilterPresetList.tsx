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
  presets: FilterPreset[];
  loading: boolean;
  onPresetClick: (presetId: string) => void;
  onDeletePreset: (presetId: string, e: React.MouseEvent) => void;
  dataId: string;
}

const FilterPresetList: React.FC<FilterPresetListProps> = ({ presets, loading, onPresetClick, onDeletePreset, dataId }) => (
  <Box
    data-id="002323"
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
    maxH="200px"
    overflowY="auto"
    pb="12px"
    pt="5px"
    px="16px">
    <VStack data-id="002324" align="stretch" spacing={0}>
      {(() => {
        if (loading) {
          return (
            <Text
              data-id="002325"
              color="gray.500"
              fontSize="14px"
              py="20px"
              textAlign="center">Loading presets...
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
              preset={preset} />
          ));
        }

        return (
          <Text
            data-id="002327"
            color="gray.500"
            fontSize="14px"
            py="20px"
            textAlign="center">No filter presets saved yet
                      </Text>
        );
      })()}
    </VStack>
  </Box>
);

export default FilterPresetList;
