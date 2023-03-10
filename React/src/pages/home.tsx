import { createContext, useState } from 'react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Grid, Menu, MenuButton, MenuItem, MenuList, Spacer, Text, useDisclosure } from '@chakra-ui/react';

import AccidentInvestigationPanel from '../components/AccidentInvestigationPanel';
import AuditPanel from '../components/AuditPanel';
import DashboardFilters from '../components/DashboardFilters';
import LicensesPanel from '../components/LicensesPanel';

export const HomeContext = createContext({
  filterType: ['allTypes'],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filterHandler: (type: string) => {},
});

const Home = () => {
  const [filterType, setFilterType] = useState<Array<string>>(['allTypes']);

  const filterHandler = (type: string) => {
    if (type === 'allTypes') {
      setFilterType(['allTypes']);
      return;
    }
    if (filterType.includes(type)) {
      const filtered = filterType;
      const data = filtered.filter((item) => item !== type);
      setFilterType(data);
      return;
    }
    setFilterType((prevFilters) => [...prevFilters.filter((item) => item !== 'allTypes'), type]);
  };

  const HomeContextTemplate = {
    filterType,
    filterHandler,
  };

  const { onOpen: openAuditModal } = useDisclosure();

  return (
    (<HomeContext.Provider value={HomeContextTemplate}>
      <Flex
        alignContent={['center', 'flex-start']}
        data-id="c14bdef6353b"
        direction="row"
        justify={['center', 'flex-start']}
        p={8}
        w="full"
        wrap="wrap">
        <Box data-id="244c915bff7d" fontSize="18px" h="full" w="full">
          <Text data-id="b969ed50cf46" fontSize="24px" fontWeight="700">
            Your work
          </Text>
          <br data-id="13cd1f987d65" />
          <Flex data-id="a0794f5eccc0">
            <DashboardFilters data-id="f621379ed7f5" />
            <Spacer data-id="ebc04e21fe97" />
            <Menu data-id="fcdba340751d">
              <MenuButton
                _active={{ color: 'white', bg: 'black' }}
                _hover={{ color: 'white', bg: 'black' }}
                as={Button}
                bg="white"
                data-id="b22bd9e3e147"
                fontSize="14px"
                fontWeight="700"
                h="35px"
                rightIcon={<ChevronDownIcon data-id="e98387298c08" />}>
                Order: Priority
              </MenuButton>
              <MenuList data-id="15b83ad8606c" w="200px">
                <MenuItem data-id="6874b479d44e">Most Urgent</MenuItem>
                <MenuItem data-id="18d2ce4d0ef8">Least Urgent</MenuItem>
              </MenuList>
            </Menu>
          </Flex>

          <br data-id="2880114fbdd1" />
          <Grid
            data-id="7f2ccf2d1262"
            gap={2}
            templateColumns="repeat( auto-fill, 280px )">
            <AuditPanel data-id="61b094c461ab" isMentioned open={openAuditModal} />
            <AuditPanel data-id="24ee36336f56" open={openAuditModal} />
            <AccidentInvestigationPanel data-id="859173d51b1b" />
            <LicensesPanel data-id="decdd6b13634" />
          </Grid>
        </Box>
      </Flex>
    </HomeContext.Provider>)
  );
};

export default Home;
