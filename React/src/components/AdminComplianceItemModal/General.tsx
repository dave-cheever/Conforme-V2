import React, { useMemo, useState } from 'react';
import {
  Stack,
  Box,
  Flex
} from '@chakra-ui/react';

import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import TextInput from '../Forms/TextInput';
import Textarea from '../Forms/Textarea';
import Dropdown from '../Forms/Dropdown';
import Datepicker from '../Forms/Datepicker';
import { complianceItemFrequencies } from '../../hooks/useResponseUtils';
import SectionHeader from './SectionHeader';
import { PlusIcon } from '../../icons';
import AddComplianceItemAttribute from './AddComplianceItemAttribute';

const GeneralForm = () => {
  const {
    control,
    categories,
    regulatoryBodies,
    setValue,
    refetch
  } = useComplianceItemModalContext();

  const categoriesOptions = useMemo(() => categories.map(({ _id, name }) => ({ value: _id, label: name })), [categories]);
  const regulatoryBodiesOptions = useMemo(() => regulatoryBodies.map(({ _id, name }) => ({ value: _id, label: name })), [regulatoryBodies]);
  const frequencyOptions = useMemo(() => complianceItemFrequencies.map(f => ({ value: f, label: f })), []);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [attributeType, setAttributeType] = useState<"Category" | "Regulatory body" | undefined>()

  const onAddAttribute = (type: "Category" | "Regulatory body" | undefined) => {
    setIsModalOpen(true)
    setAttributeType(type)
  }

  const onAction = (action: 'close') => {
    setIsModalOpen(false)
    setAttributeType(undefined)
  }

  const newAttributeValue = ({ value, type }: {value: string, type: "category" | "regulatoryBody" }) => {
    switch (type) {
      case "category":
        setValue("categoryId",value)
        break;
      case "regulatoryBody":
        setValue("regulatoryBodyId",value)
        break;
    }
  }

  return (
    <>
      {isModalOpen &&
        <AddComplianceItemAttribute
          attributeType={attributeType}
          newAttributeValue={newAttributeValue}
          isOpenModal={isModalOpen}
          onAction={onAction}
          refetch={refetch}
        />}
      <Stack w='full' spacing={4} px={[0, 0, 3]} overflow="auto">
        <Box w="calc(100% - 80px)">
          <SectionHeader label="General details" />
          <Stack w='full' spacing={2} pb={3}>
            <TextInput
              control={control}
              name="name"
              label="Item name"
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
            <Flex w="calc(100% + 35px)">
              <Dropdown
                control={control}
                name="categoryId"
                label="Category"
                placeholder="Select category"
                variant="secondaryVariant"
                stroke="dropdown.icon"
                validations={{
                  notEmpty: true,
                }}
                options={categoriesOptions}
                Icon={PlusIcon}
                attributeType="Category"
                onAction={onAddAttribute}
              />
            </Flex>
            <Flex w="calc(100% + 35px)">
              <Dropdown
                control={control}
                name="regulatoryBodyId"
                label="Regulatory body"
                placeholder="Select regulatory body"
                variant="secondaryVariant"
                stroke="dropdown.icon"
                validations={{
                  notEmpty: true,
                }}
                options={regulatoryBodiesOptions}
                Icon={PlusIcon}
                attributeType="Regulatory body"
                onAction={onAddAttribute}
              />
            </Flex>
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
        </Box>
      </Stack>
    </>
  );
};

export default GeneralForm;
