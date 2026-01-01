import { useEffect, useRef } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Stack, useToast } from '@chakra-ui/react';
import { Control } from 'react-hook-form';

import { TOAST_DURATION, toastFailed, toastSuccess } from '../../bootstrap/config';
import { AdminModalState } from '../../interfaces/IAdminContext';
import TextInput from '../Forms/TextInput';
import AdminModal from '../Admin/AdminModal';

const CREATE_ACTION_CATEGORY = gql`
  mutation ($actionCategory: ActionCategoryCreateInput!) {
    createActionCategory(actionCategory: $actionCategory) {
      _id
    }
  }
`;

const UPDATE_ACTION_CATEGORY = gql`
  mutation ($actionCategoryInput: ActionCategoryModifyInput!) {
    updateActionCategory(actionCategoryInput: $actionCategoryInput) {
      _id
    }
  }
`;

const DELETE_ACTION_CATEGORY = gql`
  mutation ($_id: String!) {
    deleteActionCategory(_id: $_id)
  }
`;

export const MAX_ACTION_CATEGORIES_NAME_LENGTH = 60;

interface IActionCategoryFormModal {
  readonly isOpenModal: boolean;
  readonly modalType: AdminModalState;
  readonly control: Control<any>;
  readonly getValues: () => any;
  readonly trigger: () => Promise<boolean>;
  readonly errors: any;
  readonly refetch: () => void;
  readonly setAdminModalState: (state: AdminModalState) => void;
}

const ActionCategoryFormModal = ({
  isOpenModal,
  modalType,
  control,
  getValues,
  trigger,
  errors,
  refetch,
  setAdminModalState,
}: Readonly<IActionCategoryFormModal>) => {
  const toast = useToast();
  const hasShownValidationErrorRef = useRef(false);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [createActionCategory, { loading: createLoading }] = useMutation(CREATE_ACTION_CATEGORY);
  const [updateActionCategory, { loading: updateLoading }] = useMutation(UPDATE_ACTION_CATEGORY);
  const [deleteActionCategory, { loading: deleteLoading }] = useMutation(DELETE_ACTION_CATEGORY);

  const isLoading = createLoading || updateLoading || deleteLoading;

  useEffect(() => {
    if (!isOpenModal || Object.keys(errors).length === 0) {
      hasShownValidationErrorRef.current = false;
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = null;
      }
    }
  }, [isOpenModal, errors]);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const handleAddActionCategory = async () => {
    try {
      const actionCategory = getValues();
      await createActionCategory({ variables: { actionCategory } });
      refetch();
      toast({ ...toastSuccess, description: 'Action category added' });
      setAdminModalState('closed');
    } catch (e: any) {
      hasShownValidationErrorRef.current = false;
      toast({ ...toastFailed, description: e.message });
    }
  };

  const handleUpdateActionCategory = async () => {
    try {
      const actionCategory = getValues();
      await updateActionCategory({
        variables: {
          actionCategoryInput: {
            _id: actionCategory?._id,
            name: actionCategory.name,
          },
        },
      });
      refetch();
      toast({ ...toastSuccess, description: 'Action category updated' });
      setAdminModalState('closed');
    } catch (e: any) {
      hasShownValidationErrorRef.current = false;
      toast({ ...toastFailed, description: e.message });
    }
  };

  const handleDeleteActionCategory = async () => {
    try {
      const actionCategory = getValues();
      await deleteActionCategory({ variables: { _id: actionCategory._id } });
      refetch();
      toast({ ...toastSuccess, description: 'Action category deleted' });
      setAdminModalState('closed');
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    }
  };

  const handleAction = async (action?: AdminModalState) => {
    if (!action || action === 'closed') {
      setAdminModalState('closed');
      return;
    }

    if (action === 'delete') {
      handleDeleteActionCategory();
      return;
    }

    const isFormValid = await trigger();
    if (!isFormValid) {
      if (!hasShownValidationErrorRef.current) {
        hasShownValidationErrorRef.current = true;
        toast({
          ...toastFailed,
          description: 'Please complete all the required fields',
        });
        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current);
        }
        errorTimeoutRef.current = setTimeout(() => {
          hasShownValidationErrorRef.current = false;
          errorTimeoutRef.current = null;
        }, TOAST_DURATION);
      }
      return;
    }

    hasShownValidationErrorRef.current = false;
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }

    if (action === 'add') {
      handleAddActionCategory();
    } else if (action === 'edit') {
      handleUpdateActionCategory();
    }
  };

  return (
    <AdminModal
      data-id="013211"
      isOpenModal={isOpenModal}
      modalType={modalType}
      onAction={handleAction}
      collection="action category"
      deleteButtonText="Delete category"
      addButtonText="Add category"
      isLoading={isLoading}
      isDeleting={deleteLoading}
      itemName={getValues()?.name}
    >
      <Stack data-id="000359" spacing={4} w="full">
        <TextInput
          control={control}
          data-id="000360"
          disabled={isLoading}
          label="Type name"
          name="name"
          placeholder="Enter type name"
          maxLength={MAX_ACTION_CATEGORIES_NAME_LENGTH}
          required
          validations={{
            notEmpty: true,
          }}
        />
      </Stack>
    </AdminModal>
  );
}

export default ActionCategoryFormModal;

