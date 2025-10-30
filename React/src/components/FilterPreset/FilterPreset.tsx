import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Button, Divider, Flex, Menu, MenuButton, MenuList, Text, useDisclosure, useToast, VStack } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import { FilterPresetsIcon, PlusIcon } from '../../icons';
import updateLocalStorageFilter from '../../utils/filterStorage';
import DeletePresetModal from './DeletePresetModal';
import FilterPresetList from './FilterPresetList';
import SavePresetForm from './SavePresetForm';

export const SAVE_FILTER_PRESET = gql`
  mutation SaveFilterPreset($saveFilterPresetInput: SaveFilterPresetInput!) {
    saveFilterPreset(saveFilterPresetInput: $saveFilterPresetInput) {
      _id
      name
      filters
      moduleId
      moduleType
      pageName
      userId
      metadata {
        modulePath
        fullPath
        usedFilters
      }
      metatags {
        addedBy
        addedAt
        updatedBy
        updatedAt
      }
    }
  }
`;

export const DELETE_FILTER_PRESET = gql`
  mutation DeleteFilterPreset($deleteFilterPresetInput: DeleteFilterPresetInput!) {
    deleteFilterPreset(deleteFilterPresetInput: $deleteFilterPresetInput) {
      _id
      name
    }
  }
`;

export const GET_FILTER_PRESETS = gql`
  query GetFilterPresets($getFilterPresetsInput: GetFilterPresetsInput!) {
    getFilterPresets(getFilterPresetsInput: $getFilterPresetsInput) {
      _id
      name
      filters
      moduleId
      moduleType
      pageName
      userId
      metadata {
        modulePath
        fullPath
        usedFilters
      }
      metatags {
        addedBy
        addedAt
        updatedBy
        updatedAt
      }
    }
  }
`;

export interface FilterPresetItem {
  readonly id: string;
  readonly name: string;
  readonly onClick: () => void;
}

export interface FilterPresetProps {
  readonly placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  readonly 'data-id'?: string;
}

function FilterPreset({ placement = 'bottom-start', 'data-id': dataId = 'filter-preset' }: FilterPresetProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSaving, setIsSaving] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetToDelete, setPresetToDelete] = useState<{ id: string; name: string } | null>(null);
  const { filtersValues, usedFilters, setFilters, sortingState, setSortingState, cleanFilters } = useFiltersContext();
  const { module, user } = useAppContext();
  const location = useLocation();
  const toast = useToast();
  const [saveFilterPresetMutation] = useMutation(SAVE_FILTER_PRESET);
  const [deleteFilterPresetMutation] = useMutation(DELETE_FILTER_PRESET);

  const getCurrentPageName = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    // Remove the module path (first segment) and get the page name
    return pathSegments.length > 1 ? pathSegments[1] : 'dashboard';
  };

  // Fetch filter presets from database
  const queryVariables = {
    getFilterPresetsInput: {
      userId: user?.userId,
      moduleId: module?._id,
      pageName: getCurrentPageName(),
    },
  };

  const {
    data: presetsData,
    loading: loadingPresets,
    refetch: refetchPresets,
  } = useQuery(GET_FILTER_PRESETS, {
    variables: queryVariables,
    skip: !user?.userId || !module?._id,
    fetchPolicy: 'cache-and-network',
  });

  const getCurrentFilterValues = () => {
    const currentFilters: Record<string, any> = {};

    // Extract only the filters that are currently being used and have values
    usedFilters.forEach((filterKey) => {
      const filter = filtersValues[filterKey];
      if (filter && filter.value !== null && filter.value !== undefined) {
        // Check if the filter has a meaningful value
        let hasValue = false;

        if (Array.isArray(filter.value)) hasValue = filter.value.length > 0;
        else if (typeof filter.value === 'object' && filter.value !== null) {
          // For user filters and other complex objects
          hasValue = Object.values(filter.value).some((val: any) =>
            Array.isArray(val) ? val.length > 0 : val !== null && val !== undefined,
          );
        } else hasValue = filter.value !== '' && filter.value !== false && filter.value !== 0;

        if (hasValue) currentFilters[filterKey] = filter.value;
      }
    });

    // Include sorting state if it exists
    if (sortingState) currentFilters.sorting = sortingState;

    return currentFilters;
  };

  const saveFiltersToLocalStorage = (filters: Record<string, any>) => {
    // Save each filter to localStorage using the existing utility
    Object.entries(filters).forEach(([key, value]) => {
      // Get the filter name from the current filtersValues or use a default
      const filterName = filtersValues[key]?.name || key;
      updateLocalStorageFilter(module?._id || '', key, filterName, value, user?.userId || '', setFilters);
    });
  };

  const actualPresets = presetsData?.getFilterPresets ? [...presetsData.getFilterPresets] : [];

  const checkForDuplicateName = (name: string): boolean => actualPresets.some((preset) => preset.name.toLowerCase() === name.toLowerCase());

  const checkForDuplicateFilters = (filters: Record<string, any>): boolean =>
    actualPresets.some(
      (preset) =>
        // Deep comparison of filters
        JSON.stringify(preset.filters) === JSON.stringify(filters),
    );

  const handleSavePreset = async () => {
    if (presetName.trim()) {
      const currentFilters = getCurrentFilterValues();
      const currentPageName = getCurrentPageName();
      const trimmedName = presetName.trim();

      // Check if there are any meaningful filters to save (excluding sorting)
      const filtersWithoutSorting = { ...currentFilters };
      delete filtersWithoutSorting.sorting;

      // Additional check: ensure we have at least one actual filter with meaningful values
      const hasActualFilters = Object.keys(filtersWithoutSorting).length > 0;

      // Double-check that the filters have actual values (not just empty objects)
      const hasMeaningfulValues = Object.values(filtersWithoutSorting).some((value) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'object' && value !== null) {
          return Object.values(value).some((val: any) =>
            Array.isArray(val) ? val.length > 0 : val !== null && val !== undefined && val !== '',
          );
        }
        return value !== '' && value !== false && value !== 0 && value !== null && value !== undefined;
      });

      if (!hasActualFilters || !hasMeaningfulValues) {
        toast({
          title: 'No filters to save',
          description: 'Please apply some filters before saving a preset.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
        setIsSaving(false);
        return;
      }

      // Check for duplicate name
      if (checkForDuplicateName(trimmedName)) {
        toast({
          title: 'Duplicate preset name',
          description: `A preset with the name "${trimmedName}" already exists. Please choose a different name.`,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
        setIsSaving(false);
        return;
      }

      // Check for duplicate filters
      if (checkForDuplicateFilters(currentFilters)) {
        toast({
          title: 'Duplicate filter combination',
          description:
            'A preset with the same filter combination already exists. Please modify your filters or choose a different combination.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
        setIsSaving(false);
        return;
      }

      const presetData = {
        name: trimmedName,
        filters: currentFilters,
        moduleId: module?._id,
        moduleType: module?.type,
        pageName: currentPageName,
        userId: user?.userId,
        metadata: {
          modulePath: module?.path,
          fullPath: location.pathname,
          usedFilters,
        },
      };

      try {
        setIsSaving(true);
        await saveFilterPresetMutation({
          variables: {
            saveFilterPresetInput: presetData,
          },
        });

        toast({
          title: 'Filter preset saved',
          description: `"${trimmedName}" has been saved successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });

        // Refetch presets to update the list
        await refetchPresets();

        setPresetName('');
        setIsSaving(false);
      } catch (error: any) {
        // Error saving filter preset
        toast({
          title: 'Failed to save preset',
          description: error.message || 'An error occurred while saving the filter preset',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
        setIsSaving(false);
      }
    } else {
      toast({
        title: 'Preset name required',
        description: 'Please enter a name for your filter preset',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      setIsSaving(false);
    }
  };

  const handleCancelSave = () => {
    setPresetName('');
    setIsSaving(false);
  };

  const handleDeletePreset = (presetId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Find the preset to get its name for the confirmation message
    const preset = actualPresets.find((p) => p._id === presetId);
    if (!preset) return;

    setPresetToDelete({ id: presetId, name: preset.name });
  };

  const confirmDeletePreset = async () => {
    if (!presetToDelete) return;

    try {
      await deleteFilterPresetMutation({
        variables: {
          deleteFilterPresetInput: {
            _id: presetToDelete.id,
            userId: user?.userId,
          },
        },
      });

      // Only show success toast if the operation was successful
      toast({
        title: 'Preset deleted',
        description: `"${presetToDelete.name}" has been deleted successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });

      // Refetch presets to update the list
      await refetchPresets();

      // Close the confirmation dialog
      setPresetToDelete(null);
    } catch (error: any) {
      // Error deleting filter preset
      toast({
        title: 'Failed to delete preset',
        description: error.message || 'An error occurred while deleting the filter preset',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const cancelDeletePreset = () => {
    setPresetToDelete(null);
  };

  const handlePresetClick = (presetId: string) => {
    // Find the preset in the actual presets data
    const preset = actualPresets.find((p) => p._id === presetId);
    if (preset) {
      // Clear all existing filters and sorting first
      cleanFilters();
      setSortingState(null);

      // Extract sorting from preset filters if it exists
      const { sorting, ...filtersWithoutSorting } = preset.filters;

      // Apply new filters and sorting after a short delay to ensure clearing is complete
      setTimeout(() => {
        // Apply new filters
        setFilters(filtersWithoutSorting);

        // Apply sorting if it exists in the preset
        if (sorting) setSortingState(sorting);

        // Save to localStorage (including sorting)
        saveFiltersToLocalStorage(preset.filters);
      }, 50);

      toast({
        title: 'Filters applied',
        description: `Applied filters from "${preset.name}"`,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    }
    onClose();
  };

  return (
    <>
      <Menu data-id={dataId} isOpen={isOpen} onClose={onClose} onOpen={onOpen} placement={placement}>
        <MenuButton
          _active={{
            bg: 'gray.100',
            borderColor: '#D0D5DD',
          }}
          _focus={{
            boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px rgba(16, 24, 40, 0.05)',
          }}
          _hover={{
            bg: 'gray.50',
            borderColor: '#D0D5DD',
          }}
          as={Button}
          bg="white"
          border="1px solid #CBD5E0"
          color="filterPanel.resetButtonColor"
          data-id={`${dataId}-button`}
          fontSize="14px"
          fontWeight="500"
          h="35px"
          leftIcon={<FilterPresetsIcon data-id={`${dataId}-icon`} h="16px" w="16px" />}
          onClick={(e) => {
            e.stopPropagation();
          }}
          variant="outline"
        >
          Filter presets
        </MenuButton>

        <MenuList
          bg="white"
          border="1px solid #E4E7EC"
          borderRadius="8px"
          boxShadow="0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)"
          data-id={`${dataId}-menu`}
          minW="280px"
          onClick={(e) => {
            e.stopPropagation();
          }}
          p="0"
        >
          <VStack align="stretch" data-id="002312" spacing={0}>
            {/* Header */}
            <Box data-id="002313" px="16px" py="12px">
              <Flex align="center" data-id="002314" justify="space-between">
                <Text color="#1A202C" data-id={`${dataId}-title`} fontSize="14px" fontWeight="500">
                  Filter presets
                </Text>
                {!isSaving && (
                  <Button
                    _hover={{ bg: 'transparent' }}
                    bg="transparent"
                    color="#4A5568"
                    data-id={`${dataId}-save-button`}
                    fontSize="12px"
                    fontWeight="500"
                    h="auto"
                    leftIcon={<PlusIcon color="#4A5568" data-id="002315" h="12px" w="12px" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSaving(true);
                    }}
                    p="0"
                    variant="ghost"
                  >
                    Save preset
                  </Button>
                )}
              </Flex>
              <Divider borderColor="#E4E7EC" data-id="002316" mt="8px" />
            </Box>

            {/* Save Preset Input Section */}
            {isSaving && (
              <Box borderBottom="1px solid #CBD5E0" data-id="002317" pb="10px" px="16px">
                <SavePresetForm
                  data-id="002318"
                  dataId={dataId}
                  onCancel={handleCancelSave}
                  onPresetNameChange={setPresetName}
                  onSave={handleSavePreset}
                  presetName={presetName} />
              </Box>
            )}

            {/* Presets List */}
            <FilterPresetList
              data-id="002319"
              dataId={dataId}
              loading={loadingPresets}
              onDeletePreset={handleDeletePreset}
              onPresetClick={handlePresetClick}
              presets={actualPresets} />
          </VStack>
        </MenuList>
      </Menu>
      {/* Delete Confirmation Modal */}
      <DeletePresetModal
        data-id="002320"
        isOpen={!!presetToDelete}
        onCancel={cancelDeletePreset}
        onConfirm={confirmDeletePreset}
        presetToDelete={presetToDelete} />
    </>
  );
}

export default FilterPreset;
