import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useMutation } from '@apollo/client';
import {
  Avatar,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spacer,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { uniqBy } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { priorities, toastFailed, toastSuccess } from '../../bootstrap/config';
import { AdminContext } from '../../contexts/AdminProvider';
import { useAppContext } from '../../contexts/AppProvider';
import useNavigate from '../../hooks/useNavigate';
import { Close, OpenExternalIcon, TickIcon } from '../../icons';
import { IAction } from '../../interfaces/IAction';
import DocumentThumbnail from '../Documents/DocumentThumbnail';
import DocumentUpload from '../Documents/DocumentUpload';
import DocumentUploaded from '../Documents/DocumentUploaded';
import { Datepicker, Dropdown, TextInput } from '../Forms';
import PeoplePicker from '../Forms/PeoplePicker';
import TextInputMultiline from '../Forms/TextInputMultiline';

const SAVE_ACTION = gql`
  mutation SaveAction($action: ActionModifyInput!) {
    updateAction(actionInput: $action) {
      _id
    }
  }
`;
const DELETE_ACTION = gql`
  mutation DeleteAction($_id: ID!) {
    deleteAction(_id: $_id)
  }
`;

const ActionModal = ({
  action,
  refetch,
}: {
  action?: IAction;
  refetch: () => void;
}) => {
  const toast = useToast();
  const { openInNewTab } = useNavigate();
  const { user } = useAppContext();
  const { setAdminModalState } = useContext(AdminContext);

  const [saveAction] = useMutation(SAVE_ACTION);
  const [deleteAction] = useMutation(DELETE_ACTION);

  const { control, formState, watch, reset, setValue } = useForm({
    mode: 'all',
  });
  const { isValid } = formState;
  const values = watch();

  useEffect(() => {
    reset({
      title: action?.title,
      assigneeId: action?.assigneeId,
      dueDate: action?.dueDate,
      priority: action?.priority,
      status: action?.done ? 'closed' : 'open',
      description: action?.description,
      attachments: action?.attachments,
    });
  }, [JSON.stringify(action)]);

  const handlePrimaryButtonClick = async () => {
    if (!action) return;
    try {
      await saveAction({
        variables: {
          action: {
            _id: action._id,
            title: values.title,
            dueDate: values.dueDate,
            done: values.status === 'closed',
            priority: values.priority,
            description: values.description,
            assigneeId: values.assigneeId,
            attachments: values.attachments.map((attachment) => ({
              id: attachment.id,
              name: attachment.name,
              addedAt: attachment.addedAt,
            })),
          },
        },
      });
      refetch();
      toast({ ...toastSuccess, description: 'Action saved' });
    } catch (e: any) {
      toast({
        ...toastFailed,
        description: e.message,
      });
    } finally {
      setAdminModalState('closed');
    }
  };

  const handleSecondaryButtonClick = async () => {
    if (!action) return;
    try {
      await deleteAction({
        variables: {
          _id: action._id,
        },
      });
      refetch();
      toast({ ...toastSuccess, description: 'Action deleted' });
    } catch (e: any) {
      toast({
        ...toastFailed,
        description: e.message,
      });
    } finally {
      setAdminModalState('closed');
    }
  };

  return (
    <>
      <ModalContent
        bg="actionModal.bg"
        h="100%"
        m="0"
        p={['25px', '35px']}
        position="absolute"
        rounded="0"
      >
        <ModalHeader
          alignItems="center"
          fontSize="xxl"
          fontWeight="bold"
          p="0 0 20px 0"
        >
          <Flex justifyContent="space-between">
            <Flex alignItems="center" fontSize={['14px', '24px']}>
              <Avatar
                mr={3}
                name={user?.displayName}
                rounded="full"
                size="xs"
                src={user?.imgUrl}
              />
              {action?.title}
            </Flex>
            <Flex alignItems="center">
              <Close
                cursor="pointer"
                h="15px"
                onClick={() => setAdminModalState('closed')}
                stroke="actionModal.closeIcon"
                w="15px"
              />
            </Flex>
          </Flex>
        </ModalHeader>
        <ModalBody h="calc(100% - 175px)" overflow="auto" px={['0', '2']}>
          <Stack h="full" spacing={4}>
            <Stack spacing={6}>
              <Stack spacing={4}>
                <Text fontSize="smm" fontWeight="semibold">
                  Belongs to
                </Text>
                <HStack
                  bg="actionModal.question.bg"
                  boxShadow="0px 0px 30px 0px #31323340"
                  flexGrow={1}
                  justify="space-between"
                  px={6}
                  py={4}
                  rounded="10px"
                  spacing={2}
                >
                  <Stack spacing={1}>
                    <Stack
                      _hover={{
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      align="center"
                      direction="row"
                      onClick={() =>
                        openInNewTab(`/audits/${action?.answer?.audit?._id}`)
                      }
                      spacing={2}
                    >
                      <Text
                        color="actionModal.question.color"
                        fontSize="smm"
                        isTruncated
                      >
                        {action?.answer?.question?.question}
                      </Text>
                      <OpenExternalIcon fill="transparent" stroke="black" />
                    </Stack>
                    <Text color="actionModal.auditType" fontSize="ssm">
                      {action?.answer?.audit?.auditType?.name}
                    </Text>
                  </Stack>
                  <HStack spacing={2}>
                    {(action?.answer?.attachments || [])
                      .slice(0, 2)
                      .map((attachment) => (
                        <DocumentThumbnail
                          document={attachment}
                          key={attachment.id}
                        />
                      ))}
                    {(action?.answer?.attachments || []).length > 2 &&
                      ((action?.answer?.attachments || []).length === 3 ? (
                        <DocumentThumbnail
                          document={action!.answer!.attachments![2]}
                          key={action!.answer!.attachments![2].id}
                        />
                      ) : (
                        <Flex
                          align="center"
                          border="1px solid black"
                          cursor="default"
                          h="55px"
                          justify="center"
                          rounded="3px"
                          w="55px"
                        >
                          +{(action?.answer?.attachments || []).length - 2}
                        </Flex>
                      ))}
                  </HStack>
                </HStack>
              </Stack>
              <Stack spacing={4}>
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
                    <Datepicker
                      control={control}
                      label="Due date"
                      name="dueDate"
                    />
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
                  <GridItem>
                    <Dropdown
                      control={control}
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
                <TextInputMultiline
                  control={control}
                  label="Description"
                  name="description"
                />
                <Stack>
                  <Text fontSize="11px" fontWeight="700" mb={2}>
                    Add photos or files
                  </Text>
                  <DocumentUpload
                    callback={async (uploaded) => {
                      setValue(
                        'attachments',
                        uniqBy(
                          [...values.attachments, ...uploaded],
                          (attachment) => attachment.id,
                        ),
                      );
                    }}
                    elementId={action ? action._id : `temp-${uuidv4()}`}
                  />
                  {values.attachments?.map((attachment, i) => (
                    <Flex flexDir="column" key={i} mb={2}>
                      <DocumentUploaded
                        callback={async () => {
                          setValue(
                            'attachments',
                            values.attachments.filter(
                              ({ id }) => id !== attachment.id,
                            ),
                          );
                        }}
                        document={attachment}
                        downloadable
                        removable
                      />
                    </Flex>
                  ))}
                </Stack>
              </Stack>
            </Stack>
            <Spacer />
            <Flex justify="space-between" w="full">
              <Button
                bg="actionModal.buttons.secondary.bg"
                color="actionModal.buttons.secondary.color"
                fontSize="smm"
                fontWeight="700"
                h="40px"
                ml={3}
                onClick={handleSecondaryButtonClick}
                rounded="10px"
                w="fit-content"
              >
                Remove
              </Button>
              <Button
                bg="actionModal.buttons.primary.bg"
                color="actionModal.buttons.primary.color"
                disabled={!isValid}
                fontSize="smm"
                fontWeight="700"
                h="40px"
                ml={3}
                onClick={handlePrimaryButtonClick}
                rightIcon={
                  <Icon
                    as={TickIcon}
                    size={24}
                    stroke="actionModal.buttons.primary.icon"
                  />
                }
                rounded="10px"
                w="fit-content"
              >
                Update
              </Button>
            </Flex>
          </Stack>
        </ModalBody>
      </ModalContent>
    </>
  );
};

export default ActionModal;

export const actionModalStyles = {
  actionModal: {
    bg: '#ffffff',
    closeIcon: '#282F36',
    question: {
      color: '#1E1836',
      bg: '#FFFFFF',
    },
    auditType: '#1E183670',
    buttons: {
      primary: {
        icon: '#ffffff',
        bg: '#DC0043',
        color: '#ffffff',
      },
      secondary: {
        bg: '#1E1836',
        color: '#FFFFFF',
      },
    },
  },
};
