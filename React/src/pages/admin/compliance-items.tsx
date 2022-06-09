import React, { useEffect, useMemo, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Box, Flex, Modal, ModalOverlay, Spacer, Stack, Text } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import AdminTableHeader from '../../components/Admin/AdminTableHeader';
import AdminTableHeaderElement from '../../components/Admin/AdminTableHeaderElement';
import CloneComplianceItemModal from '../../components/AdminComplianceItemModal/CloneComplianceItemModal';
import ComplianceItemModal from '../../components/AdminComplianceItemModal/ComplianceItemModal';
import DeleteComplianceItemModal from '../../components/AdminComplianceItemModal/DeleteComplianceItemModal';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import { useAdminContext } from '../../contexts/AdminProvider';
import ComplianceItemModalProvider, { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import useDevice from '../../hooks/useDevice';
import { Copy, Trashcan } from '../../icons';
import { AdminModalState } from '../../interfaces/IAdminContext';
import { IComplianceItem } from '../../interfaces/IComplianceItem';

const GET_COMPLIANCE_ITEMS = gql`
  query ($complianceItemsQueryInput: ComplianceItemsQueryInput) {
    complianceItems(complianceItemsQueryInput: $complianceItemsQueryInput) {
      _id
      name
      description
      businessUnitsIds
      frequency
      dueDate
      published
      evidenceItems
      questions {
        type
        name
        description
        value
        required
        outdated
        requiredAnswer
        notApplicable
      }
      locationsIds
      categoryId
      category {
        name
      }
      regulatoryBodyId
      regulatoryBody {
        name
      }
    }
  }
`;

const ComplianceItemsAdmin = () => {
  const device = useDevice();
  const { filtersValues, setUsedFilters, setShowFiltersPanel, cleanFilters } = useFiltersContext();
  const { adminModalState, setAdminModalState } = useAdminContext();
  const { data, loading, refetch } = useQuery(GET_COMPLIANCE_ITEMS);
  const { complianceItem, reset } = useComplianceItemModalContext();
  const complianceItems = useMemo(() => [...(data?.complianceItems || [])].sort((a, b) => a.name.localeCompare(b.name)), [data]);
  const [sortType, setSortType] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortedData, setSortedData] = useState<any>([]);

  useEffect(() => {
    setUsedFilters(['complianceItemsIds', 'categoriesIds', 'locationsIds', 'businessUnitsIds', 'regulatoryBodiesIds']);
    return () => {
      setShowFiltersPanel(false);
      cleanFilters();
    };
  }, []);

  useEffect(() => {
    setSortedData([...complianceItems].sort((a, b) => a.name.localeCompare(b.name)));
  }, [complianceItems]);

  useEffect(() => {
    const parsedFilters = Object.entries(filtersValues).reduce((acc, [key, value]) => {
      if (
        !value.value ||
        (Array.isArray(value.value) && value.value.length === 0) ||
        (key === 'usersIds' &&
          value.value.responsibleIds.length === 0 &&
          value.value.accountableIds.length === 0 &&
          value.value.contributorIds.length === 0 &&
          value.value.followerIds.length === 0)
      )
        return acc;

      return {
        ...acc,
        [key]: value.value,
      };
    }, {});
    refetch({ complianceItemsQueryInput: parsedFilters });
  }, [filtersValues]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (sortOrder) {
      setSortedData(
        [...complianceItems].sort((a, b) => {
          if (sortType === 'regulatoryBody') return a.regulatoryBody?.name.toString().localeCompare(b.regulatoryBody?.name.toString());

          return a[sortType].localeCompare(b[sortType]);
        }),
      );
    } else {
      setSortedData(
        [...complianceItems].sort((a, b) => {
          if (sortType === 'regulatoryBody') return b.regulatoryBody?.name.toString().localeCompare(a.regulatoryBody?.name.toString());

          return b[sortType].localeCompare(a[sortType]);
        }),
      );
    }
  }, [sortType, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (adminModalState === 'closed') reset();
  }, [adminModalState]); // eslint-disable-line react-hooks/exhaustive-deps

  const openModal = (action: AdminModalState, complianceItem: IComplianceItem) => {
    setAdminModalState(action);
    reset(
      {
        _id: complianceItem._id,
        name: complianceItem.name,
        description: complianceItem.description,
        categoryId: complianceItem.categoryId,
        regulatoryBodyId: complianceItem.regulatoryBodyId,
        dueDate: complianceItem.dueDate,
        frequency: complianceItem.frequency,
        businessUnitsIds: complianceItem.businessUnitsIds,
        locationsIds: complianceItem.locationsIds,
        evidenceItems: complianceItem.evidenceItems,
        questions: (complianceItem.questions || []).map((question) => ({
          type: question.type,
          name: question.name,
          description: question.description,
          value: question.value,
          required: question.required,
          outdated: question.outdated,
          requiredAnswer: question.requiredAnswer,
          notApplicable: question.notApplicable,
        })),
        published: complianceItem.published,
      },
      5,
    );
  };

  return (
    <>
      <Modal
        isOpen={adminModalState !== 'closed'}
        key={complianceItem._id}
        onClose={() => {}}
        size={device === 'desktop' || device === 'tablet' || adminModalState === 'delete' ? '2xl' : 'full'}
        variant={adminModalState === 'delete' ? 'deleteModal' : 'conformeModal'}
      >
        <ModalOverlay />
        {adminModalState === 'delete' ? (
          <DeleteComplianceItemModal refetch={refetch} />
        ) : adminModalState === 'clone' ? (
          <CloneComplianceItemModal refetch={refetch} />
        ) : (
          <ComplianceItemModal refetch={refetch} />
        )}
      </Modal>
      <Header breadcrumbs={['Admin', pluralize(t('complianceItem')) ]} mobileBreadcrumbs={[pluralize(t('complianceItem'))]} />
      <Box h={['full', 'calc(100vh - 160px)']} overflow="auto" p="0 25px 30px 30px">
        <Box h={['calc(100% - 45px)', 'calc(100% - 35px)']} w="100%">
          <AdminTableHeader>
            <AdminTableHeaderElement
              label={capitalize(t('complianceItem'))}
              onClick={() => {
                setSortType('name');
                setSortOrder(sortOrder === 'asc' && sortType === 'name' ? 'desc' : 'asc');
              }}
              showSortingIcon={sortType === 'name'}
              sortOrder={sortType === 'name' ? sortOrder : undefined}
              w={['80%', 'calc(100% / 4)']}
            />
            {device !== 'mobile' && (
              <>
                <AdminTableHeaderElement
                  label="Frequency"
                  onClick={() => {
                    setSortType('frequency');
                    setSortOrder(sortOrder === 'asc' && sortType === 'frequency' ? 'desc' : 'asc');
                  }}
                  showSortingIcon={sortType === 'frequency'}
                  sortOrder={sortType === 'frequency' ? sortOrder : undefined}
                  w="calc(100% / 4)"
                />
                <AdminTableHeaderElement
                  label="Regulatory body"
                  onClick={() => {
                    setSortType('regulatoryBody');
                    setSortOrder(sortOrder === 'asc' && sortType === 'regulatoryBody' ? 'desc' : 'asc');
                  }}
                  showSortingIcon={sortType === 'regulatoryBody'}
                  sortOrder={sortType === 'regulatoryBody' ? sortOrder : undefined}
                  w="calc(100% / 4)"
                />
                <Flex w="calc(100% / 4)">
                  <Spacer />
                  <Text color="complianceItemsAdminWithContext.labelColor">Actions</Text>
                </Flex>
              </>
            )}
          </AdminTableHeader>
          <Stack bg="white" borderBottomRadius="20px" h="100%" overflow="auto">
            {loading ? (
              <Loader center />
            ) : (
              sortedData.map((complianceItem) => (
                <Flex
                  align="center"
                  bg="adminComplianceItems.element.bg"
                  borderBottom="1px solid"
                  borderColor="adminTableHeader.border"
                  color="adminComplianceItems.element.font"
                  cursor="pointer"
                  flexShrink={0}
                  fontSize="14px"
                  h="73px"
                  key={complianceItem._id}
                  mt="0px"
                  pl={5}
                  w="full"
                  zIndex={4}
                >
                  <Flex
                    flexDirection="column"
                    fontWeight="semi_medium"
                    onClick={() => openModal('edit', complianceItem)}
                    w={['80%', 'calc(100% / 4)']}
                  >
                    <Box fontSize="smm">
                      {complianceItem.name || (
                        <Text color="adminComplianceItems.element.unnamed" fontStyle="italic">
                          Unnamed compliance item
                        </Text>
                      )}
                    </Box>
                    <Flex alignItems="center">
                      <Box color="adminComplianceItems.element.category" fontSize="11px" lineHeight="25px">
                        {complianceItem.category?.name}
                      </Box>
                      {!complianceItem.published && (
                        <Box
                          bg="#818197"
                          borderRadius="7px"
                          color="#FFFFFF"
                          fontSize="11px"
                          ml={complianceItem.category ? 2 : 0}
                          p="3px 9px"
                        >
                          Draft
                        </Box>
                      )}
                    </Flex>
                  </Flex>
                  {device !== 'mobile' && (
                    <>
                      <Box onClick={() => openModal('edit', complianceItem)} w="calc(100% / 4)">
                        {complianceItem.frequency}{' '}
                      </Box>
                      <Box onClick={() => openModal('edit', complianceItem)} w="calc(100% / 4)">
                        {complianceItem.regulatoryBody?.name}
                      </Box>
                    </>
                  )}
                  <Box mr="30" textAlign="end" w="calc(100% / 4)" zIndex={5}>
                    <Copy
                      _hover={{
                        color: 'complianceItemsAdminWithContext.strokeHover',
                        opacity: 0.7,
                        cursor: 'pointer',
                      }}
                      fill="transparent"
                      fontSize="15px"
                      onClick={() => {
                        openModal('clone', complianceItem);
                      }}
                      stroke="complianceItemsAdminWithContext.stroke"
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Trashcan
                      _hover={{
                        color: 'complianceItemsAdminWithContext.strokeHover',
                        opacity: 0.7,
                        cursor: 'pointer',
                      }}
                      fill="transparent"
                      fontSize="15px"
                      onClick={() => {
                        openModal('delete', complianceItem);
                      }}
                      stroke="complianceItemsAdminWithContext.binStroke"
                    />
                  </Box>
                </Flex>
              ))
            )}
          </Stack>
        </Box>
      </Box>
    </>
  );
};

const ComplianceItemsAdminWithContext = (props) => (
  <ComplianceItemModalProvider {...props}>
    <ComplianceItemsAdmin />
  </ComplianceItemModalProvider>
);

export default ComplianceItemsAdminWithContext;

export const complianceItemsAdminWithContextStyles = {
  complianceItemsAdminWithContext: {
    stroke: '#282F36',
    binStroke: '#282F36',
    strokeHover: '#FFFFFF',
    labelColor: '#818197',
  },
};
