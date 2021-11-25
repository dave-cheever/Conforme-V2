import { Stack } from '@chakra-ui/react';

import { useSettingsContext } from '../../contexts/SettingsProvider';
import Switch from '../Forms/Switch';

const Notification = () => {
  const { control } = useSettingsContext();
    
  return (
    <Stack w='full' spacing={7} h="full" pb={3} maxW="280px">
        <Switch
          control={control}
          name="newItemAdded"
          label="New item added"
          variant="secondaryVariant"
          tooltip="Sends an email everytime a new matter has been added to the platform"
        />
        <Switch
          control={control}
          name="actionOverDue"
          label="Action overdue"
          variant="secondaryVariant"
          tooltip="Sends an email everytime an action you're assigned on is overdue"
        />
        <Switch
          control={control}
          name="actionChanges"
          label="Action changes"
          variant="secondaryVariant"
          tooltip="Sends an email everytime an action has been updated"
        />
    </Stack>
  )
}

export default Notification
