import { Flex, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger } from '@chakra-ui/react';
import { t } from 'i18next';

import { QuestionIcon } from '../icons';

function MissingQuestions({ questionsLeft }: { questionsLeft: number }) {
  return (
    <Popover data-id="030925-7a371c" placement="top" trigger="hover">
      <PopoverTrigger data-id="030925-73ef09">
        <Flex data-id="030925-7e24c4" align="center">
          <QuestionIcon data-id="030925-6012b9" color="white" fill="brand.primary" mr={1} />
          <Flex data-id="030925-7bd3cb" opacity="0.75">{questionsLeft} left</Flex>
        </Flex>
      </PopoverTrigger>
      <PopoverContent
        data-id="030925-422449"
        bg="brand.secondary"
        color="brand.lightGrey"
        fontSize="14px"
        mb="5px"
        ml="10px"
        w="260px">
        <PopoverArrow data-id="030925-82f011" bg="brand.secondary" />
        <PopoverBody data-id="030925-e60813" color="brand.primaryFont">
          This {t('tracker item')} has {questionsLeft} mandatory questions without response
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default MissingQuestions;
