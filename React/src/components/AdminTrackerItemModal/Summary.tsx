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
        data-id="000656"
        flexGrow={1}
        overflow="auto"
        spacing={3}
        w={['full', 'calc(100% - 180px - 1rem)']}>
      <Box data-id="000657" mb="15px">
        <SectionHeader data-id="000658" label={`Review ${t('tracker item')}`} />
      </Box>
      <SectionHeader data-id="000659" label="Details" />
      <SummaryItem data-id="000660" label="Name">{trackerItem.name || 'Not provided'}</SummaryItem>
      <SummaryItem data-id="000661" label="Description">{trackerItem.description || 'Not provided'}</SummaryItem>
      <Grid data-id="000662" gridGap="10px" gridTemplateColumns="1fr 1fr 1fr">
        <SummaryItem data-id="000663" label="Category">{selectedCategory?.name || 'Not provided'}</SummaryItem>
        <SummaryItem data-id="000664" label="Regulatory body">{selectedRegulatoryBody?.name || 'Not provided'}</SummaryItem>
        <SummaryItem data-id="000665" label="Expires on (optional)">
          {(trackerItem.dueDate && format(new Date(trackerItem.dueDate), 'd MMM yyyy')) || 'Not provided'}
        </SummaryItem>
        <SummaryItem data-id="000666" label="Frequency">{trackerItem.frequency || 'Not provided'}</SummaryItem>
      </Grid>
      {selectedBusinessUnits.length !== 0 && <SectionHeader data-id="000667" label={`${capitalize(t('business unit'))}(s)`} />}
      {selectedBusinessUnits?.map((businessUnit) => (
        <Flex
          bg="summaryModal.tileBg"
          data-id="000668"
          flexDir="column"
          key={businessUnit?.name}
          p="10px 15px"
          rounded="10px"
          w="calc(100% - 1rem)">
          <Text
            color="summaryModal.label"
            data-id="000669"
            fontSize="smm"
            fontWeight="bold"
            mb="3px">
            {businessUnit?.name}
          </Text>
        </Flex>
      ))}
      {trackerItem?.evidenceItems?.length !== 0 && <SectionHeader data-id="000670" label="Evidence" />}
      <Grid
        data-id="000671"
        gridGap="10px"
        gridTemplateColumns={trackerItem.evidenceItems?.length === 1 ? '1fr' : '1fr 1fr'}
        w="calc(100% - 1rem)">
        {(trackerItem.evidenceItems || []).map((item, index) => (
          <Stack
            bg="summaryModal.tileBg"
            data-id="000672"
            key={`evidence-item-${index}`}
            p="10px 15px"
            rounded="10px">
            <Text color="summaryModal.label" data-id="000673" fontSize="ssm">
              Evidence {index + 1}
            </Text>
            <Text
              color="summaryModal.value"
              data-id="000674"
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
          <Text color="summaryModal.error" data-id="000675">Evidence title cannot be empty in order to have a valid {t('tracker item')}</Text>
        )}
      <SummaryItem data-id="000676" label="Allow attachments">{trackerItem.allowAttachments ? 'Yes' : 'No'}</SummaryItem>
      {trackerItem.questions?.length !== 0 && (
        <Box data-id="000677" w="full">
          <SectionHeader data-id="000678" label={capitalize(pluralize(t('question')))} />
          <Stack data-id="000679" mt="15px" spacing={2} w="full">
            {trackerItem.questions?.map((item) => (
              <QuestionListElement
                bgColor="summaryModal.tileBg"
                data-id="000680"
                key={item.name}
                question={item} />
            ))}
          </Stack>
        </Box>
      )}
      {trackerItem.evidenceItems?.length === 0 && trackerItem.questions?.filter(({ required }) => required)?.length === 0 && (
        <Text color="summaryModal.error" data-id="000681">
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
