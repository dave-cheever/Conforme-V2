import React, { useMemo, useState } from 'react';

import { Box, Flex, Stack } from '@chakra-ui/react';

import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import { complianceItemFrequencies } from '../../hooks/useResponseUtils';
import { PlusIcon } from '../../icons';
import Datepicker from '../Forms/Datepicker';
import Dropdown from '../Forms/Dropdown';
import Textarea from '../Forms/Textarea';
import TextInput from '../Forms/TextInput';
import AddComplianceItemAttribute from './AddComplianceItemAttribute';
import SectionHeader from './SectionHeader';

const GeneralForm = () => {
  const { control, categories, regulatoryBodies, setValue, refetch } =
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [attributeType, setAttributeType] = useState<
    'Category' | 'Regulatory body' | undefined
  >();

  const onAddAttribute = (type: 'Category' | 'Regulatory body' | undefined) => {
    setIsModalOpen(true);
    setAttributeType(type);
  };

  const onAction = () => {
    setIsModalOpen(false);
    setAttributeType(undefined);
  };

  const newAttributeValue = ({
    value,
    type,
  }: {
    value: string;
    type: 'category' | 'regulatoryBody';
  }) => {
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
              placeholder="Compliance item name"
              validations={{
                notEmpty: true,
              }}
              variant="secondaryVariant"
            />
            <Textarea
              control={control}
              label="Description"
              name="description"
              placeholder="Describe the compliance item"
              validations={{
                notEmpty: true,
              }}
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
              placeholder="Define when the compliance item is due"
              variant="secondaryVariant"
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
              variant="secondaryVariant"
            />
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default GeneralForm;
