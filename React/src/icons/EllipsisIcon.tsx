import { createIcon } from '@chakra-ui/icons';

const EllipsisIcon = createIcon({
  path: (
    <>
      <circle cx="4" cy="12" data-id="001369" fill="currentColor" r="2" />
      <circle cx="12" cy="12" data-id="001370" fill="currentColor" r="2" />
      <circle cx="20" cy="12" data-id="001371" fill="currentColor" r="2" />
    </>
  ),
  viewBox: '0 0 24 24',
  defaultProps: {
    boxSize: '16px',
  },
});

export default EllipsisIcon;
