import React, { useMemo } from 'react';
import {
  Stack,
} from '@chakra-ui/react';

import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import TextInput from '../Forms/TextInput';
import Textarea from '../Forms/Textarea';
import Dropdown from '../Forms/Dropdown';
import Datepicker from '../Forms/Datepicker';
import { complianceItemFrequencies } from '../../hooks/useResponseUtils';
import SectionHeader from './SectionHeader';

const GeneralForm = () => {
  const {
    control,
    categories,
    functionalAreas,
    regulatoryBodies,
  } = useComplianceItemModalContext();

  const categoriesOptions = useMemo(() => categories.map(({ _id, name }) => ({ value: _id, label: name })), [categories]);
  const functionalAreasOptions = useMemo(() => functionalAreas.map(({ _id, name }) => ({ value: _id, label: name })), [functionalAreas]);
  const regulatoryBodiesOptions = useMemo(() => regulatoryBodies.map(({ _id, name }) => ({ value: _id, label: name })), [regulatoryBodies]);
  const frequencyOptions = useMemo(() => complianceItemFrequencies.map(f => ({ value: f, label: f })), []);

  return (
    <Stack w='full' spacing={4} px={[0, 0, 3]} overflow="auto">
      <SectionHeader label="General details" />
      <Stack w='full' spacing={2} pb={3}>
        <TextInput
          control={control}
          name="name"
          label="Name"
          placeholder="Compliance item name"
          variant="secondaryVariant"
          validations={{
            notEmpty: true,
          }}
        />
        <Textarea
          control={control}
          name="description"
          label="Description"
          placeholder="Describe the compliance item"
          variant="secondaryVariant"
          validations={{
            notEmpty: true,
          }}
        />
      </Stack>

      <SectionHeader label="Item attributes" />
      <Stack w='full' spacing={2} pb={3}>
        <Dropdown
          control={control}
          name="categoryId"
          label="Category"
          placeholder="Select category"
          variant="secondaryVariant"
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
          variant="secondaryVariant"
          validations={{
            notEmpty: true,
          }}
          options={regulatoryBodiesOptions}
        />
        <Dropdown
          control={control}
          name="functionalAreaId"
          label="Functional area"
          placeholder="Select functional area"
          variant="secondaryVariant"
          validations={{
            notEmpty: true,
          }}
          options={functionalAreasOptions}
        />
        <Datepicker
          control={control}
          name="dueDate"
          label="Due date (optional)"
          placeholder="Define when the compliance item is due"
          variant="secondaryVariant"
        />
        <Dropdown
          control={control}
          name="frequency"
          label="Frequency"
          placeholder="Define how often it needs to be renewed"
          variant="secondaryVariant"
          validations={{
            notEmpty: true,
          }}
          options={frequencyOptions}
        />
      </Stack>
    </Stack>
  );
};

export default GeneralForm;
