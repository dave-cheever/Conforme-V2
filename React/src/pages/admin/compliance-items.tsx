import React, { useEffect, useState, useMemo } from "react";
import {
  Modal,
  ModalOverlay,
  Box,
  Flex,
  Stack,
  Spacer,
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
import { Bin, Copy } from "../../icons";
import CloneComplianceItemModal from "../../components/AdminComplianceItemModal/CloneComplianceItemModal";

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
  const { adminModalState, setAdminModalState } = useAdminContext();
  const { data, loading, refetch } = useQuery(GET_COMPLIANCE_ITEMS);
  const { complianceItem, reset } = useComplianceItemModalContext();
  const complianceItems = useMemo(() => [...(data?.complianceItems || [])].sort((a, b) => a.name.localeCompare(b.name)), [data]);
  const [sortType, setSortType] = useState("name");
  const [sortOrder, setSortOrder] = useState(true);
  const [sortedData, setSortedData] = useState<any>([]);

  useEffect(() => {
    setSortedData([...complianceItems].sort((a, b) => a.name.localeCompare(b.name)));
  }, [complianceItems]);

  useEffect(() => {
    if (sortOrder) {
      setSortedData([...complianceItems].sort((a, b) => {
        if (sortType === 'regulatoryBody')
          return (a.regulatoryBody?.name.toString()).localeCompare(b.regulatoryBody?.name.toString())
        else
          return a[sortType].localeCompare(b[sortType])
      }));
    }
    else {
      setSortedData([...complianceItems].sort((a, b) => {
        if (sortType === 'regulatoryBody')
          return (b.regulatoryBody?.name.toString()).localeCompare(a.regulatoryBody?.name.toString())
        else
          return b[sortType].localeCompare(a[sortType])
      }));
    }
  }, [sortType, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

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
      locationsIds: complianceItem.locationsIds,
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
    }, 5);
  };

  return (
    <>
      <Modal
        key={complianceItem._id}
        variant={(adminModalState === 'delete') ? "deleteModal" : "conformeModal"}
        isOpen={adminModalState !== 'closed'}
        onClose={() => { }}
        size={(device === 'desktop' || device === 'tablet' || adminModalState === 'delete') ? '2xl' : 'full'}
      >
        <ModalOverlay />
        {
          adminModalState === 'delete' ?
            <DeleteComplianceItemModal refetch={refetch} /> :
            (
              adminModalState === 'clone' ?
                <CloneComplianceItemModal refetch={refetch} /> :
                <ComplianceItemModal refetch={refetch} />
            )
        }
      </Modal>
      <Header
        breadcrumbs={["Admin", "Compliance items"]}
        mobileBreadcrumbs={["Compliance items"]}
      />
      <Box p="0 25px 30px 30px" h={["full", "calc(100vh - 160px)"]} overflow="auto">
        <Box w="100%" h={["calc(100% - 45px)", "calc(100% - 35px)"]}>
          <AdminTableHeader>
            <AdminTableHeaderElement w={["80%", "calc(100% / 4)"]} label="Compliance items" onClick={() => { setSortType("name"); setSortOrder(!sortOrder); }} sortOrder={sortType === "name" && !sortOrder} showSortingIcon={sortType === "name"} />
            {
              device !== "mobile" && <>
                <AdminTableHeaderElement w="calc(100% / 4)" label="Frequency" onClick={() => { setSortType("frequency"); setSortOrder(!sortOrder); }} sortOrder={sortType === "frequency" && !sortOrder} showSortingIcon={sortType === "frequency"} />
                <AdminTableHeaderElement w="calc(100% / 4)" label="Regulatory body" onClick={() => { setSortType("regulatoryBody"); setSortOrder(!sortOrder); }} sortOrder={sortType === "regulatoryBody" && !sortOrder} showSortingIcon={sortType === "regulatoryBody"} />
                <Flex w="calc(100% / 4)">
                  <Spacer />
                  <Text color="complianceItemsAdminWithContext.labelColor">Actions</Text>
                </Flex>
              </>
            }
          </AdminTableHeader>
          <Stack h="100%" bg="white" borderBottomRadius="20px" overflow="auto">
            {loading ? <Loader center={true} /> :
              sortedData.map(complianceItem => (
                <Flex
                  key={complianceItem._id}
                  flexShrink={0}
                  zIndex={4}
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
                >
                  <Flex fontWeight="semi_medium" w={["80%", "calc(100% / 4)"]} flexDirection="column" onClick={() => openModal('edit', complianceItem)}>
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
                      <Box w="calc(100% / 4)" onClick={() => openModal('edit', complianceItem)}>{complianceItem.frequency} </Box>
                      <Box w="calc(100% / 4)" onClick={() => openModal('edit', complianceItem)}>{complianceItem.regulatoryBody?.name}</Box>
                    </>
                  }
                  <Box w="calc(100% / 4)" textAlign="end" mr="30" zIndex={5}>
                    <Copy
                      fontSize="15px"
                      stroke="complianceItemsAdminWithContext.stroke"
                      fill='transparent'
                      _hover={{ color: 'complianceItemsAdminWithContext.strokeHover', opacity: 0.7, cursor: "pointer" }}
                      onClick={() => { openModal('clone', complianceItem) }}
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Bin
                      fontSize="15px"
                      stroke="complianceItemsAdminWithContext.binStroke"
                      fill='transparent'
                      _hover={{ color: 'complianceItemsAdminWithContext.strokeHover', opacity: 0.7, cursor: "pointer" }}
                      onClick={() => { openModal('delete', complianceItem) }}
                    />
                  </Box>
                </Flex>
              ))}
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
    stroke: "#282F36",
    binStroke: "#282F36",
    strokeHover: "#FFFFFF",
    labelColor: "#818197"
  }
}
