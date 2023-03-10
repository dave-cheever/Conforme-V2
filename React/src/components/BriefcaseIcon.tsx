import { Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger } from '@chakra-ui/react';
import { t } from 'i18next';

import { Briefcase } from '../icons';

const BriefcaseIcon = () => (
  <Popover data-id="f0a2297d04bf" placement="top" trigger="hover">
    <PopoverTrigger data-id="3a3ef3ecd327">
      <Briefcase data-id="bca802767cc9" fill="brand.paleGrey" h="14px" w="16px" />
    </PopoverTrigger>
    <PopoverContent
      bg="brand.secondary"
      color="brand.lightGrey"
      data-id="0e80308b7a16"
      fontSize="14px"
      mb="5px"
      ml="40px"
      w="180px">
      <PopoverArrow bg="brand.secondary" data-id="9fb763ded713" />
      <PopoverBody data-id="cad13e2c22da">Corporate {t('business unit')}</PopoverBody>
    </PopoverContent>
  </Popover>
);

export default BriefcaseIcon;
