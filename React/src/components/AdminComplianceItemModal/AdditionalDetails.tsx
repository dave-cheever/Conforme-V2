import React from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Stack,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';

import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import NumberInput from '../Forms/NumberInput';
import SectionHeader from './SectionHeader';

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
      <SectionHeader label="Please define the expected evidence and action for this compliance item." />
      <Stack w='full' spacing={2} pb={3} overflow='auto'>
        <Box w='full' bg="additionalDetails.evidence.bg" borderRadius='4px'>
          {complianceItem.evidenceItems?.map((item, index) =>
            <Stack key={`item-${index}`} pr={5} mb={2} direction='row' spacing={4} align='center'>
              <Box flexGrow={1}>
                <Box
                  color="additionalDetails.evidence.label"
                  fontWeight="bold"
                  fontSize={11}
                  mb="5px"
                  zIndex={2}
                >
                  Evidence {index + 1}
                </Box>
                <Flex alignItems="center">                
                  <Input
                    name='evidenceItems'
                    color="additionalDetails.evidence.input.font.normal"
                    bg="additionalDetails.evidence.input.bg"
                    borderWidth='2px'
                    borderColor='additionalDetails.evidence.input.border'
                    h='42px'
                    fontSize="smm"
                    mb={0}
                    value={item}
                    placeholder='Type in the evidence title'
                    onChange={({ target }) => handleEvidenceItemChange(target.value, index)}
                    _focus={{ color: 'additionalDetails.evidence.input.font.focus' }}
                  />
                  <CloseIcon ml="25px" color='additionalDetails.evidence.remove' cursor='pointer' onClick={() => removeEvidenceItem(index)}/>
                </Flex>
              </Box>
            </Stack>
          )}
          {(complianceItem.evidenceItems || []).length < 5 &&
            <Button
              mt={complianceItem.evidenceItems?.length === 0 ? 0 : 3}
              mb={4}
              px={4}
              size='xs'
              bgColor='additionalDetails.evidence.add.bg'
              color='additionalDetails.evidence.add.font'
              fontWeight='400'
              leftIcon={<AddIcon />}
              onClick={addEvidenceItem}
            >{complianceItem.evidenceItems?.length === 0 ? 'Require evidence' : 'Add another'}</Button>
          }
        </Box>
        <Box w='full'>
          <NumberInput
            control={control}
            variant="secondaryVariant"
            name="retentionPeriod"
            label="Retention period in years (optional)"
          />
        </Box>
      </Stack>
    </Stack>
  );
};

export default AdditionalDetailsForm;

export const additionalDetailsStyles = {
  additionalDetails: {
    description: '#2B3236',
    evidence: {
      bg: '#F2F2F2',
      title: '#2B3236',
      label: '#2B3236',
      input: {
        font: {
          normal: '#777777',
          focus: '#2B3236',
        },
        bg: '#FFFFFF',
        border: '#CBCCCD',
      },
      remove: '#E93C44',
      add: {
        bg: '#462AC4',
        font: '#FFFFFF',
      },
    },
  }
};
