import { createIcon } from '@chakra-ui/icons';

const Close = createIcon({
  viewBox: '0 0 16 16',
  path: (
    <g>
      <path d="M14.75 1.25L1.25 14.75" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.25 1.25L14.75 14.75" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
});

export default Close;
