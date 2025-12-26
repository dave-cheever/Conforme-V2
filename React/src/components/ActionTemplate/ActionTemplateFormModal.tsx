import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Box,
  Button,
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
import { AddIcon, Close } from '../../icons';
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
    actionCategories(pagination: { limit: 1000, offset: 0 }) {
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

  const { data: categoriesData } = useQuery(GET_ACTION_CATEGORIES);

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
            }
          } 
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
        onConfirm={handleConfirmDelete} />
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
          <ModalContent
            bg="white"
            data-id="000303"
            h="100%"
            m="0"
            overflow="hidden"
            p={0}
            rounded="0"
          >
            <ModalHeader
              borderBottom="1px solid"
              borderColor="gray.200"
              data-id="000304"
              pb={4}
              position="relative"
              pt={6}
              px={6}
            >
              <Flex alignItems="center" justifyContent='space-between' data-id="000305" position="relative" w="full">
                <Text data-id="000308" fontSize="20px" fontWeight="500" lineHeight='100%'>
                  {modalType === 'edit' ? 'Edit action template' : 'Add a new action template'}
                </Text>
                <Box
                  _hover={{ opacity: 0.7 }}
                  cursor="pointer"
                  data-id="000309"
                  lineHeight='100%'
                >
                  <Close
                    data-id="013098"
                    h="14px"
                    onClick={handleDiscard}
                    stroke="#2D3748"
                    w="14px" />
                </Box>
              </Flex>
            </ModalHeader>
            <ModalBody data-id="000310" p={6} overflowY="auto">
              <Stack data-id="000359" spacing={4} w="full">
                <TextInput
                  control={control}
                  data-id="000360"
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
                  control={control}
                  data-id="000361"
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
                  control={control}
                  data-id="000363"
                  disabled={isLoading}
                  label="Suggested Owner"
                  name="suggestedOwnerId"
                  placeholder="Search for a user"
                />
                <RichTextEditor
                  control={control}
                  data-id="000362"
                  disabled={isLoading}
                  label="Description"
                  name="description"
                  placeholder="Enter description"
                />
              </Stack>
            </ModalBody>
            <Box data-id="000400" p={6} pt={4}>
              <Flex data-id="000313" gap={3} justify="space-between">
                <Button
                  _hover={{ bg: 'transparent' }}
                  bg="transparent"
                  color="#2D3748"
                  data-id="000401"
                  fontSize="14px"
                  fontWeight="500"
                  isDisabled={isLoading}
                  onClick={handleDiscard}
                  variant="ghost"
                >
                  Discard
                </Button>
                <Box data-id="013099" as='span'>
                  {modalType === 'edit' && (
                    <Button
                      _hover={{ bg: 'adminModal.button.remove.bg' }}
                      bg="adminModal.button.remove.bg"
                      color="adminModal.button.remove.color"
                      data-id="000314"
                      fontSize="14px"
                      fontWeight="500"
                      isDisabled={isLoading}
                      isLoading={deleteLoading}
                      loadingText="Deleting..."
                      onClick={onConfirmDeleteOpen}
                    >
                      Delete
                    </Button>
                  )}
                  <Button
                    _hover={{ bg: 'adminModal.button.hover' }}
                    bg="adminModal.button.bg"
                    color="adminModal.button.color"
                    data-id="000317"
                    fontSize="14px"
                    fontWeight="500"
                    isDisabled={isLoading}
                    isLoading={createLoading || updateLoading}
                    leftIcon={!createLoading && !updateLoading ? <AddIcon data-id="013100" h="16px" stroke="white" w="16px" /> : undefined}
                    loadingText={modalType === 'edit' ? 'Updating...' : 'Adding...'}
                    onClick={() => handleAction(modalType)}
                    marginLeft='10px'
                    spinner={<Spinner data-id="013101" color="white" size="sm" />}
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

