import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Avatar, Button, Flex, Grid, GridItem, HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import { format } from 'date-fns';

import { priorities } from '../../bootstrap/config';
import { useAuditContext } from '../../contexts/AuditProvider';
import { Datepicker, Dropdown, TextInput } from '../Forms';
import PeoplePicker from '../Forms/PeoplePicker';
import TextInputMultiline from '../Forms/TextInputMultiline';
import AuditActionChangesModal from './AuditActionChangesModal';

function ActionForm({ handleSave }) {
  const { selectedAction, setSelectedAction } = useAuditContext();

  const { control, formState, watch, reset } = useForm({
    mode: 'all',
  });
  const { isValid } = formState;
  const values = watch();

  useEffect(() => {
    reset({
      ...selectedAction,
      priority: selectedAction?.priority || priorities[1].value,
    });
  }, [JSON.stringify(selectedAction)]);

  const handleClose = () => {
    setSelectedAction(undefined);
  };

  return (
    <>
      <AuditActionChangesModal
        data-id="000044"
        isAcionFormValid={isValid}
        onSave={() => {
          handleSave(values);
          handleClose();
        }}
        setSelectedAction={setSelectedAction}
      />
      <Stack bg="auditActionForm.bg" data-id="000045" p={4} rounded="10px">
        <Text data-id="000046" fontSize="smm" fontWeight="semibold">
          Action details
        </Text>
        <Grid columnGap={4} data-id="000047" rowGap={2} templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}>
          <GridItem data-id="000048">
            <TextInput
              control={control}
              data-id="000049"
              label="Title"
              name="title"
              required
              validations={{
                notEmpty: true,
              }}
            />
          </GridItem>
          <GridItem data-id="000050">
            <PeoplePicker control={control} data-id="000051" label="Assign to" name="assigneeId" />
          </GridItem>
          <GridItem data-id="000052">
            <Datepicker control={control} data-id="000053" label="Due date" name="dueDate" />
          </GridItem>
          <GridItem data-id="000054">
            <Dropdown
              control={control}
              data-id="000055"
              label="Priority"
              name="priority"
              options={priorities}
              stroke="dropdown.icon"
              variant="secondaryVariant"
            />
          </GridItem>
          <GridItem data-id="000056">
            <Dropdown
              control={control}
              data-id="000057"
              label="Status"
              name="status"
              options={[
                { label: 'Open', value: 'open' },
                { label: 'Closed', value: 'closed' },
              ]}
              stroke="dropdown.icon"
              variant="secondaryVariant"
            />
          </GridItem>
        </Grid>
        <TextInputMultiline control={control} data-id="000058" label="Description" name="description" />
        <Spacer data-id="000059" />
        {selectedAction?.metatags?.addedAt && selectedAction?.assignor && (
          <Grid columnGap={4} data-id="000060" templateColumns="repeat(2, 1fr)">
            <GridItem data-id="000061">
              <Text color="auditActionForm.labelFont.normal" data-id="000062" fontSize="11px" fontWeight="bold" mb={1}>
                Date added
              </Text>
              <Text data-id="000063" fontSize="13px">
                {format(new Date(selectedAction?.metatags?.addedAt!), 'd MMM yyyy')}
              </Text>
            </GridItem>
            <GridItem data-id="000064">
              <Text color="auditActionForm.labelFont.normal" data-id="000065" fontSize="11px" fontWeight="bold" mb={1}>
                Assigned by
              </Text>
              {selectedAction?.assignor && (
                <Flex align="center" data-id="000066" direction="row">
                  <Avatar
                    data-id="000067"
                    name={selectedAction?.assignor?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
                    size="xs"
                    src={selectedAction?.assignor?.imgUrl}
                  />
                  <Text
                    data-id="000068"
                    fontSize="13px"
                    lineHeight="17px"
                    opacity="1"
                    overflow="hidden"
                    pl={3}
                    textOverflow="ellipsis"
                    w="full"
                    whiteSpace="nowrap"
                  >
                    {selectedAction?.assignor?.displayName}
                  </Text>
                </Flex>
              )}
            </GridItem>
          </Grid>
        )}
        <HStack data-id="000069" justify="flex-end" pb={3} pt={4} w="full">
          <Button
            bgColor="auditActionForm.buttons.cancel.bg"
            color="auditActionForm.buttons.cancel.color"
            data-id="000070"
            fontSize="ssm"
            fontWeight="semibold"
            h="28px"
            onClick={handleClose}
            rounded="10px"
          >
            Cancel
          </Button>
          <Button
            bgColor="auditActionForm.buttons.save.bg"
            color="auditActionForm.buttons.save.color"
            data-id="000071"
            disabled={!isValid || !values.title || values.title.trim() === ''}
            fontSize="ssm"
            fontWeight="semibold"
            h="28px"
            onClick={() => {
              if (!values.title || values.title.trim() === '') return;
              handleSave(values);
              handleClose();
            }}
            rounded="10px"
          >
            Save action
          </Button>
        </HStack>
      </Stack>
    </>
  );
}

export const auditActionFormStyles = {
  auditActionForm: {
    bg: '#F4F3F5',
    buttons: {
      cancel: {
        bg: '#787486',
        color: '#ffffff',
      },
      save: {
        bg: '#DC0043',
        color: '#ffffff',
      },
    },
    labelFont: {
      secondaryVariant: '#818197',
      normal: '#2B3236',
      error: '#E53E3E',
    },
  },
};

export default ActionForm;
