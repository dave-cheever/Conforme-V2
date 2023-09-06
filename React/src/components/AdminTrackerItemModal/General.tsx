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

  return (<>
    {isModalOpen && (
      <AddTrackerItemAttribute
        attributeType={attributeType}
        data-id="f0e7c964ee10"
        isOpenModal={isModalOpen}
        newAttributeValue={newAttributeValue}
        onAction={onAction}
        refetch={refetch} />
    )}
    <Stack data-id="bd4a71571430" overflow="auto" spacing={4} w="full">
      <Box data-id="511640f69eb2" w="calc(100% - 80px)">
        <SectionHeader data-id="829b8178d596" label="General details" />
        <Stack data-id="1d64c56fb379" pb={3} spacing={2} w="full">
          <TextInput
            control={control}
            data-id="8f006683f61c"
            label="Item name"
            name="name"
            placeholder={`${capitalize(t('tracker item'))} name`}
            validations={{
              notEmpty: true,
            }}
            variant="secondaryVariant" />
          <Textarea
            control={control}
            data-id="df77a1d660b4"
            label="Description"
            name="description"
            placeholder={`Describe the ${t('tracker item')}`}
            variant="secondaryVariant" />
        </Stack>

        <SectionHeader data-id="7da665999bdc" label="Item attributes" />
        <Stack data-id="88f35e411ba4" pb={3} spacing={2} w="full">
          <Flex data-id="fd366d4955d6" w="calc(100% + 35px)">
            <Dropdown
              attributeType="Category"
              control={control}
              data-id="8318079042da"
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
          <Flex data-id="90783af7d1f7" w="calc(100% + 35px)">
            <Dropdown
              attributeType="Regulatory body"
              control={control}
              data-id="764f2f781296"
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
            data-id="1a102b1f0c57"
            label="Expires on (optional)"
            name="dueDate"
            placeholder={`Define when the ${t('tracker item')} is due`}
            variant="secondaryVariant" />
          <Dropdown
            control={control}
            data-id="3777086bf83a"
            label="Frequency"
            name="frequency"
            options={frequencyOptions}
            placeholder="Define how often it needs to be renewed"
            validations={{
              notEmpty: true,
            }}
            variant="secondaryVariant" />
          <Stack data-id="fa1b99ab8eef" direction="column" pt={2} spacing={2}>
            <Box
              color="dropdown.labelFont.normal"
              data-id="d411c39c0112"
              fontSize="ssm"
              fontWeight="bold">
              Due date calculation schema
            </Box>
            <Box color="dropdown.labelFont.normal" data-id="8fd66868c4d7" fontSize="ssm">
              Select schema that will be used to calculate next due date after response completion.
            </Box>
            <Box color="dropdown.labelFont.normal" data-id="afc5e794f936" fontSize="ssm">
              Due date will be calculated base on:
            </Box>
            <Stack data-id="22c7382b1176" direction="row" position="relative" spacing={4}>
              <Flex
                color={
                  trackerItem.dueDateCalculation !== 'fromDueDate'
                    ? 'trackerItemModal.toggle.label.active'
                    : 'trackerItemModal.toggle.label.default'
                }
                data-id="29754022bdad"
                fontSize="smm">
                completion date
              </Flex>
              <Switch
                colorScheme="trackerItemModal.toggle.color"
                data-id="85dd4de16b78"
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
                data-id="606e755eb297"
                fontSize="smm">
                due date
              </Flex>
            </Stack>
            {trackerItem.dueDateCalculation === 'fromDueDate' ? (
              <Box color="dropdown.labelFont.normal" data-id="3bdd22e0bddd" fontSize="ssm">
                Example: <br data-id="37c2a1346cbc" />
                Licence was due 31.01.2022 and was completed 10.01.2022. <br data-id="8d06c403ae67" />
                Next due date will be 31.01.2022 + frequency.
              </Box>
            ) : (
              <Box color="dropdown.labelFont.normal" data-id="50e150d9b044" fontSize="ssm">
                Example: <br data-id="a82aec94c549" />
                Review was due 31.01.2022 and was completed 10.01.2022. <br data-id="4c4a960d09eb" />
                Next due date will be 10.01.2022 + frequency.
              </Box>
            )}
          </Stack>
          <Flex align="center" data-id="c462e8546ba6" position="relative" pt={4}>
            <Switch
              colorScheme="toogle.color"
              css={{
                '.chakra-switch__thumb': {
                  '&[data-checked]': {
                    background: '#462AC4',
                  },
                },
              }}
              data-id="21b0904460e4"
              isChecked={!!trackerItem.dueDateEditable}
              onChange={() => setValue('dueDateEditable', !trackerItem.dueDateEditable)} />
            <Flex
              color={trackerItem.dueDateEditable ? 'toogle.enableColor' : 'toogle.disableColor'}
              data-id="f68eb9aa7fda"
              fontSize="14px"
              fontWeight="400"
              ml={3}>
              Allow updating due date in responses
            </Flex>
          </Flex>
        </Stack>
      </Box>
    </Stack>
  </>);
}

export default GeneralForm;
