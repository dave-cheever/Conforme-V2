import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useQuery } from '@apollo/client';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

import ActionTemplateFormModal from '../../components/ActionTemplate/ActionTemplateFormModal';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import { actionTemplatePanelConfig, PanelView } from '../../components/PanelView';
import DateTimeCell from '../../components/Table/Cells/DateTimeCell';
import TextOrNumberCell from '../../components/Table/Cells/TextOrNumberCell';
import ListView, { ColumnConfig } from '../../components/Table/ListView';
import { useAdminContext } from '../../contexts/AdminProvider';
import useDevice from '../../hooks/useDevice';
import usePagination from '../../hooks/usePagination';
import { EditIcon } from '@chakra-ui/icons';

const GET_ACTION_TEMPLATES = gql`
  query ($pagination: PaginationInput) {
    actionTemplates(pagination: $pagination) {
      actionTemplates {
        _id
        title
        description
        actionCategoryId
        suggestedOwnerId
        metatags {
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

const defaultValues: {
  _id?: string;
  title: string;
  description: string;
  actionCategoryId: string;
  suggestedOwnerId: string;
} = {
  _id: undefined,
  title: '',
  description: '',
  actionCategoryId: '',
  suggestedOwnerId: '',
};

interface IActionTemplate {
  _id?: string;
  title: string;
  description?: string;
  actionCategoryId: string;
  suggestedOwnerId?: string;
  metatags?: {
    updatedAt?: Date;
  };
  actionCategoryName?: string;
}

function ActionTemplates() {
  const { adminModalState, setAdminModalState } = useAdminContext();
  const { currentPage, setCurrentPage, pageSize, setPageSize, total, setTotal } = usePagination();
  const [sortType, setSortType] = useState('title');
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
        suggestedOwnerId: actionTemplate.suggestedOwnerId || '',
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

  const columns: ColumnConfig[] = useMemo(() => [
    {
      label: 'Title',
      sortKey: 'title',
      width: '30%',
      dataId: '000389',
      render: (actionTemplate: IActionTemplate) => <TextOrNumberCell data-id="002091" text={actionTemplate.title} />,
    },
    {
      label: 'Category',
      sortKey: 'actionCategoryId',
      width: '25%',
      dataId: '000390',
      render: (actionTemplate: IActionTemplate) => (
        <TextOrNumberCell data-id="002092" text={actionTemplate.actionCategoryName || 'Unknown'} />
      ),
    },
    {
      label: 'Last Modified',
      sortKey: 'metatags.updatedAt',
      width: '30%',
      dataId: '000391',
      render: (actionTemplate: IActionTemplate) => (
        <DateTimeCell data-id="002093" date={actionTemplate.metatags?.updatedAt} showTime={true} />
      ),
    },
    {
      label: '',
      sortKey: '',
      width: '7%',
      dataId: '000393',
      disableSort: true,
      ml: 'auto',
      render: (actionTemplate: IActionTemplate) => (
        <Flex data-id="013102" justify="flex-end" w="full">
          <Button
            data-id="002091"
            fontSize={['xs', 'sm', 'smm']}
            h={['32px', '36px', 'auto']}
            minW={['auto', 'auto', 'auto']}
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(actionTemplate);
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
              Edit template
            </Text>
          </Button>
        </Flex>
      ),
    },
  ], [handleRowClick]);

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
        dataType="action templates"
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
      <Header
        breadcrumbs={['Admin settings', 'Action templates']}
        data-id="000384"
        mobileBreadcrumbs={['Action templates']}
        pageLabel="Action template"
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

