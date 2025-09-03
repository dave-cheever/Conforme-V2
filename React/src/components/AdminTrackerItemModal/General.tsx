import React, { useMemo, useState } from 'react';

import { Box, Flex, Stack, Switch } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import { useTrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import { trackerItemFrequencies } from '../../hooks/useResponseUtils';
import { PlusIcon } from '../../icons';
import { Datepicker, Dropdown, Textarea, TextInput } from '../Forms';
import AddTrackerItemAttribute from './AddTrackerItemAttribute';
import SectionHeader from './SectionHeader';

function GeneralForm() {
  const { trackerItem, control, categories, regulatoryBodies, setValue, refetch } = useTrackerItemModalContext();

  const categoriesOptions = useMemo(() => categories.map(({ _id, name }) => ({ value: _id, label: name })), [categories]);
  const regulatoryBodiesOptions = useMemo(() => regulatoryBodies.map(({ _id, name }) => ({ value: _id, label: name })), [regulatoryBodies]);
  const frequencyOptions = useMemo(() => trackerItemFrequencies.map((f) => ({ value: f, label: f })), []);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [attributeType, setAttributeType] = useState<'Category' | 'Regulatory body' | undefined>();

  const onAddAttribute = (type: 'Category' | 'Regulatory body' | undefined) => {
    setIsModalOpen(true);
    setAttributeType(type);
  };

  const onAction = () => {
    setIsModalOpen(false);
    setAttributeType(undefined);
  };

  const newAttributeValue = ({ value, type }: { value: string; type: 'category' | 'regulatoryBody' }) => {
    switch (type) {
      case 'category':
        setValue('categoryId', value);
        break;
      case 'regulatoryBody':
        setValue('regulatoryBodyId', value);
        break;
      default:
        break;
    }
  };

  return (
    <>
      {isModalOpen && (
        <AddTrackerItemAttribute
          data-id="030925-fe7ff3"
          attributeType={attributeType}
          isOpenModal={isModalOpen}
          newAttributeValue={newAttributeValue}
          onAction={onAction}
          refetch={refetch} />
      )}
      <Stack data-id="030925-634f6a" overflow="auto" spacing={4} w="full">
        <Box data-id="030925-f7dade" w={['100%', 'calc(100% - 80px)']}>   
          <SectionHeader data-id="030925-d5424c" label="General details" />
          <Stack data-id="030925-03bcc3" pb={3} spacing={2} w="full">
            <TextInput
              data-id="030925-d31cc2"
              control={control}
              label="Item name"
              name="name"
              placeholder={`${capitalize(t('tracker item'))} name`}
              validations={{
                notEmpty: true,
              }}
              variant="secondaryVariant" />
            <Textarea
              data-id="030925-deb603"
              control={control}
              label="Description"
              name="description"
              placeholder={`Describe the ${t('tracker item')}`}
              variant="secondaryVariant" />
          </Stack>

          <SectionHeader data-id="030925-8b9c73" label="Item attributes" />
          <Stack data-id="030925-36edc3" pb={3} spacing={2} w="full">
            <Flex data-id="030925-cac76a" w="calc(100% + 35px)">
              <Dropdown
                data-id="030925-f34d8c"
                attributeType="Category"
                control={control}
                Icon={PlusIcon}
                label="Category"
                name="categoryId"
                onAction={onAddAttribute}
                options={categoriesOptions}
                placeholder="Select category"
                stroke="dropdown.icon"
                validations={{
                  notEmpty: true,
                }}
                variant="secondaryVariant" />
            </Flex>
            <Flex data-id="030925-b8a812" w="calc(100% + 35px)">
              <Dropdown
                data-id="030925-8fa08e"
                attributeType="Regulatory body"
                control={control}
                Icon={PlusIcon}
                label="Regulatory body"
                name="regulatoryBodyId"
                onAction={onAddAttribute}
                options={regulatoryBodiesOptions}
                placeholder="Select regulatory body"
                stroke="dropdown.icon"
                validations={{
                  notEmpty: true,
                }}
                variant="secondaryVariant" />
            </Flex>
            <Datepicker
              data-id="030925-a5e651"
              control={control}
              label="Expires on (optional)"
              name="dueDate"
              placeholder={`Define when the ${t('tracker item')} is due`}
              variant="secondaryVariant" />
            <Dropdown
              data-id="030925-8a5cb7"
              control={control}
              label="Frequency"
              name="frequency"
              options={frequencyOptions}
              placeholder="Define how often it needs to be renewed"
              validations={{
                notEmpty: true,
              }}
              variant="secondaryVariant" />
            <Stack data-id="030925-8782b6" direction="column" pt={2} spacing={2}>
              <Box
                data-id="030925-74ca41"
                color="dropdown.labelFont.normal"
                fontSize="ssm"
                fontWeight="bold">
                Due date calculation schema
              </Box>
              <Box data-id="030925-13d1fc" color="dropdown.labelFont.normal" fontSize="ssm">
                Select schema that will be used to calculate next due date after response completion.
              </Box>
              <Box data-id="030925-acf14d" color="dropdown.labelFont.normal" fontSize="ssm">
                Due date will be calculated base on:
              </Box>
              <Stack data-id="030925-5b990e" direction="row" position="relative" spacing={4}>
                <Flex
                  data-id="030925-5f221f"
                  color={
                    trackerItem.dueDateCalculation !== 'fromDueDate'
                      ? 'trackerItemModal.toggle.label.active'
                      : 'trackerItemModal.toggle.label.default'
                  }
                  fontSize="smm">
                  completion date
                </Flex>
                <Switch
                  data-id="030925-be5675"
                  colorScheme="trackerItemModal.toggle.color"
                  isChecked={trackerItem.dueDateCalculation === 'fromDueDate'}
                  onChange={() =>
                    setValue('dueDateCalculation', trackerItem.dueDateCalculation === 'fromDueDate' ? 'fromCompletionDate' : 'fromDueDate')
                  } />
                <Flex
                  data-id="030925-94ec40"
                  color={
                    trackerItem.dueDateCalculation === 'fromDueDate'
                      ? 'trackerItemModal.toggle.label.active'
                      : 'trackerItemModal.toggle.label.default'
                  }
                  fontSize="smm">
                  due date
                </Flex>
              </Stack>
              {trackerItem.dueDateCalculation === 'fromDueDate' ? (
                <Box data-id="030925-cdb1f1" color="dropdown.labelFont.normal" fontSize="ssm">
                  Example: <br data-id="030925-c67ec6" />
                  Licence was due 31.01.2022 and was completed 10.01.2022. <br data-id="030925-922c1d" />
                  Next due date will be 31.01.2022 + frequency.
                </Box>
              ) : (
                <Box data-id="030925-41b6fa" color="dropdown.labelFont.normal" fontSize="ssm">
                  Example: <br data-id="030925-084eb8" />
                  Review was due 31.01.2022 and was completed 10.01.2022. <br data-id="030925-ea660b" />
                  Next due date will be 10.01.2022 + frequency.
                </Box>
              )}
            </Stack>
            <Flex data-id="030925-6e0470" align="center" position="relative" pt={4}>
              <Switch
                data-id="030925-85e39a"
                colorScheme="toogle.color"
                css={{
                  '.chakra-switch__thumb': {
                    '&[data-checked]': {
                      background: '#462AC4',
                    },
                  },
                }}
                isChecked={!!trackerItem.dueDateEditable}
                onChange={() => setValue('dueDateEditable', !trackerItem.dueDateEditable)} />
              <Flex
                data-id="030925-c66534"
                color={trackerItem.dueDateEditable ? 'toogle.enableColor' : 'toogle.disableColor'}
                fontSize="14px"
                fontWeight="400"
                ml={3}>
                Allow updating due date in responses
              </Flex>
            </Flex>
          </Stack>
        </Box>
      </Stack>
    </>
  );
}

export default GeneralForm;
