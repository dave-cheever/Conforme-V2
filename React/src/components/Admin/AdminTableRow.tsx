import { Flex, Tooltip } from "@chakra-ui/react";

import { ArrowCount } from "../../icons";
import { IBaseWithName } from "../../interfaces/IBaseWithName";

const AdminTableRow = ({ element, index, edit }: { element: IBaseWithName, index: number, edit?: () => void }) => (
  <Flex
    w="full"
    h={["80px", "73px"]}
    pl={5}
    flexWrap={["wrap", "nowrap"]}
    fontSize="smm"
    flexShrink={0}
    key={element._id}
    bg="adminTableRow.bg"
    color="adminTableRow.font"
    align="center"
    boxShadow={["0px 4px 10px rgba(0, 0, 0, 0.25)", "none"]}
    borderBottom="1px solid"
    borderColor="adminTableHeader.border"
  >
    <Flex w="50%" align="center" cursor="pointer" onClick={edit}>
      {element.name}
    </Flex>
    <Flex
      w={["36%", "50%"]}
      alignItems="center"
      mt={["5px", "0"]}
      justifyContent={["flex-end", "flex-start"]}
      pr={["21px", "0"]}
    >
      {element.count ? element.count : "0"}
      <Tooltip label="Show Items" fontSize="md">
        <ArrowCount w="10px" h="10px" stroke="#282F36" cursor="pointer" ml="13px" />
      </Tooltip>
    </Flex>
  </Flex>
);

export default AdminTableRow;
