import { createIcon } from '@chakra-ui/icons';

const CircleEmpty = createIcon({
  viewBox: '0 0 21 21',
  path: (
    <g>
      <circle
        cx="10.5"
        cy="10.5"
        fill="white"
        r="10"
        stroke="currentColor"
        strokeWidth="1"
      />
    </g>
  ),
});

export default CircleEmpty;
