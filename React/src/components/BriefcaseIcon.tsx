import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { Briefcase } from "../icons";

const BriefcaseIcon = () => (
  <Popover trigger="hover" placement="top">
    <PopoverTrigger>
      <Briefcase w="16px" h="14px" fill="brand.paleGrey" />
    </PopoverTrigger>
    <PopoverContent
      bg="brand.secondary"
      ml="40px"
      mb="5px"
      w="180px"
      color="brand.lightGrey"
      fontSize="14px"
    >
      <PopoverArrow bg="brand.secondary" />
      <PopoverBody>Corporate business unit</PopoverBody>
    </PopoverContent>
  </Popover>
);

export default BriefcaseIcon;
