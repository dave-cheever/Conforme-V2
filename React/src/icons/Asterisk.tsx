import { createIcon } from "@chakra-ui/icons";

const Asterisk = createIcon({
  viewBox: '0 0 11 11',
  path: (
    <g>
      <path d="M5.5 1V10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 5.5H1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.68179 2.31786L2.31836 8.68171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.68179 8.68171L2.31836 2.31786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
});

export default Asterisk;
