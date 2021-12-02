import { Flex, Box } from "@chakra-ui/react";

import NavigationLeft from "../components/NavigationLeft/NavigationLeft";
import NavigationTop from "../components/NavigationTop";
import Loader from "../components/Loader";
import ResponseLeftNavigation from "../components/Response/ResponseLeftNavigation";
import ResponseProvider, { useResponseContext } from "../contexts/ResponseProvider";

const ResponseLayout = ({ component: Component }: { component: any }) => {

  const { loading,response} = useResponseContext();

  if(loading && !response){
      return(
        <Flex h="100vh">
            <Loader center={true}/>
        </Flex>
      )
  }

  return (
    <Flex minH='100vh'>
      <NavigationLeft />
      <Flex
        w={[0, "calc(100% - 90px)", "calc(100% - 240px)"]}
        direction="column"
        flexBasis="auto"
        flexGrow={1}
      >
        <NavigationTop />
        <Box h="full" overflow="none" bg="layout.bg">
        <Flex direction={['column', 'row']} position={['relative', 'absolute']} left='0px' w='full' h='calc(100% - 75px)'>
            <ResponseLeftNavigation response={response} />
            <Flex w={[0, "calc(100% - 90px)", "calc(100% - 240px)"]} h="full" flexDirection="column">
            {response && <Component/>}
            </Flex>
        </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};

const ResponseLayoutWithContext = (props) => <ResponseProvider {...props}><ResponseLayout  {...props}/></ResponseProvider>;

export default ResponseLayoutWithContext;
