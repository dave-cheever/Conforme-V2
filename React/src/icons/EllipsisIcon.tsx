import { createIcon } from '@chakra-ui/icons';

const EllipsisIcon = createIcon({
  path: (
    <>
      <circle cx="4" cy="12" data-id="000111" fill="currentColor" r="2" />
      <circle cx="12" cy="12" data-id="000112" fill="currentColor" r="2" />
      <circle cx="20" cy="12" data-id="000113" fill="currentColor" r="2" />
    </>
  ),
  viewBox: '0 0 24 24',
  defaultProps: {
    boxSize: '18px',
  },
});

export default EllipsisIcon;
