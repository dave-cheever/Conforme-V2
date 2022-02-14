import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useResponseUtils from "../../hooks/useResponseUtils";

import { IResponse } from "../../interfaces/IResponse";
import AdminTableHeader from "../Admin/AdminTableHeader";
import AdminTableHeaderElement from "../Admin/AdminTableHeaderElement";
import ComplianceListItem from "./ComplianceListItem";

const ComplianceListItems = ({ responses }: { responses: IResponse[] }) => {
  const { getStatus } = useResponseUtils();
  const [sortType, setSortType] = useState("name");
  const [sortOrder, setSortOrder] = useState(true);
  const [sortedData, setSortedData] = useState<any>([]);

  useEffect(() => {
    if (sortOrder) {
      setSortedData([...sortedData].sort((a, b) => {
        if (sortType === 'name')
          return a.complianceItem?.name.localeCompare(b.complianceItem?.name)
        else if (sortType === 'regulatoryBody')
          return (a.complianceItem.regulatoryBody?.name!).localeCompare(b.complianceItem.regulatoryBody?.name!)
        else if (sortType === 'businessUnit')
          return (a.businessUnit?.name!).localeCompare(b.businessUnit?.name!)
        else if (sortType === 'category')
          return (a.complianceItem?.category?.name).localeCompare(b.complianceItem?.category?.name)
        else if (sortType === 'compliant')
          return (getStatus(a) === "nonCompliant" ? 'Yes' : 'No').localeCompare(getStatus(b) === "nonCompliant" ? 'Yes' : 'No')
        else if (sortType === 'evidence')
          return (a.evidence?.find(({ uploaded }) => uploaded === undefined) ? 'Missing' : 'Uploaded').localeCompare(b.evidence?.find(({ uploaded }) => uploaded === undefined) ? 'Missing' : 'Uploaded')
        else if (sortType === 'responsible')
          return (a.responsible?.displayName || 'unassigned').localeCompare(b.responsible?.displayName || 'unassigned')
        else {
          if (a[sortType] === null) {
            return 1;
          }
          else if (b[sortType] === null) {
            return -1;
          }
          return a[sortType] ? a[sortType].localeCompare(b[sortType]) : 0
        }
      }));
    }
    else {
      setSortedData([...sortedData].sort((a, b) => {
        if (sortType === 'name')
          return b.complianceItem?.name.localeCompare(a.complianceItem?.name)
        else if (sortType === 'regulatoryBody')
          return (b.complianceItem.regulatoryBody?.name!).localeCompare(a.complianceItem.regulatoryBody?.name!)
        else if (sortType === 'businessUnit')
          return (b.businessUnit?.name!).localeCompare(a.businessUnit?.name!)
        else if (sortType === 'category')
          return (b.complianceItem?.category?.name).localeCompare(a.complianceItem?.category?.name)
        else if (sortType === 'compliant')
          return (getStatus(b) === "nonCompliant" ? 'Yes' : 'No').localeCompare(getStatus(a) === "nonCompliant" ? 'Yes' : 'No')
        else if (sortType === 'evidence')
          return (b.evidence?.find(({ uploaded }) => uploaded === undefined) ? 'Missing' : 'Uploaded').localeCompare(a.evidence?.find(({ uploaded }) => uploaded === undefined) ? 'Missing' : 'Uploaded')
        else if (sortType === 'responsible')
          return (b.responsible?.displayName || 'unassigned').localeCompare(a.responsible?.displayName || 'unassigned')
        else {
          if (a[sortType] === null) {
            return 1;
          }
          else if (b[sortType] === null) {
            return -1;
          }
          return b[sortType] ? b[sortType].localeCompare(a[sortType]) : 0
        }
      }));
    }
  }, [sortType, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSortedData([...responses].sort((a, b) => a.complianceItem?.name.localeCompare(b.complianceItem?.name)));
  }, [responses]);

  return (
    <Box p={[3, 6]} ml="10px" w="full" h="full" overflow="none">
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
          <AdminTableHeaderElement w="20%" label="Item name" onClick={() => { setSortType("name"); setSortOrder(!sortOrder); }} sortOrder={sortType === "name" && !sortOrder} showSortingIcon={sortType === "name"} />
          <AdminTableHeaderElement w="12%" label="Expires on" onClick={() => { setSortType("nextRenewalDate"); setSortOrder(!sortOrder); }} sortOrder={sortType === "nextRenewalDate" && !sortOrder} showSortingIcon={sortType === "nextRenewalDate"} />
          <AdminTableHeaderElement w="10%" label="Compliant" onClick={() => { setSortType("compliant"); setSortOrder(!sortOrder); }} sortOrder={sortType === "compliant" && !sortOrder} showSortingIcon={sortType === "compliant"} />
          <AdminTableHeaderElement w="18%" label="Regulatory body" onClick={() => { setSortType("regulatoryBody"); setSortOrder(!sortOrder); }} sortOrder={sortType === "regulatoryBody" && !sortOrder} showSortingIcon={sortType === "regulatoryBody"} />
          <AdminTableHeaderElement w="20%" label="Responsible" onClick={() => { setSortType("responsible"); setSortOrder(!sortOrder); }} sortOrder={sortType === "responsible" && !sortOrder} showSortingIcon={sortType === "responsible"} />
          <AdminTableHeaderElement w="20%" label="Business unit" onClick={() => { setSortType("businessUnit"); setSortOrder(!sortOrder); }} sortOrder={sortType === "businessUnit" && !sortOrder} showSortingIcon={sortType === "businessUnit"} />
        </AdminTableHeader>
        <Flex
          flexDir="column"
          overflowY="auto"
          w="full"
          h={["full", "calc(100vh - 280px)", "calc(100vh - 270px)"]}
        >
          {sortedData?.map((response) => (
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
