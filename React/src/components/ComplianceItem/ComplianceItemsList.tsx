import { Box, Flex } from "@chakra-ui/react";

import { IResponse } from "../../interfaces/IResponse";
import AdminTableHeader from "../Admin/AdminTableHeader";
import AdminTableHeaderElement from "../Admin/AdminTableHeaderElement";
import ComplianceListItem from "./ComplianceListItem";

const ComplianceListItems = ({ responses }: { responses: IResponse[] }) => {
  return (
    <Box p={[3, 6]} ml="10px" w="full" h="full" overflow="none" minW="1400px">
      <Box
        bg="complianceList.bg"
        w="full"
        minH="full"
        h="fit-content"
        borderRadius="20px"
        pb={7}
        mb={7}
      >
        <AdminTableHeader>
          <AdminTableHeaderElement w="20%" label="Item name" />
          <AdminTableHeaderElement w="10%" label="Due date" />
          <AdminTableHeaderElement w="10%" label="Compliant" />
          <AdminTableHeaderElement w="10%" label="Evidence" />
          <AdminTableHeaderElement w="10%" label="Category" />
          <AdminTableHeaderElement w="10%" label="Regulatory body" />
          <AdminTableHeaderElement w="15%" label="Responsible" />
          <AdminTableHeaderElement w="15%" label="Business unit" />
        </AdminTableHeader>
        <Flex
          flexDir="column"
          overflowY="auto"
          w="full"
          h={["full", "calc(100vh - 280px)", "calc(100vh - 270px)"]}
        >
          {responses?.map((response) => (
            <ComplianceListItem key={response._id} response={response} />
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default ComplianceListItems;

export const complianceListItemsStyles = {
  complianceList: {
    bg: "white",
    compliant: "#62c240",
    nonCompliant: "#FC5960",
    comingUp: "#FFA012",
    fontColor: "#282F36",
    buildingIcon: "#2B3236",
    crossIcon: "#FC5960",
    tickIcon: "#41BA17",
    imageBg: "#ffffff",
    evidenceFontColor: "#818197",
    headerBorderColor: "#F0F0F0",
  },
};
