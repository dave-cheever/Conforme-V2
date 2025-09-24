import { Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger } from '@chakra-ui/react';
import { t } from 'i18next';

import { Briefcase } from '../icons';

function BriefcaseIcon() {
  return (
    <Popover data-id="000157" placement="top" trigger="hover">
      <PopoverTrigger data-id="000158">
        <Briefcase data-id="000159" fill="brand.paleGrey" h="14px" w="16px" />
      </PopoverTrigger>
      <PopoverContent
        data-id="000160"
        bg="brand.secondary"
        color="brand.lightGrey"
        fontSize="14px"
        mb="5px"
        ml="40px"
        w="180px">
        <PopoverArrow data-id="000161" bg="brand.secondary" />
        <PopoverBody data-id="000162">Corporate {t('business unit')}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default BriefcaseIcon;
