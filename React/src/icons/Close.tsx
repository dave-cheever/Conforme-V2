import { createIcon } from "@chakra-ui/icons";

const Close = createIcon({
  viewBox: "0 0 16 15",
  path: (
    <g>
      <path
        d="M15.5 0.5L0.5 15.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.5 0.5L15.5 15.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  ),
});

export default Close;
