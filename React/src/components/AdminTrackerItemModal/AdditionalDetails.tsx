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
    <Stack data-id="030925-8a35f6" spacing={4} w="full">
      <SectionHeader
        data-id="030925-b1fd45"
        label={`Please define the expected evidence and action for this ${t('tracker item')}.`} />
      <Stack data-id="030925-294937" overflow="auto" pb={3} spacing={2} w="full">
        <Box
          data-id="030925-8bfed5"
          bg="additionalDetails.evidence.bg"
          borderRadius="4px"
          w="full">
          {trackerItem.evidenceItems?.map((item, index) => (
            <Stack
              data-id="030925-aa5134"
              align="center"
              direction="row"
              key={`item-${index}`}
              mb={2}
              pr={5}
              spacing={4}>
              <Box data-id="030925-c26ec7" flexGrow={1}>
                <Box
                  data-id="030925-e6dedf"
                  color="additionalDetails.evidence.label"
                  fontSize={11}
                  fontWeight="bold"
                  mb="5px"
                  zIndex={2}>
                  Evidence {index + 1}
                </Box>
                <Flex data-id="030925-25c620" alignItems="center">
                  <Input
                    data-id="030925-29aba5"
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
                    value={item} />
                  <CloseIcon
                    data-id="030925-7195b9"
                    color="additionalDetails.evidence.remove"
                    cursor="pointer"
                    ml="25px"
                    onClick={() => removeEvidenceItem(index)} />
                </Flex>
              </Box>
            </Stack>
          ))}
          {(trackerItem.evidenceItems || []).length < 5 && (
            <Button
              data-id="030925-a9c26d"
              bgColor="additionalDetails.evidence.add.bg"
              color="additionalDetails.evidence.add.font"
              fontSize="11px"
              fontWeight="400"
              h="28px"
              leftIcon={<AddIcon data-id="030925-028248" stroke="additionalDetails.addIcon" />}
              mb={4}
              mt={trackerItem.evidenceItems?.length === 0 ? 0 : 3}
              onClick={addEvidenceItem}
              px={4}>
              {trackerItem.evidenceItems?.length === 0 ? 'Require evidence' : 'Add another'}
            </Button>
          )}
          <Flex data-id="030925-591636" align="center" mt={3}>
            <Switch
              data-id="030925-9087fd"
              colorScheme="toogle.color"
              css={{
                '.chakra-switch__thumb': {
                  '&[data-checked]': {
                    background: '#462AC4',
                  },
                },
              }}
              isChecked={!!trackerItem.allowAttachments}
              onChange={() => setValue('allowAttachments', !trackerItem.allowAttachments)} />
            <Flex
              data-id="030925-929497"
              color={trackerItem.allowAttachments ? 'toogle.enableColor' : 'toogle.disableColor'}
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
