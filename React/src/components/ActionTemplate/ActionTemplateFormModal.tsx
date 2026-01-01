import { useEffect, useRef } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Stack, useToast } from '@chakra-ui/react';
import { Control } from 'react-hook-form';

import { TOAST_DURATION, toastFailed, toastSuccess } from '../../bootstrap/config';
import { AdminModalState } from '../../interfaces/IAdminContext';
import { Dropdown, TextInput, Textarea } from '../Forms';
import AdminModal from '../Admin/AdminModal';

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

export const MAX_ACTION_TEMPLATES_NAME_LENGTH = 60;

interface IActionTemplateFormModal {
  readonly isOpenModal: boolean;
  readonly modalType: AdminModalState;
  readonly control: Control<any>;
  readonly getValues: () => any;
  readonly trigger: () => Promise<boolean>;
  readonly errors: any;
  readonly refetch: () => void;
  readonly setAdminModalState: (state: AdminModalState) => void;
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
}: Readonly<IActionTemplateFormModal>) => {
  const toast = useToast();
  const hasShownValidationErrorRef = useRef(false);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleAddActionTemplate = async () => {
    try {
      const actionTemplate = getValues();
      await createActionTemplate({
        variables: {
          actionTemplate: { ...actionTemplate },
        },
      });
      refetch();
      toast({ ...toastSuccess, description: 'Action template added' });
      setAdminModalState('closed');
    } catch (e: any) {
      hasShownValidationErrorRef.current = false;
      toast({ ...toastFailed, description: e.message });
    }
  };

  const handleUpdateActionTemplate = async () => {
    try {
      const actionTemplate = getValues();
      await updateActionTemplate({
        variables: {
          actionTemplateInput: {
            _id: actionTemplate?._id,
            title: actionTemplate.title,
            description: actionTemplate.description || '',
            actionCategoryId: actionTemplate.actionCategoryId,
          },
        },
      });
      refetch();
      toast({ ...toastSuccess, description: 'Action template updated' });
      setAdminModalState('closed');
    } catch (e: any) {
      hasShownValidationErrorRef.current = false;
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

  const handleAction = async (action?: AdminModalState) => {
    if (!action || action === 'closed') {
      setAdminModalState('closed');
      return;
    }

    if (action === 'delete') {
      handleDeleteActionTemplate();
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
      handleAddActionTemplate();
    } else if (action === 'edit') {
      handleUpdateActionTemplate();
    }
  };

  return (
      <AdminModal
        data-id="013211"
        isOpenModal={isOpenModal}
        modalType={modalType}
        onAction={handleAction}
        collection="action template"
        deleteButtonText="Delete template"
        addButtonText="Add template"
        isLoading={isLoading}
        isDeleting={deleteLoading}
        itemName={getValues()?.title}>
        <Stack data-id="000359" spacing={4} w="full">
          <TextInput
            data-id="000360"
            control={control}
            disabled={isLoading}
            label="Action title"
            name="title"
            placeholder="Enter action title"
            maxLength={MAX_ACTION_TEMPLATES_NAME_LENGTH}
            required
            validations={{
              notEmpty: true,
            }}
          />
          <Dropdown
            data-id="000361"
            control={control}
            disabled={isLoading}
            label="Action category"
            name="actionCategoryId"
            options={categoryOptions}
            placeholder="Select category"
            required
            validations={{
              notEmpty: true,
            }}
          />
          <Textarea
            data-id="000362"
            control={control}
            disabled={isLoading}
            label="Description"
            name="description"
            placeholder="Enter description"
            rows={10}
          />
        </Stack>
      </AdminModal>
  );
};

export default ActionTemplateFormModal;
