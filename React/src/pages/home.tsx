import React, { createContext, useState } from "react";
import AuditModal from "../components/AuditModal/AuditModal";
import { Button, useDisclosure } from "@chakra-ui/react";

import {
  Box,
  Flex,
  Text,
  Grid,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import AuditPanel from "../components/AuditPanel";
import { ChevronDownIcon } from "@chakra-ui/icons";
import AccidentInvestigationPanel from "../components/AccidentInvestigationPanel";
import LicensesPanel from "../components/LicensesPanel";
import DashboardFilters from "../components/DashboardFilters";

export const HomeContext = createContext({
  filterType: ["allTypes"],
  filterHandler: (type: string) => {},
});

const Home = () => {
  const [filterType, setFilterType] = useState<Array<string>>(["allTypes"]);

  const filterHandler = (type: string) => {
    if (type === "allTypes") {
      setFilterType(["allTypes"]);
      return;
    }
    if (filterType.includes(type)) {
      const filtered = filterType;
      const data = filtered.filter((item) => item !== type);
      setFilterType(data);
      return;
    }
    setFilterType((prevFilters) => [
      ...prevFilters.filter((item) => item !== "allTypes"),
      type,
    ]);
  };

  const HomeContextTemplate = {
    filterType,
    filterHandler,
  };

  const { isOpen: isAuditModalOpen, onOpen: openAuditModal, onClose: closeAuditModal } = useDisclosure();

  return (
    <HomeContext.Provider value={HomeContextTemplate}>
      <Flex
        direction="row"
        w="full"
        p={8}
        wrap="wrap"
        justify={["center", "flex-start"]}
        alignContent={["center", "flex-start"]}
      >
        <Box w="full" h="full" fontSize="18px">
          <Text fontWeight="700" fontSize="24px" color="brand.lightGrey">
            Your work
          </Text>
          <br />
          <Flex>
            <DashboardFilters />
            <Spacer />
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                bg="white"
                fontSize="14px"
                fontWeight="700"
                h="35px"
                _hover={{ color: "white", bg: "black" }}
                _active={{ color: "white", bg: "black" }}
              >
                Order: Priority
              </MenuButton>
              <MenuList w="200px">
                <MenuItem>Most Urgent</MenuItem>
                <MenuItem>Least Urgent</MenuItem>
              </MenuList>
            </Menu>
          </Flex>

          <br />
          <Grid templateColumns="repeat( auto-fill, 280px )" gap={2}>
            <AuditPanel isMentioned open={openAuditModal} />
            <AuditPanel open={openAuditModal}  />
            <AccidentInvestigationPanel />
            <LicensesPanel />
          </Grid>
        </Box>
        <AuditModal onClose={closeAuditModal} isOpen={isAuditModalOpen} />
      </Flex>
    </HomeContext.Provider>
  );
};

export default Home;
