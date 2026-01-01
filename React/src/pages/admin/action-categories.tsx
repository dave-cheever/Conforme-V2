import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Button, Divider, Flex, Text, useDisclosure, useToast } from '@chakra-ui/react';

import ActionCategoryFormModal from '../../components/ActionCategory/ActionCategoryFormModal';
import { ConfirmDeleteModal } from '../../components/ConfirmDeleteModal';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import { actionCategoryPanelConfig, PanelView } from '../../components/PanelView';
import DateTimeCell from '../../components/Table/Cells/DateTimeCell';
import TextOrNumberCell from '../../components/Table/Cells/TextOrNumberCell';
import ListView, { ColumnConfig } from '../../components/Table/ListView';
import { useAdminContext } from '../../contexts/AdminProvider';
import useDevice from '../../hooks/useDevice';
import usePagination from '../../hooks/usePagination';
import { IBaseWithName } from '../../interfaces/IBaseWithName';
import { NoRecordsFoundMessage } from '../../components/UI';
import { EditIcon, Trashcan } from '../../icons';
import { toastFailed, toastSuccess } from '../../bootstrap/config';

const GET_ACTION_CATEGORIES = gql`
  query ($pagination: PaginationInput) {
    actionCategories(pagination: $pagination) {
      actionCategories {
        _id
        name
        metatags {
          updatedAt
        }
      }
      total
    }
  }
`;

const DELETE_ACTION_CATEGORY = gql`
  mutation ($_id: String!) {
    deleteActionCategory(_id: $_id)
  }
`;

const defaultValues: Partial<IBaseWithName> = {
  _id: undefined,
  name: '',
};

interface IActionCategory extends IBaseWithName {
  used?: number;
}

function ActionCategories() {
  const toast = useToast();
  const { adminModalState, setAdminModalState } = useAdminContext();
  const { currentPage, setCurrentPage, pageSize, setPageSize, total, setTotal } = usePagination();
  const [sortType, setSortType] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const device = useDevice();
  const isMobile = device === 'mobile';
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  const [actionCategoryToDelete, setActionCategoryToDelete] = useState<IActionCategory | null>(null);

  const [deleteActionCategory, { loading: isDeleting }] = useMutation(DELETE_ACTION_CATEGORY);

  const queryVariables = useMemo(
    () => ({
      pagination: {
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        sortBy: sortType,
        sortDirection: sortOrder,
      },
    }),
    [pageSize, currentPage, sortType, sortOrder],
  );

  const { data, loading, refetch } = useQuery(GET_ACTION_CATEGORIES, {
    variables: queryVariables,
  });

  const getActionCategories = (actionCategoriesArray: IActionCategory[]) => {
    if (!actionCategoriesArray) return [];

    return actionCategoriesArray.map((actionCategory) => ({
      ...actionCategory,
      used: 0, // Default to 0 for now as requested
    }));
  };

  const [actionCategories, setActionCategories] = useState<IActionCategory[]>([]);

  useEffect(() => {
    if (data?.actionCategories) {
      setActionCategories(getActionCategories(data.actionCategories.actionCategories));
      setTotal(data.actionCategories.total || 0);
    }
  }, [data, setTotal]);

  const {
    control,
    formState: { errors },
    getValues,
    reset,
    trigger,
  } = useForm({
    mode: 'all',
    defaultValues,
  });

  useEffect(() => {
    if (adminModalState === 'closed') reset(defaultValues);
  }, [reset, adminModalState]);

  const openActionCategoryModal = useCallback(
    (action: 'edit' | 'delete', actionCategory: IActionCategory) => {
      setAdminModalState(action);
      reset({
        _id: actionCategory?._id,
        name: actionCategory.name,
      });
    },
    [setAdminModalState, reset],
  );

  const handleRowClick = useCallback(
    (row: IActionCategory) => {
      openActionCategoryModal('edit', row);
    },
    [openActionCategoryModal],
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent, actionCategory: IActionCategory) => {
      e.stopPropagation();
      setActionCategoryToDelete(actionCategory);
      onDeleteModalOpen();
    },
    [onDeleteModalOpen],
  );

  const handleDeleteFromPanel = useCallback(
    (actionCategory: IActionCategory) => {
      setActionCategoryToDelete(actionCategory);
      onDeleteModalOpen();
    },
    [onDeleteModalOpen],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!actionCategoryToDelete?._id) return;

    try {
      await deleteActionCategory({
        variables: {
          _id: actionCategoryToDelete._id,
        },
      });
      refetch();
      toast({ ...toastSuccess, description: 'Action category deleted' });
      onDeleteModalClose();
      setActionCategoryToDelete(null);
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    }
  }, [actionCategoryToDelete, deleteActionCategory, refetch, toast, onDeleteModalClose]);

  const columns: ColumnConfig[] = useMemo(
    () => [
      {
        label: 'Category name',
        sortKey: 'name',
        width: '40%',
        dataId: '000389',
        render: (actionCategory: IActionCategory) => <TextOrNumberCell data-id="002091" text={actionCategory.name} />,
      },
      {
        label: 'Used',
        sortKey: 'used',
        width: '20%',
        dataId: '000390',
        render: (actionCategory: IActionCategory) => (
          <TextOrNumberCell data-id="002092" text={`${actionCategory.used || 0} ${actionCategory.used === 1 ? 'Action' : 'Actions'}`} />
        ),
      },
      {
        label: 'Last Modified',
        sortKey: 'metatags.updatedAt',
        width: '28%',
        dataId: '000391',
        render: (actionCategory: IActionCategory) => (
          <DateTimeCell data-id="002093" date={actionCategory.metatags?.updatedAt} showTime={true} />
        ),
      },
      {
        label: '',
        sortKey: '',
        width: '12%',
        dataId: '000393',
        disableSort: true,
        ml: 'auto',
        render: (actionCategory: IActionCategory) => (
          <Flex data-id="013102" justify="flex-end" w="full" gap="8px">
            <Button
              data-id="002091"
              fontSize={['xs', 'sm', 'smm']}
              h='28px'
              minW='auto'
              boxShadow="0px 1px 2px 0px #1A202C14"
              border="1px solid #CBD5E0"
              borderRadius="6px"
              onClick={(e) => {
                e.stopPropagation();
                handleRowClick(actionCategory);
              }}
              p='6px 8px'
              size="md"
              variant="outline"
            >
              <EditIcon data-id="013103" color="#2D3748" h="14px" w="14px" />
              <Text
                data-id="013104"
                fontSize="12px"
                fontWeight="500"
                lineHeight="100%"
                color="#2D3748"
                ml="4px"
              >
                Edit category
              </Text>
            </Button>
            <Divider data-id="013216" orientation='vertical' height='26px' color="#E2E8F0" />
            <Button
              data-id="002091"
              height="28px"
              boxShadow="0px 1px 2px 0px #1A202C14"
              border="1px solid #CBD5E0"
              borderRadius="6px"
              onClick={(e) => handleDeleteClick(e, actionCategory)}
              p="4px"
              size="sm"
              variant="outline"
            >
              <Trashcan data-id="013103" color="#D0021B" h="18px" w="18px" />
            </Button>
          </Flex>
        ),
      },
    ],
    [handleRowClick, handleDeleteClick],
  );

  const panelConfig = useMemo(
    () => ({
      ...actionCategoryPanelConfig,
      actions: {
        ...actionCategoryPanelConfig.actions,
        primary: {
          ...actionCategoryPanelConfig.actions.primary!,
          onClick: handleRowClick,
        },
        panelClick: {
          onClick: handleRowClick,
        },
        delete: {
          ...actionCategoryPanelConfig.actions.delete!,
          onClick: handleDeleteFromPanel,
        },
      },
    }),
    [handleRowClick, handleDeleteFromPanel],
  );

  const renderContent = () => {
    if (loading) {
      return (
        <Box bg="white" borderBottomRadius="10px" data-id="000387" h="full" w="full">
          <Loader center data-id="000388" />
        </Box>
      );
    }

    if (actionCategories.length === 0) return <NoRecordsFoundMessage dataSourceName="action categories" data-id="000389" />;

    if (isMobile) {
      return (
        <PanelView
          config={panelConfig}
          currentPage={currentPage}
          data-id="000389"
          dataSourceName="action categories"
          items={actionCategories}
          pageSize={pageSize}
          total={total}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      );
    }

    return (
      <ListView
        columns={columns}
        currentPage={currentPage}
        data={actionCategories}
        data-id="000389"
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onRowClick={handleRowClick}
        pageSize={pageSize}
        setSortOrder={setSortOrder}
        setSortType={setSortType}
        sortOrder={sortOrder}
        sortType={sortType}
        total={total}
      />
    );
  };

  return (
    <>
      <ActionCategoryFormModal
        control={control}
        data-id="000358"
        errors={errors}
        getValues={getValues}
        isOpenModal={adminModalState !== 'closed'}
        modalType={adminModalState}
        refetch={refetch}
        setAdminModalState={setAdminModalState}
        trigger={trigger}
      />
      <ConfirmDeleteModal
        collectionName="action category"
        data-id="000326"
        isOpen={isDeleteModalOpen}
        isLoading={isDeleting}
        itemName={actionCategoryToDelete?.name}
        onClose={() => {
          onDeleteModalClose();
          setActionCategoryToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
      <Header
        breadcrumbs={['Admin settings', 'Action categories']}
        data-id="000384"
        mobileBreadcrumbs={['Action categories']}
        pageLabel="Action category"
        addButtonText="Add a new category"
      />
      <Box bg="auditsList.bg" data-id="000385" h="full" overflow="hidden">
        <Flex data-id="000386" h="full">
          {renderContent()}
        </Flex>
      </Box>
    </>
  );
}

export default ActionCategories;

export const actionCategoriesStyles = {
  actionCategories: {
    bg: '#FFFFFF',
    deleteButton: {
      bg: 'transparent',
      border: '#CBD5E0',
      color: '#D0021B',
      hover: {
        bg: '#FEE2E2',
        border: '#D0021B',
      },
    },
    editButton: {
      bg: 'transparent',
      border: '#CBD5E0',
      color: '#2D3748',
      hover: {
        bg: '#F7FAFC',
        border: '#CBD5E0',
      },
    },
  },
};
