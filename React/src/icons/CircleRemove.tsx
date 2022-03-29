import { createIcon } from '@chakra-ui/icons';

const CircleChecked = createIcon({
  viewBox: '0 0 15 15',
  path: (
    <g>
      <circle
        cx="7.5"
        cy="7.5"
        fill="currentColor"
        r="7"
        stroke="currentColor"
      />
      <line
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="bevel"
        x1="4.78564"
        x2="10.2142"
        y1="7.35693"
        y2="7.35693"
      />
    </g>
  ),
});

export default CircleChecked;
