import React, { useMemo } from 'react';

import { gql, useMutation } from '@apollo/client';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { Flex, HStack, IconButton, Stack } from '@chakra-ui/react';

import { useSettingsContext } from '../../contexts/SettingsProvider';
import Field from '../Forms/Field';

const UPDATE_SETTINGS = gql`
  mutation ($settingsUpdate: SettingsUpdate!) {
    updateSetting(settingsUpdate: $settingsUpdate) {
      _id
    }
  }
`;

function Defaults() {
  const [updateSetting] = useMutation(UPDATE_SETTINGS);
  const { control, categories, businessUnits, regulatoryBodies, defaultSettings, formValues, errors, reset, refetch } =
    useSettingsContext();

  const businessUnitsOptions = useMemo(() => businessUnits.map(({ _id, name }) => ({ value: _id, label: name })), [businessUnits]);
  const categoriesOptions = useMemo(() => categories.map(({ _id, name }) => ({ value: _id, label: name })), [categories]);
  const regulatoryBodiesOptions = useMemo(() => regulatoryBodies.map(({ _id, name }) => ({ value: _id, label: name })), [regulatoryBodies]);

  const getOptions = (name: string, defaultOptions?: string[]) => {
    switch (name) {
      case 'defaultBusinessUnit':
        return businessUnitsOptions;

      case 'defaultRegulatoryBody':
        return regulatoryBodiesOptions;

      case 'defaultCategory':
        return categoriesOptions;

      default:
        return defaultOptions?.map((option) => ({ value: option, label: option }));
    }
  };

  const updateSettings = async ({ _id, name }) => {
    const updatedValue = formValues[name] || '';
    await updateSetting({
      variables: { settingsUpdate: { _id, name, value: updatedValue } },
    });
    refetch();
  };

  const wasFieldChanged = (inputType, name, initialValue) => {
    const currentValue = formValues[name];
    if (inputType === 'table') return JSON.stringify(currentValue) !== JSON.stringify(initialValue);

    if (inputType === 'dataGrid') return JSON.stringify(currentValue) !== JSON.stringify(initialValue);

    return currentValue !== initialValue;
  };

  const resetValue = ({ name, value }) => {
    reset({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <Stack data-id="030925-1ba53c" h="full" pb={3} spacing={7} w="full">
      {defaultSettings?.map(({ _id, name, label, placeholder, variant, description, inputType, help, value, options }) => (
        <Flex
          align={['flex-start', 'center']}
          data-id="030925-a98d1b"
          flexDirection={['column', 'row']}
          key={name}>
          <Flex data-id="030925-3a3c69" maxW="280px">
            <Field
              control={control}
              data-id="030925-35f0af"
              help={help}
              label={label}
              name={name}
              options={getOptions(name, options)}
              placeholder={placeholder}
              tooltip={description}
              type={inputType}
              validations={{
                notEmpty: true,
              }}
              value={value}
              variant={variant} />
          </Flex>
          {wasFieldChanged(inputType, name, value) && !Object.keys(errors).includes(name) && (
            <HStack data-id="030925-fad694" ml={3} mt={7} spacing={3}>
              <IconButton
                aria-label="Confirm Icon"
                colorScheme="purpleHeart"
                data-id="030925-2d325c"
                icon={<CheckIcon data-id="030925-7db9b7" />}
                onClick={() => updateSettings({ _id, name })}
                size="sm"
                variant="outline" />
              <IconButton
                aria-label="Cross Icon"
                colorScheme="red"
                data-id="030925-eaf784"
                icon={<CloseIcon data-id="030925-c55cb7" />}
                onClick={() => resetValue({ name, value })}
                size="sm" />
            </HStack>
          )}
        </Flex>
      ))}
    </Stack>
  );
}

export default Defaults;
