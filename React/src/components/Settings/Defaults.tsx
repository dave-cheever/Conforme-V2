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

const Defaults = () => {
  const [updateSetting] = useMutation(UPDATE_SETTINGS);
  const {
    control,
    categories,
    businessUnits,
    regulatoryBodies,
    defaultSettings,
    formValues,
    reset,
    refetch,
  } = useSettingsContext();

  const businessUnitsOptions = useMemo(
    () => businessUnits.map(({ _id, name }) => ({ value: _id, label: name })),
    [businessUnits],
  );
  const categoriesOptions = useMemo(
    () => categories.map(({ _id, name }) => ({ value: _id, label: name })),
    [categories],
  );
  const regulatoryBodiesOptions = useMemo(
    () =>
      regulatoryBodies.map(({ _id, name }) => ({ value: _id, label: name })),
    [regulatoryBodies],
  );

  const options = (name) => {
    switch (name) {
      case 'defaultBusinessUnit':
        return businessUnitsOptions;

      case 'defaultRegulatoryBody':
        return regulatoryBodiesOptions;

      case 'defaultCategory':
        return categoriesOptions;

      default:
        break;
    }
  };

  const updateSettings = async ({ _id, name }) => {
    const updatedValue = formValues[name] || '';
    await updateSetting({
      variables: { settingsUpdate: { _id, name, value: updatedValue } },
    });
    await refetch();
    reset({
      ...formValues,
      [name]: updatedValue,
    });
  };

  const wasFieldChanged = (inputType, name, initialValue) => {
    const currentValue = formValues[name];
    if (inputType === 'table')
      return JSON.stringify(currentValue) !== JSON.stringify(initialValue);

    if (inputType === 'dataGrid')
      return JSON.stringify(currentValue) !== JSON.stringify(initialValue);

    return currentValue !== initialValue;
  };

  const resetValue = ({ name, value }) => {
    reset({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <Stack h="full" pb={3} spacing={7} w="full">
      {defaultSettings?.map(
        ({
          _id,
          name,
          label,
          placeholder,
          variant,
          description,
          inputType,
          help,
          value,
        }) => (
          <Flex
            align={['flex-start', 'center']}
            flexDirection={['column', 'row']}
            key={name}
          >
            <Flex maxW="280px">
              <Field
                control={control}
                help={help}
                label={label}
                name={name}
                options={options(name)}
                placeholder={placeholder}
                tooltip={description}
                type={inputType}
                value={value}
                variant={variant}
              />
            </Flex>
            {wasFieldChanged(inputType, name, value) && (
              <HStack ml={3} mt={7} spacing={3}>
                <IconButton
                  aria-label="Confirm Icon"
                  colorScheme="purpleHeart"
                  icon={<CheckIcon />}
                  onClick={() => updateSettings({ _id, name })}
                  size="sm"
                  variant="outline"
                />
                <IconButton
                  aria-label="Cross Icon"
                  colorScheme="red"
                  icon={<CloseIcon />}
                  onClick={() => resetValue({ name, value })}
                  size="sm"
                />
              </HStack>
            )}
          </Flex>
        ),
      )}
    </Stack>
  );
};

export default Defaults;
