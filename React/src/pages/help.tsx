import React, { useEffect } from "react";
import { Flex, Text } from "@chakra-ui/react";

import Header from "../components/Header";
import { useFiltersContext } from "../contexts/FiltersProvider";

const Help = () => {
  const { setUsedFilters } = useFiltersContext();

  useEffect(() => {
    setUsedFilters([]);
  // eslint-disable-next-line
  },[]);

  return (
    <Flex flexDirection="column" h="full" w="full" overflow="auto">
      <Header breadcrumbs={["Home", "Help"]} mobileBreadcrumbs={["Help"]}/>
      <Flex
        flexDirection="column"
        bg="white"
        maxWidth={"full"}
        borderRadius="20px"
        ml="7"
        p="25px 30px 25px 30px"
        mr="25px"
        mb={["25px","25px"]}
        h="full"
      >
        <Text fontSize="24px" fontWeight="bold" mb="30px">
          Welcome to Tracker
        </Text>
        <Text>
          Guinea tremendously tedious as learned where newt some goldfish
          slattern reined camel well beneath because owl and mandrill elephant
          the this sparing. <br /> <br /> A then much caterpillar unselfishly
          dolphin pessimistic oriole much a dutifully alas close disagreed
          kangaroo carnally and this this much considering regardless hello frog
          industriously much. 
          <br />
          <br />
          Cannily before around piquant smoked much some well the aside much
          tuneful and wrote beside darn however apart weasel iguana icily
          imitative spontaneous cuckoo.
        </Text>

        <Text fontSize="24px" fontWeight="bold" my="30px">
          How to use it
        </Text>
        <Text>
          More far loving adventurous jeepers doggedly a more oh cassowary
          folded around near less and less much piranha thus the far above this.{" "}
          <br /> <br /> Desirable incapably amid this away cackled a then far
          some near when since slid armadillo far beside hello snorted and on
          but exact tasteful far and darn well much oh the yikes and hey.
        </Text>
      </Flex>
    </Flex>
  );
};

export default Help;
