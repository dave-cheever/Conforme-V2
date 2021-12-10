import { Flex, HStack, IconButton, Stack } from '@chakra-ui/react';
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

const Notification = () => {
  const { control, notificationSettings, dirtyFields, formValues, reset } = useSettingsContext();
  const [updateSetting] = useMutation(UPDATE_SETTINGS);
    
  const isModified = (name) => {
    return dirtyFields[name] || false;
  };

  const updateSettings = async({_id, name}) => {
    const updatedValue = formValues[name];
    await updateSetting({ variables: { settingsUpdate: { _id, name, value: updatedValue } } });
    reset(formValues);
  }

  const resetValue = ({name, value}) => {
    reset({
      ...formValues,
      [name]: value
    });
  }

  return (
    <Stack w='full' spacing={7} h="full" overflow="auto" pb={3}>
        {notificationSettings?.map(({_id, name,label, placeholder, variant, description, inputType, help, value, options  }) => 
        <Flex align='center' key={name}>
          <Flex maxW="280px"><Field
          control={control}
          name={name}
          type={inputType}
          label={label}
          placeholder={placeholder}
          variant={variant}
          help={help}
          tooltip={description}
          value={value}
          options={options}
        />
        </Flex>
        {isModified(name) && <HStack ml={3} spacing={3} mt={7}>
        <IconButton
          colorScheme="purpleHeart"
          variant='outline'
          aria-label='Confirm Icon'
          size="sm"
          icon={<CheckIcon />}
          onClick={() => updateSettings({_id, name})}
        />
        <IconButton
          colorScheme="red"
          aria-label='Cross Icon'
          size="sm"
          icon={<CloseIcon />}
          onClick={() => resetValue({name, value})}
        />
        </HStack>}
        </Flex>)}
    </Stack>
  )
}

export default Notification
