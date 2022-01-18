import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Menu,
  MenuButton,
  Button,
  Flex,
  MenuList,
  MenuItem,
  Text,
  Grid
} from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";

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
import useDevice from "../hooks/useDevice";
import { useLocation } from "react-router-dom";

const GET_RESPONSES = gql`
  query Responses($responsesQuery: ResponsesQuery) {
    responses(responsesQuery: $responsesQuery) {
      _id
      nextRenewalDate
      status
      responsibleId
      daysToDueDate
      evidence {
        name
        uploaded {
          id
          name
          addedAt
          thumbnail
          path
        }
        outdated
      }
      complianceItem {
        name
        frequency
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
      metatags {
        addedBy
      }
      responsible {
        _id
        displayName
        imgUrl
      }
    }
  }
`;

const ComplianceItems = () => {
  const { user } = useAppContext();
  const { filtersValues, setUsedFilters, setFilters, setResponsesStatusesCounts } = useFiltersContext();
  const [filteredResponses, setFilteredResponses] = useState<IResponse[]>([]);
  const { getRenewalStatus, getStatus } = useResponseUtils();

  const { data, loading, error, refetch } = useQuery(GET_RESPONSES);
  const device = useDevice();
  const location = useLocation()

  useEffect(() => {
    setUsedFilters(['complianceItemsIds', 'categoriesIds', 'usersIds', 'locationsIds', 'businessUnitsIds', 'itemStatus', 'regulatoryBodiesIds', 'dueDate']);
    if (location.state && typeof location.state === "object") {
      setFilters(location.state)
      window.history.replaceState(null, '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const responsesStatusesCounts = {
      nonCompliant: 0,
      compliant: 0,
      comingUp: 0,
    };
    data?.responses.forEach(response => {
      const status = getStatus(response);
      if (status === 'compliant') {
        responsesStatusesCounts.compliant++;
      } else {
        responsesStatusesCounts.nonCompliant++;
      }

      const renewalStatus = getRenewalStatus(response);
      if (renewalStatus === 'comingUp') {
        responsesStatusesCounts.comingUp++;
      }
    });
    setResponsesStatusesCounts(responsesStatusesCounts);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const initialViewMode = useMemo(() => {
    const savedView = localStorage.getItem('viewMode');
    if (savedView && (savedView === "Grid" || savedView === "List" || savedView === "Group")) {
      return savedView;
    }

    if (user?.role === "admin") {
      return "List";
    }

    return "Grid";
  }, [user]);

  const [viewMode, setViewMode] = useState<"Grid" | "List" | "Group">(initialViewMode);

  // use Memo not working for hook, used this for mobile
  useEffect(() => {
    if (device === "mobile") {
      setViewMode("Grid");
    }
  }, [device]);

  const viewIcon = useMemo(
    () => ({
      Grid: <GridIcon boxSize="18px" />,
      List: <ListIcon boxSize="18px" />,
      Group: <GroupIcon boxSize="18px" />,
    }),
    []
  );

  // Filter responses (server side)
  useEffect(() => {
    // Parse filters to format expected by GraphQL Query
    const parsedFilters = Object.entries(filtersValues).reduce((acc, [key, value]) => {
      if (key === 'itemStatus') {
        // itemStatus is client side filter
        return acc;
      }
      if (
        !value.value ||
        (Array.isArray(value.value) && value.value.length === 0) ||
        (
          key === 'usersIds' &&
          value.value.responsibleIds.length === 0 &&
          value.value.accountableIds.length === 0 &&
          value.value.contributorIds.length === 0 &&
          value.value.followerIds.length === 0
        )
      ) {
        return acc;
      }
      return {
        ...acc,
        [key]: value.value,
      };
    }, {});
    refetch({ responsesQuery: parsedFilters });
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
      <Header breadcrumbs={["Compliance items"]} mobileBreadcrumbs={["Compliance items"]}>
        {device !== "mobile" && <Menu autoSelect={false}>
          {
            // @ts-ignore: Issue inside ChakraUI
            <MenuButton
              as={Button}
              rounded="10px"
              h="40px"
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
          <MenuList zIndex={2} rounded="lg" w="100px" border='none'>
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
        </Menu>}
      </Header>
      <Flex h={["calc(100vh - 210px)", "calc(100vh - 150px)"]} overflow='auto'>
        {error ? <Text>{error.message}</Text> : loading ? <Loader center={true} /> :
          <>
            {viewMode === "Grid" &&
              <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]} h="fit-content" gap={6} w='full' pb={[0, 8]} px={[4, 8]} pt="3">
                {filteredResponses.length > 0
                  ? filteredResponses.map((response) => <ComplianceItemSquare key={response._id} response={response} />)
                  : <Flex w='full' h='full' fontSize='18px' fontStyle='italic'>No compliance items found</Flex>
                }
              </Grid>}
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
      menuItemFont: "#9A9EA1"
    },
  },
};
