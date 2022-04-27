import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Grid, GridItem, HStack, Stack, Text } from '@chakra-ui/react';

import { priorities } from '../../bootstrap/config';
import { useAuditContext } from '../../contexts/AuditProvider';
import { Datepicker, Dropdown, TextInput } from '../Forms';
import PeoplePicker from '../Forms/PeoplePicker';
import TextInputMultiline from '../Forms/TextInputMultiline';

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
      priority: selectedAction?.priority || priorities[0].value,
    });
  }, [JSON.stringify(selectedAction)]);

  const handleClose = () => {
    setSelectedAction(undefined);
  };

  return (
    <Stack bg="auditActionForm.bg" p={4} rounded="10px">
      <Text fontSize="smm" fontWeight="semibold">
        Action details
      </Text>
      <Grid columnGap={4} rowGap={2} templateColumns="repeat(2, 1fr)">
        <GridItem>
          <TextInput
            control={control}
            label="Title"
            name="title"
            required
            validations={{
              notEmpty: true,
            }}
          />
        </GridItem>
        <GridItem>
          <PeoplePicker
            control={control}
            label="Assign to"
            name="assigneeId"
            required
            validations={{
              notEmpty: true,
            }}
          />
        </GridItem>
        <GridItem>
          <Datepicker control={control} label="Due date" name="dueDate" />
        </GridItem>
        <GridItem>
          <Dropdown
            control={control}
            label="Priority"
            name="priority"
            options={priorities}
            stroke="dropdown.icon"
            variant="secondaryVariant"
          />
        </GridItem>
      </Grid>
      <TextInputMultiline
        control={control}
        label="Description"
        name="description"
      />
      <HStack justify="flex-end" pb={3} pt={4} w="full">
        <Button
          bgColor="auditActionForm.buttons.cancel.bg"
          color="auditActionForm.buttons.cancel.color"
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
          disabled={!isValid}
          fontSize="ssm"
          fontWeight="semibold"
          h="28px"
          onClick={() => {
            handleSave(values);
            handleClose();
          }}
          rounded="10px"
        >
          Save
        </Button>
      </HStack>
    </Stack>
  );
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
  },
};

export default ActionForm;
