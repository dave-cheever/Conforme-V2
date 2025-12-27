import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Box,
  Button,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Control } from 'react-hook-form';

import { toastFailed, toastSuccess } from '../../bootstrap/config';
import { AddIcon, Close, Trashcan } from '../../icons';
import { AdminModalState } from '../../interfaces/IAdminContext';
import TextInput from '../Forms/TextInput';
import Dropdown from '../Forms/Dropdown';
import PeoplePicker from '../Forms/PeoplePicker';
import useDevice from '../../hooks/useDevice';
import ActionTemplateDeleteConfirmModal from './ActionTemplateDeleteConfirmModal';
import { RichTextEditor } from '../UI';

const CREATE_ACTION_TEMPLATE = gql`
  mutation ($actionTemplate: ActionTemplateCreateInput!) {
    createActionTemplate(actionTemplate: $actionTemplate) {
      _id
    }
  }
`;

const UPDATE_ACTION_TEMPLATE = gql`
  mutation ($actionTemplateInput: ActionTemplateModifyInput!) {
    updateActionTemplate(actionTemplateInput: $actionTemplateInput) {
      _id
    }
  }
`;

const DELETE_ACTION_TEMPLATE = gql`
  mutation ($_id: String!) {
    deleteActionTemplate(_id: $_id)
  }
`;

const GET_ACTION_CATEGORIES = gql`
  query {
    actionCategories {
      actionCategories {
        _id
        name
      }
      total
    }
  }
`;

interface IActionTemplateFormModal {
  isOpenModal: boolean;
  modalType: AdminModalState;
  control: Control<any>;
  getValues: () => any;
  trigger: () => Promise<boolean>;
  errors: any;
  refetch: () => void;
  setAdminModalState: (state: AdminModalState) => void;
}

const ActionTemplateFormModal = ({
  isOpenModal,
  modalType,
  control,
  getValues,
  trigger,
  errors,
  refetch,
  setAdminModalState,
}: IActionTemplateFormModal) => {
  const { onClose } = useDisclosure();
  const device = useDevice();
  const toast = useToast();
  const { isOpen: isConfirmDeleteOpen, onOpen: onConfirmDeleteOpen, onClose: onConfirmDeleteClose } = useDisclosure();

  const [createActionTemplate, { loading: createLoading }] = useMutation(CREATE_ACTION_TEMPLATE);
  const [updateActionTemplate, { loading: updateLoading }] = useMutation(UPDATE_ACTION_TEMPLATE);
  const [deleteActionTemplate, { loading: deleteLoading }] = useMutation(DELETE_ACTION_TEMPLATE);

  const { data: categoriesData } = useQuery(GET_ACTION_CATEGORIES, {
    fetchPolicy: 'cache-and-network',
  });

  const categoryOptions = categoriesData?.actionCategories?.actionCategories
    ? categoriesData.actionCategories.actionCategories.map((cat: { _id: string; name: string }) => ({
        value: cat._id,
        label: cat.name,
      }))
    : [];

  const isLoading = createLoading || updateLoading || deleteLoading;

  const handleAddActionTemplate = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const actionTemplate = getValues();
        await createActionTemplate({
          variables: {
            actionTemplate: {
              ...actionTemplate,
              suggestedOwnerId: actionTemplate.suggestedOwnerId || null,
            },
          },
        });
        refetch();
        toast({ ...toastSuccess, description: 'Action template added' });
        setAdminModalState('closed');
      } else {
        toast({
          ...toastFailed,
          description: 'Please complete all the required fields',
        });
      }
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    }
  };

  const handleUpdateActionTemplate = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const actionTemplate = getValues();
        await updateActionTemplate({
          variables: {
            actionTemplateInput: {
              _id: actionTemplate?._id,
              title: actionTemplate.title,
              description: actionTemplate.description || '',
              actionCategoryId: actionTemplate.actionCategoryId,
              suggestedOwnerId: actionTemplate.suggestedOwnerId || null,
            },
          },
        });
        refetch();
        toast({ ...toastSuccess, description: 'Action template updated' });
        setAdminModalState('closed');
      } else {
        toast({
          ...toastFailed,
          description: 'Please complete all the required fields',
        });
      }
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    }
  };

  const handleDeleteActionTemplate = async () => {
    try {
      const actionTemplate = getValues();
      await deleteActionTemplate({ variables: { _id: actionTemplate._id } });
      refetch();
      toast({ ...toastSuccess, description: 'Action template deleted' });
      setAdminModalState('closed');
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    }
  };

  const handleAction = async (action) => {
    const isFormValid = await trigger();
    if (['add', 'edit'].includes(action) && !isFormValid) {
      return toast({
        ...toastFailed,
        description: 'Please complete all the required fields',
      });
    }
    switch (action) {
      case 'add':
        handleAddActionTemplate();
        break;
      case 'edit':
        handleUpdateActionTemplate();
        break;
      case 'delete':
        handleDeleteActionTemplate();
        break;
      default:
        setAdminModalState('closed');
    }
  };

  const handleConfirmDelete = () => {
    onConfirmDeleteClose();
    handleAction('delete');
  };

  const handleDiscard = () => {
    if (!isLoading) {
      setAdminModalState('closed');
    }
  };

  return (
    <>
      <ActionTemplateDeleteConfirmModal
        data-id="013097"
        actionTemplateName={getValues()?.title}
        isOpen={isConfirmDeleteOpen}
        onClose={onConfirmDeleteClose}
        onConfirm={handleConfirmDelete}
      />
      <Modal
        blockScrollOnMount={false}
        data-id="000301"
        isOpen={isOpenModal}
        onClose={onClose}
        onEsc={handleDiscard}
        size={device === 'desktop' || device === 'tablet' || modalType === 'delete' ? 'lg' : 'full'}
        variant={modalType === 'delete' ? 'deleteModal' : 'adminModal'}
      >
        <ModalOverlay data-id="000302" />
        {(modalType === 'add' || modalType === 'edit') && (
          <ModalContent bg="actionTemplateFormModal.body.bg" data-id="000303" h="100%" m="0" overflow="hidden" p={0} rounded="0">
            <ModalHeader
              data-id="000304"
              borderBottom="1px solid"
              borderColor="actionTemplateFormModal.modalHeader.borderColor"
              bg="actionTemplateFormModal.modalHeader.bg"
              padding="14px 18px"
              position="relative"
            >
              <Flex alignItems="center" justifyContent="space-between" data-id="000305" position="relative" w="full">
                <Text
                  color="actionTemplateFormModal.modalHeader.titleColor"
                  data-id="000308"
                  fontSize="20px"
                  fontWeight="500"
                  lineHeight="100%"
                >
                  {modalType === 'edit' ? 'Edit action template' : 'Add a new action template'}
                </Text>

                <Box data-id="013209" as="span" display="flex" alignItems="center" gap="10px">
                  {modalType === 'edit' && (
                    <>
                      <Button
                        data-id="000314"
                        _hover={{
                          bg: 'actionTemplateFormModal.deleteButton.hover.bg',
                          color: 'actionTemplateFormModal.deleteButton.hover.color',
                          border: 'none',
                        }}
                        bg="actionTemplateFormModal.deleteButton.bg"
                        color="actionTemplateFormModal.deleteButton.color"
                        border="1px solid"
                        borderColor="actionTemplateFormModal.deleteButton.border"
                        borderRadius="6px"
                        boxShadow="0px 1px 2px 0px #1A202C14"
                        fontSize="12px"
                        fontWeight="500"
                        letterSpacing="0%"
                        padding="6px 8px"
                        isDisabled={isLoading}
                        isLoading={deleteLoading}
                        loadingText="Deleting..."
                        onClick={onConfirmDeleteOpen}
                        leftIcon={
                          <Trashcan
                            data-id="013100"
                            _groupHover={{ color: 'actionTemplateFormModal.deleteButton.hover.iconColor' }}
                            w="12px"
                            h="12px"
                            color="actionTemplateFormModal.deleteButton.iconColor"
                          />
                        }
                        role="group"
                      >
                        Delete template
                      </Button>

                      <Divider data-id="013210" orientation="vertical" height="30px" />
                    </>
                  )}
                  <Box data-id="000309" _hover={{ opacity: 0.7 }} cursor="pointer" lineHeight="100%">
                    <Close data-id="013098" h="16px" onClick={handleDiscard} stroke="actionTemplateFormModal.closeIcon.color" w="16px" />
                  </Box>
                </Box>
              </Flex>
            </ModalHeader>
            <ModalBody data-id="000310" bg="actionTemplateFormModal.modalBody.bg" p="18px" overflowY="auto">
              <Stack data-id="000359" spacing={4} w="full">
                <TextInput
                  data-id="000360"
                  control={control}
                  disabled={isLoading}
                  label="Title"
                  name="title"
                  placeholder="Enter template title"
                  required
                  validations={{
                    notEmpty: true,
                  }}
                />
                <Dropdown
                  data-id="000361"
                  control={control}
                  disabled={isLoading}
                  label="Category"
                  name="actionCategoryId"
                  options={categoryOptions}
                  placeholder="Select category"
                  required
                  validations={{
                    notEmpty: true,
                  }}
                />
                <PeoplePicker
                  data-id="000363"
                  control={control}
                  disabled={isLoading}
                  label="Suggested Owner"
                  name="suggestedOwnerId"
                  placeholder="Search for a user"
                />
                <RichTextEditor
                  data-id="000362"
                  control={control}
                  disabled={isLoading}
                  label="Description"
                  name="description"
                  placeholder="Enter description"
                />
              </Stack>
            </ModalBody>
            <Box
              data-id="000400"
              bg="actionTemplateFormModal.modalFooter.bg"
              borderTop="1px solid"
              borderColor="actionTemplateFormModal.modalFooter.borderColor"
              color="actionTemplateFormModal.modalFooter.color"
              p="16px 20px"
            >
              <Flex data-id="000313" gap={3} justify="space-between">
                <Button
                  _hover={{ bg: 'actionTemplateFormModal.discardButton.hover.bg' }}
                  bg="actionTemplateFormModal.discardButton.bg"
                  color="actionTemplateFormModal.discardButton.color"
                  data-id="000401"
                  fontSize="14px"
                  fontWeight="500"
                  isDisabled={isLoading}
                  onClick={handleDiscard}
                  variant="ghost"
                >
                  Discard
                </Button>
                <Box data-id="013099" as="span">
                  <Button
                    _hover={{ bg: 'actionTemplateFormModal.primaryButton.hover.bg' }}
                    bg="actionTemplateFormModal.primaryButton.bg"
                    color="actionTemplateFormModal.primaryButton.color"
                    data-id="000317"
                    fontSize="14px"
                    fontWeight="500"
                    isDisabled={isLoading}
                    isLoading={createLoading || updateLoading}
                    leftIcon={
                      !createLoading && !updateLoading ? (
                        <AddIcon data-id="013100" h="16px" stroke="actionTemplateFormModal.primaryButton.iconColor" w="16px" />
                      ) : undefined
                    }
                    loadingText={modalType === 'edit' ? 'Updating...' : 'Adding...'}
                    onClick={() => handleAction(modalType)}
                    marginLeft="10px"
                    spinner={<Spinner data-id="013101" color="actionTemplateFormModal.primaryButton.spinnerColor" size="sm" />}
                  >
                    {modalType === 'edit' ? 'Update template' : 'Add template'}
                  </Button>
                </Box>
              </Flex>
            </Box>
          </ModalContent>
        )}
      </Modal>
    </>
  );
};

export default ActionTemplateFormModal;

export const actionTemplateFormModalStyles = {
  actionTemplateFormModal: {
    modalHeader: {
      bg: '#FFFFFF',
      borderColor: '#E2E8F0',
      titleColor: '#2D3748',
    },
    modalBody: {
      bg: '#FFFFFF',
    },
    modalFooter: {
      bg: '#FFFFFF',
      color: '#FFFFFF',
      borderColor: '#CBD5E0',
    },
    deleteButton: {
      bg: 'transparent',
      color: '#2D3748',
      border: '#CBD5E0',
      iconColor: '#D0021B',
      hover: {
        bg: '#E93C44',
        color: '#FFFFFF',
        iconColor: '#FFFFFF',
      },
    },
    primaryButton: {
      bg: '#462AC4',
      color: '#FFFFFF',
      iconColor: '#FFFFFF',
      spinnerColor: '#FFFFFF',
      hover: {
        bg: '#462AC4',
      },
    },
    discardButton: {
      bg: 'transparent',
      color: '#2D3748',
      hover: {
        bg: 'transparent',
      },
    },
    closeIcon: {
      color: '#2D3748',
      hoverOpacity: 0.7,
    },
  },
};
