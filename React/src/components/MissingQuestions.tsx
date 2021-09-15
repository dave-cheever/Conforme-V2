import {
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { QuestionIcon } from "../icons";

const MissingQuestions = ({ questionsLeft }: { questionsLeft: number }) => (
  <Popover trigger="hover" placement="top">
    <PopoverTrigger>
      <Flex align="center">
        <QuestionIcon fill="brand.primary" color="white" mr={1} />
        <Flex opacity="0.75">{questionsLeft} left</Flex>
      </Flex>
    </PopoverTrigger>
    <PopoverContent
      bg="brand.secondary"
      ml="10px"
      mb="5px"
      w="260px"
      color="brand.lightGrey"
      fontSize="14px"
    >
      <PopoverArrow bg="brand.secondary" />
      <PopoverBody color="brand.primaryFont">
        This compliance item has {questionsLeft} mandatory questions without
        response
      </PopoverBody>
    </PopoverContent>
  </Popover>
);

export default MissingQuestions;
