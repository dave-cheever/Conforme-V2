import React, { useMemo } from 'react';

import { Stack, Text } from '@chakra-ui/react';
import { t } from 'i18next';

import { useTrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import { trackerItemFrequencies } from '../../hooks/useResponseUtils';
import Datepicker from '../Forms/Datepicker';
import Dropdown from '../Forms/Dropdown';

const DetailsForm = () => {
  const { control, categories, regulatoryBodies } = useTrackerItemModalContext();

  const categoriesOptions = useMemo(() => categories.map(({ _id, name }) => ({ value: _id, label: name })), [categories]);
  const regulatoryBodiesOptions = useMemo(() => regulatoryBodies.map(({ _id, name }) => ({ value: _id, label: name })), [regulatoryBodies]);
  const frequencyOptions = useMemo(() => trackerItemFrequencies.map((f) => ({ value: f, label: f })), []);

  return (
    (<Stack data-id="65772a197273" px={[0, 0, 3]} spacing={4} w="full">
      <Text
        color="adminTrackerItemModal.section.details.description"
        data-id="248dcb976ce6"
        fontSize="14px"
        opacity="0.7">
        Please make sure that all {t('tracker item')} details are completed/accurate.
      </Text>
      <Stack data-id="d50ce7bb650b" overflow="auto" pb={3} spacing={2} w="full">
        <Dropdown
          control={control}
          data-id="a44db0e6a4e8"
          label="Category"
          name="categoryId"
          options={categoriesOptions}
          placeholder="Select category"
          validations={{
            notEmpty: true,
          }} />
        <Dropdown
          control={control}
          data-id="c572688396b4"
          label="Regulatory body"
          name="regulatoryBodyId"
          options={regulatoryBodiesOptions}
          placeholder="Select regulatory body"
          validations={{
            notEmpty: true,
          }} />
        <Datepicker
          control={control}
          data-id="2e3662471d71"
          label="Expires on (optional)"
          name="dueDate"
          placeholder={`Define when the ${t('tracker item')} is due`} />
        <Dropdown
          control={control}
          data-id="66302897c99e"
          label="Frequency"
          name="frequency"
          options={frequencyOptions}
          placeholder="Define how often it needs to be renewed"
          validations={{
            notEmpty: true,
          }} />
      </Stack>
    </Stack>)
  );
};

export default DetailsForm;
