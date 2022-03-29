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

const Notification = () => {
  const { control, notificationSettings, formValues, reset, refetch } =
    useSettingsContext();
  const [updateSetting] = useMutation(UPDATE_SETTINGS);

  const wasFieldChanged = (name, initialValue) => {
    const currentValue = formValues[name];
    return currentValue !== initialValue;
  };

  const updateSettings = async ({ _id, name }) => {
    const updatedValue = formValues[name];
    await updateSetting({
      variables: { settingsUpdate: { _id, name, value: updatedValue } },
    });
    await refetch();
    reset({
      ...formValues,
      [name]: updatedValue,
    });
  };

  const resetValue = ({ name, value }) => {
    reset({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <Stack h="full" overflow="auto" pb={3} spacing={7} w="full">
      {notificationSettings?.map(
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
          options,
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
                options={options}
                placeholder={placeholder}
                tooltip={description}
                type={inputType}
                value={value}
                variant={variant}
              />
            </Flex>
            {wasFieldChanged(name, value) && (
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

export default Notification;
