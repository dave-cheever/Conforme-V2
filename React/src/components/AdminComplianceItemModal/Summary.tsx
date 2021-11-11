import React, { useMemo } from 'react';
import {
  Stack,
  Text,
  Skeleton,
  Box,
} from '@chakra-ui/react';

import moment from 'moment';
import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import BusinessUnitsCarousel from '../BusinessUnitsCarousel';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import QuestionListElement from '../Questions/QuestionListElement';

export const details = {
  name: 'summary',
  label: 'Summary',
  fields: [],
};

const Summary = () => {
  const {
    complianceItem,
    categories,
    functionalAreas,
    regulatoryBodies,
    businessUnits,
  } = useComplianceItemModalContext();

  const selectedBusinessUnits = useMemo(() =>
    (complianceItem.businessUnitsIds || []).map(el => businessUnits.find(({ _id }) => _id === el)) as IBusinessUnit[],
    [businessUnits, complianceItem]
  );
  const selectedCategory = useMemo(() =>
    categories.find(({ _id }) => _id === complianceItem.categoryId),
    [categories, complianceItem]
  );
  const selectedRegulatoryBody = useMemo(() =>
    regulatoryBodies.find(({ _id }) => _id === complianceItem.regulatoryBodyId),
    [regulatoryBodies, complianceItem]
  );
  const selectedFunctionalArea = useMemo(() =>
    functionalAreas.find(({ _id }) => _id === complianceItem.functionalAreaId),
    [functionalAreas, complianceItem]
  );

  return (
    <Stack mt={2} spacing={4} direction={['column', 'row']} w='full'>
      <BusinessUnitsCarousel selectedBusinessUnits={selectedBusinessUnits} businessUnits={businessUnits} />
      <Stack spacing={3} flexGrow={1} w={['full', 'calc(100% - 180px - 1rem)']}>

        <Stack >
          <Text color='adminComplianceItemModal.section.summary.label' fontSize='sm'>Name</Text>
          <Text color='adminComplianceItemModal.section.summary.value' fontSize='md'>{complianceItem.name}</Text>
        </Stack>
        <Stack >
          <Text color='adminComplianceItemModal.section.summary.label' fontSize='sm'>Description</Text>
          <Text color='adminComplianceItemModal.section.summary.value' fontSize='md'>{complianceItem.description}</Text>
        </Stack>

        <Stack spacing={3} direction='row' >
          <Stack w='60%'>
            <Text color='adminComplianceItemModal.section.summary.label' fontSize='sm'>Category</Text>
            <Skeleton color='adminComplianceItemModal.section.summary.value' fontSize='md' isLoaded={!!selectedCategory}>{selectedCategory?.name}</Skeleton>
          </Stack>
          <Stack w='40%'>
            <Text color='adminComplianceItemModal.section.summary.label' fontSize='sm'>Regulatory body</Text>
            <Skeleton color='adminComplianceItemModal.section.summary.value' fontSize='md' isLoaded={!!selectedRegulatoryBody}>{selectedRegulatoryBody?.name}</Skeleton>
          </Stack>
        </Stack>

        <Stack spacing={3} direction='row' >
          <Stack w='60%'>
            <Text color='adminComplianceItemModal.section.summary.label' fontSize='sm'>Functional area</Text>
            <Skeleton color='adminComplianceItemModal.section.summary.value' fontSize='md' isLoaded={!!selectedFunctionalArea}>{selectedFunctionalArea?.name}</Skeleton>
          </Stack>
          <Stack w='40%'>
            <Text color='adminComplianceItemModal.section.summary.label' fontSize='sm'>Due date (optional)</Text>
            <Text color='adminComplianceItemModal.section.summary.value' fontSize='md'>{complianceItem.dueDate && moment(complianceItem.dueDate).format('D MMM YYYY')}</Text>
          </Stack>
        </Stack>

        <Stack >
          <Text color='adminComplianceItemModal.section.summary.label' fontSize='sm'>Frequency</Text>
          <Text color='adminComplianceItemModal.section.summary.value' fontSize='md'>{complianceItem.frequency}</Text>
        </Stack>

        <Text mt='1.5rem !important' fontWeight='700' fontSize='14px' color='adminComplianceItemModal.section.summary.section'>Additional details</Text>

        <Stack spacing={3} >
          {(complianceItem.evidenceItems || []).map((item, index) => (
            <Stack key={`evidence-item-${index}`} >
              <Text color='adminComplianceItemModal.section.summary.label' fontSize='sm'>Evidence {index + 1}</Text>
              <Text color='adminComplianceItemModal.section.summary.value' fontSize='md'>{item}</Text>
            </Stack>
          ))}
        </Stack>

        {complianceItem.questions?.length !== 0 && <Box w='full'>
          <Text mt='1.5rem !important' mb='1rem !important' fontWeight='700' fontSize='14px' color='adminComplianceItemModal.section.summary.section'>Added questions</Text>
          <Stack spacing={2} w='full'>
            {complianceItem.questions?.map(item => (
              <QuestionListElement question={item} bgColor="adminComplianceItemModal.section.summary.questionBg" key={item.name} />
            ))}
          </Stack>
        </Box>}

        {complianceItem.evidenceItems?.length === 0 && complianceItem.questions?.filter(({ required, outdated }) => required && !outdated)?.length === 0 &&
          <Text color="adminComplianceItemModal.section.summary.error">
            You must add at least one evidence item OR one mandatory question in order to have a valid compliance item.
          </Text>
        }
      </Stack>
    </Stack>
  );
};

export default Summary;
