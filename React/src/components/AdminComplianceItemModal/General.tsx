import React, { useMemo, useState } from 'react';

import { Box, Flex, Stack, Switch } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import { complianceItemFrequencies } from '../../hooks/useResponseUtils';
import { PlusIcon } from '../../icons';
import { Datepicker, Dropdown, Textarea, TextInput } from '../Forms';
import AddComplianceItemAttribute from './AddComplianceItemAttribute';
import SectionHeader from './SectionHeader';

const GeneralForm = () => {
  const { complianceItem, control, categories, regulatoryBodies, setValue, refetch } = useComplianceItemModalContext();

  const categoriesOptions = useMemo(() => categories.map(({ _id, name }) => ({ value: _id, label: name })), [categories]);
  const regulatoryBodiesOptions = useMemo(() => regulatoryBodies.map(({ _id, name }) => ({ value: _id, label: name })), [regulatoryBodies]);
  const frequencyOptions = useMemo(() => complianceItemFrequencies.map((f) => ({ value: f, label: f })), []);
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
        <AddComplianceItemAttribute
          attributeType={attributeType}
          isOpenModal={isModalOpen}
          newAttributeValue={newAttributeValue}
          onAction={onAction}
          refetch={refetch}
        />
      )}
      <Stack overflow="auto" spacing={4} w="full">
        <Box w="calc(100% - 80px)">
          <SectionHeader label="General details" />
          <Stack pb={3} spacing={2} w="full">
            <TextInput
              control={control}
              label="Item name"
              name="name"
              placeholder={`${capitalize(t('complianceItem'))} name`}
              validations={{
                notEmpty: true,
              }}
              variant="secondaryVariant"
            />
            <Textarea
              control={control}
              label="Description"
              name="description"
              placeholder={`Describe the ${t('complianceItem')}`}
              variant="secondaryVariant"
            />
          </Stack>

          <SectionHeader label="Item attributes" />
          <Stack pb={3} spacing={2} w="full">
            <Flex w="calc(100% + 35px)">
              <Dropdown
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
                variant="secondaryVariant"
              />
            </Flex>
            <Flex w="calc(100% + 35px)">
              <Dropdown
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
                variant="secondaryVariant"
              />
            </Flex>
            <Datepicker
              control={control}
              label="Expires on (optional)"
              name="dueDate"
              placeholder={`Define when the ${t('complianceItem')} is due`}
              variant="secondaryVariant"
            />
            <Dropdown
              control={control}
              label="Frequencye"
              name="frequency"
              options={frequencyOptions}
              placeholder="Define how often it needs to be renewed"
              validations={{
                notEmpty: true,
              }}
              variant="secondaryVariant"
            />
            <Stack direction="column" pt={2} spacing={2}>
              <Box color="dropdown.labelFont.normal" fontSize="ssm" fontWeight="bold">
                Due date calculation schema
              </Box>
              <Box color="dropdown.labelFont.normal" fontSize="ssm">
                Select schema that will be used to calculate next due date after response completion.
              </Box>
              <Box color="dropdown.labelFont.normal" fontSize="ssm">
                Due date will be calculated base on:
              </Box>
              <Stack direction="row" spacing={4}>
                <Flex
                  color={
                    complianceItem.dueDateCalculation !== 'fromDueDate'
                      ? 'complianceItemModal.toggle.label.active'
                      : 'complianceItemModal.toggle.label.default'
                  }
                  fontSize="smm"
                >
                  completion date
                </Flex>
                <Switch
                  colorScheme="complianceItemModal.toggle.color"
                  isChecked={complianceItem.dueDateCalculation === 'fromDueDate'}
                  onChange={() =>
                    setValue(
                      'dueDateCalculation',
                      complianceItem.dueDateCalculation === 'fromDueDate' ? 'fromCompletionDate' : 'fromDueDate',
                    )
                  }
                />
                <Flex
                  color={
                    complianceItem.dueDateCalculation === 'fromDueDate'
                      ? 'complianceItemModal.toggle.label.active'
                      : 'complianceItemModal.toggle.label.default'
                  }
                  fontSize="smm"
                >
                  due date
                </Flex>
              </Stack>
              {complianceItem.dueDateCalculation === 'fromDueDate' ? (
                <Box color="dropdown.labelFont.normal" fontSize="ssm">
                  Example: <br />
                  Licence was due 31.01.2022 and was completed 10.01.2022. <br />
                  Next due date will be 31.01.2022 + frequency.
                </Box>
              ) : (
                <Box color="dropdown.labelFont.normal" fontSize="ssm">
                  Example: <br />
                  Review was due 31.01.2022 and was completed 10.01.2022. <br />
                  Next due date will be 10.01.2022 + frequency.
                </Box>
              )}
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default GeneralForm;
