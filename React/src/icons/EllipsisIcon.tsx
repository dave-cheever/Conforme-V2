import { createIcon } from '@chakra-ui/icons';

const EllipsisIcon = createIcon({
  path: <ellipse data-id="000111" fill="#9A9EA180" rx="30" ry="30" />,
  viewBox: '0 0 18 22',
  defaultProps: {
    position: 'absolute',
    borderRadius: 'full',
    transformOrigin: 'center',
  },
});

export default EllipsisIcon;
