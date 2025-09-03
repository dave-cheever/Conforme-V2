import React, { useMemo } from 'react';

import { Stack, Text } from '@chakra-ui/react';
import { t } from 'i18next';

import { useTrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import { trackerItemFrequencies } from '../../hooks/useResponseUtils';
import Datepicker from '../Forms/Datepicker';
import Dropdown from '../Forms/Dropdown';

function DetailsForm() {
  const { control, categories, regulatoryBodies } = useTrackerItemModalContext();

  const categoriesOptions = useMemo(() => categories.map(({ _id, name }) => ({ value: _id, label: name })), [categories]);
  const regulatoryBodiesOptions = useMemo(() => regulatoryBodies.map(({ _id, name }) => ({ value: _id, label: name })), [regulatoryBodies]);
  const frequencyOptions = useMemo(() => trackerItemFrequencies.map((f) => ({ value: f, label: f })), []);

  return (
    <Stack data-id="030925-3efe14" px={[0, 0, 3]} spacing={4} w="full">
      <Text
        data-id="030925-62069f"
        color="adminTrackerItemModal.section.details.description"
        fontSize="14px"
        opacity="0.7">
        Please make sure that all {t('tracker item')} details are completed/accurate.
      </Text>
      <Stack data-id="030925-86a56a" overflow="auto" pb={3} spacing={2} w="full">
        <Dropdown
          data-id="030925-081f2c"
          control={control}
          label="Category"
          name="categoryId"
          options={categoriesOptions}
          placeholder="Select category"
          validations={{
            notEmpty: true,
          }} />
        <Dropdown
          data-id="030925-548ce4"
          control={control}
          label="Regulatory body"
          name="regulatoryBodyId"
          options={regulatoryBodiesOptions}
          placeholder="Select regulatory body"
          validations={{
            notEmpty: true,
          }} />
        <Datepicker
          data-id="030925-d5b190"
          control={control}
          label="Expires on (optional)"
          name="dueDate"
          placeholder={`Define when the ${t('tracker item')} is due`} />
        <Dropdown
          data-id="030925-ed102e"
          control={control}
          label="Frequency"
          name="frequency"
          options={frequencyOptions}
          placeholder="Define how often it needs to be renewed"
          validations={{
            notEmpty: true,
          }} />
      </Stack>
    </Stack>
  );
}

export default DetailsForm;
