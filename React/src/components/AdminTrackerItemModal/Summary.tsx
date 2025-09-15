import React, { useMemo } from 'react';

import { Box, Flex, Grid, Stack, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import { useTrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import QuestionListElement from '../Questions/QuestionListElement';
import SectionHeader from './SectionHeader';
import SummaryItem from './SummaryItem';

export const details = {
  name: 'summary',
  label: 'Summary',
  fields: [],
};

function Summary() {
  const { trackerItem, categories, regulatoryBodies, businessUnits } = useTrackerItemModalContext();

  const selectedBusinessUnits = useMemo(
    () => (trackerItem.businessUnitsIds || []).map((el) => businessUnits.find(({ _id }) => _id === el)) as IBusinessUnit[],
    [businessUnits, trackerItem],
  );
  const selectedCategory = useMemo(() => categories.find(({ _id }) => _id === trackerItem.categoryId), [categories, trackerItem]);
  const selectedRegulatoryBody = useMemo(
    () => regulatoryBodies.find(({ _id }) => _id === trackerItem.regulatoryBodyId),
    [regulatoryBodies, trackerItem],
  );

  return (
    <Stack
        data-id="030925-ce71b3"
        flexGrow={1}
        overflow="auto"
        spacing={3}
        w={['full', 'calc(100% - 180px - 1rem)']}>
      <Box data-id="030925-462b33" mb="15px">
        <SectionHeader data-id="030925-49737a" label={`Review ${t('tracker item')}`} />
      </Box>
      <SectionHeader data-id="030925-f3770e" label="Details" />
      <SummaryItem data-id="030925-3f5c21" label="Name">{trackerItem.name || 'Not provided'}</SummaryItem>
      <SummaryItem data-id="030925-d1fba1" label="Description">{trackerItem.description || 'Not provided'}</SummaryItem>
      <Grid data-id="030925-e5e4b5" gridGap="10px" gridTemplateColumns="1fr 1fr 1fr">
        <SummaryItem data-id="030925-7aa634" label="Category">{selectedCategory?.name || 'Not provided'}</SummaryItem>
        <SummaryItem data-id="030925-36fb2b" label="Regulatory body">{selectedRegulatoryBody?.name || 'Not provided'}</SummaryItem>
        <SummaryItem data-id="030925-ffc8d3" label="Expires on (optional)">
          {(trackerItem.dueDate && format(new Date(trackerItem.dueDate), 'd MMM yyyy')) || 'Not provided'}
        </SummaryItem>
        <SummaryItem data-id="030925-cd5650" label="Frequency">{trackerItem.frequency || 'Not provided'}</SummaryItem>
      </Grid>
      {selectedBusinessUnits.length !== 0 && <SectionHeader data-id="030925-74f9e3" label={`${capitalize(t('business unit'))}(s)`} />}
      {selectedBusinessUnits?.map((businessUnit) => (
        <Flex
          bg="summaryModal.tileBg"
          data-id="030925-0b75b9"
          flexDir="column"
          key={businessUnit?.name}
          p="10px 15px"
          rounded="10px"
          w="calc(100% - 1rem)">
          <Text
            color="summaryModal.label"
            data-id="030925-00148e"
            fontSize="smm"
            fontWeight="bold"
            mb="3px">
            {businessUnit?.name}
          </Text>
        </Flex>
      ))}
      {trackerItem?.evidenceItems?.length !== 0 && <SectionHeader data-id="030925-518146" label="Evidence" />}
      <Grid
        data-id="030925-1c0cfb"
        gridGap="10px"
        gridTemplateColumns={trackerItem.evidenceItems?.length === 1 ? '1fr' : '1fr 1fr'}
        w="calc(100% - 1rem)">
        {(trackerItem.evidenceItems || []).map((item, index) => (
          <Stack
            bg="summaryModal.tileBg"
            data-id="030925-3656d0"
            key={`evidence-item-${index}`}
            p="10px 15px"
            rounded="10px">
            <Text color="summaryModal.label" data-id="030925-1d5484" fontSize="ssm">
              Evidence {index + 1}
            </Text>
            <Text
              color="summaryModal.value"
              data-id="030925-d6f260"
              fontSize="smm"
              fontWeight="bold">
              {item}
            </Text>
          </Stack>
        ))}
      </Grid>
      {trackerItem.evidenceItems &&
        trackerItem.evidenceItems?.length > 0 &&
        trackerItem.evidenceItems?.some((evidence) => evidence === '') && (
          <Text color="summaryModal.error" data-id="030925-af8213">Evidence title cannot be empty in order to have a valid {t('tracker item')}</Text>
        )}
      <SummaryItem data-id="030925-85c13f" label="Allow attachments">{trackerItem.allowAttachments ? 'Yes' : 'No'}</SummaryItem>
      {trackerItem.questions?.length !== 0 && (
        <Box data-id="030925-205267" w="full">
          <SectionHeader data-id="030925-ad5604" label={capitalize(pluralize(t('question')))} />
          <Stack data-id="030925-0e5e1e" mt="15px" spacing={2} w="full">
            {trackerItem.questions?.map((item) => (
              <QuestionListElement
                bgColor="summaryModal.tileBg"
                data-id="030925-bb5bc1"
                key={item.name}
                question={item} />
            ))}
          </Stack>
        </Box>
      )}
      {trackerItem.evidenceItems?.length === 0 && trackerItem.questions?.filter(({ required }) => required)?.length === 0 && (
        <Text color="summaryModal.error" data-id="030925-dd625d">
          You must add at least one evidence item OR one mandatory {t('question')} in order to have a valid {t('tracker item')}.
        </Text>
      )}
    </Stack>
  );
}

export default Summary;

export const summaryModalStyles = {
  summaryModal: {
    tileBg: '#FFFFFF',
    buColor: '#818197',
    error: '#E53E3E',
    label: '#282F36',
    value: '#282F36',
  },
};
