import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Menu,
  MenuButton,
  Button,
  Flex,
  MenuList,
  MenuItem,
  Text
} from "@chakra-ui/react";

import Header from "../components/Header";
import { ChevronRight, GridIcon, GroupIcon, ListIcon } from "../icons";
import Loader from "../components/Loader";
import { IResponse } from "../interfaces/IResponse";
import ComplianceItemSquare from "../components/ComplianceItem/ComplianceItemSquare";
import ComplianceItemsList from "../components/ComplianceItem/ComplianceItemsList";
import ComplianceItemsGroup from "../components/ComplianceItem/ComplianceItemsGroup";
import useResponseUtils from "../hooks/useResponseUtils";
import { useFiltersContext } from "../contexts/FiltersProvider";
import { useAppContext } from "../contexts/AppProvider";
import { gql, useQuery } from "@apollo/client";

const GET_RESPONSES = gql`
  query Responses {
    responses {
      _id
      nextRenewalDate
      status
      complianceItem {
        name
        category {
          name
        }
        regulatoryBody {
          name
        }
      }
      businessUnit {
        name
        imgUrl
      }
    }
  }
`;

const ComplianceItems = () => {
  const { user } = useAppContext();
  const { filters } = useFiltersContext();
  const [filteredResponses, setFilteredResponses] = useState<IResponse[]>([]);
  const { getRenewalStatus, getStatus } = useResponseUtils();

  const {data, loading, error} = useQuery(GET_RESPONSES);

  const [viewMode, setViewMode] = useState<"Grid" | "List" | "Group">(
    user?.role === "admin" ? "List" : "Grid"
  );
  const viewIcon = useMemo(
    () => ({
      Grid: <GridIcon />,
      List: <ListIcon />,
      Group: <GroupIcon />,
    }),
    []
  );

  // Filter responses
  useEffect(() => {
    if (data?.responses?.length === 0 && !error) {
      setFilteredResponses(data?.responses);
      return;
    }

    if (data && data?.responses?.length !== 0 && !error ){
      let items = [...data?.responses];
      if (filters.itemStatus?.value && filters.itemStatus?.value?.length > 0) {
        let statusFilteredResults: IResponse[] = [];
        for (const filter of filters.itemStatus?.value) {
          if (['notStarted', 'inProgress', 'completed', 'comingUp', 'overdue'].includes(filter)) {
            statusFilteredResults.push(...items.filter(response => getRenewalStatus(response) === filter));
          } else if (['compliant', 'nonCompliant'].includes(filter)) {
            statusFilteredResults.push(...items.filter(response => getStatus(response) === filter));
          } else if (filter === 'noDueDate') {
            statusFilteredResults.push(...items.filter(response => response.daysToDueDate === null));
          }
        }
        items = Array.from(new Set(statusFilteredResults.flat()));
      }
      setFilteredResponses(items);
    }
  }, [data?.responses, filters.itemStatus?.value]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeViewMode = useCallback((viewMode: "Grid" | "List" | "Group") => {
    setViewMode(viewMode);
    localStorage.setItem("viewMode", viewMode);
  }, []);

  return (
    <>
      <Header breadcrumbs={["Compliance items"]} itemsCount={6}>
        <Menu autoSelect={false}>
          {
            // @ts-ignore: Issue inside ChakraUI
            <MenuButton
              as={Button}
              rounded="lg"
              w="115px"
              h="36px"
              mt={2}
              ml={["15px", "0"]}
              bg="complianceItems.header.menuButton"
              fontWeight="700"
              fontSize="14px"
              _active={{}}
              _hover={{}}
              rightIcon={
                <ChevronRight
                  color="complianceItems.header.rightIcon"
                  h="12px"
                  w="12px"
                  mt="3px"
                  transform="rotate(90deg)"
                />
              }
            >
              <Flex align="center" color="white">
                {viewIcon[viewMode]}
                <Flex ml={2}>{viewMode}</Flex>
              </Flex>
            </MenuButton>
          }
          <MenuList rounded="lg" w="100px" border='none'>
            <MenuItem
              fontSize="14px"
              _focus={{ color: "complianceItems.header.menuItemFocus" }}
              color={viewMode === "Grid" ? "complianceItems.header.menuItemFont" : "#9A9EA1"}
              onClick={() => changeViewMode("Grid")}
            >
              <GridIcon mr={3} />
              Grid
            </MenuItem>
            <MenuItem
              fontSize="14px"
              _focus={{ color: "complianceItems.header.menuItemFocus" }}
              color={viewMode === "List" ? "complianceItems.header.menuItemFont" : "#9A9EA1"}
              onClick={() => changeViewMode("List")}
            >
              <ListIcon mr={3} />
              List
            </MenuItem>
            <MenuItem
              fontSize="14px"
              _focus={{ color: "complianceItems.header.menuItemFocus" }}
              color={viewMode === "Group" ? "complianceItems.header.menuItemFont" : "#9A9EA1"}
              onClick={() => changeViewMode("Group")}
            >
              <GroupIcon mr={3} />
              Group
            </MenuItem>
          </MenuList>
        </Menu>
      </Header>
      <Flex h='calc(100vh - 150px)' overflow='auto'>
        {error ? <Text>{error.message}</Text> : loading ? <Loader center={true} /> :
          <>
            {viewMode === "Grid" &&
              <Flex direction='row' w='full' p={8} wrap='wrap' justify={['center', 'flex-start']} alignContent={['center', 'flex-start']}>
                {filteredResponses.length > 0
                  ? filteredResponses.map((response) => <ComplianceItemSquare key={response._id} response={response} />)
                  : <Flex w='full' h='full' fontSize='18px' fontStyle='italic'>No compliance items found</Flex>
                }
              </Flex>}
            {viewMode === "List" && <ComplianceItemsList responses={filteredResponses} />}
            {viewMode === "Group" && <ComplianceItemsGroup responses={filteredResponses} />}
          </>
        } 
      </Flex>
    </>
  );
};

export default ComplianceItems;
