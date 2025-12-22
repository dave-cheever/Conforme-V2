import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useQuery } from '@apollo/client';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

import ActionCategoryFormModal from '../../components/ActionCategory/ActionCategoryFormModal';
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
import { EditIcon } from '@chakra-ui/icons';

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

const defaultValues: Partial<IBaseWithName> = {
  _id: undefined,
  name: '',
};

interface IActionCategory extends IBaseWithName {
  used?: number;
}

function ActionCategories() {
  const { adminModalState, setAdminModalState } = useAdminContext();
  const { currentPage, setCurrentPage, pageSize, setPageSize, total, setTotal } = usePagination();
  const [sortType, setSortType] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const device = useDevice();
  const isMobile = device === 'mobile';

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

  const columns: ColumnConfig[] = useMemo(() => [
    {
      label: 'Audit type',
      sortKey: 'name',
      width: '30%',
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
      width: '30%',
      dataId: '000391',
      render: (actionCategory: IActionCategory) => (
        <DateTimeCell data-id="002093" date={actionCategory.metatags?.updatedAt} showTime={true} />
      ),
    },
    {
      label: '',
      sortKey: '',
      width: '7%',
      dataId: '000393',
      disableSort: true,
      ml: 'auto',
      render: (actionCategory: IActionCategory) => (
        <Flex data-id="013102" justify="flex-end" w="full">
          <Button
            data-id="002091"
            fontSize={['xs', 'sm', 'smm']}
            h={['32px', '36px', 'auto']}
            minW={['auto', 'auto', 'auto']}
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(actionCategory);
            }}
            p={['6px 8px', '7px 12px', '7px 12px']}
            size={['sm', 'md', 'md']}
            variant="outline"
          >
            <EditIcon data-id="013103" boxSize={['14px', '16px', '16px']} />
            <Text
              data-id="013104"
              fontSize={['xs', 'sm', 'smm']}
              fontWeight="500"
              lineHeight="100%"
              ml={[1, 2, 2]}>
              Edit
            </Text>
          </Button>
        </Flex>
      ),
    },
  ], [handleRowClick]);

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
      },
    }),
    [handleRowClick],
  );

  const renderContent = () => {
    if (loading) {
      return (
        <Box bg="white" borderBottomRadius="10px" data-id="000387" h="full" w="full">
          <Loader center data-id="000388" />
        </Box>
      );
    }

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
        dataType="action categories"
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
      <Header
        breadcrumbs={['Admin settings', 'Action categories']}
        data-id="000384"
        mobileBreadcrumbs={['Action categories']}
        pageLabel="Action category"
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
