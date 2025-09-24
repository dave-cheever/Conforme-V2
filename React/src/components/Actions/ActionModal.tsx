import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { gql, useMutation } from "@apollo/client";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { endOfDay, format } from "date-fns";
import { t } from "i18next";
import { capitalize } from "lodash";
import { v4 as uuidv4 } from "uuid";

import { priorities, toastFailed, toastSuccess } from "../../bootstrap/config";
import { useAdminContext } from "../../contexts/AdminProvider";
import { useAppContext } from "../../contexts/AppProvider";
import { useShareContext } from "../../contexts/ShareProvider";
import useNavigate from "../../hooks/useNavigate";
import { Close, OpenExternalIcon, TickIcon } from "../../icons";
import { IAction } from "../../interfaces/IAction";
import { isPermitted } from "../can";
import DocumentThumbnail from "../Documents/DocumentThumbnail";
import DocumentUpload from "../Documents/DocumentUpload";
import DocumentUploaded from "../Documents/DocumentUploaded";
import { Datepicker, Dropdown, TextInput } from "../Forms";
import PeoplePicker from "../Forms/PeoplePicker";
import TextInputMultiline from "../Forms/TextInputMultiline";
import ShareButton from "../ShareButton";

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

function ActionModal({
  action,
  closeModal,
  refetch,
}: {
  action?: IAction;
  closeModal: () => void;
  refetch: () => void;
}) {
  const toast = useToast();
  const { openInNewTab } = useNavigate();
  const { user } = useAppContext();
  const { handleShareOpen, setShareItemUrl, setShareItemName } =
    useShareContext();
  const { setAdminModalState } = useAdminContext();
  const isUserPermittedToModify = isPermitted({
    user,
    action: "actions.edit",
    data: { action, answer: action?.answer, audit: action?.answer?.audit },
  });

  const [saveAction] = useMutation(SAVE_ACTION);
  const [deleteAction] = useMutation(DELETE_ACTION);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const { control, formState, watch, reset } = useForm({
    mode: "all",
  });
  const { isValid } = formState;
  const values = watch();

  const { append: appendAttachment, remove: removeAttachment } = useFieldArray({
    control,
    name: "attachments",
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
            dueDate: values.dueDate ? endOfDay(new Date(values.dueDate)) : null,
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
      toast({ ...toastSuccess, description: "Action saved" });
    } catch (e: any) {
      toast({
        ...toastFailed,
        description: e.message,
      });
    } finally {
      setAdminModalState("closed");
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
      toast({ ...toastSuccess, description: "Action deleted" });
    } catch (e: any) {
      toast({
        ...toastFailed,
        description: e.message,
      });
    } finally {
      setAdminModalState("closed");
    }
  };

  return (
    <>
      <ModalContent
        data-id="000585"
        bg="actionModal.bg"
        h="100%"
        m="0"
        overflow="hidden"
        p={[4, 6]}
        rounded="0"
      >
        <ModalHeader
          data-id="000586"
          alignItems="center"
          fontSize="xxl"
          fontWeight="bold"
          p="0"
        >
          <Flex data-id="000587" justifyContent="space-between">
            <Flex
              data-id="000588"
              alignItems="center"
              fontSize={["14px", "24px"]}
            >
              <Tooltip
                data-id="000589"
                label={action?.assignee?.displayName ?? "No assignee"}
              >
                <Avatar
                  data-id="000590"
                  mr={3}
                  name={action?.assignee?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
                  rounded="full"
                  size="xs"
                  src={action?.assignee?.imgUrl}
                />
              </Tooltip>
              <Text data-id="000591" wordBreak="break-word">
                {action?.title}
              </Text>
            </Flex>
            <Flex data-id="000592" alignItems="center">
              <ShareButton
                data-id="000593"
                ariaLabel="action-share-button"
                onClick={() => {
                  setShareItemUrl(`actions?id=${action?._id}`);
                  setShareItemName(action?.title);
                  handleShareOpen();
                }}
              />
              <Close
                data-id="000594"
                cursor="pointer"
                h="15px"
                onClick={closeModal}
                stroke="actionModal.closeIcon"
                w="15px"
              />
            </Flex>
          </Flex>
        </ModalHeader>
        <ModalBody data-id="000595" overflowY="auto" p="1rem 0 0 0">
          <Stack
            data-id="000596"
            flexGrow={1}
            justify="space-between"
            overflowY="auto"
            px={2}
            py={0}
            spacing={2}
          >
            <Stack data-id="000597" spacing={4}>
              <Text data-id="000598" fontSize="smm" fontWeight="semibold">
                {capitalize(t("question"))}
              </Text>
              <HStack
                data-id="000599"
                bg="actionModal.question.bg"
                boxShadow="simple"
                flexGrow={1}
                justify="space-between"
                px={6}
                py={4}
                rounded="10px"
                spacing={6}
              >
                <Stack data-id="000600" spacing={1}>
                  <Stack
                    data-id="000601"
                    _hover={{
                      textDecoration: "underline",
                      cursor: "pointer",
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
                    <Text
                      data-id="000602"
                      color="actionModal.question.color"
                      fontSize="smm"
                      noOfLines={1}
                      whiteSpace="break-spaces"
                      wordBreak="break-word"
                    >
                      {action?.answer?.question?.question}
                    </Text>
                    <OpenExternalIcon
                      data-id="000603"
                      fill="transparent"
                      stroke="black"
                    />
                  </Stack>
                  <Text
                    data-id="000604"
                    color="actionModal.auditType"
                    fontSize="ssm"
                  >
                    {action?.answer?.audit?.auditType?.name}
                  </Text>
                </Stack>
                <HStack data-id="000605" spacing={2}>
                  {(action?.answer?.attachments || [])
                    .slice(0, 2)
                    .map((attachment) => (
                      <DocumentThumbnail
                        data-id="000606"
                        document={attachment}
                        key={attachment.id}
                      />
                    ))}
                  {(action?.answer?.attachments || []).length > 2 &&
                    ((action?.answer?.attachments || []).length === 3 ? (
                      <DocumentThumbnail
                        data-id="000607"
                        document={action!.answer!.attachments![2]}
                        key={action!.answer!.attachments![2].id}
                      />
                    ) : (
                      <Flex
                        data-id="000608"
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
            <Stack data-id="000609" spacing={4}>
              <Text data-id="000610" fontSize="smm" fontWeight="semibold">
                Action details
              </Text>
              <Grid
                data-id="000611"
                columnGap={4}
                rowGap={2}
                templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
              >
                <GridItem data-id="000612">
                  <TextInput
                    data-id="000613"
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
                <GridItem data-id="000614">
                  <PeoplePicker
                    data-id="000615"
                    control={control}
                    disabled={!isUserPermittedToModify}
                    label="Assigned to"
                    name="assigneeId"
                  />
                </GridItem>
                <GridItem data-id="000616">
                  <Datepicker
                    data-id="000617"
                    control={control}
                    disabled={!isUserPermittedToModify}
                    label="Due date"
                    name="dueDate"
                  />
                </GridItem>
                <GridItem data-id="000618">
                  <Dropdown
                    data-id="000619"
                    control={control}
                    disabled={!isUserPermittedToModify}
                    label="Priority"
                    name="priority"
                    options={priorities}
                    stroke="dropdown.icon"
                    variant="secondaryVariant"
                  />
                </GridItem>
                <GridItem data-id="000620">
                  <Dropdown
                    data-id="000621"
                    control={control}
                    disabled={!isUserPermittedToModify}
                    label="Status"
                    name="status"
                    options={[
                      { label: "Open", value: "open" },
                      { label: "Closed", value: "closed" },
                    ]}
                    stroke="dropdown.icon"
                    variant="secondaryVariant"
                  />
                </GridItem>
              </Grid>
              <TextInputMultiline
                data-id="000622"
                control={control}
                disabled={!isUserPermittedToModify}
                label="Description"
                name="description"
              />
              <Grid
                data-id="000623"
                columnGap={4}
                templateColumns="repeat(2, 1fr)"
              >
                <GridItem data-id="000624">
                  <Text
                    data-id="000625"
                    color="auditActionForm.labelFont.normal"
                    fontSize="11px"
                    fontWeight="bold"
                  >
                    Date added
                  </Text>
                  <Text data-id="000626" fontSize="13px">
                    {format(
                      new Date(action?.metatags?.addedAt! || null),
                      "dd MMM yyyy",
                    )}
                  </Text>
                </GridItem>
                {action?.creator && (
                  <GridItem data-id="000627">
                    <Text
                      data-id="000628"
                      color="auditActionForm.labelFont.normal"
                      fontSize="11px"
                      fontWeight="bold"
                    >
                      Created by
                    </Text>
                    <Flex
                      data-id="000629"
                      align="center"
                      direction="row"
                      mt={1}
                    >
                      <Avatar
                        data-id="000630"
                        name={action?.creator?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
                        size="xs"
                        src={action?.creator?.imgUrl}
                      />
                      <Text
                        data-id="000631"
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
              <Stack data-id="000632">
                {isUserPermittedToModify && (
                  <>
                    <Text
                      data-id="000633"
                      fontSize="11px"
                      fontWeight="700"
                      mb={2}
                    >
                      Add photos or files
                    </Text>
                    <DocumentUpload
                      data-id="000634"
                      callback={async (uploaded) => appendAttachment(uploaded)}
                      elementId={action ? action._id : `temp-${uuidv4()}`}
                    />
                  </>
                )}
                {values.attachments?.map((attachment, i) => (
                  <Flex data-id="000635" flexDir="column" key={i} mb={2}>
                    <DocumentUploaded
                      data-id="000636"
                      callback={async () => removeAttachment(i)}
                      document={attachment}
                      downloadable
                      removable
                    />
                  </Flex>
                ))}
                {values.attachments?.length === 0 &&
                  !isUserPermittedToModify && (
                    <Text data-id="000637" fontSize="sm">
                      No uploaded attachments
                    </Text>
                  )}
              </Stack>
            </Stack>
          </Stack>
        </ModalBody>
        <ModalFooter data-id="000638" p={1}>
          <Flex
            data-id="000639"
            flexBasis="calc(40px + 1rem)"
            flexShrink={0}
            justify="space-between"
            w="full"
          >
            {isPermitted({ user, action: "actions.delete" }) ? (
              <Button
                data-id="000640"
                bg="actionModal.buttons.secondary.bg"
                color="actionModal.buttons.secondary.color"
                fontSize="smm"
                fontWeight="700"
                h="40px"
                ml={3}
                onClick={() => {
                  setIsConfirmDeleteOpen(true);
                }}
                rounded="10px"
                w="fit-content"
              >
                Delete
              </Button>
            ) : (
              <Spacer data-id="000641" />
            )}
            {isUserPermittedToModify && (
              <Button
                data-id="000642"
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
                    data-id="000643"
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
            )}
          </Flex>
        </ModalFooter>
      </ModalContent>
      <Modal
        data-id="000644"
        isCentered
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}>
        <ModalOverlay data-id="000645" />
        <ModalContent
          data-id="000646"
          bg="white"
          borderRadius="12px"
          boxShadow="lg"
          p={6}
          textAlign="center">
          <Box
            data-id="000647"
            color="gray.800"
            fontSize="xl"
            fontWeight="bold"
            mb={4}>
            Confirm Delete
          </Box>
          <Box data-id="000648" color="gray.600" mb={6}>
            Are you sure you want to delete this item? This action cannot be
            undone.
          </Box>
          <Flex data-id="000649" justify="center">
            <Button
              data-id="000650"
              colorScheme="gray"
              mr={3}
              onClick={() => setIsConfirmDeleteOpen(false)}
              variant="outline">
              Cancel
            </Button>
            <Button
              data-id="000651"
              colorScheme="red"
              onClick={handleSecondaryButtonClick}>
              Delete
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ActionModal;

export const actionModalStyles = {
  actionModal: {
    bg: "#ffffff",
    closeIcon: "#282F36",
    question: {
      color: "#1E1836",
      bg: "#FFFFFF",
    },
    auditType: "#1E183670",
    buttons: {
      primary: {
        icon: "#ffffff",
        bg: "#DC0043",
        color: "#ffffff",
      },
      secondary: {
        bg: "#1E1836",
        color: "#FFFFFF",
      },
    },
  },
};
