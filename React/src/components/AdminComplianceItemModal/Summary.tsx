import React, { useMemo } from 'react';

import { Box, Flex, Grid, Stack, Text } from '@chakra-ui/react';
import { format } from 'date-fns';

import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
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
  const { complianceItem, categories, regulatoryBodies, businessUnits } =
    useComplianceItemModalContext();

  const selectedBusinessUnits = useMemo(
    () =>
      (complianceItem.businessUnitsIds || []).map((el) =>
        businessUnits.find(({ _id }) => _id === el),
      ) as IBusinessUnit[],
    [businessUnits, complianceItem],
  );
  const selectedCategory = useMemo(
    () => categories.find(({ _id }) => _id === complianceItem.categoryId),
    [categories, complianceItem],
  );
  const selectedRegulatoryBody = useMemo(
    () =>
      regulatoryBodies.find(
        ({ _id }) => _id === complianceItem.regulatoryBodyId,
      ),
    [regulatoryBodies, complianceItem],
  );

  return (
    <Stack
      flexGrow={1}
      overflow="auto"
      spacing={3}
      w={['full', 'calc(100% - 180px - 1rem)']}
    >
      <Box mb="15px">
        <SectionHeader label="Review compliance item" />
      </Box>
      <SectionHeader label="Details" />

      <SummaryItem label="Name">
        {complianceItem.name || 'Not provided'}
      </SummaryItem>
      <SummaryItem label="Description">
        {complianceItem.description || 'Not provided'}
      </SummaryItem>

      <Grid gridGap="10px" gridTemplateColumns="1fr 1fr 1fr">
        <SummaryItem label="Category">
          {selectedCategory?.name || 'Not provided'}
        </SummaryItem>
        <SummaryItem label="Regulatory body">
          {selectedRegulatoryBody?.name || 'Not provided'}
        </SummaryItem>
        <SummaryItem label="Expires on (optional)">
          {(complianceItem.dueDate &&
            format(new Date(complianceItem.dueDate), 'd MMM yyyy')) ||
            'Not provided'}
        </SummaryItem>
        <SummaryItem label="Frequency">
          {complianceItem.frequency || 'Not provided'}
        </SummaryItem>
      </Grid>

      {selectedBusinessUnits.length !== 0 && (
        <SectionHeader label="Business unit(s)" />
      )}
      {selectedBusinessUnits?.map((businessUnit) => (
        <Flex
          bg="summaryModal.tileBg"
          flexDir="column"
          key={businessUnit?.name}
          p="10px 15px"
          rounded="10px"
          w="calc(100% - 1rem)"
        >
          <Text
            color="summaryModal.label"
            fontSize="smm"
            fontWeight="bold"
            mb="3px"
          >
            {businessUnit?.name}
          </Text>
        </Flex>
      ))}

      {complianceItem?.evidenceItems?.length !== 0 && (
        <SectionHeader label="Evidence" />
      )}

      <Grid
        gridGap="10px"
        gridTemplateColumns={
          complianceItem.evidenceItems?.length === 1 ? '1fr' : '1fr 1fr'
        }
        w="calc(100% - 1rem)"
      >
        {(complianceItem.evidenceItems || []).map((item, index) => (
          <Stack
            bg="summaryModal.tileBg"
            key={`evidence-item-${index}`}
            p="10px 15px"
            rounded="10px"
          >
            <Text color="summaryModal.label" fontSize="ssm">
              Evidence {index + 1}
            </Text>
            <Text color="summaryModal.value" fontSize="smm" fontWeight="bold">
              {item}
            </Text>
          </Stack>
        ))}
      </Grid>

      {complianceItem.evidenceItems &&
        complianceItem.evidenceItems?.length > 0 &&
        complianceItem.evidenceItems?.some((evidence) => evidence === '') && (
          <Text color="summaryModal.error">
            Evidence title cannot be empty in order to have a valid compliance
            item.
          </Text>
        )}

      {complianceItem.questions?.length !== 0 && (
        <Box w="full">
          <SectionHeader label="Questions" />
          <Stack mt="15px" spacing={2} w="full">
            {complianceItem.questions?.map((item) => (
              <QuestionListElement
                bgColor="summaryModal.tileBg"
                key={item.name}
                question={item}
              />
            ))}
          </Stack>
        </Box>
      )}

      {complianceItem.evidenceItems?.length === 0 &&
        complianceItem.questions?.filter(
          ({ required, outdated }) => required && !outdated,
        )?.length === 0 && (
          <Text color="summaryModal.error">
            You must add at least one evidence item OR one mandatory question in
            order to have a valid compliance item.
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
