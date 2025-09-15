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
        data-id="030925-423199"
        isAcionFormValid={isValid}
        onSave={() => {
          handleSave(values);
          handleClose();
        }}
        setSelectedAction={setSelectedAction}
      />
      <Stack bg="auditActionForm.bg" data-id="030925-98586f" p={4} rounded="10px">
        <Text data-id="030925-83a6de" fontSize="smm" fontWeight="semibold">
          Action details
        </Text>
        <Grid columnGap={4} data-id="030925-2da311" rowGap={2} templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}>
          <GridItem data-id="030925-b46203">
            <TextInput
              control={control}
              data-id="030925-ba671d"
              label="Title"
              name="title"
              required
              validations={{
                notEmpty: true,
              }}
            />
          </GridItem>
          <GridItem data-id="030925-1d9c97">
            <PeoplePicker control={control} data-id="030925-3e794d" label="Assign to" name="assigneeId" />
          </GridItem>
          <GridItem data-id="030925-6c6339">
            <Datepicker control={control} data-id="030925-0047ad" label="Due date" name="dueDate" />
          </GridItem>
          <GridItem data-id="030925-987cb1">
            <Dropdown
              control={control}
              data-id="030925-c8848d"
              label="Priority"
              name="priority"
              options={priorities}
              stroke="dropdown.icon"
              variant="secondaryVariant"
            />
          </GridItem>
          <GridItem data-id="030925-bbb3da">
            <Dropdown
              control={control}
              data-id="030925-59fe7c"
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
        <TextInputMultiline control={control} data-id="030925-1c1ce5" label="Description" name="description" />
        <Spacer data-id="030925-8f8650" />
        {selectedAction?.metatags?.addedAt && selectedAction?.assignor && (
          <Grid columnGap={4} data-id="030925-6dc40c" templateColumns="repeat(2, 1fr)">
            <GridItem data-id="030925-bb758a">
              <Text color="auditActionForm.labelFont.normal" data-id="030925-b6b41d" fontSize="11px" fontWeight="bold" mb={1}>
                Date added
              </Text>
              <Text data-id="030925-8dc9c3" fontSize="13px">
                {format(new Date(selectedAction?.metatags?.addedAt!), 'd MMM yyyy')}
              </Text>
            </GridItem>
            <GridItem data-id="030925-913992">
              <Text color="auditActionForm.labelFont.normal" data-id="030925-7d7e49" fontSize="11px" fontWeight="bold" mb={1}>
                Assigned by
              </Text>
              {selectedAction?.assignor && (
                <Flex align="center" data-id="030925-38b65b" direction="row">
                  <Avatar
                    data-id="030925-3026c7"
                    name={selectedAction?.assignor?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
                    size="xs"
                    src={selectedAction?.assignor?.imgUrl}
                  />
                  <Text
                    data-id="030925-a3c4ef"
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
        <HStack data-id="030925-d69784" justify="flex-end" pb={3} pt={4} w="full">
          <Button
            bgColor="auditActionForm.buttons.cancel.bg"
            color="auditActionForm.buttons.cancel.color"
            data-id="030925-6998b3"
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
            data-id="030925-b926f4"
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
