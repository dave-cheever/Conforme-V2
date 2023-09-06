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
    (<Stack
      data-id="4c12cecc522a"
      flexGrow={1}
      overflow="auto"
      spacing={3}
      w={['full', 'calc(100% - 180px - 1rem)']}>
      <Box data-id="fe1f1f80aa4a" mb="15px">
        <SectionHeader data-id="87ac9e444146" label={`Review ${t('tracker item')}`} />
      </Box>
      <SectionHeader data-id="c9b51a3df061" label="Details" />
      <SummaryItem data-id="6fee4cbf7cd0" label="Name">{trackerItem.name || 'Not provided'}</SummaryItem>
      <SummaryItem data-id="edecb2e63126" label="Description">{trackerItem.description || 'Not provided'}</SummaryItem>
      <Grid data-id="4c12b7a34138" gridGap="10px" gridTemplateColumns="1fr 1fr 1fr">
        <SummaryItem data-id="a869e6024440" label="Category">{selectedCategory?.name || 'Not provided'}</SummaryItem>
        <SummaryItem data-id="9f5b56cf6d5e" label="Regulatory body">{selectedRegulatoryBody?.name || 'Not provided'}</SummaryItem>
        <SummaryItem data-id="9dfe0638498a" label="Expires on (optional)">
          {(trackerItem.dueDate && format(new Date(trackerItem.dueDate), 'd MMM yyyy')) || 'Not provided'}
        </SummaryItem>
        <SummaryItem data-id="d82dfe64225c" label="Frequency">{trackerItem.frequency || 'Not provided'}</SummaryItem>
      </Grid>
      {selectedBusinessUnits.length !== 0 && <SectionHeader data-id="5fba53785f35" label={`${capitalize(t('business unit'))}(s)`} />}
      {selectedBusinessUnits?.map((businessUnit) => (
        <Flex
          bg="summaryModal.tileBg"
          data-id="bb88c325a729"
          flexDir="column"
          key={businessUnit?.name}
          p="10px 15px"
          rounded="10px"
          w="calc(100% - 1rem)">
          <Text
            color="summaryModal.label"
            data-id="4943b58aa459"
            fontSize="smm"
            fontWeight="bold"
            mb="3px">
            {businessUnit?.name}
          </Text>
        </Flex>
      ))}
      {trackerItem?.evidenceItems?.length !== 0 && <SectionHeader data-id="1a87b8756f9a" label="Evidence" />}
      <Grid
        data-id="180ac9527efe"
        gridGap="10px"
        gridTemplateColumns={trackerItem.evidenceItems?.length === 1 ? '1fr' : '1fr 1fr'}
        w="calc(100% - 1rem)">
        {(trackerItem.evidenceItems || []).map((item, index) => (
          <Stack
            bg="summaryModal.tileBg"
            data-id="52c8cc9ef4bb"
            key={`evidence-item-${index}`}
            p="10px 15px"
            rounded="10px">
            <Text color="summaryModal.label" data-id="afd9b0e7959a" fontSize="ssm">
              Evidence {index + 1}
            </Text>
            <Text
              color="summaryModal.value"
              data-id="24e2dc91eaaf"
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
          <Text color="summaryModal.error" data-id="07337273104f">Evidence title cannot be empty in order to have a valid {t('tracker item')}</Text>
        )}
      <SummaryItem data-id="c47fbb3aff86" label="Allow attachments">{trackerItem.allowAttachments ? 'Yes' : 'No'}</SummaryItem>
      {trackerItem.questions?.length !== 0 && (
        <Box data-id="ab1146fe8efc" w="full">
          <SectionHeader data-id="be49f48a30c8" label={capitalize(pluralize(t('question')))} />
          <Stack data-id="ee3b5c24bfa8" mt="15px" spacing={2} w="full">
            {trackerItem.questions?.map((item) => (
              <QuestionListElement
                bgColor="summaryModal.tileBg"
                data-id="08b638dd3d9a"
                key={item.name}
                question={item} />
            ))}
          </Stack>
        </Box>
      )}
      {trackerItem.evidenceItems?.length === 0 && trackerItem.questions?.filter(({ required }) => required)?.length === 0 && (
        <Text color="summaryModal.error" data-id="223d196ae1a3">
          You must add at least one evidence item OR one mandatory {t('question')} in order to have a valid {t('tracker item')}.
        </Text>
      )}
    </Stack>)
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
