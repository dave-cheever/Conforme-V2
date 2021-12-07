import { Flex } from "@chakra-ui/react";

import Header from "../../components/Header";

const AuditLog = () => {
  return (
    <>
      <Header breadcrumbs={["Admin", "Audit log"]} />
      <Flex>AuditLog</Flex>
    </>
  );
};

export default AuditLog;
