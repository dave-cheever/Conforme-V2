import { Flex, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger } from '@chakra-ui/react';
import { t } from 'i18next';

import { QuestionIcon } from '../icons';

function MissingQuestions({ questionsLeft }: { questionsLeft: number }) {
  return (
    <Popover data-id="000349" placement="top" trigger="hover">
      <PopoverTrigger data-id="000350">
        <Flex align="center" data-id="000351">
          <QuestionIcon color="white" data-id="000352" fill="brand.primary" mr={1} />
          <Flex data-id="000353" opacity="0.75">{questionsLeft} left</Flex>
        </Flex>
      </PopoverTrigger>
      <PopoverContent
        bg="brand.secondary"
        color="brand.lightGrey"
        data-id="000354"
        fontSize="14px"
        mb="5px"
        ml="10px"
        w="260px">
        <PopoverArrow bg="brand.secondary" data-id="000355" />
        <PopoverBody color="brand.primaryFont" data-id="000356">
          This {t('tracker item')} has {questionsLeft} mandatory questions without response
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default MissingQuestions;
