import { Box } from "@chakra-ui/react";

import Header from "../../components/Header";
import AuditLogComponent from "../../components/AuditLog/AuditLog";

const AuditLog = () => {
  return (
    <>
      <Header breadcrumbs={["Admin", "Audit log"]} />
      <Box p='30px' pt='0px' h='calc(100vh - 150px)' overflow="auto">
        <AuditLogComponent />
      </Box>
    </>
  );
};

export default AuditLog;
