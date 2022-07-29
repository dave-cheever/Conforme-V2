import { createIcon } from '@chakra-ui/icons';

const RightArrowIcon = createIcon({
  path: (
    <>
      <path d="M1 6H11" fill="none" stroke="#9A9EA1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M6 1L11 6L6 11" fill="none" stroke="#9A9EA1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </>
  ),
  viewBox: '0 0 12 12',
});

export default RightArrowIcon;
