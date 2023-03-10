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

const ActionForm = ({ handleSave }) => {
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

  return (<>
    <AuditActionChangesModal
      data-id="15def5adf71f"
      isAcionFormValid={isValid}
      onSave={() => {
        handleSave(values);
        handleClose();
      }}
      setSelectedAction={setSelectedAction} />
    <Stack bg="auditActionForm.bg" data-id="43b8cb3acd97" p={4} rounded="10px">
      <Text data-id="8cd6bf2c370b" fontSize="smm" fontWeight="semibold">
        Action details
      </Text>
      <Grid
        columnGap={4}
        data-id="c9c833cf26bf"
        rowGap={2}
        templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}>
        <GridItem data-id="765c694dc3a8">
          <TextInput
            control={control}
            data-id="a0ec4d95aa29"
            label="Title"
            name="title"
            required
            validations={{
              notEmpty: true,
            }} />
        </GridItem>
        <GridItem data-id="70d8bfa209c4">
          <PeoplePicker
            control={control}
            data-id="bdb62e6049fc"
            label="Assign to"
            name="assigneeId" />
        </GridItem>
        <GridItem data-id="20e5c6158772">
          <Datepicker control={control} data-id="ce242b7f13be" label="Due date" name="dueDate" />
        </GridItem>
        <GridItem data-id="c4a5f233e5da">
          <Dropdown
            control={control}
            data-id="d62af1c0525b"
            label="Priority"
            name="priority"
            options={priorities}
            stroke="dropdown.icon"
            variant="secondaryVariant" />
        </GridItem>
      </Grid>
      <TextInputMultiline
        control={control}
        data-id="dd6ff01ea97f"
        label="Description"
        name="description" />
      <Spacer data-id="a6a6bec328e3" />
      {selectedAction?.metatags?.addedAt && selectedAction?.assignor && (
        <Grid columnGap={4} data-id="8bd1fa37a651" templateColumns="repeat(2, 1fr)">
          <GridItem data-id="51f112784e99">
            <Text
              color="auditActionForm.labelFont.normal"
              data-id="bb63989e7e9a"
              fontSize="11px"
              fontWeight="bold"
              mb={1}>
              Date added
            </Text>
            <Text data-id="d7b79ac10d22" fontSize="13px">{format(new Date(selectedAction?.metatags?.addedAt!), 'd MMM yyyy')}</Text>
          </GridItem>
          <GridItem data-id="cb7d320a6854">
            <Text
              color="auditActionForm.labelFont.normal"
              data-id="4b20ebabc304"
              fontSize="11px"
              fontWeight="bold"
              mb={1}>
              Assigned by
            </Text>
            {selectedAction?.assignor && (
              <Flex align="center" data-id="40b81b8ade10" direction="row">
                <Avatar
                  data-id="182a002344fc"
                  name={selectedAction?.assignor?.displayName}
                  size="xs"
                  src={selectedAction?.assignor?.imgUrl} />
                <Text
                  data-id="4558d9a9eaa5"
                  fontSize="13px"
                  lineHeight="17px"
                  opacity="1"
                  overflow="hidden"
                  pl={3}
                  textOverflow="ellipsis"
                  w="full"
                  whiteSpace="nowrap">
                  {selectedAction?.assignor?.displayName}
                </Text>
              </Flex>
            )}
          </GridItem>
        </Grid>
      )}
      <HStack data-id="d25fa99b5583" justify="flex-end" pb={3} pt={4} w="full">
        <Button
          bgColor="auditActionForm.buttons.cancel.bg"
          color="auditActionForm.buttons.cancel.color"
          data-id="b3e9ac0e4d15"
          fontSize="ssm"
          fontWeight="semibold"
          h="28px"
          onClick={handleClose}
          rounded="10px">
          Cancel
        </Button>
        <Button
          bgColor="auditActionForm.buttons.save.bg"
          color="auditActionForm.buttons.save.color"
          data-id="d88b305bc9d7"
          disabled={!isValid}
          fontSize="ssm"
          fontWeight="semibold"
          h="28px"
          onClick={() => {
            handleSave(values);
            handleClose();
          }}
          rounded="10px">
          Save action
        </Button>
      </HStack>
    </Stack>
  </>);
};

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
