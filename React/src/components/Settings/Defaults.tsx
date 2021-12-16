import React, { useMemo } from 'react';
import { Flex, IconButton, Stack, HStack } from '@chakra-ui/react';
import { useMutation, gql } from '@apollo/client';

import { useSettingsContext } from '../../contexts/SettingsProvider';
import Field from '../Forms/Field';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

const UPDATE_SETTINGS = gql`
  mutation ($settingsUpdate: SettingsUpdate!) {
    updateSetting(settingsUpdate: $settingsUpdate) {
      _id
    }
  }
`;

const Defaults = () => {
  const [updateSetting] = useMutation(UPDATE_SETTINGS);
  const { control, categories, businessUnits, regulatoryBodies, defaultSettings, formValues, dirtyFields, reset, refetch } = useSettingsContext();

  const businessUnitsOptions = useMemo(() => businessUnits.map(({ _id, name }) => ({ value: _id, label: name })), [businessUnits]);
  const categoriesOptions = useMemo(() => categories.map(({ _id, name }) => ({ value: _id, label: name })), [categories]);
  const regulatoryBodiesOptions = useMemo(() => regulatoryBodies.map(({ _id, name }) => ({ value: _id, label: name })), [regulatoryBodies]);

  const options = (name) => {
    switch (name) {
      case "defaultBusinessUnit":
        return businessUnitsOptions;

      case "defaultRegulatoryBody":
        return regulatoryBodiesOptions;

      case "defaultCategory":
        return categoriesOptions;

      default:
        break;
    }
  }

  const updateSettings = async ({ _id, name }) => {
    const updatedValue = formValues[name] || "";
    await updateSetting({ variables: { settingsUpdate: { _id, name, value: updatedValue } } });
    refetch();
    reset(formValues);
  }

  const isModified = (name) => {
    return dirtyFields[name] || false;
  };

  const resetValue = ({ name, value }) => {
    reset({
      ...formValues,
      [name]: value
    });
  }

  return (
    <Stack w='full' spacing={7} h="full" pb={3}>
      {defaultSettings?.map(({ _id, name, label, placeholder, variant, description, inputType, help, value }) =>
        <Flex align='center' key={name}>
          <Flex maxW="280px">
            <Field
              control={control}
              name={name}
              type={inputType}
              label={label}
              placeholder={placeholder}
              variant={variant}
              options={options(name)}
              help={help}
              tooltip={description}
              value={value}
            />
          </Flex>
          {isModified(name) && (
            <HStack ml={3} spacing={3} mt={6}>
              <IconButton
                colorScheme="purpleHeart"
                variant='outline'
                aria-label='Confirm Icon'
                size="sm"
                icon={<CheckIcon />}
                onClick={() => updateSettings({ _id, name })}
              />
              <IconButton
                colorScheme="red"
                aria-label='Cross Icon'
                size="sm"
                icon={<CloseIcon />}
                onClick={() => resetValue({ name, value })}
              />
            </HStack>
          )}
        </Flex>)}
    </Stack>
  )
}

export default Defaults
