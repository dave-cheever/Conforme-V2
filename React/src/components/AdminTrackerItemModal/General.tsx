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
          attributeType={attributeType}
          data-id="000518"
          isOpenModal={isModalOpen}
          newAttributeValue={newAttributeValue}
          onAction={onAction}
          refetch={refetch} />
      )}
      <Stack data-id="000519" overflow="auto" spacing={4} w="full">
        <Box data-id="000520" w={['100%', 'calc(100% - 80px)']}>   
          <SectionHeader data-id="000521" label="General details" />
          <Stack data-id="000522" pb={3} spacing={2} w="full">
            <TextInput
              control={control}
              data-id="000523"
              label="Item name"
              name="name"
              placeholder={`${capitalize(t('tracker item'))} name`}
              validations={{
                notEmpty: true,
              }}
              variant="secondaryVariant" />
            <Textarea
              control={control}
              data-id="000524"
              label="Description"
              name="description"
              placeholder={`Describe the ${t('tracker item')}`}
              variant="secondaryVariant" />
          </Stack>

          <SectionHeader data-id="000525" label="Item attributes" />
          <Stack data-id="000526" pb={3} spacing={2} w="full">
            <Flex data-id="000527" w="calc(100% + 35px)">
              <Dropdown
                attributeType="Category"
                control={control}
                data-id="000528"
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
            <Flex data-id="000529" w="calc(100% + 35px)">
              <Dropdown
                attributeType="Regulatory body"
                control={control}
                data-id="000530"
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
              control={control}
              data-id="000531"
              label="Expires on (optional)"
              name="dueDate"
              placeholder={`Define when the ${t('tracker item')} is due`}
              variant="secondaryVariant" />
            <Dropdown
              control={control}
              data-id="000532"
              label="Frequency"
              name="frequency"
              options={frequencyOptions}
              placeholder="Define how often it needs to be renewed"
              validations={{
                notEmpty: true,
              }}
              variant="secondaryVariant" />
            <Stack data-id="000533" direction="column" pt={2} spacing={2}>
              <Box
                color="dropdown.labelFont.normal"
                data-id="000534"
                fontSize="ssm"
                fontWeight="bold">
                Due date calculation schema
              </Box>
              <Box color="dropdown.labelFont.normal" data-id="000535" fontSize="ssm">
                Select schema that will be used to calculate next due date after response completion.
              </Box>
              <Box color="dropdown.labelFont.normal" data-id="000536" fontSize="ssm">
                Due date will be calculated base on:
              </Box>
              <Stack data-id="000537" direction="row" position="relative" spacing={4}>
                <Flex
                  color={
                    trackerItem.dueDateCalculation !== 'fromDueDate'
                      ? 'trackerItemModal.toggle.label.active'
                      : 'trackerItemModal.toggle.label.default'
                  }
                  data-id="000538"
                  fontSize="smm">
                  completion date
                </Flex>
                <Switch
                  colorScheme="trackerItemModal.toggle.color"
                  data-id="000539"
                  isChecked={trackerItem.dueDateCalculation === 'fromDueDate'}
                  onChange={() =>
                    setValue('dueDateCalculation', trackerItem.dueDateCalculation === 'fromDueDate' ? 'fromCompletionDate' : 'fromDueDate')
                  } />
                <Flex
                  color={
                    trackerItem.dueDateCalculation === 'fromDueDate'
                      ? 'trackerItemModal.toggle.label.active'
                      : 'trackerItemModal.toggle.label.default'
                  }
                  data-id="000540"
                  fontSize="smm">
                  due date
                </Flex>
              </Stack>
              {trackerItem.dueDateCalculation === 'fromDueDate' ? (
                <Box color="dropdown.labelFont.normal" data-id="000541" fontSize="ssm">
                  Example: <br data-id="000542" />
                  Licence was due 31.01.2022 and was completed 10.01.2022. <br data-id="000543" />
                  Next due date will be 31.01.2022 + frequency.
                </Box>
              ) : (
                <Box color="dropdown.labelFont.normal" data-id="000544" fontSize="ssm">
                  Example: <br data-id="000545" />
                  Review was due 31.01.2022 and was completed 10.01.2022. <br data-id="000546" />
                  Next due date will be 10.01.2022 + frequency.
                </Box>
              )}
            </Stack>
            <Flex align="center" data-id="000547" position="relative" pt={4}>
              <Switch
                colorScheme="toogle.color"
                css={{
                  '.chakra-switch__thumb': {
                    '&[data-checked]': {
                      background: '#462AC4',
                    },
                  },
                }}
                data-id="000548"
                isChecked={!!trackerItem.dueDateEditable}
                onChange={() => setValue('dueDateEditable', !trackerItem.dueDateEditable)} />
              <Flex
                color={trackerItem.dueDateEditable ? 'toogle.enableColor' : 'toogle.disableColor'}
                data-id="000549"
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
