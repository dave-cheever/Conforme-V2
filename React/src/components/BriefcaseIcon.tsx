import { Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger } from '@chakra-ui/react';
import { t } from 'i18next';

import { Briefcase } from '../icons';

const BriefcaseIcon = () => (
  <Popover placement="top" trigger="hover">
    <PopoverTrigger>
      <Briefcase fill="brand.paleGrey" h="14px" w="16px" />
    </PopoverTrigger>
    <PopoverContent bg="brand.secondary" color="brand.lightGrey" fontSize="14px" mb="5px" ml="40px" w="180px">
      <PopoverArrow bg="brand.secondary" />
      <PopoverBody>Corporate {t('business unit')}</PopoverBody>
    </PopoverContent>
  </Popover>
);

export default BriefcaseIcon;
