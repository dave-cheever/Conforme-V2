import { useEffect } from 'react';
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
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { endOfDay, format } from 'date-fns';
import { t } from 'i18next';
import { capitalize, uniqBy } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { priorities, toastFailed, toastSuccess } from '../../bootstrap/config';
import { useAdminContext } from '../../contexts/AdminProvider';
import { useAppContext } from '../../contexts/AppProvider';
import { useShareContext } from '../../contexts/ShareProvider';
import useNavigate from '../../hooks/useNavigate';
import { Close, OpenExternalIcon, TickIcon } from '../../icons';
import { IAction } from '../../interfaces/IAction';
import { isPermitted } from '../can';
import DocumentThumbnail from '../Documents/DocumentThumbnail';
import DocumentUpload from '../Documents/DocumentUpload';
import DocumentUploaded from '../Documents/DocumentUploaded';
import { Datepicker, Dropdown, TextInput } from '../Forms';
import PeoplePicker from '../Forms/PeoplePicker';
import TextInputMultiline from '../Forms/TextInputMultiline';
import ShareButton from '../ShareButton';

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

const ActionModal = ({ action, closeModal, refetch }: { action?: IAction; closeModal: () => void; refetch: () => void }) => {
  const toast = useToast();
  const { openInNewTab } = useNavigate();
  const { user } = useAppContext();
  const { handleShareOpen, setShareItemUrl, setShareItemName } = useShareContext();
  const { setAdminModalState } = useAdminContext();
  const isUserPermittedToModify = isPermitted({
    user,
    action: 'actions.edit',
    data: { action, answer: action?.answer, audit: action?.answer?.audit },
  });

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
      status: action?.status,
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
            dueDate: values.dueDate ? endOfDay(values.dueDate) : null,
            status: values?.status,
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
      <ModalContent bg="actionModal.bg" h="auto" m="0" minH="100vh" overflow="hidden" p={[4, 6]} rounded="0">
        <ModalHeader alignItems="center" fontSize="xxl" fontWeight="bold" p="0">
          <Flex justifyContent="space-between">
            <Flex alignItems="center" fontSize={['14px', '24px']}>
              <Tooltip label={action?.assignee?.displayName ?? 'No assignee'}>
                <Avatar mr={3} name={action?.assignee?.displayName} rounded="full" size="xs" src={action?.assignee?.imgUrl} />
              </Tooltip>
              {action?.title}
            </Flex>
            <Flex alignItems="center">
              <ShareButton
                ariaLabel="action-share-button"
                onClick={() => {
                  setShareItemUrl(`actions?id=${action?._id}`);
                  setShareItemName(action?.title);
                  handleShareOpen();
                }}
              />
              <Close cursor="pointer" h="15px" onClick={closeModal} stroke="actionModal.closeIcon" w="15px" />
            </Flex>
          </Flex>
        </ModalHeader>
        <ModalBody h="calc(100% - 1rem)" p="1rem 0 0 0">
          <Stack h="100%" justify="space-between" spacing={2}>
            <Stack flexGrow={1} overflowY="auto" px={2} py={0} spacing={6}>
              <Stack spacing={4}>
                <Text fontSize="smm" fontWeight="semibold">
                  {capitalize(t('question'))}
                </Text>
                <HStack
                  bg="actionModal.question.bg"
                  boxShadow="simple"
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
                        openInNewTab(
                          `/audits/${action?.answer?.audit?._id}?questionId=${action?.answer?.questionId}&questionsCategoryId=${action?.answer?.question?.questionsCategoryId}`,
                        )
                      }
                      spacing={2}
                    >
                      <Text color="actionModal.question.color" fontSize="smm" isTruncated>
                        {action?.answer?.question?.question}
                      </Text>
                      <OpenExternalIcon fill="transparent" stroke="black" />
                    </Stack>
                    <Text color="actionModal.auditType" fontSize="ssm">
                      {action?.answer?.audit?.auditType?.name}
                    </Text>
                  </Stack>
                  <HStack spacing={2}>
                    {(action?.answer?.attachments || []).slice(0, 2).map((attachment) => (
                      <DocumentThumbnail document={attachment} key={attachment.id} />
                    ))}
                    {(action?.answer?.attachments || []).length > 2 &&
                      ((action?.answer?.attachments || []).length === 3 ? (
                        <DocumentThumbnail document={action!.answer!.attachments![2]} key={action!.answer!.attachments![2].id} />
                      ) : (
                        <Flex
                          align="center"
                          border="1px solid"
                          borderColor="documentUploaded.border"
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
                <Grid columnGap={4} rowGap={2} templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}>
                  <GridItem>
                    <TextInput
                      control={control}
                      disabled={!isUserPermittedToModify}
                      label="Title"
                      name="title"
                      required
                      validations={{
                        notEmpty: true,
                      }}
                    />
                  </GridItem>
                  <GridItem>
                    <PeoplePicker control={control} disabled={!isUserPermittedToModify} label="Assigned to" name="assigneeId" />
                  </GridItem>
                  <GridItem>
                    <Datepicker control={control} disabled={!isUserPermittedToModify} label="Due date" name="dueDate" />
                  </GridItem>
                  <GridItem>
                    <Dropdown
                      control={control}
                      disabled={!isUserPermittedToModify}
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
                      disabled={!isUserPermittedToModify}
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
                <TextInputMultiline control={control} disabled={!isUserPermittedToModify} label="Description" name="description" />
                <Grid columnGap={4} templateColumns="repeat(2, 1fr)">
                  <GridItem>
                    <Text color="auditActionForm.labelFont.normal" fontSize="11px" fontWeight="bold">
                      Date added
                    </Text>
                    <Text fontSize="13px">{format(new Date(action?.metatags?.addedAt! || null), 'dd MMM yyyy')}</Text>
                  </GridItem>
                  {action?.creator && (
                    <GridItem>
                      <Text color="auditActionForm.labelFont.normal" fontSize="11px" fontWeight="bold">
                        Created by
                      </Text>
                      <Flex align="center" direction="row" mt={1}>
                        <Avatar name={action?.creator?.displayName} size="xs" src={action?.creator?.imgUrl} />
                        <Text
                          fontSize="13px"
                          lineHeight="17px"
                          opacity="1"
                          overflow="hidden"
                          pl={3}
                          textOverflow="ellipsis"
                          w="full"
                          whiteSpace="nowrap"
                        >
                          {action?.creator?.displayName}
                        </Text>
                      </Flex>
                    </GridItem>
                  )}
                </Grid>
                <Stack>
                  {isUserPermittedToModify && (
                    <>
                      <Text fontSize="11px" fontWeight="700" mb={2}>
                        Add photos or files
                      </Text>
                      <DocumentUpload
                        callback={async (uploaded) => {
                          setValue(
                            'attachments',
                            uniqBy([...values.attachments, ...uploaded], (attachment) => attachment.id),
                          );
                        }}
                        elementId={action ? action._id : `temp-${uuidv4()}`}
                      />
                    </>
                  )}
                  {values.attachments?.map((attachment, i) => (
                    <Flex flexDir="column" key={i} mb={2}>
                      <DocumentUploaded
                        callback={async () => {
                          setValue(
                            'attachments',
                            values.attachments.filter(({ id }) => id !== attachment.id),
                          );
                        }}
                        document={attachment}
                        downloadable
                        removable
                      />
                    </Flex>
                  ))}
                  {values.attachments?.length === 0 && !isUserPermittedToModify && <Text fontSize="sm">No uploaded attachments</Text>}
                </Stack>
              </Stack>
            </Stack>
            <Flex flexBasis="calc(40px + 1rem)" flexShrink={0} justify="space-between" pt={4} w="full">
              {isPermitted({ user, action: 'actions.delete' }) ? (
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
                  Delete
                </Button>
              ) : (
                <Spacer />
              )}
              <Button
                bg="actionModal.buttons.primary.bg"
                color="actionModal.buttons.primary.color"
                disabled={!isValid}
                fontSize="smm"
                fontWeight="700"
                h="40px"
                ml={3}
                onClick={handlePrimaryButtonClick}
                rightIcon={<Icon as={TickIcon} size={24} stroke="actionModal.buttons.primary.icon" />}
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
