import { Flex } from "@chakra-ui/react";

import Header from "../../components/Header";

const AuditLog = () => {
  return (
    <>
      <Header breadcrumbs={["Admin", "Audit log"]} hideBreadcrumbsOnMobile />
      <Flex>AuditLog</Flex>
    </>
  );
};

export default AuditLog;
