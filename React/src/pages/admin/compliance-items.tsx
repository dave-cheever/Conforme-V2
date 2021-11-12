import React, { useEffect, useMemo } from "react";
import {
  Modal,
  ModalOverlay,
  Box,
  Flex,
  Stack,
  Text,
} from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";

import Header from "../../components/Header";
import { useAdminContext } from "../../contexts/AdminProvider";
import ComplianceItemModalProvider, { useComplianceItemModalContext } from "../../contexts/ComplianceItemModalProvider";
import ComplianceItemModal from "../../components/AdminComplianceItemModal/ComplianceItemModal";
import DeleteComplianceItemModal from "../../components/AdminComplianceItemModal/DeleteComplianceItemModal";
import useDevice from "../../hooks/useDevice";
import Loader from "../../components/Loader";
import { IComplianceItem } from "../../interfaces/IComplianceItem";
import { Bin, Eye } from "../../icons";
import { AdminModalState } from "../../interfaces/IAdminContext";

const GET_COMPLIANCE_ITEMS = gql`
  query {
    complianceItems {
      _id
      name
      description
      frequency
      dueDate
      published
      evidenceItems
      retentionPeriod
      questions {
        type
        name
        description
        value
        required
        outdated
      }
      published
      categoryId
      category {
        name
      }
      functionalAreaId
      functionalArea {
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
  const { adminModalState, setAdminModalState } = useAdminContext();
  const { data, loading, refetch } = useQuery(GET_COMPLIANCE_ITEMS);
  const { complianceItem, reset } = useComplianceItemModalContext();
  const complianceItems = useMemo(() => [...(data?.complianceItems || [])].sort((a, b) => a.name.localeCompare(b.name)), [data]);

  useEffect(() => {
    if (adminModalState === 'closed') {
      reset();
    }
  }, [adminModalState]); // eslint-disable-line react-hooks/exhaustive-deps

  const openModal = (action: AdminModalState, complianceItem: IComplianceItem) => {
    setAdminModalState(action);
    reset({
      _id: complianceItem._id,
      name: complianceItem.name,
      description: complianceItem.description,
      categoryId: complianceItem.categoryId,
      regulatoryBodyId: complianceItem.regulatoryBodyId,
      functionalAreaId: complianceItem.functionalAreaId,
      dueDate: complianceItem.dueDate,
      frequency: complianceItem.frequency,
      businessUnitsIds: complianceItem.businessUnitsIds,
      evidenceItems: complianceItem.evidenceItems,
      retentionPeriod: complianceItem.retentionPeriod,
      questions: (complianceItem.questions || []).map(question => ({
        type: question.type,
        name: question.name,
        description: question.description,
        value: question.value,
        required: question.required,
        outdated: question.outdated,
      })),
      published: complianceItem.published,
    }, 5);
  };

  return (
    <>
      <Modal
        key={complianceItem._id}
        variant="conformeModal"
        isOpen={adminModalState !== 'closed'}
        onClose={() => { }}
        size={device === 'desktop' ? '2xl' : 'md'}
      >
        <ModalOverlay />
        {adminModalState === 'delete' ?
          <DeleteComplianceItemModal refetch={refetch} /> :
          <ComplianceItemModal refetch={refetch} />
        }
      </Modal>
      <Header
        breadcrumbs={["Admin", "Compliance items"]}
        hideBreadcrumbsOnMobile
      />
      {loading ? (
        <Box mt={20}>
          <Loader />
        </Box>
      ) : (
        <Box p="30px" h='calc(100vh - 150px)' overflow="auto">
          <Flex>
            <Box w="100%">
              <Flex fontWeight="semi_medium" color="adminComplianceItems.headers" mb="14px" fontSize="14px">
                <Box w='40%'>Compliance items</Box>
                <Box w='20%'>Frequency</Box>
                <Box w='20%'>Regulatory body</Box>
                <Box w='20%' align="right" mr="15px">Actions</Box>
              </Flex>
              <Stack borderRadius="10px" overflow="hidden" spacing="1px">
                {complianceItems.map(complianceItem => (
                  <Flex
                    key={complianceItem._id}
                    w='full'
                    h='73px'
                    bg='adminComplianceItems.element.bg'
                    color='adminComplianceItems.element.font'
                    pl={5}
                    align='center'
                    mt='0px'
                    fontSize="14px">
                    <Flex w='40%' flexDirection="column">
                      <Box fontWeight="bold">{complianceItem.name || <Text fontStyle='italic' color='adminComplianceItems.element.unnamed'>Unnamed compliance item</Text>}</Box>
                      <Flex fontWeight="semi-medium" fontSize="sm" alignItems="center">
                        <Box color="adminComplianceItems.element.category" lineHeight='25px'>{complianceItem.category?.name}</Box>
                        {!complianceItem.published && (
                          <Box
                            bg="adminComplianceItems.element.draft.bg"
                            color="adminComplianceItems.element.draft.font"
                            borderRadius="7px"
                            p="3px 9px"
                            ml={complianceItem.category ? 2 : 0}
                          >
                            Draft
                          </Box>
                        )}
                      </Flex>
                    </Flex>
                    <Box w='20%' fontWeight="medium">{complianceItem.frequency}</Box>
                    <Box w='20%' fontWeight="medium">{complianceItem.regulatoryBody?.name}</Box>
                    <Box w='20%' fontWeight="medium" align="right" mr="30px">
                      <Eye cursor='pointer' color='adminComplianceItems.element.edit' onClick={() => openModal('edit', complianceItem)} />
                      <Bin cursor='pointer' ml="25px" onClick={() => openModal('delete', complianceItem)} />
                    </Box>
                  </Flex>
                ))}
              </Stack>
            </Box>
          </Flex>
        </Box>
      )}
    </>
  );
};

const ComplianceItemsAdminWithContext = (props) => (
  <ComplianceItemModalProvider {...props}>
    <ComplianceItemsAdmin />
  </ComplianceItemModalProvider>
);

export default ComplianceItemsAdminWithContext;
