import React from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';

import { CircleRemove } from '../../icons';
import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import NumberInput from '../Forms/NumberInput';

const AdditionalDetailsForm = () => {
  const {
    complianceItem,
    control, setValue,
  } = useComplianceItemModalContext();

  const handleEvidenceItemChange = (value: string, index: number) => {
    const newValue = [...(complianceItem.evidenceItems || [])];
    newValue.splice(index, 1, value);
    setValue('evidenceItems', newValue);
  };

  const addEvidenceItem = () => {
    setValue('evidenceItems', [...(complianceItem.evidenceItems || []), '']);
  };

  const removeEvidenceItem = (index: number) => {
    const newValue = [...(complianceItem.evidenceItems || [])];
    newValue.splice(index, 1);
    setValue('evidenceItems', newValue);
  };

  return (
    <Stack w='full' spacing={4} px={[0, 0, 3]}>
      <Text fontSize='14px' color='adminComplianceItemModal.section.additionalDetails.description' opacity='0.7'>
        Please define the expected evidence and action for this compliance item.
      </Text>
      <Stack w='full' spacing={2} pb={3} overflow='auto'>
        <Box w='full' bg="adminComplianceItemModal.section.additionalDetails.evidence.bg" borderRadius='4px'>
          <Text color="adminComplianceItemModal.section.additionalDetails.evidence.title" mx={6} my={4} fontWeight="bold" fontSize={14}>Evidence items</Text>
          {complianceItem.evidenceItems?.map((item, index) =>
            <Stack key={`item-${index}`} pl={5} pr={5} mb={2} direction='row' spacing={4} align='center'>
              <Box flexGrow={1}>
                <Flex pt={2} pb={2} align='center' justify="space-between" mt="-30px">
                  <Box
                    color="adminComplianceItemModal.section.additionalDetails.evidence.label"
                    fontWeight="bold"
                    fontSize={11}
                    position="relative"
                    left="19px"
                    top="32px"
                    zIndex={2}
                  >
                    Evidence {index + 1}
                  </Box>
                </Flex>
                <Input
                  name='evidenceItems'
                  color="adminComplianceItemModal.section.additionalDetails.evidence.input.font.normal"
                  bg="adminComplianceItemModal.section.additionalDetails.evidence.input.bg"
                  borderWidth='2px'
                  borderColor='adminComplianceItemModal.section.additionalDetails.evidence.input.border'
                  h='55px'
                  pt='10px'
                  mb={0}
                  value={item}
                  placeholder='Type of required evidence submission'
                  onChange={({ target }) => handleEvidenceItemChange(target.value, index)}
                  _focus={{ color: 'adminComplianceItemModal.section.additionalDetails.evidence.input.font.focus' }}
                />
              </Box>
              <CircleRemove
                boxSize={4}
                color='adminComplianceItemModal.section.additionalDetails.evidence.remove'
                cursor='pointer'
                onClick={() => removeEvidenceItem(index)}
              />
            </Stack>
          )}
          {(complianceItem.evidenceItems || []).length < 5 &&
            <Button
              mt={complianceItem.evidenceItems?.length === 0 ? 0 : 3}
              ml={5}
              mb={4}
              px={4}
              size='xs'
              bgColor='adminComplianceItemModal.section.additionalDetails.evidence.add.bg'
              color='adminComplianceItemModal.section.additionalDetails.evidence.add.font'
              fontWeight='400'
              onClick={addEvidenceItem}
            >{complianceItem.evidenceItems?.length === 0 ? 'Add' : 'Add another'}</Button>
          }
        </Box>
        <Box w='full'>
          <NumberInput
            control={control}
            name="retentionPeriod"
            label="Retention period in years (optional)"
            placeholder="Define the retention period"
          />
        </Box>
      </Stack>
    </Stack>
  );
};

export default AdditionalDetailsForm;
