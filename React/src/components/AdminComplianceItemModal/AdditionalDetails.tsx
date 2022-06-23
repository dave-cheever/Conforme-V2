import React from 'react';

import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Input, Stack, Switch } from '@chakra-ui/react';
import { t } from 'i18next';

import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import SectionHeader from './SectionHeader';

const AdditionalDetailsForm = () => {
  const { complianceItem, setValue } = useComplianceItemModalContext();

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
    <Stack spacing={4} w="full">
      <SectionHeader label={`Please define the expected evidence and action for this ${t('complianceItem')}.`} />
      <Stack overflow="auto" pb={3} spacing={2} w="full">
        <Box bg="additionalDetails.evidence.bg" borderRadius="4px" w="full">
          {complianceItem.evidenceItems?.map((item, index) => (
            <Stack align="center" direction="row" key={`item-${index}`} mb={2} pr={5} spacing={4}>
              <Box flexGrow={1}>
                <Box color="additionalDetails.evidence.label" fontSize={11} fontWeight="bold" mb="5px" zIndex={2}>
                  Evidence {index + 1}
                </Box>
                <Flex alignItems="center">
                  <Input
                    _focus={{
                      color: 'additionalDetails.evidence.input.font.focus',
                    }}
                    bg="additionalDetails.evidence.input.bg"
                    borderColor="additionalDetails.evidence.input.border"
                    borderWidth="1px"
                    color="additionalDetails.evidence.input.font.normal"
                    fontSize="smm"
                    h="42px"
                    mb={0}
                    name="evidenceItems"
                    onChange={({ target }) => handleEvidenceItemChange(target.value, index)}
                    placeholder="Type in the evidence title"
                    value={item}
                  />
                  <CloseIcon
                    color="additionalDetails.evidence.remove"
                    cursor="pointer"
                    ml="25px"
                    onClick={() => removeEvidenceItem(index)}
                  />
                </Flex>
              </Box>
            </Stack>
          ))}
          {(complianceItem.evidenceItems || []).length < 5 && (
            <Button
              bgColor="additionalDetails.evidence.add.bg"
              color="additionalDetails.evidence.add.font"
              fontSize="11px"
              fontWeight="400"
              h="28px"
              leftIcon={<AddIcon stroke="additionalDetails.addIcon" />}
              mb={4}
              mt={complianceItem.evidenceItems?.length === 0 ? 0 : 3}
              onClick={addEvidenceItem}
              px={4}
            >
              {complianceItem.evidenceItems?.length === 0 ? 'Require evidence' : 'Add another'}
            </Button>
          )}
          <Flex align="center" mt={3}>
            <Switch
              colorScheme="toogle.color"
              css={{
                '.chakra-switch__thumb': {
                  '&[data-checked]': {
                    background: '#462AC4',
                  },
                },
              }}
              isChecked={!!complianceItem.allowAttachments}
              onChange={() => setValue('allowAttachments', !complianceItem.allowAttachments)}
            />
            <Flex
              color={complianceItem.allowAttachments ? 'toogle.enableColor' : 'toogle.disableColor'}
              fontSize="14px"
              fontWeight="400"
              ml={3}
            >
              Allow attachments
            </Flex>
          </Flex>
        </Box>
      </Stack>
    </Stack>
  );
};

export default AdditionalDetailsForm;

export const additionalDetailsStyles = {
  additionalDetails: {
    description: '#2B3236',
    addIcon: '#FFFFFF',
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
  },
};
