import React, { useMemo } from 'react';
import {
  Stack,
  Text,
} from '@chakra-ui/react';

import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import Dropdown from '../Forms/Dropdown';
import Datepicker from '../Forms/Datepicker';
import { complianceItemFrequencies } from '../../hooks/useResponseUtils';

const DetailsForm = () => {
  const {
    control,
    categories,
    regulatoryBodies,
  } = useComplianceItemModalContext();

  const categoriesOptions = useMemo(() => categories.map(({ _id, name }) => ({ value: _id, label: name })), [categories]);
  const regulatoryBodiesOptions = useMemo(() => regulatoryBodies.map(({ _id, name }) => ({ value: _id, label: name })), [regulatoryBodies]);
  const frequencyOptions = useMemo(() => complianceItemFrequencies.map(f => ({ value: f, label: f })), []);

  return (
    <Stack w='full' spacing={4} px={[0, 0, 3]}>
      <Text fontSize='14px' color='adminComplianceItemModal.section.details.description' opacity='0.7'>Please make sure that all compliance item details are completed/accurate.</Text>
      <Stack w='full' spacing={2} pb={3} overflow='auto'>
        <Dropdown
          control={control}
          name="categoryId"
          label="Category"
          placeholder="Select category"
          validations={{
            notEmpty: true,
          }}
          options={categoriesOptions}
        />
        <Dropdown
          control={control}
          name="regulatoryBodyId"
          label="Regulatory body"
          placeholder="Select regulatory body"
          validations={{
            notEmpty: true,
          }}
          options={regulatoryBodiesOptions}
        />
        <Datepicker
          control={control}
          name="dueDate"
          label="Expires on (optional)"
          placeholder="Define when the compliance item is due"
        />
        <Dropdown
          control={control}
          name="frequency"
          label="Frequency"
          placeholder="Define how often it needs to be renewed"
          validations={{
            notEmpty: true,
          }}
          options={frequencyOptions}
        />
      </Stack>
    </Stack>
  );
};

export default DetailsForm;
