import { Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger } from '@chakra-ui/react';
import { t } from 'i18next';

import { Briefcase } from '../icons';

function BriefcaseIcon() {
  return (
    <Popover data-id="030925-aabcc5" placement="top" trigger="hover">
      <PopoverTrigger data-id="030925-6861e1">
        <Briefcase data-id="030925-dd1785" fill="brand.paleGrey" h="14px" w="16px" />
      </PopoverTrigger>
      <PopoverContent
        data-id="030925-debf33"
        bg="brand.secondary"
        color="brand.lightGrey"
        fontSize="14px"
        mb="5px"
        ml="40px"
        w="180px">
        <PopoverArrow data-id="030925-0d472a" bg="brand.secondary" />
        <PopoverBody data-id="030925-335e7b">Corporate {t('business unit')}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default BriefcaseIcon;
