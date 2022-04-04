import { createContext, useState } from 'react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Grid,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

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
    setFilterType((prevFilters) => [
      ...prevFilters.filter((item) => item !== 'allTypes'),
      type,
    ]);
  };

  const HomeContextTemplate = {
    filterType,
    filterHandler,
  };

  const {
    isOpen: isAuditModalOpen,
    onOpen: openAuditModal,
    onClose: closeAuditModal,
  } = useDisclosure();

  return (
    <HomeContext.Provider value={HomeContextTemplate}>
      <Flex
        alignContent={['center', 'flex-start']}
        direction="row"
        justify={['center', 'flex-start']}
        p={8}
        w="full"
        wrap="wrap"
      >
        <Box fontSize="18px" h="full" w="full">
          <Text fontSize="24px" fontWeight="700">
            Your work
          </Text>
          <br />
          <Flex>
            <DashboardFilters />
            <Spacer />
            <Menu>
              <MenuButton
                _active={{ color: 'white', bg: 'black' }}
                _hover={{ color: 'white', bg: 'black' }}
                as={Button}
                bg="white"
                fontSize="14px"
                fontWeight="700"
                h="35px"
                rightIcon={<ChevronDownIcon />}
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
          <Grid gap={2} templateColumns="repeat( auto-fill, 280px )">
            <AuditPanel isMentioned open={openAuditModal} />
            <AuditPanel open={openAuditModal} />
            <AccidentInvestigationPanel />
            <LicensesPanel />
          </Grid>
        </Box>
      </Flex>
    </HomeContext.Provider>
  );
};

export default Home;
