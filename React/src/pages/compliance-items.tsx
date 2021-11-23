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
  query Responses($responsesQueryInput: ResponsesQueryInput) {
    responses(responsesQueryInput: $responsesQueryInput) {
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
  const { filtersValues, setUsedFilters } = useFiltersContext();
  const [filteredResponses, setFilteredResponses] = useState<IResponse[]>([]);
  const { getRenewalStatus, getStatus } = useResponseUtils();

  const { data, loading, error, refetch } = useQuery(GET_RESPONSES);

  const [viewMode, setViewMode] = useState<"Grid" | "List" | "Group">(
    user?.role === "admin" ? "List" : "Grid"
  );
  const viewIcon = useMemo(
    () => ({
      Grid: <GridIcon boxSize="18px"/>,
      List: <ListIcon boxSize="18px"/>,
      Group: <GroupIcon boxSize="18px" />,
    }),
    []
  );

  useEffect(() => {
    setUsedFilters(['itemStatus', 'complianceItemsIds', 'regulatoryBodiesIds', 'categoriesIds', 'functionalAreasIds', 'businessUnitsIds', 'usersIds', 'dueDate']);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter responses (server side)
  useEffect(() => {
    // Parse filters to format expected by GraphQL Query
    const parsedFilters = Object.entries(filtersValues).reduce((acc, [key, value]) => {
      if (key === 'itemStatus') {
        // itemStatus is client side filter
        return acc;
      }
      if (!value.value || (Array.isArray(value.value) && value.value.length === 0)) {
        // Filter out empty filters
        return acc;
      }
      return {
        ...acc,
        [key]: value.value,
      };
    }, {});
    refetch({ responsesQueryInput: parsedFilters });
  }, [filtersValues]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter responses by status (client side)
  useEffect(() => {
    if (data?.responses?.length === 0 && !error) {
      setFilteredResponses(data?.responses);
      return;
    }

    if (data && data?.responses?.length !== 0 && !error) {
      let items = [...data?.responses];
      if (filtersValues.itemStatus?.value && filtersValues.itemStatus?.value?.length > 0) {
        let statusFilteredResults: IResponse[] = [];
        for (const filter of filtersValues.itemStatus?.value) {
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
  }, [data?.responses, filtersValues.itemStatus?.value]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeViewMode = useCallback((viewMode: "Grid" | "List" | "Group") => {
    setViewMode(viewMode);
    localStorage.setItem("viewMode", viewMode);
  }, []);

  return (
    <>
      <Header breadcrumbs={["Compliance items", "All"]}>
        <Menu autoSelect={false}>
          {
            // @ts-ignore: Issue inside ChakraUI
            <MenuButton
              as={Button}
              rounded="lg"
              h="40px"
              mt={2}
              ml={["15px", "0"]}
              bg="complianceItems.header.menuButtonBg"
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
              <Flex align="center" mr="1">
                {viewIcon[viewMode]}
              </Flex>
            </MenuButton>
          }
          <MenuList rounded="lg" w="100px" border='none'>
            <MenuItem
              fontSize="14px"
              _focus={{ color: "complianceItems.header.menuItemFocus" }}
              color={viewMode === "Grid" ? "complianceItems.header.menuItemFontSelected" : "complianceItems.header.menuItemFont"}
              onClick={() => changeViewMode("Grid")}
            >
              <GridIcon mr={3} />
              Grid
            </MenuItem>
            <MenuItem
              fontSize="14px"
              _focus={{ color: "complianceItems.header.menuItemFocus" }}
              color={viewMode === "List" ? "complianceItems.header.menuItemFontSelected" : "complianceItems.header.menuItemFont"}
              onClick={() => changeViewMode("List")}
            >
              <ListIcon mr={3} />
              List
            </MenuItem>
            <MenuItem
              fontSize="14px"
              _focus={{ color: "complianceItems.header.menuItemFocus" }}
              color={viewMode === "Group" ? "complianceItems.header.menuItemFontSelected" : "complianceItems.header.menuItemFont"}
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

export const complianceItemStyles = {
  complianceItems: {
    header: {
      menuButtonBg: "white",
      rightIcon: "#9A9EA1",
      menuItemFocus: "#462AC4",
      menuItemFontSelected: "#462AC4", 
      menuItemFont:"#9A9EA1"
    },
  },
}
