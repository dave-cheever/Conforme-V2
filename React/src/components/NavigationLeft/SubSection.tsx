import { Flex } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

const SubSection = ({ url, label }: any) => {
  const history = useHistory();

  return (
    <Flex
      mb={4}
      ml="40px"
      opacity={history.location.pathname === url ? 1 : 0.5}
      cursor="pointer"
      fontSize="14px"
      onClick={() => {
        history.push(url);
      }}
    >
      {label}
    </Flex>
  );
};

export default SubSection;
