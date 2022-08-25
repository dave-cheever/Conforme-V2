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

const Summary = () => {
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
    <Stack flexGrow={1} overflow="auto" spacing={3} w={['full', 'calc(100% - 180px - 1rem)']}>
      <Box mb="15px">
        <SectionHeader label={`Review ${t('tracker item')}`} />
      </Box>
      <SectionHeader label="Details" />

      <SummaryItem label="Name">{trackerItem.name || 'Not provided'}</SummaryItem>
      <SummaryItem label="Description">{trackerItem.description || 'Not provided'}</SummaryItem>

      <Grid gridGap="10px" gridTemplateColumns="1fr 1fr 1fr">
        <SummaryItem label="Category">{selectedCategory?.name || 'Not provided'}</SummaryItem>
        <SummaryItem label="Regulatory body">{selectedRegulatoryBody?.name || 'Not provided'}</SummaryItem>
        <SummaryItem label="Expires on (optional)">
          {(trackerItem.dueDate && format(new Date(trackerItem.dueDate), 'd MMM yyyy')) || 'Not provided'}
        </SummaryItem>
        <SummaryItem label="Frequency">{trackerItem.frequency || 'Not provided'}</SummaryItem>
      </Grid>

      {selectedBusinessUnits.length !== 0 && <SectionHeader label={`${capitalize(t('business unit'))}(s)`} />}
      {selectedBusinessUnits?.map((businessUnit) => (
        <Flex bg="summaryModal.tileBg" flexDir="column" key={businessUnit?.name} p="10px 15px" rounded="10px" w="calc(100% - 1rem)">
          <Text color="summaryModal.label" fontSize="smm" fontWeight="bold" mb="3px">
            {businessUnit?.name}
          </Text>
        </Flex>
      ))}

      {trackerItem?.evidenceItems?.length !== 0 && <SectionHeader label="Evidence" />}
      <Grid gridGap="10px" gridTemplateColumns={trackerItem.evidenceItems?.length === 1 ? '1fr' : '1fr 1fr'} w="calc(100% - 1rem)">
        {(trackerItem.evidenceItems || []).map((item, index) => (
          <Stack bg="summaryModal.tileBg" key={`evidence-item-${index}`} p="10px 15px" rounded="10px">
            <Text color="summaryModal.label" fontSize="ssm">
              Evidence {index + 1}
            </Text>
            <Text color="summaryModal.value" fontSize="smm" fontWeight="bold">
              {item}
            </Text>
          </Stack>
        ))}
      </Grid>

      {trackerItem.evidenceItems &&
        trackerItem.evidenceItems?.length > 0 &&
        trackerItem.evidenceItems?.some((evidence) => evidence === '') && (
          <Text color="summaryModal.error">Evidence title cannot be empty in order to have a valid {t('tracker item')}</Text>
        )}

      <SummaryItem label="Allow attachments">{trackerItem.allowAttachments ? 'Yes' : 'No'}</SummaryItem>

      {trackerItem.questions?.length !== 0 && (
        <Box w="full">
          <SectionHeader label={capitalize(pluralize(t('question')))} />
          <Stack mt="15px" spacing={2} w="full">
            {trackerItem.questions?.map((item) => (
              <QuestionListElement bgColor="summaryModal.tileBg" key={item.name} question={item} />
            ))}
          </Stack>
        </Box>
      )}

      {trackerItem.evidenceItems?.length === 0 && trackerItem.questions?.filter(({ required }) => required)?.length === 0 && (
        <Text color="summaryModal.error">
          You must add at least one evidence item OR one mandatory {t('question')} in order to have a valid {t('tracker item')}.
        </Text>
      )}
    </Stack>
  );
};

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
