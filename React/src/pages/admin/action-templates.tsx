import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Button, Divider, Flex, Text, useDisclosure, useToast } from '@chakra-ui/react';

import ActionTemplateFormModal from '../../components/ActionTemplate/ActionTemplateFormModal';
import { ConfirmDeleteModal } from '../../components/ConfirmDeleteModal';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import { actionTemplatePanelConfig, PanelView } from '../../components/PanelView';
import DateTimeCell from '../../components/Table/Cells/DateTimeCell';
import TextOrNumberCell from '../../components/Table/Cells/TextOrNumberCell';
import ListView, { ColumnConfig } from '../../components/Table/ListView';
import { useAdminContext } from '../../contexts/AdminProvider';
import useDevice from '../../hooks/useDevice';
import usePagination from '../../hooks/usePagination';
import { NoRecordsFoundMessage } from '../../components/UI';
import { EditIcon, Trashcan } from '../../icons';
import { toastFailed, toastSuccess } from '../../bootstrap/config';

const GET_ACTION_TEMPLATES = gql`
  query ($pagination: PaginationInput) {
    actionTemplates(pagination: $pagination) {
      actionTemplates {
        _id
        title
        description
        actionCategoryId
        metatags {
          addedAt
          updatedAt
        }
      }
      total
    }
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

const DELETE_ACTION_TEMPLATE = gql`
  mutation ($_id: String!) {
    deleteActionTemplate(_id: $_id)
  }
`;

const defaultValues: {
  _id?: string;
  title: string;
  description: string;
  actionCategoryId: string;
} = {
  _id: undefined,
  title: '',
  description: '',
  actionCategoryId: '',
};

interface IActionTemplate {
  _id?: string;
  title: string;
  description?: string;
  actionCategoryId: string;
  metatags?: {
    addedAt?: Date;
    updatedAt?: Date;
  };
  actionCategoryName?: string;
}

function ActionTemplates() {
  const toast = useToast();
  const { adminModalState, setAdminModalState } = useAdminContext();
  const { currentPage, setCurrentPage, pageSize, setPageSize, total, setTotal } = usePagination();
  const [sortType, setSortType] = useState('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const device = useDevice();
  const isMobile = device === 'mobile';
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  const [actionTemplateToDelete, setActionTemplateToDelete] = useState<IActionTemplate | null>(null);

  const [deleteActionTemplate, { loading: isDeleting }] = useMutation(DELETE_ACTION_TEMPLATE);

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

  const { data, loading, refetch } = useQuery(GET_ACTION_TEMPLATES, {
    variables: queryVariables,
  });

  const { data: categoriesData } = useQuery(GET_ACTION_CATEGORIES);

  const categoriesMap = useMemo(() => {
    if (!categoriesData?.actionCategories?.actionCategories) return {};
    const map: Record<string, string> = {};
    categoriesData.actionCategories.actionCategories.forEach((cat: { _id: string; name: string }) => {
      map[cat._id] = cat.name;
    });
    return map;
  }, [categoriesData]);

  const getActionTemplates = (actionTemplatesArray: IActionTemplate[]) => {
    if (!actionTemplatesArray) return [];

    return actionTemplatesArray.map((actionTemplate) => ({
      ...actionTemplate,
      actionCategoryName: categoriesMap[actionTemplate.actionCategoryId] || 'Unknown Category',
    }));
  };

  const [actionTemplates, setActionTemplates] = useState<IActionTemplate[]>([]);

  useEffect(() => {
    if (data?.actionTemplates) {
      setActionTemplates(getActionTemplates(data.actionTemplates.actionTemplates));
      setTotal(data.actionTemplates.total || 0);
    }
  }, [data, setTotal, categoriesMap]);

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

  const openActionTemplateModal = useCallback(
    (action: 'edit' | 'delete', actionTemplate: IActionTemplate) => {
      setAdminModalState(action);
      reset({
        _id: actionTemplate?._id,
        title: actionTemplate.title,
        description: actionTemplate.description || '',
        actionCategoryId: actionTemplate.actionCategoryId,
      });
    },
    [setAdminModalState, reset],
  );

  const handleRowClick = useCallback(
    (row: IActionTemplate) => {
      openActionTemplateModal('edit', row);
    },
    [openActionTemplateModal],
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent, actionTemplate: IActionTemplate) => {
      e.stopPropagation();
      setActionTemplateToDelete(actionTemplate);
      onDeleteModalOpen();
    },
    [onDeleteModalOpen],
  );

  const handleDeleteFromPanel = useCallback(
    (actionTemplate: IActionTemplate) => {
      setActionTemplateToDelete(actionTemplate);
      onDeleteModalOpen();
    },
    [onDeleteModalOpen],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!actionTemplateToDelete?._id) return;

    try {
      await deleteActionTemplate({
        variables: {
          _id: actionTemplateToDelete._id,
        },
      });
      refetch();
      toast({ ...toastSuccess, description: 'Action template deleted' });
      onDeleteModalClose();
      setActionTemplateToDelete(null);
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    }
  }, [actionTemplateToDelete, deleteActionTemplate, refetch, toast, onDeleteModalClose]);

  const columns: ColumnConfig[] = useMemo(() => [
    {
      label: 'Action title',
      sortKey: 'title',
      width: '23%',
      dataId: '000389',
      render: (actionTemplate: IActionTemplate) => <TextOrNumberCell data-id="002091" text={actionTemplate.title} />,
    },
    {
      label: 'Action category',
      sortKey: 'actionCategoryId',
      width: '20%',
      dataId: '000390',
      render: (actionTemplate: IActionTemplate) => (
        <TextOrNumberCell data-id="002092" text={actionTemplate.actionCategoryName || '-'} />
      ),
    },
    {
      label: 'Description ',
      sortKey: 'actionCategoryId',
      width: '35%',
      dataId: '000390',
      render: (actionTemplate: IActionTemplate) => (
        <TextOrNumberCell data-id="002092" text={actionTemplate.description || '-'} />
      ),
    },
    {
      label: 'Last Modified',
      sortKey: 'metatags.updatedAt',
      width: '10%',
      dataId: '000391',
      render: (actionTemplate: IActionTemplate) => (
        <DateTimeCell data-id="002093" date={actionTemplate.metatags?.updatedAt || actionTemplate.metatags?.addedAt} showTime={true} />
      ),
    },
    {
      label: '',
      sortKey: '',
      width: '12%',
      dataId: '000393',
      disableSort: true,
      ml: 'auto',
      render: (actionTemplate: IActionTemplate) => (
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
              handleRowClick(actionTemplate);
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
              Edit template
            </Text>
          </Button>
          <Divider data-id="013216" orientation='vertical' height='26px' color="#E2E8F0" />
          <Button
            data-id="002091"
            height="28px"
            boxShadow="0px 1px 2px 0px #1A202C14"
            border="1px solid #CBD5E0"
            borderRadius="6px"
            onClick={(e) => handleDeleteClick(e, actionTemplate)}
            p="4px"
            size="sm"
            variant="outline"
          >
            <Trashcan data-id="013103" color="#D0021B" h="18px" w="18px" />
          </Button>
        </Flex>
      ),
    },
  ], [handleRowClick, handleDeleteClick]);

  const panelConfig = useMemo(
    () => ({
      ...actionTemplatePanelConfig,
      actions: {
        ...actionTemplatePanelConfig.actions,
        primary: {
          ...actionTemplatePanelConfig.actions.primary!,
          onClick: handleRowClick,
        },
        panelClick: {
          onClick: handleRowClick,
        },
        delete: {
          ...actionTemplatePanelConfig.actions.delete!,
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

    if (actionTemplates.length === 0) return <NoRecordsFoundMessage dataSourceName="action templates" data-id="000389" message='No action templates found' />;

    if (isMobile) {
      return (
        <PanelView
          config={panelConfig}
          currentPage={currentPage}
          data-id="000389"
          dataSourceName="action templates"
          items={actionTemplates}
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
        data={actionTemplates}
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
      <ActionTemplateFormModal
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
        collectionName="action template"
        data-id="000326"
        isOpen={isDeleteModalOpen}
        isLoading={isDeleting}
        itemName={actionTemplateToDelete?.title}
        onClose={() => {
          onDeleteModalClose();
          setActionTemplateToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
      <Header
        breadcrumbs={['Admin settings', 'Action templates']}
        data-id="000384"
        mobileBreadcrumbs={['Action templates']}
        pageLabel="Action template"
        addButtonText="Add a new template"
      />
      <Box bg="auditsList.bg" data-id="000385" h="full" overflow="hidden">
        <Flex data-id="000386" h="full">
          {renderContent()}
        </Flex>
      </Box>
    </>
  );
}

export default ActionTemplates;

export const actionTemplatesStyles = {
  actionTemplates: {
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

