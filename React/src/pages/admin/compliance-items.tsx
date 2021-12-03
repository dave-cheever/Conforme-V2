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
import { AdminModalState } from "../../interfaces/IAdminContext";
import AdminTableHeader from "../../components/Admin/AdminTableHeader";
import AdminTableHeaderElement from "../../components/Admin/AdminTableHeaderElement";

const GET_COMPLIANCE_ITEMS = gql`
  query {
    complianceItems {
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
      }
      published
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
      dueDate: complianceItem.dueDate,
      frequency: complianceItem.frequency,
      businessUnitsIds: complianceItem.businessUnitsIds,
      evidenceItems: complianceItem.evidenceItems,
      questions: (complianceItem.questions || []).map(question => ({
        type: question.type,
        name: question.name,
        description: question.description,
        value: question.value,
        required: question.required,
        outdated: question.outdated,
      })),
      published: complianceItem.published,
    }, 4);
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
        <Box p="0 25px 30px 30px" h='calc(100vh - 160px)' overflow="auto" rounded="10px">
          <Box w="100%" h={['calc(100% - 125px)', 'calc(100% - 35px)']}>
            <AdminTableHeader>
              <AdminTableHeaderElement w={["80%", "calc(100% / 3)"]} label="Compliance items" />
              {
                device !== "mobile" && <>
                  <AdminTableHeaderElement w="calc(100% / 3)" label="Frequency" />
                  <AdminTableHeaderElement w="calc(100% / 3)" label="Regulatory body" />
                </>
              }
            </AdminTableHeader>
            <Stack h="100%" bg="white" borderBottomRadius="10px" overflow="auto">
              {complianceItems.map(complianceItem => (
                <Flex
                  key={complianceItem._id}
                  flexShrink={0}
                  w='full'
                  h='73px'
                  bg='adminComplianceItems.element.bg'
                  color='adminComplianceItems.element.font'
                  pl={5}
                  align='center'
                  mt='0px'
                  fontSize="14px"
                  cursor="pointer"
                  borderBottom="1px solid"
                  borderColor="adminTableHeader.border"
                  onClick={() => openModal('edit', complianceItem)}
                >
                  <Flex fontWeight="semi_medium" w={["80%", "calc(100% / 3)"]} flexDirection="column">
                    <Box fontSize="smm">{complianceItem.name || <Text fontStyle='italic' color='adminComplianceItems.element.unnamed'>Unnamed compliance item</Text>}</Box>
                    <Flex alignItems="center">
                      <Box fontSize="11px" color="adminComplianceItems.element.category" lineHeight='25px'>{complianceItem.category?.name}</Box>
                      {!complianceItem.published && (
                        <Box
                          bg="#818197"
                          color="#FFFFFF"
                          borderRadius="7px"
                          fontSize="11px"
                          p="3px 9px"
                          ml={complianceItem.category ? 2 : 0}
                        >
                          Draft
                        </Box>
                      )}
                    </Flex>
                  </Flex>
                  {
                    device !== "mobile" && <>
                      <Box w="calc(100% / 3)">{complianceItem.frequency}</Box>
                      <Box w="calc(100% / 3)">{complianceItem.regulatoryBody?.name}</Box>
                    </>
                  }
                </Flex>
              ))}
            </Stack>
          </Box>
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
