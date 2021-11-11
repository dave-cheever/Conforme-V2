import React from 'react';
import {
  Stack,
  Text,
} from '@chakra-ui/react';

import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import TextInput from '../Forms/TextInput';
import Textarea from '../Forms/Textarea';

const GeneralForm = () => {
  const { control } = useComplianceItemModalContext();

  return (
    <Stack w='full' spacing={4} px={[0, 0, 3]}>
      <Text fontSize='14px' color='adminComplianceItemModal.section.general.description' opacity='0.7'>Please provide general information about the compliance item.</Text>
      <Stack w='full' spacing={2} pb={3} overflow='auto'>
        <TextInput
          control={control}
          name="name"
          label="Name"
          placeholder="Compliance item name"
          validations={{
            notEmpty: true,
          }}
        />
        <Textarea
          control={control}
          name="description"
          label="Description"
          placeholder="Describe the compliance item"
          validations={{
            notEmpty: true,
          }}
        />
      </Stack>
    </Stack>
  );
};

export default GeneralForm;
