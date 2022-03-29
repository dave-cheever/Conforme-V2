import React, { useMemo } from 'react';

import { Stack, Text } from '@chakra-ui/react';

import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import { complianceItemFrequencies } from '../../hooks/useResponseUtils';
import Datepicker from '../Forms/Datepicker';
import Dropdown from '../Forms/Dropdown';

const DetailsForm = () => {
  const { control, categories, regulatoryBodies } =
    useComplianceItemModalContext();

  const categoriesOptions = useMemo(
    () => categories.map(({ _id, name }) => ({ value: _id, label: name })),
    [categories],
  );
  const regulatoryBodiesOptions = useMemo(
    () =>
      regulatoryBodies.map(({ _id, name }) => ({ value: _id, label: name })),
    [regulatoryBodies],
  );
  const frequencyOptions = useMemo(
    () => complianceItemFrequencies.map((f) => ({ value: f, label: f })),
    [],
  );

  return (
    <Stack px={[0, 0, 3]} spacing={4} w="full">
      <Text
        color="adminComplianceItemModal.section.details.description"
        fontSize="14px"
        opacity="0.7"
      >
        Please make sure that all compliance item details are
        completed/accurate.
      </Text>
      <Stack overflow="auto" pb={3} spacing={2} w="full">
        <Dropdown
          control={control}
          label="Category"
          name="categoryId"
          options={categoriesOptions}
          placeholder="Select category"
          validations={{
            notEmpty: true,
          }}
        />
        <Dropdown
          control={control}
          label="Regulatory body"
          name="regulatoryBodyId"
          options={regulatoryBodiesOptions}
          placeholder="Select regulatory body"
          validations={{
            notEmpty: true,
          }}
        />
        <Datepicker
          control={control}
          label="Expires on (optional)"
          name="dueDate"
          placeholder="Define when the compliance item is due"
        />
        <Dropdown
          control={control}
          label="Frequency"
          name="frequency"
          options={frequencyOptions}
          placeholder="Define how often it needs to be renewed"
          validations={{
            notEmpty: true,
          }}
        />
      </Stack>
    </Stack>
  );
};

export default DetailsForm;
