import {
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';

import { QuestionIcon } from '../icons';

const MissingQuestions = ({ questionsLeft }: { questionsLeft: number }) => (
  <Popover placement="top" trigger="hover">
    <PopoverTrigger>
      <Flex align="center">
        <QuestionIcon color="white" fill="brand.primary" mr={1} />
        <Flex opacity="0.75">{questionsLeft} left</Flex>
      </Flex>
    </PopoverTrigger>
    <PopoverContent
      bg="brand.secondary"
      color="brand.lightGrey"
      fontSize="14px"
      mb="5px"
      ml="10px"
      w="260px"
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
