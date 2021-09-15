import { Flex } from "@chakra-ui/react";

import Header from "../../components/Header";

const ComplianceItemsAdmin = () => {
  return (
    <>
      <Header
        breadcrumbs={["Admin", "Compliance items"]}
        hideBreadcrumbsOnMobile
      />
      <Flex>ComplianceItemsAdmin</Flex>
    </>
  );
};

export default ComplianceItemsAdmin;
