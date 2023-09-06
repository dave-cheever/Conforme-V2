import { Flex, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger } from '@chakra-ui/react';
import { t } from 'i18next';

import { QuestionIcon } from '../icons';

function MissingQuestions({ questionsLeft }: { questionsLeft: number }) {
  return <Popover data-id="a3e118151585" placement="top" trigger="hover">
    <PopoverTrigger data-id="f47055585d5e">
      <Flex align="center" data-id="4dbcc2fe92b6">
        <QuestionIcon color="white" data-id="7feacb3280c3" fill="brand.primary" mr={1} />
        <Flex data-id="e7ec9d39cd5f" opacity="0.75">{questionsLeft} left</Flex>
      </Flex>
    </PopoverTrigger>
    <PopoverContent
      bg="brand.secondary"
      color="brand.lightGrey"
      data-id="8c07e9075291"
      fontSize="14px"
      mb="5px"
      ml="10px"
      w="260px">
      <PopoverArrow bg="brand.secondary" data-id="e62ab40a073a" />
      <PopoverBody color="brand.primaryFont" data-id="2b1d2a655746">
        This {t('tracker item')} has {questionsLeft} mandatory questions without response
      </PopoverBody>
    </PopoverContent>
  </Popover>
}

export default MissingQuestions;
