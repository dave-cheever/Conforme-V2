import { useBreakpointValue } from "@chakra-ui/react"

const useDevice = () => {
  const device = useBreakpointValue({ base: "mobile", tablet: "tablet", desktop: "desktop" });
  return device;
}

export default useDevice;
