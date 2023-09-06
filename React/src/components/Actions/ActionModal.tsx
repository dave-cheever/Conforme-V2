import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

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
  ModalFooter,
  ModalHeader,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { endOfDay, format } from 'date-fns';
import { t } from 'i18next';
import { capitalize } from 'lodash';
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

function ActionModal({ action, closeModal, refetch }: { action?: IAction; closeModal: () => void; refetch: () => void }) {
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

  const { control, formState, watch, reset } = useForm({
    mode: 'all',
  });
  const { isValid } = formState;
  const values = watch();

  const { append: appendAttachment, remove: removeAttachment } = useFieldArray({
    control,
    name: 'attachments',
  });

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

  return (<ModalContent
      bg="actionModal.bg"
      data-id="e07489b5ec0d"
      h="100vh"
      m="0"
      overflow="hidden"
      p={[4, 6]}
      rounded="0">
      <ModalHeader
        alignItems="center"
        data-id="ab5237152720"
        fontSize="xxl"
        fontWeight="bold"
        p="0">
        <Flex data-id="e2fe1c361853" justifyContent="space-between">
          <Flex alignItems="center" data-id="c2aa63d2a252" fontSize={['14px', '24px']}>
            <Tooltip
              data-id="d691eb52a15c"
              label={action?.assignee?.displayName ?? 'No assignee'}>
              <Avatar
                data-id="3739132585c0"
                mr={3}
                name={action?.assignee?.displayName}
                rounded="full"
                size="xs"
                src={action?.assignee?.imgUrl} />
            </Tooltip>
            <Text data-id="6fb3fae752bf" wordBreak="break-word">{action?.title}</Text>
          </Flex>
          <Flex alignItems="center" data-id="4d21b7862bbc">
            <ShareButton
              ariaLabel="action-share-button"
              data-id="29d025ed5c1f"
              onClick={() => {
                setShareItemUrl(`actions?id=${action?._id}`);
                setShareItemName(action?.title);
                handleShareOpen();
              }} />
            <Close
              cursor="pointer"
              data-id="1ac72cd12f49"
              h="15px"
              onClick={closeModal}
              stroke="actionModal.closeIcon"
              w="15px" />
          </Flex>
        </Flex>
      </ModalHeader>
      <ModalBody data-id="50f60632e192" overflowY="auto" p="1rem 0 0 0">
        <Stack
          data-id="cc1a3ff59ef0"
          flexGrow={1}
          justify="space-between"
          overflowY="auto"
          px={2}
          py={0}
          spacing={2}>
          <Stack data-id="4d3e1281b830" spacing={4}>
            <Text data-id="9e9395f9db3e" fontSize="smm" fontWeight="semibold">
              {capitalize(t('question'))}
            </Text>
            <HStack
              bg="actionModal.question.bg"
              boxShadow="simple"
              data-id="1d7c6d0a7462"
              flexGrow={1}
              justify="space-between"
              px={6}
              py={4}
              rounded="10px"
              spacing={2}>
              <Stack data-id="163e95ebcb07" spacing={1}>
                <Stack
                  _hover={{
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                  align="center"
                  data-id="11fd2eb9f522"
                  direction="row"
                  onClick={() =>
                    openInNewTab(
                      `/audits/${action?.answer?.audit?._id}?questionId=${action?.answer?.questionId}&questionsCategoryId=${action?.answer?.question?.questionsCategoryId}`,
                    )
                  }
                  spacing={2}>
                  <Text
                    color="actionModal.question.color"
                    data-id="ae57d245c6e8"
                    fontSize="smm"
                    noOfLines={1}
                    whiteSpace="break-spaces"
                    wordBreak="break-word">
                    {action?.answer?.question?.question}
                  </Text>
                  <OpenExternalIcon data-id="c782a47fc7e5" fill="transparent" stroke="black" />
                </Stack>
                <Text color="actionModal.auditType" data-id="7b5e7fbd59ea" fontSize="ssm">
                  {action?.answer?.audit?.auditType?.name}
                </Text>
              </Stack>
              <HStack data-id="df4841a0d834" spacing={2}>
                {(action?.answer?.attachments || []).slice(0, 2).map((attachment) => (
                  <DocumentThumbnail data-id="329a11d03c6b" document={attachment} key={attachment.id} />
                ))}
                {(action?.answer?.attachments || []).length > 2 &&
                  ((action?.answer?.attachments || []).length === 3 ? (
                    <DocumentThumbnail
                      data-id="998517db12bd"
                      document={action!.answer!.attachments![2]}
                      key={action!.answer!.attachments![2].id} />
                  ) : (
                    <Flex
                      align="center"
                      border="1px solid"
                      borderColor="documentUploaded.border"
                      cursor="default"
                      data-id="a5ff0a532833"
                      h="55px"
                      justify="center"
                      rounded="3px"
                      w="55px">
                      +{(action?.answer?.attachments || []).length - 2}
                    </Flex>
                  ))}
              </HStack>
            </HStack>
          </Stack>
          <Stack data-id="d3b9933975f6" spacing={4}>
            <Text data-id="f07743e3a201" fontSize="smm" fontWeight="semibold">
              Action details
            </Text>
            <Grid
              columnGap={4}
              data-id="0ce9bf10acd2"
              rowGap={2}
              templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}>
              <GridItem data-id="3748117cbef3">
                <TextInput
                  control={control}
                  data-id="e202cf483960"
                  disabled={!isUserPermittedToModify}
                  label="Title"
                  name="title"
                  required
                  validations={{
                    notEmpty: true,
                  }} />
              </GridItem>
              <GridItem data-id="f6c3c382f734">
                <PeoplePicker
                  control={control}
                  data-id="8751783dd875"
                  disabled={!isUserPermittedToModify}
                  label="Assigned to"
                  name="assigneeId" />
              </GridItem>
              <GridItem data-id="ab774497f5a5">
                <Datepicker
                  control={control}
                  data-id="bbdaeb2f8b3e"
                  disabled={!isUserPermittedToModify}
                  label="Due date"
                  name="dueDate" />
              </GridItem>
              <GridItem data-id="a68021d3a601">
                <Dropdown
                  control={control}
                  data-id="231fd6397d17"
                  disabled={!isUserPermittedToModify}
                  label="Priority"
                  name="priority"
                  options={priorities}
                  stroke="dropdown.icon"
                  variant="secondaryVariant" />
              </GridItem>
              <GridItem data-id="d27bb587d5d3">
                <Dropdown
                  control={control}
                  data-id="02a1107a39d2"
                  disabled={!isUserPermittedToModify}
                  label="Status"
                  name="status"
                  options={[
                    { label: 'Open', value: 'open' },
                    { label: 'Closed', value: 'closed' },
                  ]}
                  stroke="dropdown.icon"
                  variant="secondaryVariant" />
              </GridItem>
            </Grid>
            <TextInputMultiline
              control={control}
              data-id="3ce456de61b9"
              disabled={!isUserPermittedToModify}
              label="Description"
              name="description" />
            <Grid columnGap={4} data-id="7989e38f30ea" templateColumns="repeat(2, 1fr)">
              <GridItem data-id="4a89938dc5f2">
                <Text
                  color="auditActionForm.labelFont.normal"
                  data-id="428cc5b99f38"
                  fontSize="11px"
                  fontWeight="bold">
                  Date added
                </Text>
                <Text data-id="899b6e01927a" fontSize="13px">{format(new Date(action?.metatags?.addedAt! || null), 'dd MMM yyyy')}</Text>
              </GridItem>
              {action?.creator && (
                <GridItem data-id="6e73d43f0d0e">
                  <Text
                    color="auditActionForm.labelFont.normal"
                    data-id="363d969f210c"
                    fontSize="11px"
                    fontWeight="bold">
                    Created by
                  </Text>
                  <Flex align="center" data-id="a3b011dc9042" direction="row" mt={1}>
                    <Avatar
                      data-id="e9c608c6b835"
                      name={action?.creator?.displayName}
                      size="xs"
                      src={action?.creator?.imgUrl} />
                    <Text
                      data-id="ffc737b1be80"
                      fontSize="13px"
                      lineHeight="17px"
                      opacity="1"
                      overflow="hidden"
                      pl={3}
                      textOverflow="ellipsis"
                      w="full"
                      whiteSpace="nowrap">
                      {action?.creator?.displayName}
                    </Text>
                  </Flex>
                </GridItem>
              )}
            </Grid>
            <Stack data-id="dc5db89213e9">
              {isUserPermittedToModify && (
                <>
                  <Text data-id="3239fd7cd745" fontSize="11px" fontWeight="700" mb={2}>
                    Add photos or files
                  </Text>
                  <DocumentUpload
                    callback={async (uploaded) => appendAttachment(uploaded)}
                    data-id="9f942bc4000b"
                    elementId={action ? action._id : `temp-${uuidv4()}`} />
                </>
              )}
              {values.attachments?.map((attachment, i) => (
                <Flex data-id="ecf74b22d4d3" flexDir="column" key={i} mb={2}>
                  <DocumentUploaded
                    callback={async () => removeAttachment(i)}
                    data-id="197a8db0f08f"
                    document={attachment}
                    downloadable
                    removable />
                </Flex>
              ))}
              {values.attachments?.length === 0 && !isUserPermittedToModify && <Text data-id="c6504a985879" fontSize="sm">No uploaded attachments</Text>}
            </Stack>
          </Stack>
        </Stack>
      </ModalBody>
      <ModalFooter data-id="a14b7ad52efe">
        <Flex
          data-id="4709849a4fa4"
          flexBasis="calc(40px + 1rem)"
          flexShrink={0}
          justify="space-between"
          pt={4}
          w="full">
          {isPermitted({ user, action: 'actions.delete' }) ? (
            <Button
              bg="actionModal.buttons.secondary.bg"
              color="actionModal.buttons.secondary.color"
              data-id="9fefa4365d1f"
              fontSize="smm"
              fontWeight="700"
              h="40px"
              ml={3}
              onClick={handleSecondaryButtonClick}
              rounded="10px"
              w="fit-content">
              Delete
            </Button>
          ) : (
            <Spacer data-id="5fc37842b087" />
          )}
          {isUserPermittedToModify && (
            <Button
              bg="actionModal.buttons.primary.bg"
              color="actionModal.buttons.primary.color"
              data-id="46850ff6331e"
              disabled={!isValid}
              fontSize="smm"
              fontWeight="700"
              h="40px"
              ml={3}
              onClick={handlePrimaryButtonClick}
              rightIcon={<Icon
                as={TickIcon}
                data-id="1c682b5b9581"
                size={24}
                stroke="actionModal.buttons.primary.icon" />}
              rounded="10px"
              w="fit-content">
              Update
            </Button>
          )}
        </Flex>
      </ModalFooter>
    </ModalContent>);
}

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
