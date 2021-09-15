import { Box, Flex, Image, Text, Tooltip } from "@chakra-ui/react";
import { useCallback } from "react";

import Header from "../../components/Header";
import { Bin, Eye } from "../../icons";
import { IBusinessUnit } from "../../interfaces/IBusinessUnit";

const BusinessUnits = () => {

  const businessUnits: IBusinessUnit[] = [{
    id: "asdasd",
    name: "test",
    identifier: "identifier",
    type: "type",
    communications: [{type: "communications", value: "a"}],
    address: {
      city:"city",
      lineOne: "lineOne",
      country: "country",
      county: "county",
      postcode: "postcode"
    },
    ed: {
      firstName: "fist anem",
      lastName: "lastNAme",
      displayName: "dipla",
      email: "email"
    },
     rd: {
      firstName: "fist anem",
      lastName: "lastNAme",
      displayName: "dipla",
      email: "email"
    }
  }];
  const renderBusinessUnitRow = useCallback((businessUnit: IBusinessUnit, i: number) => (
    <Flex
      key={businessUnit.id}
      w='full'
      h='73px'
      bg='#FFFFFF'
      mb="1px"
      p={4}
      alignItems='center'
      borderTopRadius={i === 0 ? 'lg' : ''}
      borderBottomRadius={(i === businessUnits.length - 1) ? 'lg' : ''}
      boxShadow="sm"
    >
      <Flex w='30%' pl={1} mr={4} align='center' cursor="pointer" 
      // onClick={() => setAdminModalState('edit', businessUnit)}
      >
        <Flex w='36px' h='36px' mr={4} rounded='md' bg="#F2F2F2" shrink={0}>
          <Image fit='cover' rounded="md" src={businessUnit.imgUrl} />
        </Flex>
        <Text
          fontWeight='bold'
          overflow='hidden'
          textOverflow='ellipsis'
          whiteSpace='nowrap'
        >{businessUnit.name}</Text>
      </Flex>
      <Box w='10%'>{businessUnit.type}</Box>
      <Box w='20%'>{businessUnit.region}</Box>
      <Box w='20%'>{businessUnit.ed.firstName && businessUnit.ed.lastName ? `${businessUnit.ed.firstName} ${businessUnit.ed.lastName}` : `${businessUnit.ed.displayName}`}</Box>
      <Flex w='10%' align='center'>
        <Text>{businessUnit.responsesCount || 0}</Text>
        <Tooltip label="Show Items" fontSize="md">
          <Eye color='#018587' cursor='pointer' ml={4} mt='2px' 
          // onClick={() => onEyeClick(businessUnit.id)} 
          />
        </Tooltip>
      </Flex>
      <Box textAlign='right' w='10%' pr={6}>
        <Bin w='20px' cursor='pointer' _hover={{ color: 'businessUnit.binIconColor' }} color='#424B50' 
        // onClick={() => setAdminModalState('delete', businessUnit)} 
        />
      </Box>
    </Flex>
  ), []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Header breadcrumbs={["Admin", "Business units"]} />
      <Flex h='calc(100vh - 150px)'>
          <Box w='full' h='full' overflow='auto' p={[0, 8]}>
            <Flex pb={4} w='full' color="#9A9EA1" display={['none', "flex"]}>
              <Box w='30%'>Business unit name</Box>
              <Box w='10%'>Unit type</Box>
              <Box w='20%'>Region name</Box>
              <Box w='18%'>Owner</Box>
              <Box w='12%'>Responses count</Box>
              <Box textAlign='right' w='9%'>Actions</Box>
            </Flex>
            <Box w='full'>
              {businessUnits?.length > 0 ? businessUnits?.map(renderBusinessUnitRow) : <Flex w='full' h='full' fontSize='18px' fontStyle='italic'>No Business unit found.</Flex>}
            </Box>
          </Box>
        </Flex>
    </>
  );
};

export default BusinessUnits;
