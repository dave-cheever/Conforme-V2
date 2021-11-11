import { useBreakpointValue } from "@chakra-ui/react"

const useDevice = () => {
  const device = useBreakpointValue({ mobile: "mobile", tablet: "tablet", desktop: "desktop" });
  return device;
}

export default useDevice;