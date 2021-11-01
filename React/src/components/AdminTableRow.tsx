import { Box, Flex, Tooltip } from "@chakra-ui/react";

import { chartColors } from "../bootstrap/config";
import { Bin, Eye } from "../icons";
import { IBaseWithName } from "../interfaces/IBaseWithName";

const AdminTableRow = ({ element, index, edit, remove }: { element: IBaseWithName, index: number, edit?: () => void, remove?: () => void }) => (
  <Flex
    flexWrap={["wrap", "nowrap"]}
    key={element._id}
    w="full"
    h={["80px", "73px"]}
    bg="#FFFFFF"
    color="#272727"
    pl={5}
    align="center"
    boxShadow={["0px 4px 10px rgba(0, 0, 0, 0.25)", "none"]}
  >
    <Flex w="64%" fontWeight="bold" align="center" cursor="pointer" onClick={edit}>
      <Box bg={chartColors[index]} h="10px" w="10px" borderRadius="5px" mr={2} />
      {element.name}
    </Flex>
    <Flex
      w={["36%", "25%"]}
      fontWeight="medium"
      alignItems="center"
      mt={["5px", "0"]}
      justifyContent={["flex-end", "flex-start"]}
      pr={["21px", "0"]}
    >
      {element.count ? element.count : "0"}
      <Tooltip label="Show Items" fontSize="md">
        <Eye color="#018587" cursor="pointer" ml={4} mt="2px" />
      </Tooltip>
    </Flex>
    <Flex
      w="11%"
      justifyContent={["flex-start", "flex-end"]}
      mb={["10px", "0"]}
      mr={["0", "20px"]}
      onClick={remove}
    >
      <Bin cursor="pointer" />
    </Flex>
  </Flex>
);

export default AdminTableRow;
