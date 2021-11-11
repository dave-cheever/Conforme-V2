import { createIcon } from "@chakra-ui/icons";

const CircleChecked = createIcon({
  viewBox: '0 0 15 15',
  path: (
    <g>
      <circle cx="7.5" cy="7.5" r="7" fill="currentColor" stroke="currentColor" />
      <line x1="4.78564" y1="7.35693" x2="10.2142" y2="7.35693" stroke="white" strokeLinecap="round" strokeLinejoin="bevel" />
    </g>
  )
});

export default CircleChecked;
