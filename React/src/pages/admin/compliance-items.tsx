import {
  Flex,
  Modal,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

import Header from "../../components/Header";
import { useAdminContext } from "../../contexts/AdminProvider";
import ComplianceItemModalProvider, { complianceItemModalSections, useComplianceItemModalContext } from "../../contexts/ComplianceItemModalProvider";
import ComplianceItemModal from "../../components/AdminComplianceItemModal/ComplianceItemModal";
import DeleteComplianceItemModal from "../../components/AdminComplianceItemModal/DeleteComplianceItemModal";
import useDevice from "../../hooks/useDevice";
import { useEffect } from "react";

const ComplianceItemsAdmin = () => {
  const device = useDevice();
  const { adminModalState } = useAdminContext();
  const { complianceItem, reset, setSelectedSection } = useComplianceItemModalContext();

  // const handleAction = async (action: 'add' | 'edit' | 'delete', complianceItem?: IComplianceItem) => {
  //   // if (["add", "edit"].includes(action) && !isFormValid) {
  //   //   return toast({
  //   //     ...toastFailed,
  //   //     description: "Please complete all the required fields",
  //   //   });
  //   // }
  //   // switch (action) {
  //   //   case "add":
  //   //     handleAddCategory();
  //   //     break;
  //   //   case "edit":
  //   //     handleUpdateCategory();
  //   //     break;
  //   //   case "delete":
  //   //     handleDeleteCategory();
  //   //     break;
  //   //   default:
  //   //     setAdminModalState("closed");
  //   // }
  //   console.log(action, complianceItem);
  // };

  useEffect(() => {
    if (adminModalState === 'closed') {
      reset();
    }
  }, [adminModalState]);

  return (
    <>
      <Modal
        key={complianceItem._id}
        variant="auditModal"
        isOpen={adminModalState !== 'closed'}
        onClose={() => {}}
        size={device === 'desktop' ? '2xl' : 'md'}
      >
        <ModalOverlay />
        {adminModalState === 'delete' ?
          <DeleteComplianceItemModal /> :
          <ComplianceItemModal />
        }
      </Modal>
      <Header
        breadcrumbs={["Admin", "Compliance items"]}
        hideBreadcrumbsOnMobile
      />
      <Flex>ComplianceItemsAdmin</Flex>
    </>
  );
};

const ComplianceItemsAdminWithContext = (props) => (
  <ComplianceItemModalProvider {...props}>
    <ComplianceItemsAdmin />
  </ComplianceItemModalProvider>
);

export default ComplianceItemsAdminWithContext;
