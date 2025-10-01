import React from 'react';

import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Input, Stack, Switch } from '@chakra-ui/react';
import { t } from 'i18next';

import { useTrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import SectionHeader from './SectionHeader';

function AdditionalDetailsForm() {
  const { trackerItem, setValue } = useTrackerItemModalContext();

  const handleEvidenceItemChange = (value: string, index: number) => {
    const newValue = [...(trackerItem.evidenceItems || [])];
    newValue.splice(index, 1, value);
    setValue('evidenceItems', newValue);
  };

  const addEvidenceItem = () => {
    setValue('evidenceItems', [...(trackerItem.evidenceItems || []), '']);
  };

  const removeEvidenceItem = (index: number) => {
    const newValue = [...(trackerItem.evidenceItems || [])];
    newValue.splice(index, 1);
    setValue('evidenceItems', newValue);
  };

  return (
    <Stack data-id="000418" spacing={4} w="full">
      <SectionHeader
        data-id="000419"
        label={`Please define the expected evidence and action for this ${t('tracker item')}.`} />
      <Stack data-id="000420" overflow="auto" pb={3} spacing={2} w="full">
        <Box
          bg="additionalDetails.evidence.bg"
          borderRadius="4px"
          data-id="000421"
          w="full">
          {trackerItem.evidenceItems?.map((item, index) => (
            <Stack
              align="center"
              data-id="000422"
              direction="row"
              key={`item-${index}`}
              mb={2}
              pr={5}
              spacing={4}>
              <Box data-id="000423" flexGrow={1}>
                <Box
                  color="additionalDetails.evidence.label"
                  data-id="000424"
                  fontSize={11}
                  fontWeight="bold"
                  mb="5px"
                  zIndex={2}>
                  Evidence {index + 1}
                </Box>
                <Flex alignItems="center" data-id="000425">
                  <Input
                    _focus={{
                      color: 'additionalDetails.evidence.input.font.focus',
                    }}
                    bg="additionalDetails.evidence.input.bg"
                    borderColor="additionalDetails.evidence.input.border"
                    borderWidth="1px"
                    color="additionalDetails.evidence.input.font.normal"
                    data-id="000426"
                    fontSize="smm"
                    h="42px"
                    mb={0}
                    name="evidenceItems"
                    onChange={({ target }) => handleEvidenceItemChange(target.value, index)}
                    placeholder="Type in the evidence title"
                    value={item} />
                  <CloseIcon
                    color="additionalDetails.evidence.remove"
                    cursor="pointer"
                    data-id="000427"
                    ml="25px"
                    onClick={() => removeEvidenceItem(index)} />
                </Flex>
              </Box>
            </Stack>
          ))}
          {(trackerItem.evidenceItems || []).length < 5 && (
            <Button
              bgColor="additionalDetails.evidence.add.bg"
              color="additionalDetails.evidence.add.font"
              data-id="000428"
              fontSize="11px"
              fontWeight="400"
              h="28px"
              leftIcon={<AddIcon data-id="000429" stroke="additionalDetails.addIcon" />}
              mb={4}
              mt={trackerItem.evidenceItems?.length === 0 ? 0 : 3}
              onClick={addEvidenceItem}
              px={4}>
              {trackerItem.evidenceItems?.length === 0 ? 'Require evidence' : 'Add another'}
            </Button>
          )}
          <Flex align="center" data-id="000430" mt={3}>
            <Switch
              colorScheme="toogle.color"
              css={{
                '.chakra-switch__thumb': {
                  '&[data-checked]': {
                    background: '#462AC4',
                  },
                },
              }}
              data-id="000431"
              isChecked={!!trackerItem.allowAttachments}
              onChange={() => setValue('allowAttachments', !trackerItem.allowAttachments)} />
            <Flex
              color={trackerItem.allowAttachments ? 'toogle.enableColor' : 'toogle.disableColor'}
              data-id="000432"
              fontSize="14px"
              fontWeight="400"
              ml={3}>
              Allow attachments
            </Flex>
          </Flex>
        </Box>
      </Stack>
    </Stack>
  );
}

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
