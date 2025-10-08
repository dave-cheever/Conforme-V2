import { createIcon } from '@chakra-ui/icons';

const EllipsisIcon = createIcon({
  path: (
    <>
      <circle data-id="000111" cx="4" cy="12" r="2" fill="currentColor" />
      <circle data-id="000112" cx="12" cy="12" r="2" fill="currentColor" />
      <circle data-id="000113" cx="20" cy="12" r="2" fill="currentColor" />
    </>
  ),
  viewBox: '0 0 24 24',
  defaultProps: {
    boxSize: '18px',
  },
});

export default EllipsisIcon;
